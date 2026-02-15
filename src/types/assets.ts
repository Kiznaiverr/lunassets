// Asset Data Types
export interface CharacterData {
  [characterId: string]: {
    Element: string;
    Consts: string[];
    SkillOrder: number[];
    Skills: { [skillId: string]: string };
    ProudMap: { [skillId: string]: number };
    NameTextMapHash: number;
    SideIconName: string;
    QualityType: "QUALITY_ORANGE" | "QUALITY_PURPLE";
    WeaponType: string;
    Costumes?: {
      [costumeId: string]: {
        sideIconName: string;
        icon: string;
        art: string;
        avatarId: number;
      };
    };
  };
}

export interface PfpData {
  [pfpId: string]: {
    IconPath: string;
  };
}

export interface NameCardData {
  [nameCardId: string]: {
    Icon: string;
  };
}

// Processed Asset Types
export interface ProcessedProfilePicture {
  id: number;
  iconName: string;
  url: string;
}

export interface ProcessedNameCard {
  id: number;
  iconName: string;
  url: string;
}

export interface ProcessedShowAvatar {
  avatarId: number;
  iconName: string;
  url: string;
  quality: 4 | 5; // PURPLE=4, ORANGE=5
  level: number;
  talentLevel?: number;
  element?: string;
  weaponType?: string;
}

// Final result
export interface ProcessedPlayerAssets {
  playerInfo: {
    nickname: string;
    level: number;
    signature?: string;
    worldLevel: number;
    finishAchievementNum?: number;
    towerFloorIndex?: number;
    towerLevelIndex?: number;
    theaterActIndex?: number;
    theaterModeIndex?: number;
    theaterStarIndex?: number;
    isShowAvatarTalent?: boolean;
    fetterCount?: number;
    towerStarIndex?: number;
    stygianIndex?: number;
    stygianSeconds?: number;
    stygianId?: number;
  };
  profilePicture: ProcessedProfilePicture;
  nameCard: ProcessedNameCard;
  showAvatars: ProcessedShowAvatar[];
  ttl?: number;
  lastUpdated: Date;
}

// Quality mapping
export type QualityType = "QUALITY_ORANGE" | "QUALITY_PURPLE";
export type QualityNumeric = 4 | 5;
