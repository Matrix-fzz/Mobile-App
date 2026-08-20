import React, { useState, useContext, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image, TextInput,
  ScrollView, SafeAreaView, Alert, ActivityIndicator
} from 'react-native';
// ==> 1. KAN'BEDDLO L'IMPORTATION <==
import * as DocumentPicker from 'expo-document-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { ThemeContext } from '@/context/ThemeContext';
import { AuthContext } from '@/context/AuthContext';
import { API_URL } from '@/config';
import HeaderS from '@/components/HeaderSimple';

const EditProfileScreen = () => {
  const router = useRouter();
  const { theme } = useContext(ThemeContext);
  const { user, updateUserProfile } = useContext(AuthContext);

  const [profileImage, setProfileImage] = useState(null); // Bach nkhzno l'image jdida
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false)


  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      if (user.profile_photo) {
        setProfileImage({ uri: user.profile_photo });
      }
    }
  }, [user]);

  const selectImage = async () => {
    try {
      // Kan7ello l'document picker o kangolo lih ybayyen ghir tsawer
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*', // HADI MOHIMMA BZAF: kat'filter ghir tsawer
        copyToCacheDirectory: true, // Daroria bach n9dro n'uploadiw l'fichier
      });

      // L'objet "result" fih chwiya dyal l'ikhtilaf
      if (result.canceled === false && result.assets && result.assets.length > 0) {
        const selectedAsset = result.assets[0];

        // Kan7to l'image l'jdida f state
        setProfileImage({
          uri: selectedAsset.uri,
          type: selectedAsset.mimeType || 'image/jpeg', // Hna smitha mimeType
          name: selectedAsset.name || 'profile.jpg'
        });
      } else {
        console.log('Document picker cancelled or failed');
      }

    } catch (error) {
      console.error('Error picking a document:', error);
      Alert.alert("Error", "Failed to pick an image.");
    }
  };

  const handleSave = async () => {
    if (!name) {
      Alert.alert('Error', 'Please fill in your name .');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('name', name);

    if (profileImage && profileImage.uri && !profileImage.uri.startsWith('http')) {
      formData.append('profile_photo', {
        uri: profileImage.uri,
        type: profileImage.type || 'image/jpeg',
        name: profileImage.name || 'profile.jpg',
      });
    }

    try {
      // L'appel l'API dyal updateUser (Nفس l'appel li déja 3endek f l'backend)
      const { data } = await axios.put(
        `${API_URL}/users/${user.user_id}`, // Kansta3mlo l'ID dyal l'user
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', // Darori l'header l'tsawer
          },
        }
      );

      // Mli l'backend yjawbna b'naja7, kan'beddlo l'data f l'AuthContext
      updateUserProfile(data);

      Alert.alert('Success', 'Your profile has been updated!');
      router.back();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An error occurred while updating your profile.';
      Alert.alert('Error', errorMessage);
      console.error('Update profile error:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      padding: 20,

      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: theme.text,
    },
    profileSection: {
      alignItems: 'center',
      marginVertical: 20,
    },
    profileImage: {
      width: 120,
      height: 120,
      borderRadius: 60,
      borderWidth: 3,
      borderColor: theme.card,
    },
    cameraIconContainer: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      backgroundColor: theme.primary,
      borderRadius: 15,
      padding: 5,
    },
    formSection: {
      marginHorizontal: 20,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.card,
      borderRadius: 10,
      paddingHorizontal: 15,
      marginBottom: 15,

      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
    },
    inputIcon: {
      marginRight: 10,
    },
    input: {
      flex: 1,
      height: 50,
      color: theme.text,
      fontSize: 16,
    },
    saveButton: {
      backgroundColor: theme.primary,
      borderRadius: 10,
      paddingVertical: 15,
      marginHorizontal: 20,
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 40,
    },
    saveButtonText: {
      color: theme.white,
      fontSize: 18,
      fontWeight: 'bold',
    },
    disabledInputContainer: { // Style jdid l'container
      backgroundColor: theme.background, // B'lon khfef
      borderColor: theme.border,
      borderWidth: 1,
    },
    disabledInputText: { // Style jdid l'text
      color: theme.textLight, // B'lon bahet chwiya
      fontSize: 16,
      paddingVertical: 15,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <HeaderS />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Edit Profile</Text>
        </View>

        <View style={styles.profileSection}>
          <TouchableOpacity onPress={selectImage}>
            <Image
              source={
                profileImage?.uri
                  ? { uri: profileImage.uri }
                  : require('@/assets/images/default.jpg')
              }
              style={styles.profileImage}
            />
            <View style={styles.cameraIconContainer}>
              <Icon name="camera" size={25} color={theme.white} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.formSection}>
          <View style={styles.inputContainer}>
            <Icon name="account-outline" size={20} color={theme.textLight} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Full Name"
              placeholderTextColor={theme.textLight}
            />
          </View>


          <View style={[styles.inputContainer, styles.disabledInputContainer]}>
            <Icon name="email-outline" size={20} color={theme.textLight} style={styles.inputIcon} />
            <Text style={styles.disabledInputText}>{email}</Text>
          </View>

        </View>

        <TouchableOpacity
          style={[styles.saveButton, { opacity: loading ? 0.6 : 1 }]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={theme.white} />
          ) : (
            <Text style={styles.saveButtonText}>Save</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfileScreen;
