import React, { useState, useContext } from 'react'; // زدنا useContext
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from '@/context/ThemeContext'; // جبنا الكونتكست

// حيدنا هاد الـ import، ما بقيناش محتاجينو
// import { COLORS } from "@/constants/colors";

const FilterModal = ({ visible, onClose, onApply }) => {
    // 2. استعمال useContext باش نجيبو الثيم الحالي
    const { theme } = useContext(ThemeContext);

    // ... (All your state logic remains the same) ...
    
    const [dealType, setDealType] = useState(null);
    const [priceOrder, setPriceOrder] = useState(null);

    const handleReset = () => {
       
        setDealType(null);
        setPriceOrder(null);
    };

    const handleApply = () => {
        onApply({  dealType, priceOrder });
        onClose();
    };

    const styles = StyleSheet.create({
        overlay: {
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "flex-end",
        },
        modal: {
            backgroundColor: theme.background,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20, 
            maxHeight: "80%",
        },
        header: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: 15, 
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
        },
        title: {
            fontSize: 20,
            fontWeight: "bold",
            color: theme.text, 
        },
        sectionTitle: {
            marginTop: 18,
            fontWeight: "600",
            fontSize: 16,
            color: theme.text,
            marginBottom: 10,
        },
        optionRows: {
            flexDirection: "row",
            flexWrap: 'wrap',
            justifyContent: "space-around",
            alignItems: "center",
            marginVertical: 5,
            marginHorizontal: 20,
        },
        chip: {
            borderWidth: 1,
            borderColor: theme.border,
            borderRadius: 20,
            paddingHorizontal: 12,
            paddingVertical: 8, 
            marginRight: 8,
            marginBottom: 8, 
        },
        chipActive: {
            backgroundColor: theme.primary,
            borderColor: theme.primary,
        },
        chipText: {
            color: theme.text,
        },
        chipTextActive: {
            color: theme.white, 
        },
        footer: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10,
            borderTopWidth: 1,
            borderTopColor: theme.border,
            paddingTop: 15,
        },
        resetBtn: {
            flex: 1,
            padding: 12,
            borderRadius: 10,
            backgroundColor: theme.card,
            marginRight: 8,
            alignItems: "center",
            borderWidth: 1,
            borderColor: theme.border,
        },
        resetBtnText: { 
            color: theme.text,
            fontWeight: 'bold',
        },
        applyBtn: {
            flex: 1,
            padding: 12,
            borderRadius: 10,
            backgroundColor: theme.primary, 
            alignItems: "center",
        },
        applyBtnText: {
            color: theme.white,
            fontWeight: 'bold',
        },
    });

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Filters</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color={theme.text} />
                        </TouchableOpacity>
                    </View>

                    <View>
                        <Text style={styles.sectionTitle}>Sort by</Text>
                        <View style={styles.optionRows}>
                            <TouchableOpacity
                                style={[styles.chip, dealType === "sell" && styles.chipActive]}
                                onPress={() => setDealType(dealType === "sell" ? null : "sell")}
                            >
                                <Text style={dealType === "sell" ? styles.chipTextActive : styles.chipText}>Sell</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.chip, dealType === "rent" && styles.chipActive]}
                                onPress={() => setDealType(dealType === "rent" ? null : "rent")}
                            >
                                <Text style={dealType === "rent" ? styles.chipTextActive : styles.chipText}>Rent</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.chip, priceOrder === "priceLow" && styles.chipActive]}
                                onPress={() => setPriceOrder(priceOrder === "priceLow" ? null : "priceLow")}
                            >
                                <Text style={priceOrder === "priceLow" ? styles.chipTextActive : styles.chipText}>Price ↑</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.chip, priceOrder === "priceHigh" && styles.chipActive]}
                                onPress={() => setPriceOrder(priceOrder === "priceHigh" ? null : "priceHigh")}
                            >
                                <Text style={priceOrder === "priceHigh" ? styles.chipTextActive : styles.chipText}>Price ↓</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
                            <Text style={styles.resetBtnText}>Reset</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
                            <Text style={styles.applyBtnText}>Apply</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default FilterModal;