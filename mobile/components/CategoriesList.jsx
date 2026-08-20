import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, ActivityIndicator } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { ThemeContext } from '@/context/ThemeContext';
import { useLimitedCategories } from '@/hooks/useLimitedCategories'; 


const CategoriesList = () => {
    const { theme } = useContext(ThemeContext);
    const router = useRouter();

    const { categories, isLoading } = useLimitedCategories();



    const styles = StyleSheet.create({
        wrapper: { marginHorizontal: 20, marginTop: 15, },
        titlewrapper: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', },
        titletext: { color: theme.text, fontSize: 18, fontWeight: '600', letterSpacing: 0.6, },
        titleBtn: { fontSize: 14, fontWeight: '500', color: theme.primary, },
        imagecatego: {
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: theme.border,
        },
        itemBox: { marginVertical: 10, gap: 7, alignItems: "center", marginRight: 20, },
        title: { color: theme.text, fontWeight: "600", fontSize: 13, },
        loaderContainer: {
            height: 100,
            justifyContent: 'center',
            alignItems: 'center',
        },
    });

    if (isLoading) {
        return (
            <View style={styles.wrapper}>
                <View style={styles.titlewrapper}>
                    <Text style={styles.titletext}>Categories</Text>
                </View>
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="small" color={theme.primary} />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.wrapper}>
            <View style={styles.titlewrapper}>
                <Text style={styles.titletext}>Categories</Text>
                <TouchableOpacity onPress={() => router.push('/search')}>
                    <Text style={styles.titleBtn}>See All</Text>
                </TouchableOpacity>
            </View>

            <FlatList

                data={categories}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.category_id?.toString()}
                renderItem={({ item }) => (
                    <Link
                        href={{
                            pathname: "/category-details/[category_id]",
                            params: { category_id: item.category_id },
                        }}
                        asChild
                    >
                        <TouchableOpacity style={styles.itemBox}>
                            <Image
                                source={{ uri: item.image_url }}
                                style={styles.imagecatego}
                                resizeMode="cover"
                            />
                            <Text style={styles.title}>{item.category_name}</Text>
                        </TouchableOpacity>
                    </Link>
                )}
            />
        </View>
    );
}

export default CategoriesList;