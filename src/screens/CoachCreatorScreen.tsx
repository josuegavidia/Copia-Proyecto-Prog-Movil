import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';
import { CustomCoach, TacticStyle } from '../types';
import { NBA_TEAMS } from '../data/nbaTeams';
import { CustomCoachCard } from '../components/Card/CustomCoachCard';
import { BackgroundRemovalService } from '../services/backgroundRemoval';
import { HapticsService } from '../services/haptics';
import { Ionicon } from '../components/Common/Ionicon';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addCoach, updateLineup } from '../store/slices/squadSlice';

import { useTheme } from '../context/ThemeContext';

const TACTICS_LIST: { style: TacticStyle; off: number; def: number; desc: string }[] = [
  {
    style: 'Pace & Space',
    off: 5,
    def: 3,
    desc: 'Tiro exterior masivo y transición veloz.',
  },
  {
    style: 'Showtime Fastbreak',
    off: 6,
    def: 2,
    desc: 'Contragolpe implacable y clavadas espectaculares.',
  },
  {
    style: 'Lockdown Defense',
    off: 2,
    def: 6,
    desc: 'Presión defensiva perimetral y protección de aro.',
  },
  {
    style: 'Triangle Offense',
    off: 4,
    def: 4,
    desc: 'Filosofía balanceada de juego de pases y movimiento.',
  },
  {
    style: 'Small Ball',
    off: 5,
    def: 3,
    desc: 'Alineación ágil para generar tiros abiertos.',
  },
  {
    style: 'Grit & Grind',
    off: 3,
    def: 5,
    desc: 'Fuerza física en la pintura y control del rebote.',
  },
];

// Official card rarity colors ONLY
export const CARD_QUALITY_COLORS: { name: string; hex: string; label: string }[] = [
  { name: 'Icono', hex: '#CA8A04', label: 'ICONO' },
  { name: 'Diamante', hex: '#0284C7', label: 'DIAMANTE' },
  { name: 'Oro', hex: '#EAB308', label: 'ORO' },
  { name: 'Plata', hex: '#94A3B8', label: 'PLATA' },
  { name: 'Bronce', hex: '#C2410C', label: 'BRONCE' },
];

export const COACH_COUNTRIES: { name: string; flag: string; code: string }[] = [
  { name: 'Honduras', flag: '🇭🇳', code: 'HN' },
  { name: 'Estados Unidos', flag: '🇺🇸', code: 'USA' },
  { name: 'España', flag: '🇪🇸', code: 'ESP' },
  { name: 'Rep. Dominicana', flag: '🇩🇴', code: 'DOM' },
  { name: 'México', flag: '🇲🇽', code: 'MEX' },
  { name: 'Puerto Rico', flag: '🇵🇷', code: 'PUR' },
  { name: 'Argentina', flag: '🇦🇷', code: 'ARG' },
  { name: 'Canadá', flag: '🇨🇦', code: 'CAN' },
  { name: 'Francia', flag: '🇫🇷', code: 'FRA' },
  { name: 'Alemania', flag: '🇩🇪', code: 'GER' },
  { name: 'Serbia', flag: '🇷🇸', code: 'SRB' },
  { name: 'Eslovenia', flag: '🇸🇮', code: 'SLO' },
  { name: 'Grecia', flag: '🇬🇷', code: 'GRE' },
  { name: 'Brasil', flag: '🇧🇷', code: 'BRA' },
  { name: 'Colombia', flag: '🇨🇴', code: 'COL' },
  { name: 'Italia', flag: '🇮🇹', code: 'ITA' },
  { name: 'Australia', flag: '🇦🇺', code: 'AUS' },
];

interface CoachCreatorScreenProps {
  currentCoach?: CustomCoach | null;
  onSaveCoach?: (coach: CustomCoach) => void;
  onAssignToLineup?: (coach: CustomCoach) => void;
}

export const CoachCreatorScreen: React.FC<CoachCreatorScreenProps> = ({
  currentCoach: propsCurrentCoach,
  onSaveCoach,
  onAssignToLineup,
}) => {
  const { colors, isDark } = useTheme();
  const dispatch = useAppDispatch();
  const reduxLineup = useAppSelector((state) => state.squad.lineup);
  const currentCoach = propsCurrentCoach !== undefined ? propsCurrentCoach : reduxLineup.coach;

  const [activeTab, setActiveTab] = useState<'profile' | 'tactics'>('profile');

  const [coachName, setCoachName] = useState(
    currentCoach?.name || 'Coach Manager'
  );
  const [photoUri, setPhotoUri] = useState<string>(
    currentCoach?.photoUri || ''
  );
  const [photoBase64, setPhotoBase64] = useState<string | undefined>(undefined);
  const [isRemovingBg, setIsRemovingBg] = useState(false);

  const [selectedTeam, setSelectedTeam] = useState<string>(
    currentCoach?.teamAffinity || 'LAL'
  );
  const [selectedCountry, setSelectedCountry] = useState<string>(
    currentCoach?.country || 'Honduras'
  );
  const [selectedFlag, setSelectedFlag] = useState<string>(
    currentCoach?.countryFlag || '🇭🇳'
  );
  const [selectedTactic, setSelectedTactic] = useState<TacticStyle>(
    currentCoach?.tactic || 'Pace & Space'
  );
  const [bgColor, setBgColor] = useState<string>(
    currentCoach?.bgColor || '#0284C7'
  );

  const cardRef = useRef<View>(null);
  const isInitialMount = useRef(true);

  const currentTacticObj =
    TACTICS_LIST.find((t) => t.style === selectedTactic) || TACTICS_LIST[0];

  const constructedCoach: CustomCoach = {
    id: currentCoach?.id || `coach-${Date.now()}`,
    name: coachName.trim() || 'Head Coach',
    photoUri,
    teamAffinity: selectedTeam,
    country: selectedCountry,
    countryFlag: selectedFlag,
    tactic: selectedTactic,
    boostOffense: currentTacticObj.off,
    boostDefense: currentTacticObj.def,
    boostChemistry: 6,
    signatureQuote: 'La defensa gana campeonatos.',
    createdAt: currentCoach?.createdAt || new Date().toISOString(),
    bgColor,
  };

  // Automatic saving on any change
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (onSaveCoach) {
      onSaveCoach(constructedCoach);
    } else {
      dispatch(addCoach(constructedCoach));
    }

    if (onAssignToLineup) {
      onAssignToLineup(constructedCoach);
    } else {
      dispatch(updateLineup({ ...reduxLineup, coach: constructedCoach }));
    }
  }, [coachName, photoUri, selectedTeam, selectedCountry, selectedFlag, selectedTactic, bgColor]);

  const handleTakeSelfie = async () => {
    await HapticsService.selectionTick();
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        'Permiso Requerido',
        'Se necesita acceso a la cámara para tomar tu selfie de Director Técnico.'
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      cameraType: ImagePicker.CameraType.front,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
      base64: true,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      setPhotoUri(result.assets[0].uri);
      setPhotoBase64(result.assets[0].base64 || undefined);
      await HapticsService.celebrate();
    }
  };

  const handlePickFromGallery = async () => {
    await HapticsService.selectionTick();
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
      base64: true,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      setPhotoUri(result.assets[0].uri);
      setPhotoBase64(result.assets[0].base64 || undefined);
      await HapticsService.celebrate();
    }
  };

  const handleRemoveBackground = async () => {
    try {
      setIsRemovingBg(true);
      await HapticsService.selectionTick();

      const res = await BackgroundRemovalService.removeBackground(photoUri, photoBase64);

      if (res.success && res.resultUri) {
        setPhotoUri(res.resultUri);
        await HapticsService.celebrate();
        Alert.alert(
          'Fondo Eliminado con Éxito',
          'Los píxeles del fondo fueron removidos. Tu silueta y rostro quedaron en formato transparente sobre el color de la carta.'
        );
      } else {
        Alert.alert(
          'Eliminación de Fondo con IA',
          res.error ||
          'Para obtener un recorte perfecto al instante en iPhone: abre tu foto en la app Fotos, mantén presionado tu rostro 1 segundo para crear un Sticker PNG transparente y selecciónalo desde Galería.'
        );
      }
    } catch (e: any) {
      Alert.alert('Aviso', e.message || 'Error al procesar la imagen.');
    } finally {
      setIsRemovingBg(false);
    }
  };

  const handleExportAndShare = async () => {
    try {
      await HapticsService.selectionTick();
      if (!cardRef.current) return;

      const uri = await captureRef(cardRef, {
        format: 'png',
        quality: 1,
      });

      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: 'Compartir mi Carta de Coach NBA',
        });
        await HapticsService.celebrate();
      } else {
        Alert.alert('Éxito', 'Carta generada en imagen HD.');
      }
    } catch (e) {
      console.error('Failed to export card image:', e);
      Alert.alert('Error', 'No se pudo exportar la imagen de la carta.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>ESTUDIO DE DIRECTOR TÉCNICO</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Personaliza tu carta oficial de Head Coach. Todos los cambios se guardan automáticamente.
          </Text>
        </View>

        {/* Live Card Preview Box */}
        <View style={styles.previewContainer}>
          <View ref={cardRef} collapsable={false} style={styles.cardShotWrapper}>
            <CustomCoachCard coach={constructedCoach} size="lg" />
          </View>
        </View>

        {/* Top Category Tabs */}
        <View style={[styles.tabContainer, { backgroundColor: isDark ? colors.bgCardSecondary : '#E2E8F0' }]}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              HapticsService.selectionTick();
              setActiveTab('profile');
            }}
            style={[
              styles.tabButton,
              activeTab === 'profile' && [styles.tabButtonActive, { backgroundColor: colors.bgCard }],
            ]}
          >
            <Ionicon
              name="person-circle-outline"
              size={18}
              color={activeTab === 'profile' ? colors.primary : colors.textMuted}
            />
            <Text
              style={[
                styles.tabButtonText,
                { color: colors.textMuted },
                activeTab === 'profile' && [styles.tabButtonTextActive, { color: colors.primary }],
              ]}
            >
              FOTO Y CARTA
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              HapticsService.selectionTick();
              setActiveTab('tactics');
            }}
            style={[
              styles.tabButton,
              activeTab === 'tactics' && [styles.tabButtonActive, { backgroundColor: colors.bgCard }],
            ]}
          >
            <Ionicon
              name="shield-outline"
              size={18}
              color={activeTab === 'tactics' ? colors.primary : colors.textMuted}
            />
            <Text
              style={[
                styles.tabButtonText,
                { color: colors.textMuted },
                activeTab === 'tactics' && [styles.tabButtonTextActive, { color: colors.primary }],
              ]}
            >
              TÁCTICA Y FILOSOFÍA
            </Text>
          </TouchableOpacity>
        </View>

        {/* TAB 1: FOTO Y CARTA */}
        {activeTab === 'profile' && (
          <View>
            {/* Camera & Gallery Buttons */}
            <View style={styles.photoActionsRow}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleTakeSelfie}
                style={[styles.photoButton, { backgroundColor: '#006BB6' }]}
              >
                <Ionicon name="camera" size={17} color="#FFFFFF" />
                <Text style={[styles.photoButtonText, { color: '#FFFFFF' }]}>
                  TOMAR SELFIE
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handlePickFromGallery}
                style={[
                  styles.photoButton,
                  {
                    backgroundColor: colors.bgCard,
                    borderWidth: 1,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Ionicon name="images" size={17} color={colors.text} />
                <Text style={[styles.photoButtonText, { color: colors.text }]}>
                  GALERÍA
                </Text>
              </TouchableOpacity>
            </View>

            {/* AI Background Removal & Remove Photo Buttons */}
            {photoUri ? (
              <View style={{ gap: 8, marginBottom: 14 }}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={handleRemoveBackground}
                  disabled={isRemovingBg}
                  style={[styles.aiRemoveBtn, { backgroundColor: isDark ? '#1E293B' : '#0F172A' }]}
                >
                  {isRemovingBg ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.aiRemoveBtnText}>
                      ELIMINAR FONDO CON IA
                    </Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => {
                    HapticsService.selectionTick();
                    setPhotoUri('');
                    setPhotoBase64(undefined);
                  }}
                  style={[
                    styles.aiRemoveBtn,
                    {
                      backgroundColor: isDark ? colors.bgCardSecondary : '#F1F5F9',
                      borderWidth: 1,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.aiRemoveBtnText, { color: colors.textMuted }]}>
                    QUITAR FOTO (USAR ÍCONO)
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}

            {/* Form Card: Name, Franchise, Country/Flag, Quality Color */}
            <View style={[styles.formCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
              {/* Coach Name */}
              <Text style={[styles.inputLabel, { color: colors.text }]}>NOMBRE DEL ENTRENADOR</Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: isDark ? colors.bgCardSecondary : '#F8FAFC',
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                value={coachName}
                onChangeText={setCoachName}
                placeholder="Ej. DT Johnson"
                placeholderTextColor={colors.textMuted}
                maxLength={22}
              />

              {/* Country & Flag Selector */}
              <View style={styles.colorSectionHeader}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>PAÍS / NACIONALIDAD</Text>
                <Text style={[styles.selectedFlagText, { color: colors.primary }]}>
                  {selectedFlag} {selectedCountry}
                </Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.countriesScroll}
              >
                {COACH_COUNTRIES.map((c) => {
                  const isSelected = selectedCountry === c.name;
                  return (
                    <TouchableOpacity
                      key={c.code}
                      activeOpacity={0.8}
                      onPress={() => {
                        HapticsService.selectionTick();
                        setSelectedCountry(c.name);
                        setSelectedFlag(c.flag);
                      }}
                      style={[
                        styles.countryChip,
                        {
                          backgroundColor: isDark ? colors.bgCardSecondary : '#F8FAFC',
                          borderColor: isSelected ? colors.primary : colors.border,
                        },
                        isSelected && { backgroundColor: isDark ? '#1E3A8A' : '#EFF6FF', borderWidth: 1.5 },
                      ]}
                    >
                      <Text style={styles.countryChipFlag}>{c.flag}</Text>
                      <Text
                        style={[
                          styles.countryChipText,
                          { color: isSelected ? colors.primary : colors.text },
                        ]}
                      >
                        {c.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* NBA Team Franchise Selector */}
              <Text style={[styles.inputLabel, { color: colors.text, marginTop: 12 }]}>
                FRANQUICIA AFÍN (LOGOTIPO Y DETALLES)
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.teamsScroll}
              >
                {Object.keys(NBA_TEAMS).map((teamAbbr) => {
                  const t = NBA_TEAMS[teamAbbr];
                  const isSelected = selectedTeam === teamAbbr;
                  return (
                    <TouchableOpacity
                      key={teamAbbr}
                      onPress={() => {
                        HapticsService.selectionTick();
                        setSelectedTeam(teamAbbr);
                      }}
                      style={[
                        styles.teamPill,
                        {
                          backgroundColor: isSelected ? t.primaryColor : isDark ? colors.bgCardSecondary : '#F8FAFC',
                          borderColor: isSelected ? t.primaryColor : colors.border,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.teamPillText,
                          { color: isSelected ? '#FFFFFF' : colors.text },
                        ]}
                      >
                        {teamAbbr}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* Quality / Tier Color Selector */}
              <View style={styles.colorSectionHeader}>
                <Text style={[styles.inputLabel, { color: colors.text, marginTop: 12 }]}>
                  COLOR DE CALIDAD DE CARTA
                </Text>
                <View style={[styles.selectedColorIndicator, { backgroundColor: bgColor }]} />
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.colorsScroll}
              >
                {CARD_QUALITY_COLORS.map((preset) => {
                  const isSelected = bgColor.toLowerCase() === preset.hex.toLowerCase();
                  return (
                    <TouchableOpacity
                      key={preset.hex}
                      activeOpacity={0.8}
                      onPress={() => {
                        HapticsService.selectionTick();
                        setBgColor(preset.hex);
                      }}
                      style={[
                        styles.colorCircle,
                        { backgroundColor: preset.hex },
                        isSelected && styles.colorCircleSelected,
                      ]}
                    >
                      {isSelected && (
                        <Ionicon
                          name="checkmark"
                          size={16}
                          color={preset.hex === '#FFFFFF' || preset.hex === '#EAB308' ? '#0F172A' : '#FFFFFF'}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        )}

        {/* TAB 2: TÁCTICA Y FILOSOFÍA */}
        {activeTab === 'tactics' && (
          <View style={[styles.formCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>SELECCIONA LA FILOSOFÍA TÁCTICA</Text>
            <View style={styles.tacticsGrid}>
              {TACTICS_LIST.map((t) => {
                const isSelected = selectedTactic === t.style;
                return (
                  <TouchableOpacity
                    key={t.style}
                    onPress={() => {
                      HapticsService.selectionTick();
                      setSelectedTactic(t.style);
                    }}
                    style={[
                      styles.tacticCard,
                      {
                        backgroundColor: isDark ? colors.bgCardSecondary : '#F8FAFC',
                        borderColor: isSelected ? colors.primary : colors.border,
                      },
                      isSelected && { backgroundColor: isDark ? '#1E293B' : '#F0F9FF' },
                    ]}
                  >
                    <View style={styles.tacticTop}>
                      <Text
                        style={[
                          styles.tacticName,
                          { color: colors.text },
                          isSelected && { color: colors.primary },
                        ]}
                      >
                        {t.style}
                      </Text>
                      <View style={[styles.boostPillWrap, { backgroundColor: isDark ? '#1E3A8A' : '#E0F2FE' }]}>
                        <Text style={[styles.boostSub, { color: isDark ? '#93C5FD' : '#0369A1' }]}>
                          +{t.off} OFF / +{t.def} DEF
                        </Text>
                      </View>
                    </View>
                    <Text style={[styles.tacticDesc, { color: colors.textMuted }]}>{t.desc}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Bottom Action: Export Card */}
        <View style={styles.bottomActions}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleExportAndShare}
            style={[styles.exportButton, { backgroundColor: colors.bgCard, borderColor: colors.primary }]}
          >
            <Text style={[styles.exportButtonText, { color: colors.primary }]}>EXPORTAR IMAGEN HD</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 50,
  },
  header: {
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  previewContainer: {
    alignItems: 'center',
    marginVertical: 6,
  },
  cardShotWrapper: {
    padding: 4,
    backgroundColor: 'transparent',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 8,
    padding: 3,
    marginVertical: 10,
    gap: 4,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 6,
    gap: 6,
  },
  tabButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabButtonText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748B',
  },
  tabButtonTextActive: {
    color: '#006BB6',
    fontWeight: 'bold',
  },
  photoActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  photoButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 6,
    gap: 6,
  },
  photoButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  aiRemoveBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
    paddingVertical: 11,
    borderRadius: 6,
    marginBottom: 8,
  },
  aiRemoveBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 4,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 6,
    marginTop: 4,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#0F172A',
    fontSize: 13,
    marginBottom: 12,
  },
  teamsScroll: {
    gap: 6,
    paddingBottom: 10,
  },
  teamPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
  },
  teamPillText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  selectedFlagText: {
    fontSize: 12,
    fontWeight: '800',
  },
  countriesScroll: {
    gap: 8,
    paddingBottom: 8,
  },
  countryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  countryChipSelected: {
    borderColor: '#0284C7',
  },
  countryChipFlag: {
    fontSize: 16,
  },
  countryChipText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  countryChipTextSelected: {
    fontWeight: '900',
  },
  colorSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    marginBottom: 6,
  },
  selectedColorIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  colorsScroll: {
    gap: 8,
    paddingBottom: 8,
    alignItems: 'center',
  },
  colorCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorCircleSelected: {
    borderWidth: 3,
    borderColor: '#0284C7',
    transform: [{ scale: 1.1 }],
  },
  tacticsGrid: {
    gap: 8,
    marginTop: 2,
  },
  tacticCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tacticCardActive: {
    borderColor: '#0284C7',
    backgroundColor: '#F0F9FF',
  },
  tacticTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  tacticName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  boostPillWrap: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  boostSub: {
    fontSize: 9.5,
    fontWeight: 'bold',
    color: '#0369A1',
  },
  tacticDesc: {
    fontSize: 10.5,
    color: '#64748B',
  },
  bottomActions: {
    marginTop: 14,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#006BB6',
    paddingVertical: 12,
    borderRadius: 6,
    gap: 6,
  },
  exportButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#006BB6',
  },
});
