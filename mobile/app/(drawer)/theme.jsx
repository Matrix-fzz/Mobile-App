import React, { useContext } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import HeaderS from '@/components/HeaderSimple';
import { ThemeContext } from '@/context/ThemeContext'; // استيراد الكونتكست
import { THEMES } from '@/constants/colors'; // استيراد جميع الثيمات
import { Feather } from '@expo/vector-icons';

const ThemeScreen = () => {
  // جلب الثيم الحالي ودالة التغيير من الكونتكست
  const { theme, themeName, selectTheme } = useContext(ThemeContext);
  
  // تحويل كائن الثيمات إلى مصفوفة باش نقدرو نديرو ليها map
  const themeOptions = Object.keys(THEMES).map(key => ({
    key,
    ...THEMES[key],
  }));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <HeaderS />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: theme.text }]}>Choose Your Style</Text>
        <Text style={[styles.subtitle, { color: theme.textLight }]}>
          Select a theme to personalize your app experience.
        </Text>
        
        <View style={styles.themesContainer}>
          {themeOptions.map((option) => (
            <TouchableOpacity 
              key={option.key} 
              style={[
                styles.themeCard, 
                { 
                  backgroundColor: option.card, 
                  borderColor: themeName === option.key ? option.primary : option.border 
                }
              ]}
              onPress={() => selectTheme(option.key)}
            >
              {themeName === option.key && (
                <View style={[styles.checkIcon, { backgroundColor: option.primary }]}>
                  <Feather name="check" size={20} color={option.white} />
                </View>
              )}
              
              <View style={styles.colorPreview}>
                <View style={[styles.colorCircle, { backgroundColor: option.primary }]} />
                <View style={[styles.colorCircle, { backgroundColor: option.income }]} />
                <View style={[styles.colorCircle, { backgroundColor: option.expense }]} />
              </View>
              <Text style={[styles.themeName, { color: option.text }]}>{option.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  themesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  themeCard: {
    width: '48%',
    aspectRatio: 1, // يخلي البطاقة مربعة
    borderRadius: 20,
    marginBottom: 15,
    padding: 15,
    justifyContent: 'space-between',
    borderWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  checkIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorPreview: {
    flexDirection: 'row',
  },
  colorCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 5,
    borderWidth: 2,
    borderColor: '#fff',
  },
  themeName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ThemeScreen;