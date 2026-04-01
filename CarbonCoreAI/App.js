import React, { useEffect, useRef, useState } from 'react';
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
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CarbonHighlighter from './components/CarbonHighlighter';
import { sendMessageToLLM, initChat, simulateRuntime, simulateLowLevel, generateAutoDoc } from './services/LLMService';
import { getChats, saveChat, deleteChat, getChatById, getProjects, saveProject, deleteProject, getProjectById } from './services/StorageService';

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
function ActionCard({ label, category, icon, iconType = 'ionicons', onPress }) {
  const IconComponent = iconType === 'material' ? MaterialCommunityIcons : Ionicons;
  
  return (
    <TouchableOpacity style={styles.actionCard} activeOpacity={0.7} onPress={onPress}>
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

// ─── Chat Input Component ──────────────────────────────────────────────
function ChatInput({ onSend }) {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim().length > 0) {
      onSend(text.trim());
      setText('');
    }
  };

  return (
    <View style={styles.inputSection}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Carbon'a bir şey sor..."
          placeholderTextColor={COLORS.outlineVariant}
          value={text}
          onChangeText={setText}
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity style={styles.sendButton} activeOpacity={0.8} onPress={handleSend}>
          <Ionicons name="arrow-up" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Chat Screen ───────────────────────────────────────────────────────
function ChatScreen({ route, navigation }) {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatId = useRef(route.params?.chatId || Date.now().toString()).current;

  useEffect(() => {
    const loadChat = async () => {
      initChat();
      if (route.params?.chatId) {
        const existing = await getChatById(route.params.chatId);
        if (existing) {
          setMessages(existing.messages.map(m => ({...m, isRunning: false})));
        }
      } else {
        setMessages([
          { id: '1', text: 'Merhaba! Ben Carbon Core AI. Size nasıl yardımcı olabilirim?', isUser: false },
          { 
            id: '2', 
            text: '// İlk Carbon kodunuz\ntanıt isim = "Ahmet";\n\neğer (isim == "Ahmet") {\n    yazdır("Merhaba Ahmet!");\n}', 
            isUser: false,
            isCode: true
          }
        ]);
      }
    };
    loadChat();
  }, [route.params?.chatId]);

  const commitChatSync = (newArr) => {
    const firstUserMsg = newArr.find(m => m.isUser);
    const chatData = {
      id: chatId,
      date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
      preview: firstUserMsg ? firstUserMsg.text : 'Yeni Sohbet',
      messages: newArr,
    };
    saveChat(chatData);
  };

  const handleRunCode = async (id, code) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, isRunning: true } : m));
    const result = await simulateRuntime(code);
    setMessages(prev => {
      const newArr = prev.map(m => m.id === id ? { ...m, isRunning: false, consoleOutput: result } : m);
      commitChatSync(newArr);
      return newArr;
    });
  };

  const handleLowLevel = (code) => {
    navigation.navigate('LowLevel', { code });
  };

  const handleSend = async (text) => {
    const newMessage = { id: Date.now().toString(), text, isUser: true };
    setMessages((prev) => {
      const narr = [...prev, newMessage];
      commitChatSync(narr);
      return narr;
    });
    setIsTyping(true);

    const responseText = await sendMessageToLLM(text);
    setIsTyping(false);

    const regex = /```(?:carbon)?\s*([\s\S]*?)```/gi;
    let parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(responseText)) !== null) {
      if (match.index > lastIndex) {
        const textPart = responseText.substring(lastIndex, match.index).trim();
        if (textPart) parts.push({ text: textPart, isCode: false });
      }
      const codePart = match[1].trim();
      if (codePart) parts.push({ text: codePart, isCode: true });
      lastIndex = regex.lastIndex;
    }
    
    if (lastIndex < responseText.length) {
      const textPart = responseText.substring(lastIndex).trim();
      if (textPart) parts.push({ text: textPart, isCode: false });
    }

    if (parts.length === 0) {
      parts.push({ text: responseText.trim(), isCode: false });
    }

    const newMessages = parts.map((part, index) => ({
      ...part,
      id: Date.now().toString() + index,
      isUser: false
    }));

    setMessages((prev) => {
      const narr = [...prev, ...newMessages];
      commitChatSync(narr);
      return narr;
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ── Top Bar Minimal for Chat ── */}
      <View style={styles.chatTopBar}>
        <TouchableOpacity style={styles.chatBackButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.onSurface} />
        </TouchableOpacity>
        <Text style={styles.chatTitle}>Yeni Sohbet</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 20, paddingBottom: 10 }}
          renderItem={({ item }) => (
            <View style={[
              styles.messageBubble, 
              item.isUser ? styles.userBubble : styles.aiBubble,
              item.isCode && !item.isUser ? { backgroundColor: '#1A1A1A', borderWidth: 1, borderColor: '#333' } : {}
            ]}>
              {item.isCode ? (
                <View>
                  <CarbonHighlighter code={item.text} />
                  {!item.isUser && (
                    <View style={styles.codeActions}>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                          <TouchableOpacity 
                            style={styles.runButton}
                            onPress={() => handleRunCode(item.id, item.text)}
                            disabled={item.isRunning}
                          >
                            <Ionicons name={item.isRunning ? "hourglass" : "play"} size={14} color="#FFF" />
                            <Text style={styles.runButtonText}>{item.isRunning ? "Çalıştırılıyor..." : "Çalıştır"}</Text>
                          </TouchableOpacity>
                          
                          <TouchableOpacity 
                            style={[styles.runButton, { backgroundColor: '#003B00' }]}
                            onPress={() => handleLowLevel(item.text)}
                          >
                            <Ionicons name="hardware-chip" size={14} color="#00FF41" />
                            <Text style={[styles.runButtonText, { color: '#00FF41' }]}>Makine Kodu (x86)</Text>
                          </TouchableOpacity>
                        </View>
                        {item.consoleOutput && (
                          <View style={styles.consoleWrapper}>
                            <Text style={styles.consoleHeader}>--- Console Output ---</Text>
                            <Text style={styles.consoleOutput}>{item.consoleOutput}</Text>
                          </View>
                        )}
                      </View>
                    )}
                </View>
              ) : (
                <Text style={styles.messageText}>{item.text}</Text>
              )}
            </View>
          )}
        />
        {isTyping && (
          <View style={[styles.messageBubble, styles.aiBubble, { width: 100, alignItems: 'center' }]}>
            <Text style={styles.messageText}>Düşünüyor...</Text>
          </View>
        )}
        <ChatInput onSend={handleSend} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


// ─── Home Screen ───────────────────────────────────────────────────────
function HomeScreen({ navigation }) {
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
            onPress={() => navigation.navigate('Chat')}
          />
          <ActionCard
            category="GELİŞTİRME"
            label="Kod Üret"
            icon="code-braces-box"
            iconType="material"
            onPress={() => navigation.navigate('Chat')}
          />
          <ActionCard
            category="VERİ"
            label="Analiz"
            icon="chart-bar"
            iconType="material"
            onPress={() => navigation.navigate('Chat')}
          />
        </View>
      </ScrollView>

      {/* ── Chat Input acts as shortcut ── */}
      <View style={styles.inputSection}>
        <View style={styles.inputContainer}>
          <Text style={[styles.textInput, { color: COLORS.outlineVariant, paddingTop: 14 }]} onPress={() => navigation.navigate('Chat')}>
            Carbon'a bir şey sor...
          </Text>
          <TouchableOpacity style={styles.sendButton} activeOpacity={0.8} onPress={() => navigation.navigate('Chat')}>
            <Ionicons name="arrow-up" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

function HistoryScreen({ navigation }) {
  const [chats, setChats] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const loadData = async () => {
        const storedChats = await getChats();
        setChats(storedChats);
      };
      loadData();
    }, [])
  );

  const handleDelete = async (id) => {
    await deleteChat(id);
    setChats(prev => prev.filter(c => c.id !== id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.logoText}>Geçmiş Sohbetler</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {chats.length === 0 ? (
          <Text style={{color: COLORS.textSecondary, textAlign: 'center', marginTop: 50}}>Henüz bir sohbet geçmişi yok.</Text>
        ) : (
          chats.map(item => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.historyCard}
              onPress={() => navigation.navigate('Home', { screen: 'Chat', params: { chatId: item.id } })}
            >
              <MaterialCommunityIcons name="chat-outline" size={20} color={COLORS.primaryContainer} />
              <View style={{ marginLeft: 15, flex: 1 }}>
                <Text style={{ color: COLORS.onSurface, fontSize: 16 }} numberOfLines={1}>{item.preview || 'Yeni Sohbet'}</Text>
                <Text style={{ color: COLORS.textSecondary, fontSize: 12, marginTop: 4 }}>{item.date}</Text>
              </View>
              <TouchableOpacity onPress={() => handleDelete(item.id)} style={{ padding: 5 }}>
                <Feather name="trash-2" size={18} color={COLORS.outlineVariant} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function ProjectsScreen({ navigation }) {
  const [projects, setProjects] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const load = async () => {
        const stored = await getProjects();
        setProjects(stored);
      };
      load();
    }, [])
  );

  const handleDelete = async (id) => {
    await deleteProject(id);
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.logoText}>Projelerim</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <TouchableOpacity 
          style={[styles.runButton, { marginBottom: 20, alignSelf: 'flex-start' }]}
          onPress={() => navigation.navigate('Home', { screen: 'Editor' })}
        >
          <Ionicons name="add" size={16} color="#FFF" />
          <Text style={styles.runButtonText}>Yeni .carbon Dosyası</Text>
        </TouchableOpacity>
        {projects.length === 0 ? (
          <Text style={{color: COLORS.textSecondary, textAlign: 'center', marginTop: 30}}>Henüz bir proje yok.</Text>
        ) : (
          projects.map(item => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.historyCard}
              onPress={() => navigation.navigate('Home', { screen: 'Editor', params: { fileId: item.id } })}
            >
              <MaterialCommunityIcons name="file-code-outline" size={24} color={COLORS.primaryContainer} />
              <View style={{ marginLeft: 15, flex: 1 }}>
                <Text style={{ color: COLORS.onSurface, fontSize: 16 }}>{item.name}</Text>
                <Text style={{ color: COLORS.textSecondary, fontSize: 12, marginTop: 4 }}>Boyut: {item.size} • {item.date}</Text>
              </View>
              <TouchableOpacity onPress={() => handleDelete(item.id)} style={{ padding: 5 }}>
                <Feather name="trash-2" size={18} color={COLORS.outlineVariant} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function ProfileScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.logoText}>Profil & Ayarlar</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 20, alignItems: 'center' }}>
         <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.surfaceContainerHigh, alignItems: 'center', justifyContent: 'center', marginBottom: 15 }}>
            <Ionicons name="person" size={40} color={COLORS.primaryContainer} />
         </View>
         <Text style={{ color: COLORS.onSurface, fontSize: 20, fontWeight: 'bold' }}>Geliştirici</Text>
         <Text style={{ color: COLORS.textSecondary, fontSize: 14, marginBottom: 30 }}>Free Tier Plan • gemini-2.5-flash</Text>
         
         <TouchableOpacity 
           style={[styles.historyCard, { backgroundColor: '#3B0000', marginBottom: 20 }]}
           onPress={() => navigation.navigate('Docs')}
         >
           <Text style={{ color: '#FF7373', flex: 1, fontWeight: 'bold', fontSize: 16 }}>📚 Teknik Belgeleri Okut (Auto-Doc)</Text>
           <Ionicons name="sparkles" size={24} color="#FF7373" />
         </TouchableOpacity>
         
         <View style={styles.historyCard}>
           <Text style={{ color: COLORS.onSurface, flex: 1 }}>Koyu Tema</Text>
           <Ionicons name="toggle" size={32} color={COLORS.primaryContainer} />
         </View>
         <View style={styles.historyCard}>
           <Text style={{ color: COLORS.onSurface, flex: 1 }}>LLM API Anahtarı Değiştir</Text>
           <Ionicons name="chevron-forward" size={20} color={COLORS.outlineVariant} />
         </View>
         <View style={styles.historyCard}>
           <Text style={{ color: COLORS.primaryContainer, flex: 1 }}>Bütün Verileri Sil</Text>
           <Feather name="trash-2" size={18} color={COLORS.primaryContainer} />
         </View>
      </ScrollView>
    </SafeAreaView>
  );
}
// ─── Low Level Matrix Screen ──────────────────────────────────────────
function LowLevelScreen({ route, navigation }) {
  const { code } = route.params;
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAsm = async () => {
      const result = await simulateLowLevel(code);
      setOutput(result);
      setLoading(false);
    };
    fetchAsm();
  }, [code]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#050505' }}>
      <StatusBar barStyle="light-content" backgroundColor="#050505" />
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#003B00', backgroundColor: '#0A0A0A' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 15 }}>
          <Ionicons name="arrow-back" size={24} color="#00FF41" />
        </TouchableOpacity>
        <Text style={{ color: '#00FF41', fontSize: 18, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: 'bold' }}>SYS_DISASM_x86_64</Text>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
        {loading ? (
          <View style={{ alignItems: 'flex-start' }}>
             <Text style={{ color: '#008F11', fontSize: 15, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', marginBottom: 10 }}>[INITIALIZING DISASSEMBLER...]</Text>
             <Text style={{ color: '#008F11', fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' }}>&gt; Parsing AST Nodes...</Text>
             <Text style={{ color: '#008F11', fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', marginTop: 5 }}>&gt; Mapping routines to x86-64...</Text>
             <Text style={{ color: '#008F11', fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', marginTop: 5 }}>&gt; Generating Hex dump...</Text>
          </View>
        ) : (
          <Text style={{ color: '#00FF41', fontSize: 13, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', lineHeight: 22 }}>
            {output}
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Auto-Doc Generation Screen ───────────────────────────────────────
function DocsScreen({ navigation }) {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoc = async () => {
      const responseText = await generateAutoDoc();
      const regex = /```(?:carbon)?\s*([\s\S]*?)```/gi;
      let parts = [];
      let lastIndex = 0;
      let match;

      while ((match = regex.exec(responseText)) !== null) {
        if (match.index > lastIndex) {
          const textPart = responseText.substring(lastIndex, match.index).trim();
          if (textPart) parts.push({ text: textPart, isCode: false });
        }
        const codePart = match[1].trim();
        if (codePart) parts.push({ text: codePart, isCode: true });
        lastIndex = regex.lastIndex;
      }
      
      if (lastIndex < responseText.length) {
        const textPart = responseText.substring(lastIndex).trim();
        if (textPart) parts.push({ text: textPart, isCode: false });
      }
      if (parts.length === 0) {
        parts.push({ text: responseText.trim(), isCode: false });
      }

      const generatedDocs = parts.map((part, index) => ({
        ...part,
        id: index.toString(),
        isRunning: false,
        consoleOutput: null
      }));

      setDocs(generatedDocs);
      setLoading(false);
    };
    fetchDoc();
  }, []);

  const handleRunCode = async (id, code) => {
    setDocs(prev => prev.map(m => m.id === id ? { ...m, isRunning: true } : m));
    const result = await simulateRuntime(code);
    setDocs(prev => prev.map(m => m.id === id ? { ...m, isRunning: false, consoleOutput: result } : m));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#222', backgroundColor: COLORS.surface }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 15 }}>
          <Ionicons name="arrow-back" size={24} color={COLORS.onSurface} />
        </TouchableOpacity>
        <Text style={{ color: COLORS.onSurface, fontSize: 18, fontWeight: 'bold' }}>📚 Belgeler</Text>
      </View>
      <FlatList
        data={docs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
            <View style={{ marginBottom: 20 }}>
              {item.isCode ? (
                <View style={{ backgroundColor: '#1A1A1A', borderRadius: 8, padding: 15, borderWidth: 1, borderColor: '#333' }}>
                  <CarbonHighlighter code={item.text} />
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#333' }}>
                    <TouchableOpacity 
                      style={styles.runButton}
                      onPress={() => handleRunCode(item.id, item.text)}
                      disabled={item.isRunning}
                    >
                      <Ionicons name={item.isRunning ? "hourglass" : "play"} size={14} color="#FFF" />
                      <Text style={styles.runButtonText}>{item.isRunning ? "Çalıştırılıyor..." : "Çalıştır (Interaktif)"}</Text>
                    </TouchableOpacity>
                  </View>
                  {item.consoleOutput && (
                    <View style={styles.consoleWrapper}>
                      <Text style={styles.consoleHeader}>--- Output ---</Text>
                      <Text style={styles.consoleOutput}>{item.consoleOutput}</Text>
                    </View>
                  )}
                </View>
              ) : (
                <Text style={{ color: COLORS.onSurface, fontSize: 15, lineHeight: 22 }}>{item.text}</Text>
              )}
            </View>
        )}
        ListHeaderComponent={loading ? (
          <View style={{ alignItems: 'center', marginTop: 50 }}>
            <Ionicons name="book-outline" size={48} color={COLORS.primaryContainer} style={{ marginBottom: 10 }} />
            <Text style={{ color: COLORS.onSurface, fontSize: 16 }}>Döküman Üretiliyor...</Text>
            <Text style={{ color: COLORS.textSecondary, fontSize: 12, marginTop: 5, textAlign: 'center' }}>AI sistemi Carbon mimarisini tarayıp Türkçe bir el kitabı oluşturuyor.</Text>
          </View>
        ) : null}
      />
    </SafeAreaView>
  );
}
// ─── Local IDE (EditorScreen) ──────────────────────────────────────────
function EditorScreen({ route, navigation }) {
  const fileId = route.params?.fileId;
  const [code, setCode] = useState('');
  const [fileName, setFileName] = useState('');
  const [consoleOutput, setConsoleOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (fileId) {
        const p = await getProjectById(fileId);
        if (p) {
          setCode(p.content);
          setFileName(p.name);
        }
      } else {
        setFileName(`proje_${Date.now().toString().slice(-4)}.carbon`);
        setCode('// Yeni Carbon Dosyası\n');
      }
    };
    load();
  }, [fileId]);

  const handleSave = async () => {
    const proj = {
      id: fileId || Date.now().toString(),
      name: fileName,
      content: code,
      size: `${(code.length / 1024).toFixed(1)} KB`,
      date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
    };
    await saveProject(proj);
    if (!fileId) {
      navigation.setParams({ fileId: proj.id });
    }
    // Basit bildirim eklenebilir. Şimdilik state değişiyor.
  };

  const handleRun = async () => {
    setIsRunning(true);
    setConsoleOutput(null);
    const result = await simulateRuntime(code);
    setIsRunning(false);
    setConsoleOutput(result);
  };

  const handleASM = () => {
    navigation.navigate('LowLevel', { code });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0A0A0A' }}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, borderBottomWidth: 1, borderBottomColor: '#222', backgroundColor: '#131313' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 5, marginRight: 10 }}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <TextInput 
          style={{ flex: 1, color: '#FFF', fontSize: 16, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' }}
          value={fileName}
          onChangeText={setFileName}
        />
        <TouchableOpacity onPress={handleSave} style={{ marginRight: 15, flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="save-outline" size={20} color="#00FF41" />
          <Text style={{color: '#00FF41', marginLeft: 5, fontWeight: 'bold'}}>Kaydet</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', padding: 10, gap: 10, backgroundColor: '#0d0d0d', borderBottomWidth: 1, borderBottomColor: '#222' }}>
        <TouchableOpacity 
          style={[styles.runButton, { flex: 1, justifyContent: 'center' }]}
          onPress={handleRun}
        >
           <Ionicons name={isRunning ? "hourglass" : "play"} size={16} color="#FFF" />
           <Text style={styles.runButtonText}>{isRunning ? "Derleniyor..." : "Çalıştır"}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.runButton, { flex: 1, justifyContent: 'center', backgroundColor: '#003B00' }]}
          onPress={handleASM}
        >
           <Ionicons name="hardware-chip" size={16} color="#00FF41" />
           <Text style={[styles.runButtonText, { color: '#00FF41' }]}>Makine Kodu (ASM)</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
        <TextInput
          style={{ padding: 15, color: '#D4D4D4', fontSize: 14, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', minHeight: 400 }}
          value={code}
          onChangeText={setCode}
          multiline
          textAlignVertical="top"
          placeholder="// Kodunuzu buraya yazın..."
          placeholderTextColor="#444"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </ScrollView>
      {consoleOutput && (
        <View style={{ padding: 15, backgroundColor: '#1E1E1E', borderTopWidth: 2, borderTopColor: '#00FF41' }}>
           <Text style={{ color: '#00FF41', fontWeight: 'bold', marginBottom: 5 }}>[STDOUT]:</Text>
           <Text style={{ color: '#FFF', fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' }}>{consoleOutput}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="LowLevel" component={LowLevelScreen} />
      <Stack.Screen name="Editor" component={EditorScreen} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="Docs" component={DocsScreen} />
    </Stack.Navigator>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: styles.bottomNav,
          tabBarIcon: ({ focused, color, size }) => {
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
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="History" component={HistoryScreen} />
        <Tab.Screen name="Projects" component={ProjectsScreen} />
        <Tab.Screen name="Profile" component={ProfileStack} />
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

  // ── Chat Elements ──
  chatTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceContainerLow,
    backgroundColor: COLORS.surface,
  },
  chatBackButton: {
    padding: 8,
  },
  chatTitle: {
    color: COLORS.onSurface,
    fontSize: 16,
    ...FONTS.semibold,
  },
  messageBubble: {
    maxWidth: '85%',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.primaryContainer,
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.surfaceContainerLow,
    borderWidth: 1,
    borderColor: COLORS.surfaceContainerHigh,
  },
  aiBubbleThinking: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.surfaceContainerLow,
    borderWidth: 1,
    borderColor: COLORS.surfaceContainerHigh,
    width: 120,
    alignItems: 'center'
  },
  messageText: {
    color: COLORS.onSurface,
    fontSize: 15,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    lineHeight: 22,
  },
  codeActions: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 10,
  },
  runButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#353534',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start'
  },
  runButtonText: {
    color: '#FFF',
    fontSize: 13,
    marginLeft: 6,
    fontWeight: 'bold'
  },
  consoleWrapper: {
    marginTop: 10,
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primaryContainer
  },
  consoleHeader: {
    color: '#666',
    fontSize: 12,
    marginBottom: 5,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  consoleOutput: {
    color: '#A3BE8C',
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceContainerLow,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.surfaceContainerHigh,
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
    backgroundColor: COLORS.background,
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
