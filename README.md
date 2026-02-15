# Lunassets

Luna's TypeScript library wrapper for asset management from Enka Network API.

## Installation

```bash
npm install lunassets
```

## Quick Start

```typescript
import { EnkaAssetWrapper } from "lunassets";

async function getPlayerData() {
  const enka = new EnkaAssetWrapper();

  try {
    const assets = await enka.getPlayerAssets("856012067");
    console.log(assets);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

getPlayerData();
```

## Example Response

```json
{
  "playerInfo": {
    "nickname": "Kiznavierr",
    "level": 60,
    "signature": "sometimes even reality is a lie",
    "worldLevel": 9,
    "finishAchievementNum": 1366,
    "towerFloorIndex": 12,
    "towerLevelIndex": 3,
    "theaterActIndex": 10,
    "theaterModeIndex": 83,
    "theaterStarIndex": 10,
    "isShowAvatarTalent": true,
    "fetterCount": 33,
    "towerStarIndex": 35,
    "stygianIndex": 3,
    "stygianSeconds": 79,
    "stygianId": 5269006
  },
  "profilePicture": {
    "id": 7300,
    "iconName": "/ui/UI_AvatarIcon_Charlotte_Circle.png",
    "url": "https://enka.network/ui/UI_AvatarIcon_Charlotte_Circle.png"
  },
  "nameCard": {
    "id": 210214,
    "iconName": "UI_NameCardPic_RoleCombat2_P",
    "url": "https://enka.network/ui/UI_NameCardPic_RoleCombat2_P.png"
  },
  "showAvatars": [
    {
      "avatarId": 10000047,
      "iconName": "UI_AvatarIcon_Kazuha",
      "url": "https://enka.network/ui/UI_AvatarIcon_Kazuha.png",
      "quality": 5,
      "level": 90,
      "talentLevel": 2,
      "element": "Wind",
      "weaponType": "WEAPON_SWORD_ONE_HAND"
    }
  ],
  "ttl": 60,
  "lastUpdated": "2026-02-15T04:51:05.385Z"
}
```

## API Methods

### getPlayerAssets(uid)

```typescript
const assets = await enka.getPlayerAssets("123456789");
```

### getPlayerAssetsUncached(uid)

```typescript
const assets = await enka.getPlayerAssetsUncached("123456789");
```

### buildAssetUrl(iconName, options)

```typescript
const url = enka.buildAssetUrl("UI_AvatarIcon_Ayaka");
```

### Cache Management

```typescript
// Check if player data is cached
const isCached = enka.isPlayerCached("123456789");

// Clear specific player cache
enka.clearPlayerCache("123456789");

// Clear all cache
enka.clearAllCache();
```

### Data Validation

```typescript
// Check if character exists in reference data
const hasCharacter = await enka.hasCharacter(10000002);

// Check if profile picture exists
const hasPfp = await enka.hasProfilePicture(7300);

// Check if name card exists
const hasNameCard = await enka.hasNameCard(210214);
```

## Error Handling

```typescript
import { EnkaApiError, EnkaMappingError } from "lunassets";

try {
  const assets = await enka.getPlayerAssets("123456");
} catch (error) {
  if (error instanceof EnkaApiError) {
    console.error("API Error:", error.message);
  } else if (error instanceof EnkaMappingError) {
    console.error("Mapping Error:", error.message);
  }
}
```

## License

See the [LICENSE](LICENSE) file for details.
