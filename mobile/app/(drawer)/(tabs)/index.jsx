import React, { useContext } from 'react';
import { StyleSheet, Image, View, ScrollView, SafeAreaView } from 'react-native';
import { Stack } from 'expo-router';
// import { usePropertiesAndMedia } from '@/hooks/usePropertiesAndMedia'; // ==> 1. KAN7YDO L HOOK L 9DIM KAMEL
import Header from '@/components/Header';
import PropertiesForSale from '@/components/PropertiesForSale';
import PropertiesForRent from '@/components/PropertiesForRent';
import PropertiesList from '@/components/PropertiesList';
import CategoriesList from '@/components/CategoriesList';
import { ThemeContext } from '@/context/ThemeContext'; 
import { AuthContext } from '@/context/AuthContext'; 

const HomeScreen = () => {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext); 
  
  // ==> 2. MABQA 7TA CHI HOOK HNA KAYJBED LES DONNÉES <==
  // L'HomeScreen wella ghir "conteneur" (container), makayjbed la properties la walo.
  // Kol component wella mkellet b rasso.
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background, 
    },
    contentContainer: {
      flex: 1,
    },
    adImageContainer: {
      marginHorizontal: 20,
      marginBottom: 10,
    },
    adImage: {
      width: "100%",
      height: 150,
      borderRadius: 15,
      marginTop: 10,
    }
  });

  // ==> 3. KAN7YDO L LOGIC DYAL "isLoading" KAMEL MEN HNA <==
  // Kol component (PropertiesForSale, etc.) wella fih l spinner dyalo l khass bih.
  // Dakchi kaykhlli l'expérience a7ssen, 7it l 7aja li t'telechargat katban.
  
  // Final return
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: true,
          header: () => <Header user={user} />,
        }}
      />
      
      {/* L code dyal l'affichage wella أبسط بكثير */}
      <ScrollView style={styles.contentContainer}>
        
        {/* Hada kayjbed o kay'affiche les 10 catégories l wlin */}
        <CategoriesList />
          
        <View style={styles.adImageContainer}>
          <Image 
            source={require("@/assets/images/annonce.png")} 
            style={styles.adImage}
          />
        </View>
        <PropertiesForSale />
        
        <PropertiesForRent />
      
        <PropertiesList />
        
      </ScrollView>
      
    </SafeAreaView>
  );
};

export default HomeScreen;