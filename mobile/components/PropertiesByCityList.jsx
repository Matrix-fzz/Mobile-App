import { ThemeContext } from '@/context/ThemeContext';
import formatPrice from "@/utils/formatPrice";
import { Link } from "expo-router";
import { useContext, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { FadeInRight, FadeInUp } from "react-native-reanimated";

const width = Dimensions.get("window").width - 40;

// API URLs
const PROPERTIES_URL = "http://192.168.100.6:5001/properties";
const MEDIA_URL = "http://192.168.100.6:5001/property_media";

const PropertiesByCityList = ({ city, searchQuery = "", filters }) => {
    const { theme } = useContext(ThemeContext);
    const [cityProperties, setCityProperties] = useState([]);
    const [media, setMedia] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (city) {
            const loadData = async () => {
                setIsLoading(true);
                try {
                    // ⬅️ نجيب properties
                    const propRes = await fetch(PROPERTIES_URL);
                    const propData = await propRes.json();
                    const filtered = propData.filter(
                        (p) => p.city?.toLowerCase() === city.toLowerCase()
                    );

                    // ⬅️ نجيب media
                    const mediaRes = await fetch(MEDIA_URL);
                    const mediaData = await mediaRes.json();

                    setCityProperties(filtered);
                    setMedia(mediaData);
                } catch (error) {
                    console.log("Error fetching properties or media:", error);
                } finally {
                    setIsLoading(false);
                }
            };
            loadData();
        }
    }, [city]);

    let finalProperties =
        searchQuery.trim().length > 0
            ? cityProperties.filter((p) =>
                p.title?.toLowerCase().includes(searchQuery.toLowerCase())
            )
            : cityProperties;

    if (filters?.dealType) {
        finalProperties = finalProperties.filter((p) => {
            const purpose = p.purpose?.toLowerCase();
            if (!purpose) return false;

            if (filters.dealType.toLowerCase() === "rent") {
                return purpose.includes("rent");
            }
            if (filters.dealType.toLowerCase() === "sell") {
                return purpose.includes("sell") || purpose.includes("sale") || purpose.includes("vente");
            }
            return true;
        });
    }

    if (filters?.priceOrder === "priceLow") {
        finalProperties = [...finalProperties].sort((a, b) => a.price - b.price);
    } else if (filters?.priceOrder === "priceHigh") {
        finalProperties = [...finalProperties].sort((a, b) => b.price - a.price);
    }

    const styles = StyleSheet.create({
        wrapper: {
            flex: 1, // زدت هادي باش تاخذ المساحة كلها
            marginHorizontal: 20,
            marginTop: 20,
        },
        titlewrapper: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 10,
        },
        titletext: {
            color: theme.text, // <--- تبدل اللون
            fontSize: 18,
            fontWeight: "600",
            letterSpacing: 0.6,
        },
        itemContainer: {
            width: width / 2 - 10,
            backgroundColor: theme.card, // <--- زدنا خلفية البطاقة
            borderRadius: 15,
            padding: 8, // زدت padding
            // shadowColor: theme.shadow,
            // shadowOffset: { width: 0, height: 2 },
            // shadowOpacity: 0.1,
            // shadowRadius: 5,
            elevation: 0,
        },
        imageItem: {
            width: "100%",
            height: 150, // نقصت شوية من الطول
            borderRadius: 10, // نقصت شوية
            marginBottom: 10,
            contentFit: "cover",
        },
        badge: {
            width: 40,
            height: 40,
            position: "absolute",
            right: 15, // عدلت المسافة
            top: 15,
        },
        title: {
            color: theme.primary, // <--- تبدل اللون
            fontSize: 14,
            fontWeight: "600",
            marginBottom: 4, // زدت space
        },
        description: {
            color: theme.textLight, // <--- تبدل اللون
            fontSize: 12, // كبرت الخط شوية
            fontWeight: "400",
            marginBottom: 4, // زدت space
        },
        text: {
            color: theme.text, // <--- تبدل اللون
            fontSize: 16,
            fontWeight: "600",
            textAlign: "left",
        },
        emptyContainer: { // زدت ستايل للحالة الفارغة
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 50,
        },
        emptyText: {
            fontSize: 16,
            color: theme.textLight,
        }
    });

    if (isLoading) {
        return (<ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 50 }} />
        );
    }

    if (!isLoading && finalProperties.length === 0) {
        return (
            <View style={styles.wrapper}>
                <Text style={styles.titletext}>No properties found in {city}</Text>
            </View>
        );
    }

    const renderItem = ({ item, index }) => {
        // نربط media بالـ property
        const relatedMedia = media.filter(
            (m) => m.property_id === item.property_id
        );

        const badgeSource =
            item.purpose === "rent"
                ? require("@/assets/images/real.png")
                : require("@/assets/images/money.png");

        return (
            <Link
                href={{
                    pathname: "/property-details/[property_id]",
                    params: { property_id: item.property_id },
                }}
                asChild
            >
                <TouchableOpacity>
                    <Animated.View
                        style={styles.itemContainer}
                        entering={FadeInUp.delay(100 + index * 100).duration(300).springify()}
                    >
                        {relatedMedia && relatedMedia.length > 0 ? (
                            <Image
                                key={relatedMedia[0].media_id} // عرض صورة واحدة فقط
                                source={{ uri: relatedMedia[0].file_url }}
                                style={styles.imageItem}
                            />
                        ) : (
                            <Image
                                source={require("@/assets/images/default.jpg")}
                                style={styles.imageItem}
                            />
                        )}

                        <Image source={badgeSource} style={styles.badge} />

                        <Animated.Text style={styles.title} entering={FadeInRight.delay(200 + index * 100)} numberOfLines={1}>
                            {item.title}
                        </Animated.Text>
                        <Animated.Text style={styles.description} entering={FadeInRight.delay(300 + index * 100)}>
                            {item.city}
                        </Animated.Text>
                        <Animated.Text style={styles.text} entering={FadeInRight.delay(400 + index * 100)}>
                            {formatPrice(item.price)} MAD
                        </Animated.Text>
                    </Animated.View>
                </TouchableOpacity>
            </Link>
        );
    };

    return (
        <View style={styles.wrapper}>
            <FlatList
                data={finalProperties}
                showsVerticalScrollIndicator={false}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 20 }}
                keyExtractor={(item) => item.property_id?.toString()}
                renderItem={renderItem}
            />
        </View>
    );
};

export default PropertiesByCityList;

