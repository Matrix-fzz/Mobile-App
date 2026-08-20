import React, { useContext, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Modal, Share } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Image } from 'expo-image';
import Swiper from 'react-native-swiper';
import ImageViewer from 'react-native-image-zoom-viewer';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '@/context/ThemeContext';
import usePropertyDetails from '@/hooks/usePropertyDetails';
import AgentProfileCard from '@/components/AgentProfileCard.jsx';
import formatPrice from '@/utils/formatPrice';

export default function PropertyDetailsScreen() {
     const { theme } = useContext(ThemeContext);
    const { property_id } = useLocalSearchParams();
    const router = useRouter();

       const { details, loading, error } = usePropertyDetails(property_id);
    
    const [featuresOpen, setFeaturesOpen] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const imagesForViewer = details?.media?.map(img => ({ url: img.file_url })) || [];

    const openImageViewer = (index) => {
        setSelectedImageIndex(index);
        setModalVisible(true);
    };

    const closeImageViewer = () => {
        setModalVisible(false);
    };

    // ==== 2. ZEDNA FUNCTION JDIDA DYAL L PARTAGE ====
    const handleShare = async () => {
        if (!details) return;
        const shareMessage = `Check out this property: ${details.title}\n\nPrice: ${formatPrice(details.price, { short: false })} MAD...`;
        const shareUrl = `https://your-website.com/property/${property_id}`;
        try {
            await Share.share({ message: `${shareMessage} ${shareUrl}`, title: `For ${details.purpose}: ${details.title}`, url: shareUrl });
        } catch (error) {
            alert(error.message);
        }
    };

    const featureIcons = {
        "icons/pool.png": require('../../assets/images/icons-colors/swimming-pool.png'),
        "icons/terrace.png": require('../../assets/images/icons-colors/terrace.png'),
        "icons/garden.png": require('../../assets/images/icons-colors/flowers.png'),
        "icons/balcon.png": require('../../assets/images/icons-colors/balcony.png'),
        "icons/climatisation.png": require('../../assets/images/icons-colors/airconditionerone.png'),
        "icons/chauffage.png": require('../../assets/images/icons-colors/hot.png'),
        "icons/cheminee.png": require('../../assets/images/icons-colors/chimney.png'),
        "icons/hammam.png": require('../../assets/images/icons-non-colors/bathone.png'),
        "icons/sauna.png": require('../../assets/images/icons-colors/sauna.png'),
        "icons/jacuzzi.png": require('../../assets/images/icons-colors/jacuzzi.png'),
        "icons/fibre.png": require('../../assets/images/icons-colors/optical-fiber.png'),
        "icons/securite.png": require('../../assets/images/icons-colors/shield.png'),
        "icons/ascenseur.png": require('../../assets/images/icons-non-colors/transport.png'),
        "icons/garage.png": require('../../assets/images/icons-colors/garage.png'),
        "icons/parking.png": require('../../assets/images/icons-colors/parking.png'),
        "icons/marocain.png": require('../../assets/images/icons-colors/morocco.png'),
        "icons/meuble.png": require('../../assets/images/icons-non-colors/apartmentone.png'),
        "icons/renove.png": require('../../assets/images/icons-colors/renovation.png'),
    };

    const styles = StyleSheet.create({
        mainContainer: {
            flex: 1,
            backgroundColor: theme.background,
        },
        centered: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.background,
        },
        backButton: {
            backgroundColor: theme.background,
            borderRadius: 20,
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
        },
        swiperContainer: {
            height: 280,
            position: 'relative',
        },
        image: {
            width: '100%',
            height: '100%',
        },
        pagination: { bottom: 10 },
        dot: { backgroundColor: 'rgba(255,255,255,0.4)', width: 8, height: 8, borderRadius: 4, margin: 3 },
        activeDot: { backgroundColor: theme.white, width: 12, height: 8, borderRadius: 4, margin: 3 },
        badgeContainered: {
            position: 'absolute', top: 40, left: 10, right: 10,
            flexDirection: 'row', justifyContent: 'space-between', zIndex: 1, alignItems: 'center',
        },
        badgeContainer: {
            flexDirection: 'row',
            alignItems: 'center', // Bch yjiw les badges o l'icone مقادين
        },
        // ==== 3. ZEDNA STYLE JDID L BOUTON DYAL L PARTAGE ====
        actionButton: {
            backgroundColor: theme.background,
            width: 40,
            height: 40,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 8, // Bach nbe3do 3la l badge li 7dah
        },
        badge: {
            paddingVertical: 5, paddingHorizontal: 12, borderRadius: 20,
            marginRight: 5, // 9ellelna l margin chwiya
            elevation: 2, shadowColor: theme.shadow,
            shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2,
        },
        badgeText: { color: theme.white, fontWeight: 'bold', fontSize: 12 },
        infoContainer: {
            padding: 20, backgroundColor: theme.card,
            borderBottomWidth: 1, borderBottomColor: theme.border,
        },
        title: {
            fontSize: 24, fontWeight: 'bold', color: theme.primary,
            marginBottom: 3,
        },
        locationContainer: {
            flexDirection: 'row', alignItems: 'center',
            marginBottom: 5, marginRight: 10,
        },
        locationText: { fontSize: 14, color: theme.textLight, marginLeft: 5 },
        price: {
            fontSize: 20, fontWeight: 'bold', color: theme.income,
            textAlign: 'right', position: 'absolute', right: 20, top: 50,
        },
        sectionContainer: {
            padding: 20, backgroundColor: theme.card, marginTop: 8,
            borderBottomWidth: 1, borderBottomColor: theme.border,
        },
        sectionTitle: {
            fontSize: 20, fontWeight: 'bold', color: theme.text,
            marginBottom: 15,
        },
        descriptionText: {
            fontSize: 16, color: theme.primary, lineHeight: 24,
        },
        amenitiesGrid: {
            flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between',
        },
        amenityItem: {
            backgroundColor: theme.background,
            width: '48%', padding: 15, borderRadius: 10,
            alignItems: 'center', marginBottom: 10, borderWidth: 1,
            borderColor: theme.border,
        },
        amenityLabel: { marginTop: 8, fontSize: 14, color: theme.textLight },
        amenityValue: { fontSize: 16, fontWeight: 'bold', color: theme.text },
        featuresHeader: {
            flexDirection: 'row', justifyContent: 'space-between',
            alignItems: 'center', paddingVertical: 10,
        },
        featureItem: {
            flexDirection: 'row', alignItems: 'center', backgroundColor: theme.background,
            paddingVertical: 10, paddingHorizontal: 10, borderRadius: 12,
            elevation: 5, shadowColor: theme.shadow,
            shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2,
            shadowRadius: 2, marginBottom: 10, borderColor: theme.border,
            borderWidth: 1,
        },
        featureIcon: { width: 36, height: 26, contentFit: 'contain', marginRight: 10, marginLeft: 10 },
        featureLabelbefore: {
            fontSize: 35, fontWeight: '600', color: theme.primary,
            bottom: '10%', position: 'absolute', left: 60,
        },
        featureLabel: {
            fontSize: 16, fontWeight: '500', color: theme.primary,
            marginLeft: 25,
        },
        icoico: {
            color: theme.text, fontWeight: '600', position: 'absolute',
            right: 10, top: '35%',
        },
        purposeIcon: {
            width: 40, height: 40, contentFit: 'contain',
            marginLeft: 5, position: 'absolute',
        },
        closeButton: {
            position: 'absolute',
            top: 40,
            right: 20,
            zIndex: 1,
        },
    });

     // 3. Gestion dyal Loading o Error
    if (loading) {
        return ( <SafeAreaView style={styles.mainContainer}><ActivityIndicator style={styles.centered} size="large" color={theme.primary} /></SafeAreaView> );
    }
    if (error || !details) {
        return ( <SafeAreaView style={styles.mainContainer}><View style={styles.centered}><Text style={{ color: theme.text }}>{error || "Property not found."}</Text></View></SafeAreaView> );
    }

    const renderAmenity = (icon, label, value) => (
        <View style={styles.amenityItem}>
            <Ionicons name={icon} size={24} style={{ color: theme.primary }} />
            <Text style={styles.amenityLabel}>{label}</Text>
            <Text style={styles.amenityValue}>{value}</Text>
        </View>
    );
// console.log("Data li wasla men l'hook:", JSON.stringify(details, null, 2));
 return (
        <SafeAreaView style={styles.mainContainer}>
            <Stack.Screen options={{ headerShown: false }} />
            <ScrollView>
                {/* ==> 4. KANSTA3MLO "details.media" HNA <== */}
                {details.media && details.media.length > 0 && (
                    <View style={styles.swiperContainer}>
                        <Swiper autoplay autoplayTimeout={4} showsPagination dotStyle={styles.dot} activeDotStyle={styles.activeDot} paginationStyle={styles.pagination}>
                            {details.media.map((img, index) => (
                                <TouchableOpacity key={img.media_id} onPress={() => openImageViewer(index)} activeOpacity={0.9}>
                                    <Image source={{ uri: img.file_url }} style={styles.image} contentFit="cover" />
                                </TouchableOpacity>
                            ))}
                        </Swiper>
                        <View style={styles.badgeContainered}>
                            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                                <Ionicons name="arrow-back" size={28} style={{ color: theme.primary }} />
                            </TouchableOpacity>
                            <View style={styles.badgeContainer}>
                                <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
                                    <Ionicons name="share-social-outline" size={22} color={theme.primary} />
                                </TouchableOpacity>
                                <View style={[styles.badge, { backgroundColor: theme.income }]}>
                                    <Text style={styles.badgeText}>{details.status}</Text>
                                </View>
                                <View style={[styles.badge, { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]}>
                                    {details.purpose === 'sale' && (<Image source={require('@/assets/images/money.png')} style={styles.purposeIcon} />)}
                                    {details.purpose === 'rent' && (<Image source={require('@/assets/images/real.png')} style={styles.purposeIcon} />)}
                                </View>
                            </View>
                        </View>
                    </View>
                )}
                
                {/* ==> 5. KANSTA3MLO "details.X" F KOL BLASSA <== */}
                <View style={styles.infoContainer}>
                    <Text style={styles.title}>{details.title}</Text>
                    <View style={styles.locationContainer}>
                        <Ionicons name="location-outline" size={16} color={theme.textLight} />
                        <Text style={styles.locationText}>{details.city}, {details.country}</Text>
                    </View>
                    <Text style={styles.price}>{formatPrice(details.price, { short: false })} MAD</Text>
                </View>

                {/* Kan'passiw l'owner l AgentProfileCard */}
                <View style={styles.sectionContainer}>
                    <AgentProfileCard owner={details.owner} />
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.descriptionText}>{details.description}</Text>
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Informations</Text>
                    <View style={styles.amenitiesGrid}>
                        {renderAmenity("bed-outline", "Rooms", details.number_of_rooms)}
                        {renderAmenity("water-outline", "Bathrooms", details.bathrooms)}
                        {renderAmenity("scan-outline", "Area", `${details.area_meters} m²`)}
                        {renderAmenity("calendar-outline", "Year", details.construction_year)}
                    </View>
                </View>

                <View style={styles.sectionContainer}>
                    <TouchableOpacity style={styles.featuresHeader} onPress={() => setFeaturesOpen(!featuresOpen)}>
                        <Text style={styles.sectionTitle}>Features</Text>
                        <Ionicons name={featuresOpen ? 'chevron-up' : 'chevron-down'} size={22} color={theme.text} style={styles.icoico} />
                    </TouchableOpacity>
                    {featuresOpen && (
                        <View style={styles.featuresGrid}>
                            {details.features && details.features.length > 0 ? (
                                details.features.map(f => (
                                    <View key={f.features_id} style={styles.featureItem}>
                                        <Image source={featureIcons[f.icon_url]} style={styles.featureIcon} />
                                        <Text style={styles.featureLabelbefore}> | </Text>
                                        <Text style={styles.featureLabel}>{f.title}</Text>
                                    </View>
                                ))
                            ) : (
                                <Text style={{ color: theme.textLight }}>No features available</Text>
                            )}
                        </View>
                    )}
                </View>
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Location</Text>
                    {/* ... Map component ... */}
                </View>
            </ScrollView>

            <Modal visible={isModalVisible} transparent={true} onRequestClose={closeImageViewer}>
                <ImageViewer
                    imageUrls={imagesForViewer}
                    index={selectedImageIndex}
                    onCancel={closeImageViewer}
                    enableSwipeDown={true}
                    renderHeader={() => (
                        <TouchableOpacity onPress={closeImageViewer} style={styles.closeButton}>
                            <Ionicons name="close-circle" size={30} color="white" />
                        </TouchableOpacity>
                    )}
                />
            </Modal>
        </SafeAreaView>
    );
}