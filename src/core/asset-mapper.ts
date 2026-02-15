import {
  EnkaApiResponse,
  CharacterData,
  PfpData,
  NameCardData,
  ProcessedPlayerAssets,
  ProcessedProfilePicture,
  ProcessedNameCard,
  ProcessedShowAvatar,
  EnkaMappingError,
} from "../types";
import { getQualityNumeric, transformIconName } from "../utils";
import { EnkaUrlBuilder } from "./url-builder";
import { EnkaDataFetcher } from "./data-fetcher";

export class EnkaAssetMapper {
  private dataFetcher: EnkaDataFetcher;
  private urlBuilder: EnkaUrlBuilder;

  constructor(urlBuilder: EnkaUrlBuilder) {
    this.dataFetcher = new EnkaDataFetcher();
    this.urlBuilder = urlBuilder;
  }

  /**
   * Map API response to processed player assets
   */
  async mapPlayerAssets(
    apiResponse: EnkaApiResponse,
  ): Promise<ProcessedPlayerAssets> {
    const { playerInfo } = apiResponse;

    // Process profile picture
    const profilePicture = await this.mapProfilePicture(
      playerInfo.profilePicture.id,
    );

    // Process name card
    const nameCard = await this.mapNameCard(playerInfo.nameCardId);

    // Process show avatars
    const showAvatars = await Promise.all(
      playerInfo.showAvatarInfoList.map((avatar) =>
        this.mapShowAvatar(avatar.avatarId, avatar.level, avatar.talentLevel),
      ),
    );

    return {
      playerInfo: {
        nickname: playerInfo.nickname,
        level: playerInfo.level,
        signature: playerInfo.signature,
        worldLevel: playerInfo.worldLevel,
        finishAchievementNum: playerInfo.finishAchievementNum,
        towerFloorIndex: playerInfo.towerFloorIndex,
        towerLevelIndex: playerInfo.towerLevelIndex,
        theaterActIndex: playerInfo.theaterActIndex,
        theaterModeIndex: playerInfo.theaterModeIndex,
        theaterStarIndex: playerInfo.theaterStarIndex,
        isShowAvatarTalent: playerInfo.isShowAvatarTalent,
        fetterCount: playerInfo.fetterCount,
        towerStarIndex: playerInfo.towerStarIndex,
        stygianIndex: playerInfo.stygianIndex,
        stygianSeconds: playerInfo.stygianSeconds,
        stygianId: playerInfo.stygianId,
      },
      profilePicture,
      nameCard,
      showAvatars,
      ttl: apiResponse.ttl,
      lastUpdated: new Date(),
    };
  }

  /**
   * Map profile picture ID to processed profile picture
   */
  private async mapProfilePicture(
    pfpId: number,
  ): Promise<ProcessedProfilePicture> {
    const pfpsData = await this.dataFetcher.getPfpsData();
    const pfpData = pfpsData[pfpId.toString()];

    if (!pfpData) {
      throw new EnkaMappingError(
        `Profile picture not found for ID: ${pfpId}`,
        pfpId,
      );
    }

    // IconPath di pfps.json sudah include full path dan extension
    const url = `https://enka.network${pfpData.IconPath}`;

    return {
      id: pfpId,
      iconName: pfpData.IconPath,
      url,
    };
  }

  /**
   * Map name card ID to processed name card
   */
  private async mapNameCard(nameCardId: number): Promise<ProcessedNameCard> {
    const namecardsData = await this.dataFetcher.getNamecardsData();
    const nameCardData = namecardsData[nameCardId.toString()];

    if (!nameCardData) {
      throw new EnkaMappingError(
        `Name card not found for ID: ${nameCardId}`,
        nameCardId,
      );
    }

    const url = this.urlBuilder.buildNameCardUrl(nameCardData.icon);

    return {
      id: nameCardId,
      iconName: nameCardData.icon,
      url,
    };
  }

  /**
   * Map avatar ID to processed show avatar
   */
  private async mapShowAvatar(
    avatarId: number,
    level: number,
    talentLevel?: number,
  ): Promise<ProcessedShowAvatar> {
    const charactersData = await this.dataFetcher.getCharactersData();
    const characterData = charactersData[avatarId.toString()];

    if (!characterData) {
      throw new EnkaMappingError(
        `Character not found for ID: ${avatarId}`,
        avatarId,
      );
    }

    // Transform SideIconName (hilangkan "Side_")
    const iconName = transformIconName(characterData.SideIconName);

    // Convert quality type to numeric
    const quality = getQualityNumeric(characterData.QualityType);

    // Build URL
    const url = this.urlBuilder.buildCharacterIconUrl(iconName);

    return {
      avatarId,
      iconName,
      url,
      quality,
      level,
      talentLevel,
      element: characterData.Element,
      weaponType: characterData.WeaponType,
    };
  }

  /**
   * Get character data by ID
   */
  async getCharacterData(avatarId: number) {
    const charactersData = await this.dataFetcher.getCharactersData();
    return charactersData[avatarId.toString()] || null;
  }

  /**
   * Get profile picture data by ID
   */
  async getProfilePictureData(pfpId: number) {
    const pfpsData = await this.dataFetcher.getPfpsData();
    return pfpsData[pfpId.toString()] || null;
  }

  /**
   * Get name card data by ID
   */
  async getNameCardData(nameCardId: number) {
    const namecardsData = await this.dataFetcher.getNamecardsData();
    return namecardsData[nameCardId.toString()] || null;
  }

  /**
   * Check if character exists
   */
  async hasCharacter(avatarId: number): Promise<boolean> {
    const charactersData = await this.dataFetcher.getCharactersData();
    return avatarId.toString() in charactersData;
  }

  /**
   * Check if profile picture exists
   */
  async hasProfilePicture(pfpId: number): Promise<boolean> {
    const pfpsData = await this.dataFetcher.getPfpsData();
    return pfpId.toString() in pfpsData;
  }

  /**
   * Check if name card exists
   */
  async hasNameCard(nameCardId: number): Promise<boolean> {
    const namecardsData = await this.dataFetcher.getNamecardsData();
    return nameCardId.toString() in namecardsData;
  }

  /**
   * Get statistics about loaded data
   */
  async getDataStats() {
    const [charactersData, pfpsData, namecardsData] = await Promise.all([
      this.dataFetcher.getCharactersData(),
      this.dataFetcher.getPfpsData(),
      this.dataFetcher.getNamecardsData(),
    ]);

    return {
      characters: Object.keys(charactersData).length,
      profilePictures: Object.keys(pfpsData).length,
      nameCards: Object.keys(namecardsData).length,
    };
  }

  /**
   * Get data fetcher cache info
   */
  getDataCacheInfo() {
    return this.dataFetcher.getCacheInfo();
  }

  /**
   * Clear reference data cache
   */
  clearDataCache(): void {
    this.dataFetcher.clearCache();
  }
}
