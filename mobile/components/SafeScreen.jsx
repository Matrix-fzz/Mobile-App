import React, { useContext } from 'react';
import { View, StyleSheet,StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemeContext } from '@/context/ThemeContext'; 


const SafeScreen = ({ children }) => {
   
    const { theme,isDarkMode } = useContext(ThemeContext);
    
    const insets = useSafeAreaInsets();
    
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background, 
        }
    });

    return (
        <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
             <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            {children}
        </View>
    );
};

export default SafeScreen;