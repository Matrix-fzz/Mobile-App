import React, { useState, useContext } from 'react';
import { FlatList, Text, View, StyleSheet, Dimensions, TouchableOpacity, SafeAreaView, ActivityIndicator } from "react-native";
import { useLocalSearchParams, Link, Stack } from "expo-router";
import { useCategoryProperties } from "@/hooks/useCategoryProperties";
import formatPrice from "@/utils/formatPrice";
import Animated, { FadeInUp, FadeInRight, FadeIn } from "react-native-reanimated";
import { Image } from "expo-image";
import HeaderFilter from "@/components/HeaderFilter";
import FilterModal from "@/components/FilterModal";
import { ThemeContext } from '@/context/ThemeContext';

const width = Dimensions.get("window").width - 40;

export default function CategoryDetails() {
  // 2. استعمال useContext باش نجيبو الثيم الحالي
  const { theme } = useContext(ThemeContext);
  
  const { category_id } = useLocalSearchParams();
  const { properties, categoryName, loading, error } = useCategoryProperties(category_id);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({});

  const handleFilterPress = () => setIsFilterVisible(true);
  const handleApplyFilters = (filters) => {
        setAppliedFilters(filters);
        setIsFilterVisible(false);
    };

let filteredProperties = properties;
if (appliedFilters?.dealType) {
        filteredProperties = filteredProperties.filter((p) => {
            const purpose = p.purpose?.toLowerCase();
            if (!purpose) return false;

            if (appliedFilters.dealType.toLowerCase() === "rent") {
                return purpose.includes("rent");
            }
            if (appliedFilters.dealType.toLowerCase() === "sell") {
                return purpose.includes("sell") || purpose.includes("sale") || purpose.includes("vente");
            }
            return true;
        });
    }
if (appliedFilters?.priceOrder === "priceLow") {
  filteredProperties = [...filteredProperties].sort(
    (a, b) => a.price - b.price
  );
}

if (appliedFilters?.priceOrder === "priceHigh") {
  filteredProperties = [...filteredProperties].sort(
    (a, b) => b.price - a.price
  );
}

const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.background, // <--- تبدل اللون
    },
    wrapper: { 
      flex: 1, // زدت هادي باش تاخذ المساحة كلها
      marginHorizontal: 20, 
      marginTop: 20 
    },
    itemContainer: {
      width: width / 2 - 10,
      backgroundColor: theme.card, // <--- زدنا خلفية البطاقة
      borderRadius: 15,
      padding: 8,
      // shadowColor: theme.shadow,
      // shadowOffset: { width: 0, height: 2 },
      // shadowOpacity: 0.1,
      // shadowRadius: 5,
      elevation: 0,
    },
    imageItem: { 
      width: "100%", 
      height: 150, 
      borderRadius: 10, 
      marginBottom: 10 
    },
    badge: { 
      width: 40, 
      height: 40, 
      position: "absolute", 
      right: 15, 
      top: 15 
    },
    title: {
      color: theme.primary, // <--- تبدل اللون
      fontSize: 14,
      fontWeight: "600",
      marginBottom: 4,
    },
    description: {
      color: theme.textLight, // <--- تبدل اللون
      fontSize: 12,
      fontWeight: "400",
      marginBottom: 4,
    },
    text: {
      color: theme.text, // <--- تبدل اللون
      fontSize: 16,
      fontWeight: "600",
      textAlign: "left",
    },
    emptyContainer: {
      flex: 1, // زدت هادي باش تجي فالوسط
      marginTop: 50, 
      alignItems: "center" 
    },
    emptyText: {
      color: theme.textLight, // <--- تبدل اللون
      fontSize: 16,
      fontWeight: "500",
      textAlign: "center",
    }
  });

  const renderItem = ({ item, index }) => {
    const badgeSource =
      item.purpose?.toLowerCase().includes("rent")
        ? require("@/assets/images/real.png")
        : require("@/assets/images/money.png");

    return (
            <Link href={{ pathname: `/property-details/[property_id]`, params: { property_id: item.property_id }}} asChild>
                <TouchableOpacity>
                    <Animated.View style={styles.itemContainer} entering={FadeInUp.delay(100 + index * 100).duration(300).springify()}>
                        
                        {/* ==> 6. KANBDLO L'AFFICHAGE DYAL L'IMAGE <== */}
                        <Image
                            source={{ uri: item.primary_image_url || 'https://via.placeholder.com/150' }}
                            style={styles.imageItem}
                            contentFit="cover"
                        />

                        <Image source={badgeSource} style={styles.badge} contentFit="cover"/>
                        <Animated.Text style={styles.title} entering={FadeInRight.delay(200 + index * 100)} numberOfLines={1}>
                            {item.title}
                        </Animated.Text>
                        <Animated.Text style={styles.description} entering={FadeInRight.delay(300 + index * 100)}>
                            {item.city}
                        </Animated.Text>
                        <Animated.Text style={styles.text} entering={FadeInRight.delay(400 + index * 100)}>
                            {formatPrice(item.price, { short: false })} MAD
                        </Animated.Text>
                    </Animated.View>
                </TouchableOpacity>
            </Link>
        );
    };
    
    // ==> 7. KAN'GÉRER L LOADING O L'ERREUR <==
    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <Stack.Screen options={{ title: "Loading...", headerStyle: { backgroundColor: theme.card }, headerTintColor: theme.text }} />
                <ActivityIndicator style={{ flex: 1 }} size="large" color={theme.primary} />
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <Stack.Screen options={{ title: "Error", headerStyle: { backgroundColor: theme.card }, headerTintColor: theme.text }} />
                <Text style={styles.emptyText}>{error}</Text>
            </SafeAreaView>
        );
    }

  return (
        <SafeAreaView style={styles.safeArea}>
            {/* ==> 8. KAN'AFFICHIW SMIYT L CATÉGORIE L7A9I9IYA <== */}
            <Stack.Screen options={{ title: categoryName, headerStyle: { backgroundColor: theme.card }, headerTintColor: theme.text, headerTitleStyle: { fontWeight: 'bold' } }} />

            <HeaderFilter
                searchValue={searchQuery}
                onSearchChange={setSearchQuery}
                onFilterPress={handleFilterPress}
                isFilterActive={Object.values(appliedFilters).some(v => v)} 
            />
            <View style={styles.wrapper}>
                <FlatList
                    data={filteredProperties}
                    showsVerticalScrollIndicator={false}
                    numColumns={2}
                    columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 20, }}
                    keyExtractor={(item) => item.property_id?.toString()}
                    renderItem={renderItem}
                    ListEmptyComponent={() => (
                        <Animated.View style={styles.emptyContainer} entering={FadeIn.duration(500)}>
                            <Text style={styles.emptyText}>No properties found in this category. ✨</Text>
                        </Animated.View>
                    )}
                />
            </View>
            <FilterModal
                visible={isFilterVisible}
                onClose={() => setIsFilterVisible(false)}
                onApply={handleApplyFilters}
            />
        </SafeAreaView>
    );
}