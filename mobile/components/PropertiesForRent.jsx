/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect } from 'react';
import { FlatList, Image, Text, View, StyleSheet, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import Animated, { FadeInUp, FadeInRight } from 'react-native-reanimated';
import { Link } from 'expo-router';
import formatPrice from '@/utils/formatPrice';
import { ThemeContext } from '@/context/ThemeContext';
import { useProperties } from '@/hooks/useProperties';

const width = Dimensions.get('window').width - 40;
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
                    <Image source={require('@/assets/images/real.png')} style={styles.badge} />
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
// 3ad men be3d kan'ghelfoh b React.memo
const PropertyCard = React.memo(PropertyCardComponent);
const PropertiesForRent = () => {
    const { theme } = useContext(ThemeContext);

    // Kan 3iyto l hook b filtre 'rent' o bla limit
    const { properties: rentProperties, isLoading, refetch } = useProperties({ purpose: 'rent' });

    // ==> 2. HADA HOWA L CODE L MOHIM LI KHASS YTZAD <==
    // Had l useEffect kay'exécuta merra we7da mli l component kaydemarrer
    useEffect(() => {
        refetch(); // Kan'golo l hook: "Yallah, jib les données"
    }, []); // L "[]" khawya kat3ni "dir hadchi merra we7da f lwl o safi"


    // ... (les styles kayb9aw kima homa)
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



     const renderItem = ({ item, index }) => <PropertyCard item={item} index={index} theme={theme} />;
    
    
    // L "wrapper" khasso yb9a dima, o l spinner yji l west dyalo
    return (
        <View style={styles.wrapper}>
            <View style={styles.titlewrapper}>
                <Text style={styles.titletext}>Properties For Rent</Text>
            </View>
            
            {isLoading ? (
                <View style={styles.loader}>
                    <ActivityIndicator color={theme.primary} />
                </View>
            ) : (
                <FlatList
                     data={rentProperties}
                    horizontal
                    renderItem={renderItem}
                    keyExtractor={(item) => item.property_id?.toString()}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingLeft: 10 }}
                    ItemSeparatorComponent={() => <View style={{ width: 20 }} />}
                    initialNumToRender={4}
                    maxToRenderPerBatch={4}
                    windowSize={5}
                />
            )}
        </View>
    );
};

export default PropertiesForRent;