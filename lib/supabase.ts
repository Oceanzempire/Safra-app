import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import 'react-native-url-polyfill/auto';

// Replace with your Supabase URL and anon key
const supabaseUrl = 'https://gycjeotqgkkjeyeophgk.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5Y2plb3RxZ2tramV5ZW9waGdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzODA5NDksImV4cCI6MjA1OTk1Njk0OX0.mfVRcvFfEK0-xHgnn491OKgHZtI2ZjGKW-MnxGtaA2E';

// Create a custom storage implementation for AsyncStorage
const AsyncStorageAdapter = {
  getItem: (key: string) => AsyncStorage.getItem(key),
  setItem: (key: string, value: string) => AsyncStorage.setItem(key, value),
  removeItem: (key: string) => AsyncStorage.removeItem(key),
};

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === 'web',
  },
});

// Types for database tables
export interface UserProfile {
  id: string;
  email: string;
  phone?: string;
  is_premium: boolean;
  premium_expires_at?: string;
  trusted_contacts: string[]; // Array of contact IDs
  last_backup_at?: string;
  created_at: string;
  updated_at: string;
}

export interface BackupData {
  id: string;
  user_id: string;
  data: string; // Encrypted JSON string of all app data
  created_at: string;
}

// Helper functions for authentication
export const signUpWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

export const signInWithPhone = async (phone: string) => {
  const { data, error } = await supabase.auth.signInWithOtp({
    phone,
  });

  if (error) throw error;
  return data;
};

export const verifyPhoneOtp = async (phone: string, token: string) => {
  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: 'sms',
  });

  if (error) throw error;
  return data;
};

export const resetPassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// User profile management
export const createUserProfile = async (userId: string, email: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert([
      {
        id: userId,
        email,
        is_premium: false,
        trusted_contacts: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .select();

  if (error) throw error;
  return data;
};

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data as UserProfile;
};

export const updateUserProfile = async (
  userId: string,
  updates: Partial<UserProfile>
) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select();

  if (error) throw error;
  return data;
};

// Backup and restore functions
export const createBackup = async (userId: string, encryptedData: string) => {
  // First update the last_backup_at timestamp in the user profile
  await updateUserProfile(userId, {
    last_backup_at: new Date().toISOString(),
  });

  // Then create the backup
  const { data, error } = await supabase
    .from('backups')
    .insert([
      {
        user_id: userId,
        data: encryptedData,
        created_at: new Date().toISOString(),
      },
    ])
    .select();

  if (error) throw error;
  return data;
};

export const getLatestBackup = async (userId: string) => {
  const { data, error } = await supabase
    .from('backups')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) throw error;
  return data as BackupData;
};

// Premium status check
export const checkPremiumStatus = async (userId: string) => {
  const profile = await getUserProfile(userId);

  // Check if premium and not expired
  if (profile.is_premium && profile.premium_expires_at) {
    const expiryDate = new Date(profile.premium_expires_at);
    const now = new Date();

    if (expiryDate > now) {
      return true;
    } else {
      // Premium expired, update the status
      await updateUserProfile(userId, {
        is_premium: false,
      });
      return false;
    }
  }

  return profile.is_premium;
};

// Trusted contacts management
export const addTrustedContact = async (userId: string, contactId: string) => {
  const profile = await getUserProfile(userId);
  const trustedContacts = [...profile.trusted_contacts, contactId];

  return updateUserProfile(userId, {
    trusted_contacts: trustedContacts,
  });
};

export const removeTrustedContact = async (
  userId: string,
  contactId: string
) => {
  const profile = await getUserProfile(userId);
  const trustedContacts = profile.trusted_contacts.filter(
    (id) => id !== contactId
  );

  return updateUserProfile(userId, {
    trusted_contacts: trustedContacts,
  });
};
