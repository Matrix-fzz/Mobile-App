import { useContext, useRef, useState, useEffect } from 'react';
import { View, Pressable, StyleSheet, Animated } from 'react-native';
import { Badge, Icon } from 'react-native-paper';
import { ThemeContext } from '@/context/ThemeContext';

const getTabStyles = (theme) => StyleSheet.create({
    tabContainer: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 12,
    },
    iconContainer: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badge: {
        position: 'absolute',
        top: 0,
        right: -4,
        backgroundColor: theme.primary,
    },
});

const CustomTab = ({ tab, isActive, onPress, onLayout }) => {
    const { theme } = useContext(ThemeContext);
    const styles = getTabStyles(theme);
    
    const iconName = isActive ? tab.icon.replace('-outline', '') : tab.icon;
    
    return (
         <Pressable onPress={onPress} style={styles.tabContainer} onLayout={onLayout}>
            <View style={styles.iconContainer}>
                <Icon 
                    source={iconName}
                    size={28}
                    color={isActive ? theme.primary : theme.textLight}
                />
                {tab.badge && (
                    <Badge style={styles.badge}>{tab.badge}</Badge>
                )}
            </View>
        </Pressable>
    );
};

const getMainStyles = (theme) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: theme.background,
        borderBottomWidth: 1,
        borderBottomColor: theme.border,
    },
    indicator: {
        position: 'absolute',
        bottom: 0,
        height: 4,
        backgroundColor: theme.primary,
        borderRadius: 2,
    },
});

const CustomTabs = ({ tabs, value, onValueChange }) => {
    const { theme } = useContext(ThemeContext);
    const styles = getMainStyles(theme);
    
    const [layouts, setLayouts] = useState([]);
    const indicatorAnim = useRef(new Animated.Value(0)).current;

    const INDICATOR_WIDTH = "25%"; 

    useEffect(() => {
        const activeTabIndex = tabs.findIndex(tab => tab.value === value);
        
        // زدت هاد الشرط باش نتأكد أن layouts فيها معلومات قبل ما نخدمو بيها
        if (layouts.length > activeTabIndex && layouts[activeTabIndex]) {
            const tabLayout = layouts[activeTabIndex];
            const indicatorPosition = tabLayout.x + (tabLayout.width / -1);
            
            Animated.spring(indicatorAnim, {
                toValue: indicatorPosition,
                useNativeDriver: true,
            }).start();
        }
    }, [value, layouts, tabs, indicatorAnim]);
    
    return (
        <View style={styles.container}>
            {tabs.map((tab, index) => (
                <CustomTab
                    key={tab.value}
                    tab={tab}
                    isActive={value === tab.value}
                    onPress={() => onValueChange(tab.value)}
                    onLayout={(event) => {
                        // --- هنا فين كاين الحل ---
                        // 1. كنتأكدو أن event.nativeEvent موجود
                        if (!event.nativeEvent) return;

                        // 2. كنجبدو layout مباشرة وكنخزنوه في متغير
                        const { layout } = event.nativeEvent;

                        // 3. كنستعملو المتغير اللي خزنّا
                        setLayouts(prevLayouts => {
                            const newLayouts = [...prevLayouts];
                            newLayouts[index] = layout; // كنستعملو layout ماشي event.nativeEvent.layout
                            return newLayouts;
                        });
                    }}
                />
            ))}
            <Animated.View style={[
                styles.indicator, 
                { 
                    width: INDICATOR_WIDTH, 
                    transform: [{ translateX: indicatorAnim }] 
                }
            ]} />
        </View>
    );
};

export default CustomTabs;