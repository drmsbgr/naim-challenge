import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAT_KEY = '@carbon_chats';
const PROJECT_KEY = '@carbon_projects';

// ─── CHAT STORAGE ───────────────────────────────────────────────────
export const getChats = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(CHAT_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Error reading chats:", e);
    return [];
  }
};

export const saveChat = async (chatData) => {
  try {
    const chats = await getChats();
    const existingIndex = chats.findIndex(c => c.id === chatData.id);
    
    if (existingIndex >= 0) {
      chats[existingIndex] = chatData;
    } else {
      chats.unshift(chatData);
    }
    
    await AsyncStorage.setItem(CHAT_KEY, JSON.stringify(chats));
  } catch (e) {
    console.error("Error saving chat:", e);
  }
};

export const deleteChat = async (chatId) => {
  try {
    const chats = await getChats();
    const newChats = chats.filter(c => c.id !== chatId);
    await AsyncStorage.setItem(CHAT_KEY, JSON.stringify(newChats));
  } catch (e) {
    console.error("Error deleting chat:", e);
  }
};

export const getChatById = async (chatId) => {
  try {
    const chats = await getChats();
    return chats.find(c => c.id === chatId) || null;
  } catch (e) {
    return null;
  }
}

// ─── PROJECT (.CARBON FILE) STORAGE ─────────────────────────────────
export const getProjects = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(PROJECT_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Error reading projects:", e);
    return [];
  }
};

export const saveProject = async (projectData) => {
  try {
    const projects = await getProjects();
    const existingIndex = projects.findIndex(p => p.id === projectData.id);
    
    if (existingIndex >= 0) {
      projects[existingIndex] = projectData;
    } else {
      projects.unshift(projectData);
    }
    
    await AsyncStorage.setItem(PROJECT_KEY, JSON.stringify(projects));
  } catch (e) {
    console.error("Error saving project:", e);
  }
};

export const deleteProject = async (projectId) => {
  try {
    const projects = await getProjects();
    const newProjects = projects.filter(p => p.id !== projectId);
    await AsyncStorage.setItem(PROJECT_KEY, JSON.stringify(newProjects));
  } catch (e) {
    console.error("Error deleting project:", e);
  }
};

export const getProjectById = async (projectId) => {
  try {
    const projects = await getProjects();
    return projects.find(p => p.id === projectId) || null;
  } catch (e) {
    return null;
  }
}
