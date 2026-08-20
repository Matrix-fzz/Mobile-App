import { ThemeContext } from '@/context/ThemeContext';
import { Link } from 'expo-router';
import { useContext } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native'; // ==> 1. ZEDNA ActivityIndicator
import { useAllCategories } from '@/hooks/useAllCategories'; // ==> 2. KANJIBO L HOOK DYALNA

// ==> 3. MABQINACH KANAKHDO "categories" MEN PROPS <==
// L component wella kayjbed les données dyalo l rasso
const AllCategoriesList = ({ searchQuery = "" }) => { // Kandiro valeur par défaut
    const { theme } = useContext(ThemeContext);
    const { categories, isLoading } = useAllCategories();

 const filteredCategories = searchQuery.trim().length > 0
        ? categories.filter(item => item.category_name?.toLowerCase().includes(searchQuery.toLowerCase()))
        : categories;

    const styles = StyleSheet.create({
        wrapper: { marginHorizontal: 10, marginTop: 10 },
        titlewrapper: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 },
        titletext: { color: theme.text, fontSize: 18, fontWeight: '600', letterSpacing: 0.6 },
        listContainer: { paddingHorizontal: 10, paddingTop: 10 },
        row: { justifyContent: 'space-between', marginBottom: 15 },
        itemBox: { width: '23%', alignItems: 'center' },
        imagecatego: {
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: theme.border,
            marginBottom: 6,
        },
        title: {
            color: theme.text,
            fontWeight: '600',
            fontSize: 13,
            textAlign: 'center',
        },
        // ==> 5. ZEDNA STYLE JDID L LOADER <==
        loaderContainer: {
            height: 200, // Bach yakhod chwiya dyal l blassa
            justifyContent: 'center',
            alignItems: 'center',
        },
    });
    
    // ==> 6. KANDIRO CONDITION L L'AFFICHAGE <==
    // Ila konna ba9in kan telechargiw les données, n'affichiw spinner
    if (isLoading) {
        return (
            <View style={styles.wrapper}>
                <View style={styles.titlewrapper}>
                    <Text style={styles.titletext}>All Categories</Text>
                </View>
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color={theme.primary} />
                </View>
            </View>
        );
    }
    
    // Ila salina l telechargement, n'affichiw la liste
    return (
        <View style={styles.wrapper}>
            <View style={styles.titlewrapper}>
                <Text style={styles.titletext}> All Categories</Text>
            </View>

            <FlatList
                data={filteredCategories} // Kansta3mlo l variable li jat men l hook
                numColumns={4}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.category_id?.toString()}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.listContainer}
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

export default AllCategoriesList;