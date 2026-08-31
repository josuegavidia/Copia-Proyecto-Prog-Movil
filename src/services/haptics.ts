import * as Haptics from 'expo-haptics';
import { CardRarity } from '../types';

export const HapticsService = {
  // Light tick for UI clicks / card selection
  selectionTick: async () => {
    try {
      await Haptics.selectionAsync();
    } catch {
      // Safe fallback on platforms without haptics
    }
  },

  // Pack tearing tension effect (call repeatedly with decreasing delay during drag/rip)
  packTearProgress: async (intensity: number = 0.5) => {
    try {
      if (intensity < 0.3) {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } else if (intensity < 0.7) {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }
    } catch {}
  },

  // Dynamic card reveal vibration based on rarity
  triggerCardRevealHaptics: async (rarity: CardRarity) => {
    try {
      switch (rarity) {
        case 'BRONZE':
          // Subtle single pulse
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;

        case 'SILVER':
          // Crisp medium double pulse
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          setTimeout(async () => {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }, 80);
          break;

        case 'GOLD':
          // Powerful dual pulse + warning notification
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          setTimeout(async () => {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          }, 120);
          break;

        case 'DIAMOND':
          // Épico: Secuencia escalada de alta intensidad + Success chime
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          setTimeout(async () => {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          }, 70);
          setTimeout(async () => {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          }, 150);
          setTimeout(async () => {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }, 240);
          break;
      }
    } catch {
      // Ignore if not supported on simulator/web
    }
  },

  // Success celebration
  celebrate: async () => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}
  },

  mediumImpact: async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
  },

  successNotification: async () => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}
  },

  errorNotification: async () => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch {}
  },
};

