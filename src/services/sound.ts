import { Audio } from 'expo-av';
import { CardRarity } from '../types';

// High-compatibility MP3 streams
const SOUND_URIS = {
  TEAR: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', // Paper tear
  BRONZE: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', // Soft wood tap
  SILVER: 'https://assets.mixkit.co/active_storage/sfx/2574/2574-preview.mp3', // Crisp NBA basketball net swish + metallic silver tone
  GOLD: 'https://assets.mixkit.co/active_storage/sfx/2020/2020-preview.mp3', // Bright golden win chime fanfare
  DIAMOND: 'https://assets.mixkit.co/active_storage/sfx/270/270-preview.mp3', // Stadium crowd applause & cheer
  VICTORY: 'https://assets.mixkit.co/active_storage/sfx/270/270-preview.mp3',
};

class SoundServiceClass {
  private isInitialized = false;

  async init() {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });
      this.isInitialized = true;
    } catch {
      // Safe fallback
    }
  }

  private playSoundSafely(uri: string, volume = 1.0) {
    setTimeout(async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          { uri },
          { shouldPlay: true, volume }
        );
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            sound.unloadAsync().catch(() => {});
          }
        });
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
        // Calm, subtle pleasant tone
        this.playSoundSafely(SOUND_URIS.SILVER, 0.7);
        break;
      case 'GOLD':
        // Bright golden fanfare
        this.playSoundSafely(SOUND_URIS.GOLD, 0.9);
        break;
      case 'DIAMOND':
        // Stadium crowd applause
        this.playSoundSafely(SOUND_URIS.DIAMOND, 1.0);
        break;
    }
  }

  playVictory() {
    this.playSoundSafely(SOUND_URIS.VICTORY, 1.0);
  }
}

export const SoundService = new SoundServiceClass();
