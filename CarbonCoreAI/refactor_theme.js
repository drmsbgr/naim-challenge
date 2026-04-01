const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, 'App.js');
let content = fs.readFileSync(appJsPath, 'utf8');

// 1. Add Theme Imports
if (!content.includes("import { ThemeProvider, useTheme } from './context/ThemeContext';")) {
  content = content.replace(
    "import { sendMessageToLLM, initChat, simulateRuntime, simulateLowLevel, generateAutoDoc } from './services/LLMService';",
    "import { sendMessageToLLM, initChat, simulateRuntime, simulateLowLevel, generateAutoDoc } from './services/LLMService';\nimport { ThemeProvider, useTheme } from './context/ThemeContext';"
  );
}

// 2. Remove COLORS definition globally
content = content.replace(/const COLORS = \{[\s\S]*?\};\n\n?/g, '');

// 3. Remove FONTS definition if we want? No, leave fonts alone, just update COLORS.
// Actually, styles uses COLORS. Let's make styles dynamic.
if (content.includes("const styles = StyleSheet.create({")) {
  content = content.replace(
    /const styles = StyleSheet\.create\(\{/g,
    "const getStyles = (theme) => StyleSheet.create({"
  );
}

// 4. Transform COLORS.X to theme.X globally
content = content.replace(/COLORS\.([a-zA-Z0-9]+)/g, 'theme.$1');

// 5. Inject hook into all React components
const componentNames = [
  'StatusDot', 'PulsingOrb', 'ActionCard', 'ChatInput', 'ChatScreen', 
  'HomeScreen', 'HistoryScreen', 'ProjectsScreen', 'EditorScreen', 
  'ProfileScreen', 'LowLevelScreen', 'DocsScreen'
];

componentNames.forEach(comp => {
  const regex = new RegExp(`(function ${comp}\\([^\\)]*\\) \\{)\\s*`, 'g');
  // Only inject if it hasn't been injected yet
  if (!content.includes(`const { theme } = useTheme();`) || !content.match(regex)) {
      content = content.replace(regex, `$1\n  const { theme } = useTheme();\n  const styles = getStyles(theme);\n`);
  }
});

// Since App and Tab/Stack navigators are not simple screens or might need theme:
// 6. Wrap App component output
const appRegex = /export default function App\(\) \{\s*return \(\s*<NavigationContainer>/;
if (content.match(appRegex)) {
  content = content.replace(appRegex, `export default function App() {\n  return (\n    <ThemeProvider>\n      <NavigationContainer>`);
  
  // Also we need to inject theme to App for tabBarStyle
  content = content.replace(/export default function App\(\) \{/, `export default function App() {\n  const { theme } = useTheme();\n  const styles = getStyles(theme);\n`);
  // And close ThemeProvider at the end of App
  content = content.replace(/<\/NavigationContainer>\s*\);\s*\}/, `      </NavigationContainer>\n    </ThemeProvider>\n  );\n}`);
  // Wait, `useTheme` inside `App` won't work because `App` renders `<ThemeProvider>`. 
  // We need to move NavigationContainer into a separate component so useTheme can be called!
}

// Wait, the hook `useTheme` must be inside a component wrapped by `ThemeProvider`.
// Let's refactor App:
content = content.replace(/export default function App\(\) \{[\s\S]*?<\/NavigationContainer>\n\s*\);\n\}/, `function RootNavigator() {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: styles.bottomNav,
          tabBarIcon: ({ focused }) => {
            let iconName;
            if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
            else if (route.name === 'History') iconName = focused ? 'time' : 'time-outline';
            else if (route.name === 'Projects') iconName = focused ? 'folder' : 'folder-outline';
            else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';

            return (
              <View style={focused ? styles.navActive : styles.navItem}>
                <Ionicons
                  name={iconName}
                  size={22}
                  color={focused ? "#FFFFFF" : theme.outlineVariant}
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

export default function App() {
  return (
    <ThemeProvider>
      <RootNavigator />
    </ThemeProvider>
  );
}`);

fs.writeFileSync(appJsPath, content, 'utf8');
console.log('App.js successfully refactored for Dynamic Themes.');
