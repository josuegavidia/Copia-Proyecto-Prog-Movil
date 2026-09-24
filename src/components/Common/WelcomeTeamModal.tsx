import React, { useState, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NBA_TEAMS } from '../../data/nbaTeams';
import { NBATeamInfo, UserCard } from '../../types';
import { NBACard } from '../Card/NBACard';
import { CustomButton } from './CustomButton';
import { openStarterTeamPack } from '../../services/packOpener';
import { StorageService } from '../../services/storage';
import { SyncService } from '../../services/sync';
import { HapticsService } from '../../services/haptics';
import { SoundService } from '../../services/sound';
import { useAppDispatch } from '../../store/hooks';
import { addCards } from '../../store/slices/squadSlice';
import { NBA_THEME } from '../../theme/colors';
import { useTheme } from '../../context/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface WelcomeTeamModalProps {
  visible: boolean;
  onFinish: () => void;
}

const ALL_TEAMS = Object.values(NBA_TEAMS);

export const WelcomeTeamModal: React.FC<WelcomeTeamModalProps> = ({
  visible,
  onFinish,
}) => {
  const dispatch = useAppDispatch();
  const { colors, isDark } = useTheme();

  const [step, setStep] = useState<'SELECT_TEAM' | 'REVEAL_CARDS'>('SELECT_TEAM');
  const [customTeamName, setCustomTeamName] = useState('Mi Franquicia');
  const [selectedTeam, setSelectedTeam] = useState<NBATeamInfo | null>(null);
  const [conferenceFilter, setConferenceFilter] = useState<'ALL' | 'Eastern' | 'Western'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [pulledCards, setPulledCards] = useState<UserCard[]>([]);
  const [loading, setLoading] = useState(false);

  // Filtered teams list
  const filteredTeams = useMemo(() => {
    return ALL_TEAMS.filter((team) => {
      const matchesConf =
        conferenceFilter === 'ALL' || team.conference === conferenceFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        team.name.toLowerCase().includes(q) ||
        team.city.toLowerCase().includes(q) ||
        team.abbreviation.toLowerCase().includes(q);
      return matchesConf && matchesSearch;
    });
  }, [conferenceFilter, searchQuery]);

  const handleSelectTeam = async (team: NBATeamInfo) => {
    await HapticsService.selectionTick();
    setSelectedTeam(team);
  };

  const handleClaimStarterPack = async () => {
    if (!selectedTeam) return;

    const finalTeamName = customTeamName.trim() || 'Mi Franquicia';

    setLoading(true);
    await HapticsService.mediumImpact();
    SoundService.playTearSound();

    // 1. Generate 3 starter players from the chosen favorite NBA team
    const cards = openStarterTeamPack(selectedTeam.abbreviation);
    setPulledCards(cards);

    // 2. Save user's custom franchise name, logo and abbreviation
    await StorageService.setTeamName(finalTeamName);
    await StorageService.setTeamLogo(selectedTeam.logoUrl);
    await StorageService.setTeamAbbr(selectedTeam.abbreviation);

    // 3. Reset season with custom team name competing against all 30 NBA teams
    await StorageService.resetSeason();

    // 4. Add cards to Redux and storage
    await dispatch(addCards(cards));

    // 5. Mark starter pack as claimed
    await StorageService.setClaimedStarterPack(true);

    // 6. Sync to Supabase cloud if logged in
    SyncService.pushLocalToCloud().catch(console.warn);

    await HapticsService.celebrate();
    setStep('REVEAL_CARDS');
    setLoading(false);
  };

  const handleComplete = async () => {
    await HapticsService.selectionTick();
    onFinish();
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={[styles.container, { backgroundColor: isDark ? '#090D16' : '#F8FAFC' }]}>
        {/* Header Superior con Logo NBA */}
        <View style={styles.topHeader}>
          <Image
            source={require('../../../assets/nba-logo.png')}
            style={styles.nbaLogo}
            resizeMode="contain"
          />
          <View style={styles.headerTitles}>
            <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
              {step === 'SELECT_TEAM' ? '¡CREA TU FRANQUICIA NBA!' : '¡SOBRE INICIAL DESBLOQUEADO!'}
            </Text>
            <Text style={[styles.subtitle, { color: isDark ? '#94A3B8' : '#64748B' }]}>
              {step === 'SELECT_TEAM'
                ? 'Nombra tu equipo y elige tu club favorito para recibir 3 jugadores'
                : `3 jugadores de los ${selectedTeam?.name || 'NBA'} se unen a ${customTeamName.trim() || 'tu equipo'}`}
            </Text>
          </View>
        </View>

        {step === 'SELECT_TEAM' ? (
          <>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
              {/* Sección 1: Nombre Personalizado de la Franquicia */}
              <View style={[styles.teamNameBox, { backgroundColor: isDark ? '#131B2E' : '#FFFFFF', borderColor: isDark ? '#1E293B' : '#E2E8F0' }]}>
                <View style={styles.sectionHeaderRow}>
                  <Ionicons name="shirt-outline" size={18} color={NBA_THEME.nbaNavy} />
                  <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                    NOMBRE DE TU EQUIPO
                  </Text>
                </View>
                <Text style={[styles.sectionSub, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  Este es el nombre con el que competirás en el Quinteto y en la Temporada contra los 30 equipos de la NBA.
                </Text>
                <View style={[styles.teamNameInputWrapper, { backgroundColor: isDark ? '#1E293B' : '#F8FAFC' }]}>
                  <TextInput
                    style={[styles.teamNameInput, { color: isDark ? '#FFFFFF' : '#0F172A' }]}
                    value={customTeamName}
                    onChangeText={setCustomTeamName}
                    placeholder="Ej. Mi Franquicia, CDMX Dunkers, Hoops FC..."
                    placeholderTextColor="#94A3B8"
                    maxLength={30}
                    clearButtonMode="while-editing"
                  />
                  {customTeamName.length > 0 && (
                    <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                  )}
                </View>
              </View>

              {/* Sección 2: Selección de Equipo Favorito */}
              <View style={styles.favoriteHeaderSection}>
                <View style={styles.sectionHeaderRow}>
                  <Ionicons name="heart" size={18} color="#DC2626" />
                  <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                    ELIGE TU EQUIPO FAVORITO DE LA NBA
                  </Text>
                </View>
                <Text style={[styles.sectionSub, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  Recibirás un sobre de bienvenida de 3 jugadores pertenecientes a esta franquicia.
                </Text>

                {/* Buscador y Filtros */}
                <View style={[styles.searchInputWrapper, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}>
                  <Ionicons name="search-outline" size={18} color="#94A3B8" />
                  <TextInput
                    style={[styles.searchInput, { color: isDark ? '#FFFFFF' : '#0F172A' }]}
                    placeholder="Buscar equipo (Lakers, Celtics, Warriors, Bulls...)"
                    placeholderTextColor="#94A3B8"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    clearButtonMode="while-editing"
                  />
                </View>

                <View style={styles.filterPillsRow}>
                  <TouchableOpacity
                    style={[
                      styles.filterPill,
                      conferenceFilter === 'ALL' && styles.filterPillActive,
                    ]}
                    onPress={() => {
                      HapticsService.selectionTick();
                      setConferenceFilter('ALL');
                    }}
                  >
                    <Text
                      style={[
                        styles.filterPillText,
                        conferenceFilter === 'ALL' && styles.filterPillTextActive,
                      ]}
                    >
                      TODOS (30)
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.filterPill,
                      conferenceFilter === 'Eastern' && styles.filterPillActive,
                    ]}
                    onPress={() => {
                      HapticsService.selectionTick();
                      setConferenceFilter('Eastern');
                    }}
                  >
                    <Text
                      style={[
                        styles.filterPillText,
                        conferenceFilter === 'Eastern' && styles.filterPillTextActive,
                      ]}
                    >
                      ESTE (15)
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.filterPill,
                      conferenceFilter === 'Western' && styles.filterPillActive,
                    ]}
                    onPress={() => {
                      HapticsService.selectionTick();
                      setConferenceFilter('Western');
                    }}
                  >
                    <Text
                      style={[
                        styles.filterPillText,
                        conferenceFilter === 'Western' && styles.filterPillTextActive,
                      ]}
                    >
                      OESTE (15)
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Probabilidades Banner */}
                <View style={styles.probBanner}>
                  <Ionicons name="gift-outline" size={16} color={NBA_THEME.nbaNavy} />
                  <Text style={styles.probBannerText}>
                    Probabilidades: 🥉 Bronce (65%) | 🥈 Plata (28%) | 🥇 Oro (6%) | 💎 Diamante (1%)
                  </Text>
                </View>
              </View>

              {/* Grid de los 30 Equipos de la NBA */}
              <View style={styles.teamsGrid}>
                {filteredTeams.map((team) => {
                  const isSelected = selectedTeam?.abbreviation === team.abbreviation;
                  return (
                    <TouchableOpacity
                      key={team.abbreviation}
                      style={[
                        styles.teamCard,
                        { backgroundColor: isDark ? '#131B2E' : '#FFFFFF' },
                        isSelected && {
                          borderColor: team.primaryColor || NBA_THEME.nbaNavy,
                          borderWidth: 2.5,
                          backgroundColor: isDark ? '#1E293B' : '#EFF6FF',
                        },
                      ]}
                      onPress={() => handleSelectTeam(team)}
                      activeOpacity={0.8}
                    >
                      {/* Indicador de Selección */}
                      {isSelected && (
                        <View
                          style={[
                            styles.selectedBadge,
                            { backgroundColor: team.primaryColor || NBA_THEME.nbaNavy },
                          ]}
                        >
                          <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                        </View>
                      )}

                      <Image
                        source={{ uri: team.logoUrl }}
                        style={styles.teamLogo}
                        resizeMode="contain"
                      />

                      <Text
                        style={[
                          styles.teamName,
                          { color: isDark ? '#FFFFFF' : '#0F172A' },
                          isSelected && { fontWeight: '900' },
                        ]}
                        numberOfLines={1}
                      >
                        {team.name}
                      </Text>

                      <View style={styles.teamMetaRow}>
                        <View
                          style={[
                            styles.confBadge,
                            {
                              backgroundColor:
                                team.conference === 'Eastern' ? '#DBEAFE' : '#FEE2E2',
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.confBadgeText,
                              {
                                color:
                                  team.conference === 'Eastern' ? '#1E40AF' : '#991B1B',
                              },
                            ]}
                          >
                            {team.abbreviation} • {team.conference === 'Eastern' ? 'ESTE' : 'OESTE'}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>

            {/* Barra Inferior con Botón de Reclamar */}
            <View style={[styles.bottomBar, { backgroundColor: isDark ? '#0F172A' : '#FFFFFF' }]}>
              {selectedTeam ? (
                <View style={styles.selectedPreviewRow}>
                  <Image
                    source={{ uri: selectedTeam.logoUrl }}
                    style={styles.selectedPreviewLogo}
                    resizeMode="contain"
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.selectedPreviewTitle,
                        { color: isDark ? '#FFFFFF' : '#0F172A' },
                      ]}
                      numberOfLines={1}
                    >
                      {customTeamName.trim() || 'Mi Franquicia'}
                    </Text>
                    <Text style={styles.selectedPreviewSub}>
                      Sobre de 3 jugadores de {selectedTeam.name}
                    </Text>
                  </View>
                </View>
              ) : (
                <Text style={styles.pickHintText}>
                  👆 Selecciona tu equipo favorito para abrir tu sobre
                </Text>
              )}

              <CustomButton
                title={
                  selectedTeam
                    ? `CREAR EQUIPO Y ABRIR SOBRE DE ${selectedTeam.abbreviation}`
                    : 'SELECCIONA TU EQUIPO FAVORITO'
                }
                onPress={handleClaimStarterPack}
                disabled={!selectedTeam || loading}
                loading={loading}
                variant="primary"
                size="lg"
                iconName="gift"
                fullWidth
              />
            </View>
          </>
        ) : (
          /* PASO 2: CARTAS REVELADAS */
          <ScrollView
            contentContainerStyle={styles.revealContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.revealTeamHeader}>
              {selectedTeam && (
                <Image
                  source={{ uri: selectedTeam.logoUrl }}
                  style={styles.revealTeamLogo}
                  resizeMode="contain"
                />
              )}
              <Text style={[styles.revealCongratTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                ¡Tus 3 Jugadores Iniciales!
              </Text>
              <Text style={[styles.revealCongratSub, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                {`Pertenecientes a ${selectedTeam?.name || 'la NBA'} y listos para jugar en tu franquicia "${customTeamName.trim() || 'Mi Franquicia'}".`}
              </Text>
            </View>

            {/* Listado de las 3 cartas obtenidas */}
            <View style={styles.cardsRow}>
              {pulledCards.map((card, idx) => (
                <View key={card.instanceId || idx} style={styles.singleCardWrapper}>
                  <NBACard player={card.player} size="sm" />
                </View>
              ))}
            </View>

            <View style={styles.revealCtaSection}>
              <CustomButton
                title="¡COMENZAR MI TEMPORADA!"
                onPress={handleComplete}
                variant="primary"
                size="lg"
                iconName="arrow-forward-outline"
                iconPosition="right"
                fullWidth
                style={styles.completeBtn}
              />
            </View>
          </ScrollView>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 12,
  },
  nbaLogo: {
    width: 44,
    height: 44,
  },
  headerTitles: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  scrollContent: {
    paddingBottom: 160,
  },
  teamNameBox: {
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 8,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  sectionSub: {
    fontSize: 11.5,
    marginBottom: 10,
    lineHeight: 16,
  },
  teamNameInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  teamNameInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
  },
  favoriteHeaderSection: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
    gap: 8,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
  },
  filterPillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
  },
  filterPillActive: {
    backgroundColor: NBA_THEME.nbaNavy,
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },
  probBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EFF6FF',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  probBannerText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: NBA_THEME.nbaNavy,
    flex: 1,
  },
  teamsGrid: {
    paddingHorizontal: 16,
    marginTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  teamCard: {
    width: (SCREEN_WIDTH - 42) / 2,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    position: 'relative',
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamLogo: {
    width: 58,
    height: 58,
    marginBottom: 8,
  },
  teamName: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  teamMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  confBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  confBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  selectedPreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  selectedPreviewLogo: {
    width: 32,
    height: 32,
  },
  selectedPreviewTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  selectedPreviewSub: {
    fontSize: 11,
    color: '#64748B',
  },
  pickHintText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#64748B',
    marginBottom: 8,
    fontWeight: '600',
  },
  revealContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  revealTeamHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  revealTeamLogo: {
    width: 72,
    height: 72,
    marginBottom: 8,
  },
  revealCongratTitle: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  revealCongratSub: {
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
  },
  cardsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginVertical: 16,
  },
  singleCardWrapper: {
    width: 108,
  },
  revealCtaSection: {
    width: '100%',
    marginTop: 24,
  },
  completeBtn: {
    elevation: 3,
  },
});
