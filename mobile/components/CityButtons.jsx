import { ThemeContext } from '@/context/ThemeContext';
import { useUniqueCities } from '@/hooks/useUniqueCities';
import { Link } from 'expo-router';
import { useContext, useState,useMemo  } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const CityButtons = ({ searchQuery, ListHeaderComponent }) => {
    const { theme } = useContext(ThemeContext);
    const { majorCities, otherCities, isLoading, error } = useUniqueCities();
    const [selectedCity, setSelectedCity] = useState(null);

    const styles = StyleSheet.create({
        // --- التغيير الثاني: حيدنا container و titlewrapper لأنهم ولاو فالهيدر ---
        listContainer: {
            // كنعطيو padding لتحت باش آخر سطر ما يلصقش
            paddingBottom: 40,
        },
        loader: {
            marginVertical: 40,
        },
        buttonContainer: {
            flex: 1,
            margin: 5,
            borderRadius: 26,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 10,
            paddingHorizontal: 5,
            backgroundColor: theme.card,
            minHeight: 40,
            borderWidth: 1,
            borderColor: theme.border,
        },
        majorButton: {
            backgroundColor: theme.primary + '20',
            borderColor: theme.primary + '40',
        },
        selectedButton: {
            backgroundColor: theme.primary,
            transform: [{ scale: 1.05 }],
            shadowColor: theme.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            borderColor: theme.primary,
        },
        buttonText: {
            color: theme.text,
            fontSize: 14,
            fontWeight: '600',
            textAlign: 'center',
        },
        selectedButtonText: {
            color: theme.white,
        },
        errorText: {
            textAlign: 'center',
            color: theme.expense,
            margin: 15,
        },
        // --- زدنا هاد الستايل باش نعطيو عنوان للمدن ---
        citiesTitle: {
            color: theme.text,
            fontSize: 18,
            fontWeight: '600',
            letterSpacing: 0.6,
            marginHorizontal: 20,
            marginTop: 15,
            marginBottom: 10,
        }
    });

    const filteredCities = useMemo(() => {
        const allCitiesInOrder = [...majorCities, ...otherCities];
        if (searchQuery.trim().length > 0) {
            return allCitiesInOrder.filter(city => city?.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        return allCitiesInOrder; // Ila l recherche khawya, nrj3o kolchi
    }, [searchQuery, majorCities, otherCities]);

    if (isLoading) {
        return <ActivityIndicator size="large" color={theme.primary} style={styles.loader} />;
    }

    if (error) {
        return <Text style={styles.errorText}>Could not load cities.</Text>;
    }
    
    const renderCityButton = ({ item }) => {
        const isMajor = majorCities.includes(item);
        const isSelected = selectedCity === item;

        return (
            <Link
                href={{ pathname: "/city/[city]", params: { city: item } }}
                style={[
                    styles.buttonContainer,
                    isMajor && styles.majorButton,
                    isSelected && styles.selectedButton,
                ]}
                asChild
            >
                <TouchableOpacity onPress={() => setSelectedCity(item)}>
                    <Text style={[styles.buttonText, isSelected && styles.selectedButtonText]} numberOfLines={1}>
                        {item}
                    </Text>
                </TouchableOpacity>
            </Link>
        );
    };

    const renderHeader = () => (
        <>
            {ListHeaderComponent && ListHeaderComponent()}
            <View>
                <Text style={styles.citiesTitle}>All Cities</Text>
            </View>
        </>
    );

    return (
        <FlatList
            data={filteredCities}
            renderItem={renderCityButton}
            keyExtractor={(item) => item}
            numColumns={3}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            ListHeaderComponent={renderHeader}
        />
    );
};

export default CityButtons;