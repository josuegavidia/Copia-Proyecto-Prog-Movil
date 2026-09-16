import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { CardRarity } from '../types';

// High-compatibility MP3 streams
const SOUND_URIS = {
  TEAR: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', // Paper tear
  BRONZE: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', // Soft wood tap
  SILVER: 'https://assets.mixkit.co/active_storage/sfx/2574/2574-preview.mp3', // Crisp NBA basketball net swish
  GOLD: 'https://assets.mixkit.co/active_storage/sfx/2020/2020-preview.mp3', // Bright golden win chime fanfare
  DIAMOND: 'https://assets.mixkit.co/active_storage/sfx/270/270-preview.mp3', // Stadium crowd applause & cheer
  VICTORY: 'https://assets.mixkit.co/active_storage/sfx/270/270-preview.mp3',
  SWISH: 'https://assets.mixkit.co/active_storage/sfx/2574/2574-preview.mp3', // Net swish
  CLANK: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', // Rim clank
  MONEYBALL: 'https://assets.mixkit.co/active_storage/sfx/2020/2020-preview.mp3', // Chime fanfare
};

class SoundServiceClass {
  private isInitialized = false;

  async init() {
    try {
      if (setAudioModeAsync) {
        await setAudioModeAsync({
          playsInSilentMode: true,
        });
      }
      this.isInitialized = true;
    } catch {
      // Safe fallback
    }
  }

  private playSoundSafely(uri: string, volume = 1.0) {
    setTimeout(async () => {
      try {
        if (createAudioPlayer) {
          const player = createAudioPlayer({ uri });
          player.volume = volume;
          player.play();
          setTimeout(() => {
            try {
              player.release();
            } catch {
              // ignore
            }
          }, 3500);
        }
      } catch {
        // Safe catch
      }
    }, 0);
  }

  playTearSound() {
    this.playSoundSafely(SOUND_URIS.TEAR, 0.9);
  }

  // Distinct sound per card rarity
  playCardReveal(rarity: CardRarity) {
    switch (rarity) {
      case 'BRONZE':
        this.playSoundSafely(SOUND_URIS.BRONZE, 0.7);
        break;
      case 'SILVER':
        this.playSoundSafely(SOUND_URIS.SILVER, 0.7);
        break;
      case 'GOLD':
        this.playSoundSafely(SOUND_URIS.GOLD, 0.9);
        break;
      case 'DIAMOND':
      case 'ICON':
        this.playSoundSafely(SOUND_URIS.DIAMOND, 1.0);
        break;
    }
  }

  playVictory() {
    this.playSoundSafely(SOUND_URIS.VICTORY, 1.0);
  }

  playSwish() {
    this.playSoundSafely(SOUND_URIS.SWISH, 0.85);
  }

  playClank() {
    this.playSoundSafely(SOUND_URIS.CLANK, 0.75);
  }

  playMoneyBall() {
    this.playSoundSafely(SOUND_URIS.MONEYBALL, 0.95);
  }
}

export const SoundService = new SoundServiceClass();
