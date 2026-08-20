import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import PropertiesByCityList from "@/components/PropertiesByCityList";
import HeaderFilter from "@/components/HeaderFilter";
import FilterModal from "@/components/FilterModal";
import { ThemeContext } from '@/context/ThemeContext';

const CityDetailsPage = () => {
  const { theme } = useContext(ThemeContext);
  const { city } = useLocalSearchParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({});

  const handleFilterPress = () => setIsFilterVisible(true);
  const handleApplyFilters = (filters) => {
    setAppliedFilters(filters);
    setIsFilterVisible(false);
  };

  const styles = StyleSheet.create({
    container: { 
      flex: 1, 
      backgroundColor: theme.background,
    },
    contentHeader: {
      paddingHorizontal: 10,
      paddingTop: 20,
      paddingBottom: 10,
    },
    welcomeText: {
      fontSize: 24,
      fontWeight: "bold",
      textAlign: "center",
      color: theme.primary,
    },
    subText: {
      fontSize: 16,
      textAlign: "center",
      color: theme.textLight,
      marginTop: 4,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <HeaderFilter
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onFilterPress={handleFilterPress}
        isFilterActive={Object.keys(appliedFilters).length > 0}
      />

     
      <View style={styles.contentHeader}>
        <Text style={styles.welcomeText}>Welcome to {city}!</Text>
        <Text style={styles.subText}>Here are the available properties:</Text>
      </View>

   
      <PropertiesByCityList
        city={city}
        searchQuery={searchQuery}
        filters={appliedFilters}
      />

      <FilterModal
        visible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        onApply={handleApplyFilters}
      />
    </SafeAreaView>
  );
};

export default CityDetailsPage;
