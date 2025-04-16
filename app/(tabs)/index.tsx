'use client';

import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  CheckCircle,
  FileText,
  Droplets,
  Bell,
  Plus,
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  Zap,
  Shield,
  X,
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { layout } from '@/constants/layout';
import { Card } from '@/components/Card';
import { useTodoStore } from '@/store/todo-store';
import { useNoteStore } from '@/store/note-store';
import { useHabitStore } from '@/store/habit-store';
import { useEmergencyStore } from '@/store/emergency-store';
import { useSettingsStore } from '@/store/settings-store';
import { useAuthStore } from '@/store/auth-store';
import { formatDate, getTodayISO } from '@/utils/date';
import * as Location from 'expo-location';
import { useTranslation } from '@/hooks/use-translation';
import { useColorScheme } from 'react-native';
import { SOSButton } from '@/components/SOSButton';
import { AdBanner } from '@/components/AdBanner';

// Weather icons mapping
const weatherIcons = {
  '01d': Sun,
  '01n': Sun,
  '02d': Cloud,
  '02n': Cloud,
  '03d': Cloud,
  '03n': Cloud,
  '04d': Cloud,
  '04n': Cloud,
  '09d': CloudRain,
  '09n': CloudRain,
  '10d': CloudRain,
  '10n': CloudRain,
  '11d': Zap,
  '11n': Zap,
  '13d': CloudSnow,
  '13n': CloudSnow,
  '50d': Cloud,
  '50n': Cloud,
};

export default function HomeScreen() {
  const router = useRouter();
  const { todos, addTodo } = useTodoStore();
  const { notes, addNote } = useNoteStore();
  const { habits } = useHabitStore();
  const { updateLocation, profile, contacts } = useEmergencyStore();
  const { locationTracking, isFirstLaunch, updateSettings } =
    useSettingsStore();
  const { user, isGuest } = useAuthStore();
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const { theme } = useSettingsStore();

  const activeTheme = theme === 'system' ? colorScheme || 'light' : theme;
  const isDarkMode = activeTheme === 'dark';

  // State for current time
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [showNewNoteModal, setShowNewNoteModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Weather state
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [locationName, setLocationName] = useState('');

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Format time as HH:MM AM/PM
  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  // Get pending todos
  const pendingTodos = todos.filter((todo) => todo.status === 'pending');

  // Get today's date
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  // Get habits for today
  const todayISO = getTodayISO();
  const todayHabits = habits.map((habit) => ({
    ...habit,
    completed: habit.completedDates.includes(todayISO),
  }));

  // Fetch weather data
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Permission to access location was denied');
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        updateLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        // Get location name
        const geoResponse = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (geoResponse.length > 0) {
          const loc = geoResponse[0];
          setLocationName(`${loc.city}, ${loc.region || loc.country}`);
        }

        // Fetch weather data
        const weatherResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&units=metric&appid=${process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY}`
        );
        const weatherData = await weatherResponse.json();
        setWeather(weatherData);
      } catch (error) {
        console.error('Error fetching weather:', error);
      } finally {
        setLoadingWeather(false);
      }
    };

    fetchWeather();
  }, []);

  // Get weather icon component
  const WeatherIcon = weather?.weather?.[0]?.icon
    ? weatherIcons[weather.weather[0].icon] || Sun
    : Sun;

  // Get user name for greeting
  const userName = isGuest
    ? t('Guest')
    : profile.name || (user?.email ? user.email.split('@')[0] : t('there'));

  // Get recent notes
  const recentNotes = notes.slice(0, 3);

  return (
    <SafeAreaView
      style={[styles.container, isDarkMode && styles.containerDark]}
      edges={['right', 'left']}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <View style={styles.welcomeHeader}>
            <View>
              <Text
                style={[styles.greeting, isDarkMode && styles.greetingDark]}
              >
                {getGreeting()}, {userName}
              </Text>
              <Text style={[styles.date, isDarkMode && styles.dateDark]}>
                {formattedDate}
              </Text>
            </View>
          </View>

          {/* Weather Card */}
          <Card
            style={[styles.weatherCard, isDarkMode && styles.weatherCardDark]}
          >
            {loadingWeather ? (
              <View style={styles.weatherLoading}>
                <ActivityIndicator
                  size="small"
                  color={isDarkMode ? colors.darkPrimary : colors.primary}
                />
              </View>
            ) : (
              <View style={styles.weatherContent}>
                <View style={styles.weatherMain}>
                  <View style={styles.weatherIconContainer}>
                    <WeatherIcon
                      size={32}
                      color={isDarkMode ? colors.darkText : colors.text}
                    />
                  </View>
                  <Text
                    style={[
                      styles.temperature,
                      isDarkMode && styles.temperatureDark,
                    ]}
                  >
                    {weather?.main?.temp
                      ? `${Math.round(weather.main.temp)}°C`
                      : '--°'}
                  </Text>
                  <Text
                    style={[
                      styles.weatherDescription,
                      isDarkMode && styles.weatherDescriptionDark,
                    ]}
                  >
                    {weather?.weather?.[0]?.description || t('Loading weather')}
                  </Text>
                  {locationName && (
                    <Text
                      style={[
                        styles.location,
                        isDarkMode && styles.locationDark,
                      ]}
                    >
                      {locationName}
                    </Text>
                  )}
                </View>
              </View>
            )}
          </Card>
        </View>

        {/* Ad Banner */}
        <View style={styles.adContainer}>
          <AdBanner size="banner" />
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.quickAction, isDarkMode && styles.quickActionDark]}
            onPress={() => setShowNewTaskModal(true)}
          >
            <View
              style={[styles.actionIcon, { backgroundColor: colors.primary }]}
            >
              <CheckCircle size={20} color={colors.background} />
            </View>
            <Text
              style={[styles.actionText, isDarkMode && styles.actionTextDark]}
            >
              {t('New Task')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickAction, isDarkMode && styles.quickActionDark]}
            onPress={() => setShowNewNoteModal(true)}
          >
            <View
              style={[styles.actionIcon, { backgroundColor: colors.secondary }]}
            >
              <FileText size={20} color={colors.background} />
            </View>
            <Text
              style={[styles.actionText, isDarkMode && styles.actionTextDark]}
            >
              {t('New Note')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickAction, isDarkMode && styles.quickActionDark]}
            onPress={() => router.push('/vault')}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.info }]}>
              <Shield size={20} color={colors.background} />
            </View>
            <Text
              style={[styles.actionText, isDarkMode && styles.actionTextDark]}
            >
              {t('Vault')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Today's Tasks */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text
              style={[
                styles.sectionTitle,
                isDarkMode && styles.sectionTitleDark,
              ]}
            >
              {t("Today's Tasks")}
            </Text>
            <TouchableOpacity onPress={() => router.push('/todos')}>
              <Text style={[styles.seeAll, isDarkMode && styles.seeAllDark]}>
                {t('See All')}
              </Text>
            </TouchableOpacity>
          </View>

          <Card style={[styles.card, isDarkMode && styles.cardDark]}>
            {pendingTodos.length > 0 ? (
              pendingTodos.slice(0, 3).map((todo) => (
                <View
                  key={todo.id}
                  style={[styles.todoItem, isDarkMode && styles.todoItemDark]}
                >
                  <TouchableOpacity style={styles.todoCheckbox}>
                    <CheckCircle
                      size={18}
                      color={isDarkMode ? colors.darkPrimary : colors.primary}
                    />
                  </TouchableOpacity>
                  <View style={styles.todoContent}>
                    <Text
                      style={[
                        styles.todoTitle,
                        isDarkMode && styles.todoTitleDark,
                      ]}
                    >
                      {todo.title}
                    </Text>
                    {todo.dueDate && (
                      <Text
                        style={[
                          styles.todoMeta,
                          isDarkMode && styles.todoMetaDark,
                        ]}
                      >
                        {t('Due')}: {formatDate(todo.dueDate)}
                      </Text>
                    )}
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text
                  style={[
                    styles.emptyStateText,
                    isDarkMode && styles.emptyStateTextDark,
                  ]}
                >
                  {t('No tasks for today')}
                </Text>
                <TouchableOpacity
                  style={styles.emptyStateButton}
                  onPress={() => setShowNewTaskModal(true)}
                >
                  <Text style={styles.emptyStateButtonText}>
                    {t('Add Task')}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {pendingTodos.length > 0 && (
              <TouchableOpacity
                style={[
                  styles.addMoreButton,
                  isDarkMode && styles.addMoreButtonDark,
                ]}
                onPress={() => setShowNewTaskModal(true)}
              >
                <Plus
                  size={16}
                  color={isDarkMode ? colors.darkPrimary : colors.primary}
                />
                <Text
                  style={[
                    styles.addMoreText,
                    isDarkMode && styles.addMoreTextDark,
                  ]}
                >
                  {t('Add New Task')}
                </Text>
              </TouchableOpacity>
            )}
          </Card>
        </View>

        {/* Recent Notes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text
              style={[
                styles.sectionTitle,
                isDarkMode && styles.sectionTitleDark,
              ]}
            >
              {t('Recent Notes')}
            </Text>
            <TouchableOpacity onPress={() => router.push('/notes')}>
              <Text style={[styles.seeAll, isDarkMode && styles.seeAllDark]}>
                {t('See All')}
              </Text>
            </TouchableOpacity>
          </View>

          <Card style={[styles.card, isDarkMode && styles.cardDark]}>
            {recentNotes.length > 0 ? (
              recentNotes.map((note) => (
                <View
                  key={note.id}
                  style={[styles.noteItem, isDarkMode && styles.noteItemDark]}
                >
                  <View style={styles.noteContent}>
                    <Text
                      style={[
                        styles.noteTitle,
                        isDarkMode && styles.noteTitleDark,
                      ]}
                      numberOfLines={1}
                    >
                      {note.title}
                    </Text>
                    <Text
                      style={[
                        styles.notePreview,
                        isDarkMode && styles.notePreviewDark,
                      ]}
                      numberOfLines={2}
                    >
                      {note.isEncrypted
                        ? t('[Password Protected]')
                        : note.content}
                    </Text>
                  </View>
                  <View style={styles.noteTimeContainer}>
                    <Text
                      style={[
                        styles.noteTime,
                        isDarkMode && styles.noteTimeDark,
                      ]}
                    >
                      {new Date(note.updatedAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text
                  style={[
                    styles.emptyStateText,
                    isDarkMode && styles.emptyStateTextDark,
                  ]}
                >
                  {t('No notes yet')}
                </Text>
              </View>
            )}
          </Card>
        </View>

        {/* Ad Banner */}
        <View style={styles.adContainer}>
          <AdBanner size="largeBanner" />
        </View>

        {/* Emergency SOS Section */}
        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark]}
          >
            {t('Emergency SOS')}
          </Text>

          <Card style={[styles.sosCard, isDarkMode && styles.sosCardDark]}>
            <View style={styles.sosContent}>
              <Text
                style={[styles.sosTitle, isDarkMode && styles.sosTitleDark]}
              >
                {t('Hold for 3 seconds to activate emergency mode')}
              </Text>
              <Text
                style={[
                  styles.sosDescription,
                  isDarkMode && styles.sosDescriptionDark,
                ]}
              >
                {t(
                  'This will alert your emergency contacts and share your location'
                )}
              </Text>
            </View>

            <SOSButton isDarkMode={isDarkMode} />
          </Card>
        </View>

        {/* Health Reminders */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text
              style={[
                styles.sectionTitle,
                isDarkMode && styles.sectionTitleDark,
              ]}
            >
              {t('Health Reminders')}
            </Text>
            <TouchableOpacity onPress={() => router.push('/reminders')}>
              <Text style={[styles.seeAll, isDarkMode && styles.seeAllDark]}>
                {t('See All')}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.remindersContainer}>
            <TouchableOpacity
              style={[
                styles.reminderCard,
                isDarkMode && styles.reminderCardDark,
              ]}
              onPress={() => router.push('/reminders/water')}
            >
              <View
                style={[
                  styles.reminderIcon,
                  { backgroundColor: colors.infoLight },
                ]}
              >
                <Droplets size={24} color={colors.info} />
              </View>
              <Text
                style={[
                  styles.reminderTitle,
                  isDarkMode && styles.reminderTitleDark,
                ]}
              >
                {t('Drink Water')}
              </Text>
              <Text
                style={[
                  styles.reminderText,
                  isDarkMode && styles.reminderTextDark,
                ]}
              >
                {t('Stay hydrated')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.reminderCard,
                isDarkMode && styles.reminderCardDark,
              ]}
              onPress={() => router.push('/reminders/medication')}
            >
              <View
                style={[
                  styles.reminderIcon,
                  { backgroundColor: colors.warningLight },
                ]}
              >
                <Bell size={24} color={colors.warning} />
              </View>
              <Text
                style={[
                  styles.reminderTitle,
                  isDarkMode && styles.reminderTitleDark,
                ]}
              >
                {t('Medication')}
              </Text>
              <Text
                style={[
                  styles.reminderText,
                  isDarkMode && styles.reminderTextDark,
                ]}
              >
                {t('Set reminders')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* New Task Modal */}
      <Modal
        visible={showNewTaskModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowNewTaskModal(false)}
      >
        <View
          style={[
            styles.modalContainer,
            isDarkMode && styles.modalContainerDark,
          ]}
        >
          <View
            style={[styles.modalContent, isDarkMode && styles.modalContentDark]}
          >
            <View style={styles.modalHeader}>
              <Text
                style={[styles.modalTitle, isDarkMode && styles.modalTitleDark]}
              >
                {t('New Task')}
              </Text>
              <TouchableOpacity onPress={() => setShowNewTaskModal(false)}>
                <X
                  size={24}
                  color={isDarkMode ? colors.darkText : colors.text}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, isDarkMode && styles.labelDark]}>
                {t('Task Title')}
              </Text>
              <TextInput
                style={[styles.input, isDarkMode && styles.inputDark]}
                placeholder={t('Enter task title')}
                value={newTaskTitle}
                onChangeText={setNewTaskTitle}
                placeholderTextColor={
                  isDarkMode ? colors.darkTextSecondary : colors.textSecondary
                }
                autoFocus
              />
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  isDarkMode && styles.modalButtonDark,
                ]}
                onPress={() => setShowNewTaskModal(false)}
              >
                <Text
                  style={[
                    styles.modalButtonText,
                    isDarkMode && styles.modalButtonTextDark,
                  ]}
                >
                  {t('Cancel')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.modalPrimaryButton,
                  !newTaskTitle.trim() && styles.modalButtonDisabled,
                ]}
                onPress={() => {
                  if (newTaskTitle.trim()) {
                    addTodo({
                      id: Date.now().toString(),
                      title: newTaskTitle.trim(),
                      description: '',
                      status: 'pending',
                      priority: 'medium',
                      createdAt: new Date().toISOString(),
                      dueDate: null,
                      completedAt: null,
                      tags: [],
                    });
                    setNewTaskTitle('');
                    setShowNewTaskModal(false);
                  }
                }}
                disabled={!newTaskTitle.trim()}
              >
                <Text style={styles.modalPrimaryButtonText}>{t('Add')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* New Note Modal */}
      <Modal
        visible={showNewNoteModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowNewNoteModal(false)}
      >
        <View
          style={[
            styles.modalContainer,
            isDarkMode && styles.modalContainerDark,
          ]}
        >
          <View
            style={[styles.modalContent, isDarkMode && styles.modalContentDark]}
          >
            <View style={styles.modalHeader}>
              <Text
                style={[styles.modalTitle, isDarkMode && styles.modalTitleDark]}
              >
                {t('New Note')}
              </Text>
              <TouchableOpacity onPress={() => setShowNewNoteModal(false)}>
                <X
                  size={24}
                  color={isDarkMode ? colors.darkText : colors.text}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, isDarkMode && styles.labelDark]}>
                {t('Note Title')}
              </Text>
              <TextInput
                style={[styles.input, isDarkMode && styles.inputDark]}
                placeholder={t('Enter note title')}
                value={newNoteTitle}
                onChangeText={setNewNoteTitle}
                placeholderTextColor={
                  isDarkMode ? colors.darkTextSecondary : colors.textSecondary
                }
                autoFocus
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, isDarkMode && styles.labelDark]}>
                {t('Note Content')}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  isDarkMode && styles.inputDark,
                ]}
                placeholder={t('Enter note content')}
                value={newNoteContent}
                onChangeText={setNewNoteContent}
                placeholderTextColor={
                  isDarkMode ? colors.darkTextSecondary : colors.textSecondary
                }
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  isDarkMode && styles.modalButtonDark,
                ]}
                onPress={() => setShowNewNoteModal(false)}
              >
                <Text
                  style={[
                    styles.modalButtonText,
                    isDarkMode && styles.modalButtonTextDark,
                  ]}
                >
                  {t('Cancel')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.modalPrimaryButton,
                  (!newNoteTitle.trim() || !newNoteContent.trim()) &&
                    styles.modalButtonDisabled,
                ]}
                onPress={() => {
                  if (newNoteTitle.trim() && newNoteContent.trim()) {
                    addNote({
                      title: newNoteTitle.trim(),
                      content: newNoteContent.trim(),
                      isEncrypted: false,
                    });
                    setNewNoteTitle('');
                    setNewNoteContent('');
                    setShowNewNoteModal(false);
                  }
                }}
                disabled={!newNoteTitle.trim() || !newNoteContent.trim()}
              >
                <Text style={styles.modalPrimaryButtonText}>{t('Add')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Helper function to get greeting based on time of day
const getGreeting = (): string => {
  const hour = new Date().getHours();

  if (hour < 12) {
    return 'Good morning';
  } else if (hour < 18) {
    return 'Good afternoon';
  } else {
    return 'Good evening';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  containerDark: {
    backgroundColor: colors.darkBackground,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: layout.spacing.md,
    paddingBottom: layout.spacing.xxl,
  },
  welcomeSection: {
    marginBottom: layout.spacing.lg,
  },
  welcomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: layout.spacing.md,
  },
  greeting: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: layout.spacing.xs,
  },
  greetingDark: {
    color: colors.darkText,
  },
  date: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
  },
  dateDark: {
    color: colors.darkTextSecondary,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.highlight,
    paddingHorizontal: layout.spacing.sm,
    paddingVertical: layout.spacing.xs,
    borderRadius: layout.borderRadius.md,
  },
  timeContainerDark: {
    backgroundColor: colors.darkHighlight,
  },
  timeText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginLeft: 4,
    fontWeight: typography.weights.medium,
  },
  timeTextDark: {
    color: colors.darkTextSecondary,
  },
  weatherCard: {
    marginTop: layout.spacing.sm,
  },
  weatherCardDark: {
    backgroundColor: colors.darkCard,
    borderColor: colors.darkBorder,
  },
  weatherLoading: {
    padding: layout.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weatherContent: {
    padding: layout.spacing.md,
  },
  weatherMain: {
    flex: 1,
  },
  weatherIconContainer: {
    marginBottom: layout.spacing.sm,
  },
  temperature: {
    fontSize: 32,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  temperatureDark: {
    color: colors.darkText,
  },
  weatherDescription: {
    fontSize: typography.sizes.md,
    color: colors.text,
    marginBottom: 4,
  },
  weatherDescriptionDark: {
    color: colors.darkText,
  },
  location: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  locationDark: {
    color: colors.darkTextSecondary,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: layout.spacing.xl,
  },
  quickAction: {
    alignItems: 'center',
    width: '30%',
  },
  quickActionDark: {
    // Dark mode styles if needed
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: layout.spacing.xs,
  },
  actionText: {
    fontSize: typography.sizes.sm,
    color: colors.text,
    fontWeight: typography.weights.medium,
  },
  actionTextDark: {
    color: colors.darkText,
  },
  section: {
    marginBottom: layout.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: layout.spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text,
  },
  sectionTitleDark: {
    color: colors.darkText,
  },
  seeAll: {
    fontSize: typography.sizes.sm,
    color: colors.primary,
    fontWeight: typography.weights.medium,
  },
  seeAllDark: {
    color: colors.darkPrimary,
  },
  card: {
    padding: 0,
    overflow: 'hidden',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardDark: {
    backgroundColor: colors.darkCard,
    borderColor: colors.darkBorder,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  todoItemDark: {
    borderBottomColor: colors.darkBorder,
  },
  todoCheckbox: {
    marginRight: layout.spacing.md,
  },
  todoContent: {
    flex: 1,
  },
  todoTitle: {
    fontSize: typography.sizes.md,
    color: colors.text,
    marginBottom: 2,
  },
  todoTitleDark: {
    color: colors.darkText,
  },
  todoMeta: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  todoMetaDark: {
    color: colors.darkTextSecondary,
  },
  emptyState: {
    padding: layout.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    marginBottom: layout.spacing.md,
  },
  emptyStateTextDark: {
    color: colors.darkTextSecondary,
  },
  emptyStateButton: {
    backgroundColor: colors.primary,
    paddingVertical: layout.spacing.xs,
    paddingHorizontal: layout.spacing.md,
    borderRadius: layout.borderRadius.md,
  },
  emptyStateButtonText: {
    color: colors.background,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  addMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: layout.spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  addMoreButtonDark: {
    borderTopColor: colors.darkBorder,
  },
  addMoreText: {
    fontSize: typography.sizes.sm,
    color: colors.primary,
    fontWeight: typography.weights.medium,
    marginLeft: layout.spacing.xs,
  },
  addMoreTextDark: {
    color: colors.darkPrimary,
  },
  sosCard: {
    backgroundColor: colors.card,
    borderRadius: layout.borderRadius.md,
    padding: layout.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
  },
  sosCardDark: {
    backgroundColor: colors.darkCard,
    borderColor: colors.darkBorder,
  },
  sosContent: {
    flex: 1,
    marginRight: layout.spacing.md,
  },
  sosTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.text,
    marginBottom: layout.spacing.xs,
  },
  sosTitleDark: {
    color: colors.darkText,
  },
  sosDescription: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  sosDescriptionDark: {
    color: colors.darkTextSecondary,
  },
  premiumCard: {
    backgroundColor: colors.card,
    borderRadius: layout.borderRadius.md,
    overflow: 'hidden',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.border,
  },
  premiumCardDark: {
    backgroundColor: colors.darkCard,
    borderColor: colors.darkBorder,
  },
  premiumContent: {
    flex: 1,
    padding: layout.spacing.md,
  },
  premiumTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: layout.spacing.xs,
  },
  premiumTitleDark: {
    color: colors.darkText,
  },
  premiumDescription: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginBottom: layout.spacing.md,
  },
  premiumDescriptionDark: {
    color: colors.darkTextSecondary,
  },
  premiumButton: {
    backgroundColor: colors.primary,
    borderRadius: layout.borderRadius.sm,
    paddingVertical: layout.spacing.sm,
    paddingHorizontal: layout.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  premiumButtonText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: '#FFFFFF',
    marginRight: layout.spacing.xs,
  },
  premiumImage: {
    width: 100,
    height: '100%',
  },
  remindersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reminderCard: {
    width: '48%',
    backgroundColor: colors.card,
    borderRadius: layout.borderRadius.md,
    padding: layout.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  reminderCardDark: {
    backgroundColor: colors.darkCard,
    borderColor: colors.darkBorder,
  },
  reminderIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: layout.spacing.sm,
  },
  reminderTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: 4,
  },
  reminderTitleDark: {
    color: colors.darkText,
  },
  reminderText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  reminderTextDark: {
    color: colors.darkTextSecondary,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: layout.spacing.lg,
  },
  modalContainerDark: {
    // Additional dark mode styles if needed
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: layout.borderRadius.lg,
    padding: layout.spacing.lg,
    width: '100%',
    maxWidth: 500,
  },
  modalContentDark: {
    backgroundColor: colors.darkBackground,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: layout.spacing.lg,
  },
  modalTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  modalTitleDark: {
    color: colors.darkText,
  },
  formGroup: {
    marginBottom: layout.spacing.lg,
  },
  label: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.text,
    marginBottom: layout.spacing.xs,
  },
  labelDark: {
    color: colors.darkText,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: layout.borderRadius.md,
    padding: layout.spacing.md,
    fontSize: typography.sizes.md,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputDark: {
    backgroundColor: colors.darkCard,
    color: colors.darkText,
    borderColor: colors.darkBorder,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: layout.spacing.lg,
  },
  modalButton: {
    paddingVertical: layout.spacing.sm,
    paddingHorizontal: layout.spacing.lg,
    borderRadius: layout.borderRadius.md,
    marginLeft: layout.spacing.sm,
  },
  modalButtonDark: {
    // Additional dark mode styles if needed
  },
  modalButtonText: {
    fontSize: typography.sizes.md,
    color: colors.text,
    fontWeight: typography.weights.medium,
  },
  modalButtonTextDark: {
    color: colors.darkText,
  },
  modalPrimaryButton: {
    backgroundColor: colors.primary,
  },
  modalPrimaryButtonText: {
    color: colors.background,
    fontWeight: typography.weights.medium,
  },
  modalButtonDisabled: {
    opacity: 0.5,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  noteItem: {
    flexDirection: 'row',
    padding: layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noteItemDark: {
    borderBottomColor: colors.darkBorder,
  },
  noteContent: {
    flex: 1,
    marginRight: layout.spacing.md,
  },
  noteTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.text,
    marginBottom: 4,
  },
  noteTitleDark: {
    color: colors.darkText,
  },
  notePreview: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  notePreviewDark: {
    color: colors.darkTextSecondary,
  },
  noteTimeContainer: {
    marginLeft: layout.spacing.md,
  },
  noteTime: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  noteTimeDark: {
    color: colors.darkTextSecondary,
  },
  adContainer: {
    marginVertical: layout.spacing.md,
  },
});
