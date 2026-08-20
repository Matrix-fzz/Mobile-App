import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, ActivityIndicator, Animated } from 'react-native';
import { Stack, Link } from 'expo-router';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { ThemeContext } from '@/context/ThemeContext';
import { useProperties } from '@/hooks/useProperties'; // غادي نفترضو أن هاد الهوك كيجيب العقارات
import { darkMapStyle } from '@/constants/mapStyle'; // استيراد الستايل الداكن
import { Ionicons } from '@expo/vector-icons';
import formatPrice from '@/utils/formatPrice';

const MapScreen = () => {
  const { theme } = useContext(ThemeContext);
  const { properties, media, isLoading } = useProperties(); // جلب البيانات
  const [selectedProperty, setSelectedProperty] = useState(null);
  const mapRef = useRef(null);
  
  // للأنيميشن ديال البطاقة
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (selectedProperty) {
      // Slide In
      Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
    } else {
      // Slide Out
      Animated.timing(slideAnim, { toValue: 300, duration: 300, useNativeDriver: true }).start();
    }
  }, [selectedProperty, slideAnim]);

  const goToMyLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    mapRef.current?.animateToRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };

  const onMarkerPress = (property) => {
    setSelectedProperty(property);
    // تحريك الخريطة باش العلامة تجي فوق البطاقة
    mapRef.current?.animateToRegion({
      latitude: property.latitude,
      longitude: property.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    map: { flex: 1 },
    myLocationButton: {
      position: 'absolute',
      bottom: selectedProperty ? 240 : 30, // كيطلع الفوق فاش كتبان البطاقة
      right: 20,
      backgroundColor: theme.card,
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 5,
    },
    cardContainer: {
      position: 'absolute',
      bottom: 20,
      left: 20,
      right: 20,
      height: 210,
      backgroundColor: theme.card,
      borderRadius: 15,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 10,
      overflow: 'hidden',
    },
    cardImage: { width: '100%', height: 120 },
    cardContent: { padding: 10 },
    cardTitle: { fontSize: 16, fontWeight: 'bold', color: theme.text },
    cardPrice: { fontSize: 14, color: theme.primary, marginTop: 4 },
    cardButton: {
      position: 'absolute',
      bottom: 10,
      right: 10,
      backgroundColor: theme.primary,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 20,
    },
    cardButtonText: { color: theme.white, fontWeight: 'bold', fontSize: 12 },
    loaderContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.1)'
    }
  });

  const isDarkTheme = theme.background === '#1E1E1E'; // افتراض أن هذا هو لون خلفية الثيم الداكن

  return (
    <SafeAreaView style={styles.container}>
      {/* غادي نحيدو Header من Stack.Screen باش نقدرو نتحكمو فيه من _layout */}
      <Stack.Screen options={{ headerShown: false }} />
      
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 33.5731, // Casablanca
          longitude: -7.5898,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        customMapStyle={isDarkTheme ? darkMapStyle : []}
        showsUserLocation={true}
        onPress={() => setSelectedProperty(null)} // إخفاء البطاقة عند الضغط على الخريطة
      >
        {properties.map(prop => {
          if (!prop.latitude || !prop.longitude) return null;
          return (
            <Marker
              key={prop.property_id}
              coordinate={{ latitude: prop.latitude, longitude: prop.longitude }}
              title={prop.title}
              onPress={() => onMarkerPress(prop)}
            >
              <View style={{ backgroundColor: theme.primary, padding: 8, borderRadius: 20, borderWidth: 2, borderColor: theme.white }}>
                <Ionicons name="home" size={16} color={theme.white} />
              </View>
            </Marker>
          );
        })}
      </MapView>

      <TouchableOpacity style={styles.myLocationButton} onPress={goToMyLocation}>
        <Ionicons name="navigate" size={24} color={theme.primary} />
      </TouchableOpacity>

      {selectedProperty && (
        <Animated.View style={[styles.cardContainer, { transform: [{ translateY: slideAnim }] }]}>
          <Image 
            source={{ uri: media.find(m => m.property_id === selectedProperty.property_id)?.file_url || 'https://via.placeholder.com/400x200' }} 
            style={styles.cardImage} 
          />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle} numberOfLines={1}>{selectedProperty.title}</Text>
            <Text style={styles.cardPrice}>{formatPrice(selectedProperty.price)} MAD</Text>
          </View>
          <Link href={`/property-details/${selectedProperty.property_id}`} asChild>
            <TouchableOpacity style={styles.cardButton}>
              <Text style={styles.cardButtonText}>View Details</Text>
            </TouchableOpacity>
          </Link>
        </Animated.View>
      )}

      {isLoading && (
        <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={theme.primary} />
        </View>
      )}
    </SafeAreaView>
  );
};

export default MapScreen;