'use client';

import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  AlertTriangle,
  Phone,
  User,
  X,
  FileText,
  MapPin,
  Heart,
  Pill,
  ArrowLeft,
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { layout } from '@/constants/layout';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { SOSButton } from '@/components/SOSButton';
import { EmergencyContactItem } from '@/components/EmergencyContactItem';
import { DocumentItem } from '@/components/DocumentItem';
import { EmptyState } from '@/components/EmptyState';
import { useEmergencyStore } from '@/store/emergency-store';
import { useSettingsStore } from '@/store/settings-store';
import { useAuthStore } from '@/store/auth-store';
import type { EmergencyContact, Document } from '@/types';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import * as SMS from 'expo-sms';
import { useTranslation } from '@/hooks/use-translation';
import { AdBanner } from '@/components/AdBanner';

export default function EmergencyScreen() {
  const router = useRouter();
  const {
    contacts,
    documents,
    profile,
    lastKnownLocation,
    addContact,
    updateContact,
    deleteContact,
    addDocument,
    updateDocument,
    deleteDocument,
    updateProfile,
    updateLocation,
  } = useEmergencyStore();

  const { locationTracking } = useSettingsStore();
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const isPremium = user?.isPremium || false;

  const [showContactModal, setShowContactModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(
    null
  );

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactRelationship, setContactRelationship] = useState('');
  const [contactIsSOS, setContactIsSOS] = useState(false);

  // Profile form state
  const [profileName, setProfileName] = useState(profile.name);
  const [profilePhone, setProfilePhone] = useState(profile.phone || '');
  const [profileBloodType, setProfileBloodType] = useState(
    profile.bloodType || ''
  );
  const [profileEmergencyMessage, setProfileEmergencyMessage] = useState(
    profile.emergencyMessage || ''
  );
  const [profileAllergies, setProfileAllergies] = useState(
    profile.allergies && Array.isArray(profile.allergies)
      ? profile.allergies.join(', ')
      : ''
  );
  const [profileMedications, setProfileMedications] = useState(
    profile.medications && Array.isArray(profile.medications)
      ? profile.medications.join(', ')
      : ''
  );

  // Document form state
  const [documentTitle, setDocumentTitle] = useState('');
  const [documentDescription, setDocumentDescription] = useState('');
  const [documentCategory, setDocumentCategory] = useState<
    'id' | 'medical' | 'insurance' | 'other'
  >('id');
  const [documentUri, setDocumentUri] = useState('');

  // Update location if tracking is enabled
  useEffect(() => {
    if (locationTracking && Platform.OS !== 'web') {
      (async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status === 'granted') {
          const location = await Location.getCurrentPositionAsync({});
          updateLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            timestamp: new Date().toISOString(),
          });
        }
      })();
    }
  }, [locationTracking]);

  // Reset form when editing contact
  useEffect(() => {
    if (editingContact) {
      setContactName(editingContact.name);
      setContactPhone(editingContact.phone);
      setContactRelationship(editingContact.relationship || '');
      setContactIsSOS(editingContact.isSOSContact);
    } else {
      setContactName('');
      setContactPhone('');
      setContactRelationship('');
      setContactIsSOS(false);
    }
  }, [editingContact]);

  // Reset profile form when opening modal
  useEffect(() => {
    if (showProfileModal) {
      setProfileName(profile.name);
      setProfilePhone(profile.phone || '');
      setProfileBloodType(profile.bloodType || '');
      setProfileEmergencyMessage(profile.emergencyMessage || '');
      setProfileAllergies(
        profile.allergies && Array.isArray(profile.allergies)
          ? profile.allergies.join(', ')
          : ''
      );
      setProfileMedications(
        profile.medications && Array.isArray(profile.medications)
          ? profile.medications.join(', ')
          : ''
      );
    }
  }, [showProfileModal, profile]);

  const handleSaveContact = () => {
    if (!contactName.trim() || !contactPhone.trim()) {
      Alert.alert(t('Error'), t('Name and phone number are required'));
      return;
    }

    const contactData = {
      name: contactName,
      phone: contactPhone,
      relationship: contactRelationship,
      isSOSContact: contactIsSOS,
    };

    if (editingContact) {
      updateContact(editingContact.id, contactData);
    } else {
      addContact(contactData);
    }

    setEditingContact(null);
    setShowContactModal(false);
  };

  const handleSaveProfile = () => {
    if (!profileName.trim()) {
      Alert.alert(t('Error'), t('Name is required'));
      return;
    }

    updateProfile({
      name: profileName,
      phone: profilePhone,
      bloodType: profileBloodType,
      emergencyMessage: profileEmergencyMessage,
      allergies: profileAllergies
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      medications: profileMedications
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    });

    setShowProfileModal(false);
  };

  const handlePickDocument = async () => {
    if (Platform.OS === 'web') {
      Alert.alert(
        t('Not Available'),
        t('This feature is not available on web')
      );
      return;
    }

    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        t('Permission Required'),
        t('You need to grant permission to access your photos')
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setDocumentUri(result.assets[0].uri);
    }
  };

  const handleSaveDocument = () => {
    if (!documentTitle.trim() || !documentUri) {
      Alert.alert(t('Error'), t('Title and document are required'));
      return;
    }

    addDocument({
      title: documentTitle,
      description: documentDescription,
      uri: documentUri,
      type: 'image',
      category: documentCategory,
    });

    setDocumentTitle('');
    setDocumentDescription('');
    setDocumentCategory('id');
    setDocumentUri('');
    setShowDocumentModal(false);
  };

  const handleEditContact = (contact: EmergencyContact) => {
    setEditingContact(contact);
    setShowContactModal(true);
  };

  const handleCallContact = (phone: string) => {
    if (Platform.OS === 'web') {
      Alert.alert(t('Not Available'), t('Calling is not available on web'));
      return;
    }

    Linking.openURL(`tel:${phone}`);
  };

  const handleMessageContact = (phone: string) => {
    if (Platform.OS === 'web') {
      Alert.alert(t('Not Available'), t('Messaging is not available on web'));
      return;
    }

    Linking.openURL(`sms:${phone}`);
  };

  const handleViewDocument = (document: Document) => {
    // In a real app, you would open the document
    Alert.alert(
      document.title,
      document.description || t('No description provided'),
      [{ text: t('Close') }]
    );
  };

  const handleActivateSOS = async () => {
    const sosContacts = contacts.filter((contact) => contact.isSOSContact);

    if (sosContacts.length === 0) {
      Alert.alert(
        t('No SOS Contacts'),
        t('You need to add at least one SOS contact to use this feature'),
        [
          { text: t('Cancel'), style: 'cancel' },
          {
            text: t('Add Contact'),
            onPress: () => setShowContactModal(true),
          },
        ]
      );
      return;
    }

    // Get current location
    let locationMessage = '';
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        locationMessage = `\n\nCurrent location: https://maps.google.com/?q=${location.coords.latitude},${location.coords.longitude}`;
      }
    } catch (error) {
      console.error('Error getting location:', error);
    }

    // Prepare emergency message
    const emergencyMessage = `EMERGENCY: ${
      profile.name || 'I'
    } needs immediate help! ${
      profile.emergencyMessage || ''
    }${locationMessage}`;

    // Check if SMS is available
    const isAvailable = await SMS.isAvailableAsync();
    if (isAvailable) {
      // Send SMS to all SOS contacts
      const phoneNumbers = sosContacts.map((contact) => contact.phone);
      try {
        const { result } = await SMS.sendSMSAsync(
          phoneNumbers,
          emergencyMessage
        );
        if (result === 'sent' || result === 'unknown') {
          Alert.alert(
            t('SOS Sent'),
            t('Emergency message has been sent to your contacts')
          );
        } else {
          Alert.alert(
            t('SOS Not Sent'),
            t('There was an issue sending the emergency message')
          );
        }
      } catch (error) {
        console.error('Error sending SMS:', error);
        Alert.alert(t('Error'), t('Failed to send emergency message'));
      }
    } else {
      // Fallback if SMS is not available
      Alert.alert(
        t('SMS Not Available'),
        t(
          'SMS is not available on this device. Please call emergency services directly.'
        )
      );
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <View style={styles.header}>
        <ArrowLeft
          size={24}
          color={colors.text}
          onPress={() => router.back()}
        />
        <Text style={styles.headerTitle}>{t('Emergency')}</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* SOS Button */}
        <View style={styles.sosSection}>
          <SOSButton onActivate={handleActivateSOS} />
        </View>

        {/* Ad Banner - only show if not premium */}
        {!isPremium && (
          <View style={styles.adContainer}>
            <AdBanner size="banner" />
          </View>
        )}

        {/* Profile Card */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('Medical Profile')}</Text>
            <TouchableOpacity onPress={() => setShowProfileModal(true)}>
              <Text style={styles.editText}>{t('Edit')}</Text>
            </TouchableOpacity>
          </View>

          <Card style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={styles.profileIconContainer}>
                <User size={24} color={colors.primary} />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>
                  {profile.name || t('Add your name')}
                </Text>
                {profile.phone && (
                  <Text style={styles.profileDetail}>{profile.phone}</Text>
                )}
              </View>
            </View>

            <View style={styles.profileDetails}>
              {profile.bloodType && (
                <View style={styles.profileDetailItem}>
                  <Heart size={16} color={colors.danger} />
                  <Text style={styles.profileDetailText}>
                    {t('Blood Type')}: {profile.bloodType}
                  </Text>
                </View>
              )}

              {profile.allergies && profile.allergies.length > 0 && (
                <View style={styles.profileDetailItem}>
                  <AlertTriangle size={16} color={colors.secondary} />
                  <Text style={styles.profileDetailText}>
                    {t('Allergies')}: {profile.allergies.join(', ')}
                  </Text>
                </View>
              )}

              {profile.medications && profile.medications.length > 0 && (
                <View style={styles.profileDetailItem}>
                  <Pill size={16} color={colors.primary} />
                  <Text style={styles.profileDetailText}>
                    {t('Medications')}: {profile.medications.join(', ')}
                  </Text>
                </View>
              )}

              {!profile.bloodType &&
                (!profile.allergies || profile.allergies.length === 0) &&
                (!profile.medications || profile.medications.length === 0) && (
                  <Text style={styles.emptyProfileText}>
                    {t('Add your medical information for emergency situations')}
                  </Text>
                )}
            </View>
          </Card>
        </View>

        {/* Emergency Contacts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('Emergency Contacts')}</Text>
            <TouchableOpacity
              onPress={() => {
                setEditingContact(null);
                setShowContactModal(true);
              }}
            >
              <Text style={styles.addText}>{t('Add Contact')}</Text>
            </TouchableOpacity>
          </View>

          {contacts.length > 0 ? (
            contacts.map((contact) => (
              <EmergencyContactItem
                key={contact.id}
                contact={contact}
                onCall={handleCallContact}
                onMessage={handleMessageContact}
                onEdit={handleEditContact}
              />
            ))
          ) : (
            <EmptyState
              title={t('No emergency contacts')}
              description={t(
                'Add contacts that should be notified in case of emergency'
              )}
              icon={<Phone size={48} color={colors.primary} />}
              actionLabel={t('Add Contact')}
              onAction={() => {
                setEditingContact(null);
                setShowContactModal(true);
              }}
            />
          )}
        </View>

        {/* Ad Banner - only show if not premium */}
        {!isPremium && (
          <View style={styles.adContainer}>
            <AdBanner size="largeBanner" />
          </View>
        )}

        {/* Important Documents */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('Important Documents')}</Text>
            <TouchableOpacity onPress={() => setShowDocumentModal(true)}>
              <Text style={styles.addText}>{t('Add Document')}</Text>
            </TouchableOpacity>
          </View>

          {documents.length > 0 ? (
            documents.map((document) => (
              <DocumentItem
                key={document.id}
                document={document}
                onPress={handleViewDocument}
              />
            ))
          ) : (
            <EmptyState
              title={t('No documents saved')}
              description={t(
                'Store important documents like ID, insurance, and medical records'
              )}
              icon={<FileText size={48} color={colors.primary} />}
              actionLabel={t('Add Document')}
              onAction={() => setShowDocumentModal(true)}
            />
          )}
        </View>

        {/* Last Known Location */}
        {lastKnownLocation && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('Last Known Location')}</Text>
            <Card style={styles.locationCard}>
              <View style={styles.locationHeader}>
                <MapPin size={20} color={colors.primary} />
                <Text style={styles.locationText}>
                  {t('Lat')}: {lastKnownLocation.latitude.toFixed(6)},{' '}
                  {t('Lng')}: {lastKnownLocation.longitude.toFixed(6)}
                </Text>
              </View>
              <Text style={styles.locationTimestamp}>
                {t('Updated')}:{' '}
                {new Date(lastKnownLocation.timestamp).toLocaleString()}
              </Text>
            </Card>
          </View>
        )}
      </ScrollView>

      {/* Add/Edit Contact Modal */}
      <Modal
        visible={showContactModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setShowContactModal(false);
          setEditingContact(null);
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingContact ? t('Edit Contact') : t('Add Contact')}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setShowContactModal(false);
                  setEditingContact(null);
                }}
              >
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>{t('Name')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('Enter contact name')}
                  value={contactName}
                  onChangeText={setContactName}
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>{t('Phone Number')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('Enter phone number')}
                  value={contactPhone}
                  onChangeText={setContactPhone}
                  keyboardType="phone-pad"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>{t('Relationship (optional)')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('E.g., Family, Friend, Doctor')}
                  value={contactRelationship}
                  onChangeText={setContactRelationship}
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.formGroup}>
                <View style={styles.checkboxContainer}>
                  <TouchableOpacity
                    style={styles.checkbox}
                    onPress={() => setContactIsSOS(!contactIsSOS)}
                  >
                    {contactIsSOS ? (
                      <View style={styles.checkboxChecked} />
                    ) : null}
                  </TouchableOpacity>
                  <Text style={styles.checkboxLabel}>
                    {t('Designate as SOS contact')}
                  </Text>
                </View>
                <Text style={styles.checkboxDescription}>
                  {t('SOS contacts will be notified in emergency situations')}
                </Text>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              {editingContact && (
                <Button
                  title={t('Delete')}
                  variant="danger"
                  onPress={() => {
                    if (editingContact) {
                      deleteContact(editingContact.id);
                      setEditingContact(null);
                      setShowContactModal(false);
                    }
                  }}
                  style={styles.footerButton}
                />
              )}
              <Button
                title={t('Cancel')}
                variant="outline"
                onPress={() => {
                  setShowContactModal(false);
                  setEditingContact(null);
                }}
                style={styles.footerButton}
              />
              <Button
                title={t('Save')}
                onPress={handleSaveContact}
                style={styles.footerButton}
                disabled={!contactName.trim() || !contactPhone.trim()}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal
        visible={showProfileModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowProfileModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('Medical Profile')}</Text>
              <TouchableOpacity onPress={() => setShowProfileModal(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>{t('Name')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('Enter your name')}
                  value={profileName}
                  onChangeText={setProfileName}
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>{t('Phone Number')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('Enter your phone number')}
                  value={profilePhone}
                  onChangeText={setProfilePhone}
                  keyboardType="phone-pad"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>{t('Blood Type')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('E.g., A+, B-, O+')}
                  value={profileBloodType}
                  onChangeText={setProfileBloodType}
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>{t('Emergency Message')}</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder={t('Message to send in emergency')}
                  value={profileEmergencyMessage}
                  onChangeText={setProfileEmergencyMessage}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>
                  {t('Allergies (comma separated)')}
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('E.g., Peanuts, Penicillin')}
                  value={profileAllergies}
                  onChangeText={setProfileAllergies}
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>
                  {t('Medications (comma separated)')}
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('E.g., Insulin, Aspirin')}
                  value={profileMedications}
                  onChangeText={setProfileMedications}
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <Button
                title={t('Cancel')}
                variant="outline"
                onPress={() => setShowProfileModal(false)}
                style={styles.footerButton}
              />
              <Button
                title={t('Save')}
                onPress={handleSaveProfile}
                style={styles.footerButton}
                disabled={!profileName.trim()}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Add Document Modal */}
      <Modal
        visible={showDocumentModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDocumentModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('Add Document')}</Text>
              <TouchableOpacity onPress={() => setShowDocumentModal(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>{t('Title')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('Enter document title')}
                  value={documentTitle}
                  onChangeText={setDocumentTitle}
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>{t('Description (optional)')}</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder={t('Enter document description')}
                  value={documentDescription}
                  onChangeText={setDocumentDescription}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>{t('Category')}</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                  }}
                >
                  {[
                    { id: 'id', label: t('ID & Passport') },
                    { id: 'medical', label: t('Medical') },
                    { id: 'insurance', label: t('Insurance') },
                    { id: 'other', label: t('Other') },
                  ].map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      style={{
                        backgroundColor:
                          documentCategory === category.id
                            ? colors.primary
                            : colors.card,
                        padding: layout.spacing.sm,
                        borderRadius: layout.borderRadius.sm,
                        marginBottom: layout.spacing.sm,
                        width: '48%',
                      }}
                      onPress={() => setDocumentCategory(category.id as any)}
                    >
                      <Text
                        style={{
                          color:
                            documentCategory === category.id
                              ? colors.background
                              : colors.text,
                          textAlign: 'center',
                        }}
                      >
                        {category.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Button
                  title={
                    documentUri ? t('Change Document') : t('Select Document')
                  }
                  onPress={handlePickDocument}
                  variant={documentUri ? 'outline' : 'default'}
                />
                {documentUri && (
                  <Text
                    style={{
                      marginTop: layout.spacing.sm,
                      color: colors.success,
                      textAlign: 'center',
                    }}
                  >
                    {t('Document selected')} ✓
                  </Text>
                )}
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <Button
                title={t('Cancel')}
                variant="outline"
                onPress={() => setShowDocumentModal(false)}
                style={styles.footerButton}
              />
              <Button
                title={t('Save')}
                onPress={handleSaveDocument}
                style={styles.footerButton}
                disabled={!documentTitle.trim() || !documentUri}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginLeft: layout.spacing.md,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: layout.spacing.md,
    paddingBottom: layout.spacing.xxl,
  },
  sosSection: {
    alignItems: 'center',
    marginTop: layout.spacing.xl,
    marginBottom: layout.spacing.xl,
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
  editText: {
    color: colors.background,
    fontSize: typography.sizes.md,
    backgroundColor: colors.primary,
    paddingHorizontal: layout.spacing.sm,
    paddingVertical: layout.spacing.xs,
    borderRadius: layout.borderRadius.sm,
    overflow: 'hidden',
  },
  addText: {
    color: colors.background,
    fontSize: typography.sizes.md,
    backgroundColor: colors.primary,
    paddingHorizontal: layout.spacing.sm,
    paddingVertical: layout.spacing.xs,
    borderRadius: layout.borderRadius.sm,
    overflow: 'hidden',
  },
  profileCard: {
    padding: layout.spacing.md,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: layout.spacing.sm,
  },
  profileIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: layout.spacing.sm,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text,
  },
  profileDetail: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  profileDetails: {
    marginTop: layout.spacing.sm,
  },
  profileDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: layout.spacing.xs,
  },
  profileDetailText: {
    marginLeft: layout.spacing.xs,
    fontSize: typography.sizes.sm,
    color: colors.text,
  },
  emptyProfileText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  locationCard: {
    padding: layout.spacing.md,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: layout.spacing.sm,
  },
  locationText: {
    marginLeft: layout.spacing.xs,
    fontSize: typography.sizes.sm,
    color: colors.text,
  },
  locationTimestamp: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: layout.borderRadius.md,
    width: '90%',
    padding: layout.spacing.md,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: layout.spacing.md,
  },
  modalTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  modalScrollView: {
    maxHeight: 300,
  },
  formGroup: {
    marginBottom: layout.spacing.md,
  },
  label: {
    fontSize: typography.sizes.md,
    color: colors.text,
    marginBottom: layout.spacing.xs,
    fontWeight: typography.weights.medium,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: layout.borderRadius.sm,
    padding: layout.spacing.md,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: typography.sizes.md,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    marginRight: layout.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    width: 12,
    height: 12,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  checkboxLabel: {
    fontSize: typography.sizes.md,
    color: colors.text,
  },
  checkboxDescription: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginLeft: 30,
    marginTop: 4,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: layout.spacing.md,
  },
  footerButton: {
    flex: 1,
    marginHorizontal: layout.spacing.xs,
  },
  adContainer: {
    marginBottom: layout.spacing.md,
  },
});
