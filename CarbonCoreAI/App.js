import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const { width } = Dimensions.get('window');

// ─── Carbon Core Design Tokens ────────────────────────────────────────
const COLORS = {
  background: '#0E0E0E',
  surface: '#131313',
  surfaceContainerLow: '#1C1B1B',
  surfaceContainer: '#201F1F',
  surfaceContainerHigh: '#2A2A2A',
  surfaceContainerHighest: '#353534',
  primaryContainer: '#DC2626',
  primary: '#FFB4AB',
  secondary: '#B91C1C',
  onSurface: '#E5E2E1',
  onSurfaceVariant: '#E6BDB8',
  outline: '#AC8884',
  outlineVariant: '#5C403C',
  textSecondary: '#9CA3AF',
};

const FONTS = {
  regular: { fontWeight: '400' },
  medium: { fontWeight: '500' },
  semibold: { fontWeight: '600' },
  bold: { fontWeight: '700' },
  black: { fontWeight: '900' },
};

// ─── Pulsing Orb Component ────────────────────────────────────────────
function PulsingOrb() {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 0.15,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.4,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  return (
    <Animated.View
      style={[
        styles.orbContainer,
        {
          transform: [{ scale: pulseAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <LinearGradient
        colors={['#DC2626', '#B91C1C', 'transparent']}
        style={styles.orb}
        start={{ x: 0.5, y: 0.5 }}
        end={{ x: 0.5, y: 1 }}
      />
    </Animated.View>
  );
}

// ─── Status Dot Component ─────────────────────────────────────────────
function StatusDot() {
  const glowAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.5,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.statusContainer}>
      <Animated.View
        style={[
          styles.statusGlow,
          { opacity: glowAnim },
        ]}
      />
      <View style={styles.statusDot} />
      <Text style={styles.statusText}>ONLİNE</Text>
    </View>
  );
}

// ─── Quick Action Card ────────────────────────────────────────────────
function ActionCard({ label, category, icon, iconType = 'ionicons' }) {
  const IconComponent = iconType === 'material' ? MaterialCommunityIcons : Ionicons;
  
  return (
    <TouchableOpacity style={styles.actionCard} activeOpacity={0.7}>
      <View style={styles.actionCardBorder} />
      <View style={styles.actionCardContent}>
        <View>
          <Text style={styles.actionCategory}>{category}</Text>
          <Text style={styles.actionLabel}>{label}</Text>
        </View>
        <View style={styles.actionIconContainer}>
          <IconComponent name={icon} size={20} color={COLORS.onSurface} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── Home Screen ───────────────────────────────────────────────────────
function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Top Bar ── */}
        <View style={styles.topBar}>
          <View style={styles.logoContainer}>
            <MaterialCommunityIcons
              name="code-braces"
              size={18}
              color={COLORS.primaryContainer}
            />
            <Text style={styles.logoText}>CARBON CORE</Text>
          </View>

          <View style={styles.topBarRight}>
            <StatusDot />
            <TouchableOpacity style={styles.settingsButton}>
              <Feather name="settings" size={18} color={COLORS.onSurfaceVariant} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Hero Section ── */}
        <View style={styles.heroSection}>
          <PulsingOrb />
          <Text style={styles.heroTitle}>CARBON{'\n'}CORE AI</Text>
          <Text style={styles.heroSubtitle}>
            Türkçe tabanlı, yüksek performanslı{'\n'}yapay zeka motoru
          </Text>
        </View>

        {/* ── Quick Actions ── */}
        <View style={styles.actionsSection}>
          <ActionCard
            category="BAŞLAT"
            label="Yeni Sohbet"
            icon="chatbubble"
            iconType="ionicons"
          />
          <ActionCard
            category="GELİŞTİRME"
            label="Kod Üret"
            icon="code-braces-box"
            iconType="material"
          />
          <ActionCard
            category="VERİ"
            label="Analiz"
            icon="chart-bar"
            iconType="material"
          />
        </View>
      </ScrollView>

      {/* ── Chat Input ── */}
      <View style={styles.inputSection}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Carbon'a bir şey sor..."
            placeholderTextColor={COLORS.outlineVariant}
          />
          <TouchableOpacity style={styles.sendButton} activeOpacity={0.8}>
            <Ionicons name="arrow-up" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ─── Placeholder Screens ──────────────────────────────────────────────
function HistoryScreen() {
  return (
    <View style={styles.placeholderContainer}>
      <Text style={styles.placeholderText}>History Screen</Text>
    </View>
  );
}

function ProjectsScreen() {
  return (
    <View style={styles.placeholderContainer}>
      <Text style={styles.placeholderText}>Projects Screen</Text>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={styles.placeholderContainer}>
      <Text style={styles.placeholderText}>Profile Screen</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

// ─── Main App ─────────────────────────────────────────────────────────
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: styles.bottomNav,
          tabBarIcon: ({ focused }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'History') {
              iconName = focused ? 'time' : 'time-outline';
            } else if (route.name === 'Projects') {
              iconName = focused ? 'folder' : 'folder-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            }

            return (
              <View style={focused ? styles.navActive : styles.navItem}>
                <Ionicons
                  name={iconName}
                  size={22}
                  color={focused ? "#FFFFFF" : COLORS.outlineVariant}
                />
              </View>
            );
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="History" component={HistoryScreen} />
        <Tab.Screen name="Projects" component={ProjectsScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  placeholderContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: COLORS.onSurfaceVariant,
    fontSize: 18,
    ...FONTS.medium,
  },

  // ── Top Bar ──
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoText: {
    color: COLORS.onSurface,
    fontSize: 14,
    letterSpacing: 2,
    ...FONTS.bold,
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  settingsButton: {
    padding: 4,
  },

  // ── Status Dot ──
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: COLORS.primaryContainer,
  },
  statusGlow: {
    position: 'absolute',
    left: -4,
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: COLORS.primaryContainer,
  },
  statusText: {
    color: COLORS.primaryContainer,
    fontSize: 10,
    letterSpacing: 1.5,
    ...FONTS.bold,
  },

  // ── Hero Section ──
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    position: 'relative',
  },
  orbContainer: {
    position: 'absolute',
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orb: {
    width: 220,
    height: 220,
    borderRadius: 110,
  },
  heroTitle: {
    color: COLORS.onSurface,
    fontSize: 38,
    textAlign: 'center',
    lineHeight: 44,
    letterSpacing: 1,
    ...FONTS.black,
    zIndex: 1,
  },
  heroSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 20,
    ...FONTS.regular,
    zIndex: 1,
  },

  // ── Actions ──
  actionsSection: {
    paddingHorizontal: 20,
    gap: 12,
  },
  actionCard: {
    backgroundColor: COLORS.surfaceContainerHigh,
    borderRadius: 12,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  actionCardBorder: {
    width: 3,
    backgroundColor: COLORS.primaryContainer,
  },
  actionCardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  actionCategory: {
    color: COLORS.primaryContainer,
    fontSize: 10,
    letterSpacing: 2,
    marginBottom: 4,
    ...FONTS.bold,
  },
  actionLabel: {
    color: COLORS.onSurface,
    fontSize: 16,
    ...FONTS.semibold,
  },
  actionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceContainerHighest,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Input ──
  inputSection: {
    paddingHorizontal: 20,
    paddingBottom: 8,
    paddingTop: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 12,
    paddingLeft: 16,
    paddingRight: 6,
    height: 48,
  },
  textInput: {
    flex: 1,
    color: COLORS.onSurface,
    fontSize: 14,
    ...FONTS.regular,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Bottom Nav ──
  bottomNav: {
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceContainerLow,
    height: 60,
    paddingTop: 8,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 0,
    shadowOpacity: 0,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    width: 40,
    height: 40,
  },
  navActive: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
