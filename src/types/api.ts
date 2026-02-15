// API Response Types
export interface EnkaApiResponse {
  playerInfo: PlayerInfo;
  avatarInfoList?: AvatarInfo[];
  ttl?: number;
}

export interface PlayerInfo {
  nickname: string;
  level: number;
  signature?: string;
  worldLevel: number;
  nameCardId: number;
  finishAchievementNum: number;
  towerFloorIndex?: number;
  towerLevelIndex?: number;
  showAvatarInfoList: ShowAvatarInfo[];
  showNameCardIdList?: number[];
  profilePicture: {
    id: number;
  };
  theaterActIndex?: number;
  theaterModeIndex?: number;
  theaterStarIndex?: number;
  isShowAvatarTalent?: boolean;
  fetterCount?: number;
  towerStarIndex?: number;
  stygianIndex?: number;
  stygianSeconds?: number;
  stygianId?: number;
}

export interface ShowAvatarInfo {
  avatarId: number;
  level: number;
  talentLevel?: number;
  energyType?: number;
}

export interface AvatarInfo {
  avatarId: number;
  propMap?: { [key: string]: any };
  talentIdList?: number[];
  fightPropMap?: { [key: string]: number };
  skillDepotId?: number;
  inherentProudSkillList?: number[];
  skillLevelMap?: { [key: string]: number };
  proudSkillExtraLevelMap?: { [key: string]: number };
  equipList?: any[];
  fetterInfo?: {
    expLevel: number;
  };
}

// New fetch params interface
export interface FetchPlayerParams {
  uid: string | number;
  info?: boolean;
}
