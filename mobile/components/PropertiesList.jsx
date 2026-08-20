/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect } from 'react';
import { Dimensions,  Image, StyleSheet, Text, TouchableOpacity, View ,ActivityIndicator} from 'react-native';
import Animated, { FadeInRight, FadeInUp } from 'react-native-reanimated';
import { Link } from 'expo-router';
import { ThemeContext } from '@/context/ThemeContext';
import formatPrice from '@/utils/formatPrice';
import { useProperties } from '@/hooks/useProperties';

const width = Dimensions.get('window').width - 40;

// --- 1. Kan 3zlo l'item l component bo7do o kandiro lih smiya ---
const PropertyCardComponent = ({ item, index, theme }) => {
    const styles = StyleSheet.create({
        itemContainer: {
            width: width / 2 - 10, backgroundColor: theme.card, borderRadius: 15, padding: 8,
        },
        imageItem: { width: '100%', height: 150, borderRadius: 10, marginBottom: 10, },
        badge: { width: 40, height: 40, position: 'absolute', right: 15, top: 15, },
        title: { color: theme.primary, fontSize: 14, fontWeight: '600', marginBottom: 4, },
        description: { color: theme.textLight, fontSize: 12, fontWeight: '400', marginBottom: 4, },
        text: { color: theme.text, fontSize: 16, fontWeight: '600', textAlign: 'left', },
        gridContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
        }
    });

    const badgeSource = item.purpose === 'rent' ? require('@/assets/images/real.png') : require('@/assets/images/money.png');

    return (
        <Link href={{ pathname: `/property-details/[property_id]`, params: { property_id: item.property_id }}} asChild>
            <TouchableOpacity style={{ marginBottom: 20 }}>
                <Animated.View style={styles.itemContainer} entering={FadeInUp.delay(100 + (index % 2) * 100).duration(300).springify()}>
                    <Image source={{ uri: item.primary_image_url || 'https://via.placeholder.com/150' }} style={styles.imageItem} />
                    <Image source={badgeSource} style={styles.badge} contentFit="cover" />
                    <Animated.Text style={styles.title} entering={FadeInRight.delay(150 + (index % 2) * 100).duration(300).springify()} numberOfLines={1}>
                        {item.title}
                    </Animated.Text>
                    <Animated.Text style={styles.description} entering={FadeInRight.delay(200 + (index % 2) * 100).duration(300).springify()}>
                        {item.city}
                    </Animated.Text>
                    <Animated.Text style={styles.text} entering={FadeInRight.delay(250 + (index % 2) * 100).duration(300).springify()}>
                        {formatPrice(item.price, { short: false })} MAD
                    </Animated.Text>
                </Animated.View>
            </TouchableOpacity>
        </Link>
    );
};
// 3ad men be3d kan'ghelfoh b React.memo
const PropertyCard = React.memo(PropertyCardComponent);


const PropertiesList = () => {
    const { theme } = useContext(ThemeContext);
    const { properties, isLoading, refetch } = useProperties(); // Kan 3iyto bla filtre

    useEffect(() => {
        refetch();
    }, []);

    const styles = StyleSheet.create({
        wrapper: { marginHorizontal: 20, marginTop: 10, flex: 1 }, // Zedna flex: 1
        titlewrapper: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, },
        titletext: { color: theme.text, fontSize: 18, fontWeight: '600', letterSpacing: 0.6, },
        loader: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 40 },
          gridContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
        }
    });

    if (isLoading) {
        return <ActivityIndicator size="large" color={theme.primary} style={styles.loader} />;
    }
    return (
       <View style={styles.wrapper}>
            <View style={styles.titlewrapper}>
                <Text style={styles.titletext}>All Properties</Text>
            </View>

            {/* ==> 3. BDELNA FlatList B View O .map() <== */}
            <View style={styles.gridContainer}>
                {properties.map((item, index) => (
                    <PropertyCard 
                        key={item.property_id} 
                        item={item} 
                        index={index} 
                        theme={theme} 
                    />
                ))}
            </View>
        </View>
    );
};

export default PropertiesList;