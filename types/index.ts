export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isEncrypted?: boolean;
  securityData?: {
    question: string;
    answer: string;
  };
}

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
}

export interface Habit {
  id: string;
  title: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  completedDates: string[];
  createdAt: string;
  color?: string;
  icon?: string;
  reminder?: string;
}

export interface MoodEntry {
  id: string;
  mood: 'great' | 'good' | 'okay' | 'bad' | 'awful';
  note?: string;
  date: string;
  activities?: string[];
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isICE?: boolean; // In Case of Emergency
}

export interface Document {
  id: string;
  title: string;
  type: 'passport' | 'id' | 'insurance' | 'medical' | 'other';
  fileUri?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  isEncrypted?: boolean;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  photoUrl?: string;
  isPremium: boolean;
  premiumUntil?: string;
  createdAt: string;
}

export interface CloudStorage {
  provider: 'google' | 'icloud' | 'dropbox' | 'onedrive';
  isConnected: boolean;
  lastSync?: string;
  usedSpace?: number;
  totalSpace?: number;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notificationsEnabled: boolean;
  locationTracking: boolean;
  autoBackup: boolean;
  biometricLock: boolean;
  pinLock: boolean;
  pin?: string;
  cloudSync: boolean;
  cloudProvider?: 'google' | 'icloud' | 'dropbox' | 'onedrive';
}

export interface PremiumFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
  isAvailable: boolean;
}
