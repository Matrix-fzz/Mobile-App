/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect } from 'react';
import { FlatList, Image, Text, View, StyleSheet, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import Animated, { FadeInUp, FadeInRight } from 'react-native-reanimated';
import { Link } from 'expo-router';
import formatPrice from '@/utils/formatPrice';
import { ThemeContext } from '@/context/ThemeContext';
import { useProperties } from '@/hooks/useProperties';

const width = Dimensions.get('window').width - 40;


// ==> HNA L7EL: KAN 3ZLO L COMPONENT L WE7DO B SMIYTO <==
// 1. Kan'definiw l component b tariqa 3adiya
const PropertyCardComponent = ({ item, index, theme }) => {
    const styles = StyleSheet.create({
        itemContainer: { width: width / 2 - 10, backgroundColor: theme.card, borderRadius: 15, padding: 8, },
        imageItem: { width: '100%', height: 150, borderRadius: 10, marginBottom: 10, },
        badge: { width: 40, height: 40, position: 'absolute', right: 15, top: 15, },
        title: { color: theme.primary, fontSize: 14, fontWeight: '600', marginBottom: 4, },
        description: { color: theme.textLight, fontSize: 12, fontWeight: '400', marginBottom: 4, },
        text: { color: theme.text, fontSize: 16, fontWeight: '600', textAlign: 'left', },
    });

    return (
        <Link href={{ pathname: `/property-details/[property_id]`, params: { property_id: item.property_id }}} asChild>
            <TouchableOpacity>
                <Animated.View style={styles.itemContainer} entering={FadeInUp.delay(100 + index * 50).duration(300).springify()}>
                    <Image source={{ uri: item.primary_image_url || 'https://via.placeholder.com/150' }} style={styles.imageItem}/>
                    <Image source={require('@/assets/images/money.png')} style={styles.badge} />
                    <Animated.Text style={styles.title} entering={FadeInRight.delay(150 + index * 50).duration(300).springify()} numberOfLines={1}>
                        {item.title}
                    </Animated.Text>
                    <Animated.Text style={styles.description} entering={FadeInRight.delay(200 + index * 50).duration(300).springify()}>
                        {item.city}
                    </Animated.Text>
                    <Animated.Text style={styles.text} entering={FadeInRight.delay(250 + index * 50).duration(300).springify()}>
                        {formatPrice(item.price, { short: false })} MAD
                    </Animated.Text>
                </Animated.View>
            </TouchableOpacity>
        </Link>
    );
};

// 2. 3ad men be3d, kan'ghelfoh b React.memo o kan'exportiwh
const PropertyCard = React.memo(PropertyCardComponent);


const PropertiesForSale = () => {
    const { theme } = useContext(ThemeContext);
    
    // Kan 3iyto l hook b filtre 'sale' walakin bla limit
    const { properties: saleProperties, isLoading, refetch } = useProperties({ purpose: 'sale' });
    
    useEffect(() => {
        refetch();
    }, []);
    
    const styles = StyleSheet.create({
        wrapper: {
            marginHorizontal: 20,
            marginTop: 10,
            minHeight: 280, // Bdelna height b minHeight
        },
        titlewrapper: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 10,
        },
        titletext: {
            color: theme.text, 
            fontSize: 18,
            fontWeight: '600',
            letterSpacing: 0.6,
        },
        loader: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        }
    });

    // ==> 2. LA FONCTION renderItem WELLAT KAT3IYYET L PropertyCard <==
    const renderItem = ({ item, index }) => <PropertyCard item={item} index={index} theme={theme} />;
    
    return (
        <View style={styles.wrapper}>
            <View style={styles.titlewrapper}>
                <Text style={styles.titletext}>Properties For Sale</Text>
            </View>

            {isLoading ? (
                <View style={styles.loader}>
                    <ActivityIndicator color={theme.primary} />
                </View>
            ) : (
                <FlatList
                    data={saleProperties}
                    horizontal
                    renderItem={renderItem}
                    keyExtractor={(item) => item.property_id?.toString()}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 10 }}
                    ItemSeparatorComponent={() => <View style={{ width: 20 }} />}
                    // ==> 3. KAN ZIDO LES PROPS DYAL L'ADA2 <==
                    initialNumToRender={4}
                    maxToRenderPerBatch={4}
                    windowSize={5}
                />
            )}
        </View>
    );
};

export default PropertiesForSale;