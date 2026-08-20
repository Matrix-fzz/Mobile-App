import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
// import { useCategories } from '../hooks/useCategories'; // ==> 1. KANBEDDLO L IMPORT L 9DIM...
import { useAllCategories } from '@/hooks/useAllCategories'; // ==> ... B L IMPORT JDID (t2kked men l chemin)
import { ThemeContext } from '@/context/ThemeContext';

const DropdownComponent = ({ value, onCategoryChange }) => {
    const { theme } = useContext(ThemeContext);
    
    // ==> 2. KANBEDDLO SMIYT L HOOK HNA 7TA HIYA <==
    const { categories, isLoading } = useAllCategories();
    const [isFocus, setIsFocus] = useState(false);

    // L code l ba9i kayb9a kima howa, hit déja m9ad mzyan
    const formattedData = categories.map(category => ({
        label: category.category_name,
        value: category.category_id,
    }));
    
    const styles = StyleSheet.create({
        container: { marginBottom: 16, },
        loadingContainer: { flexDirection: 'row', alignItems: 'center', height: 50, marginBottom: 16, },
        loadingText: { color: theme.textLight, marginLeft: 10, },
        dropdown: {
            height: 55,
            borderColor: theme.border,
            borderWidth: 1,
            borderRadius: 4,
            paddingHorizontal: 8,
            backgroundColor: theme.background,
        },
        label: {
            position: 'absolute',
            backgroundColor: theme.background,
            left: 10,
            top: -10,
            zIndex: 999,
            paddingHorizontal: 8,
            fontSize: 12,
            color: theme.textLight,
        },
        labelFocus: { color: theme.primary, },
        placeholderStyle: { fontSize: 16, color: theme.textLight, },
        selectedTextStyle: { fontSize: 16, color: theme.text, },
        iconStyle: { width: 20, height: 20, },
        inputSearchStyle: { height: 40, fontSize: 16, color: theme.text, backgroundColor: theme.card, },
    });

    const renderLabel = () => {
        if (value || isFocus) {
            return (
                <Text style={[styles.label, isFocus && styles.labelFocus]}>
                    Category
                </Text>
            );
        }
        return null;
    };

    if (isLoading && categories.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={theme.primary} />
                <Text style={styles.loadingText}>Loading categories...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {renderLabel()}
            <Dropdown
                style={[styles.dropdown, isFocus && { borderColor: theme.primary }]}
                showsVerticalScrollIndicator={false}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={formattedData}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? 'Select category' : '...'}
                searchPlaceholder="Search..."
                activeColor={theme.primary + '20'}
                itemTextStyle={{ color: theme.text }}
                containerStyle={{ backgroundColor: theme.card, borderColor: theme.border }}
                value={value}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                    onCategoryChange(item.value);
                    setIsFocus(false);
                }}
            />
        </View>
    );
};

export default DropdownComponent;