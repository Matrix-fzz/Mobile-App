import React, { useState, useMemo, useContext } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { Stack } from 'expo-router';
import { Text } from 'react-native-paper';
import { ThemeContext } from '@/context/ThemeContext';

import Header from '@/components/Header';
import CustomTabs from '@/components/CustomTabs';
import ActivityItem from '@/components/ActivityItem';
import db from '@/data/db.json'; 


const allActivities = db.activities;

const InboxScreen = () => {
    // 2. استعمال useContext باش نجيبو الثيم الحالي
    const { theme } = useContext(ThemeContext);
    
    const [currentTab, setCurrentTab] = useState('alerts');

    // هاد اللوجيك مافيهش تغيير لأنه كيتعلق بالبيانات فقط
    const filteredData = useMemo(() => {
        const sortedActivities = [...allActivities].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        switch (currentTab) {
            case 'messages': return sortedActivities.filter(act => act.type === 'new_message');
            case 'alerts': return sortedActivities.filter(act => ['price_drop', 'new_listing_match', 'visit_request', 'weekly_report'].includes(act.type));
            case 'tasks': return sortedActivities.filter(act => act.type.startsWith('task_'));
            default: return sortedActivities;
        }
    }, [currentTab]);

    const unreadCounts = useMemo(() => {
        const messages = allActivities.filter(a => a.type === 'new_message' && !a.is_read).length;
        const alerts = allActivities.filter(a => ['price_drop', 'visit_request'].includes(a.type) && !a.is_read).length;
        return { messages, alerts };
    }, []);
    
    const tabs = [
        { 
            value: 'messages', 
            label: 'Messages',
            icon: 'message-reply-text-outline',
            badge: unreadCounts.messages > 0 ? unreadCounts.messages : null
        },
        { 
            value: 'alerts',   
            label: 'Alerts',
            icon: 'bell-outline',
            badge: unreadCounts.alerts > 0 ? unreadCounts.alerts : null
        },
        { 
            value: 'tasks',    
            label: 'Tasks',
            icon: 'clipboard-list-outline'
        },
    ];

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
        },
        emptyContainer: {
            flex: 1,
            marginTop: 100,
            alignItems: 'center',
            justifyContent: 'center'
        },
        emptyText: {
            color: theme.textLight, 
            fontSize: 16,
        }
    });

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen 
                options={{
                    headerShown: true,
                   
                    header: () => <Header title="Activity Center" />,
                }}
            />
            <View style={{ flex: 1 }}>
                <CustomTabs
                    tabs={tabs}
                    value={currentTab}
                    onValueChange={setCurrentTab}
                />

                <FlatList
                    data={filteredData}
                    keyExtractor={(item) => item.activity_id.toString()}
                    renderItem={({ item }) => <ActivityItem activity={item} />}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>There is nothing to show here.</Text>
                        </View>
                    }
                    contentContainerStyle={{ paddingTop: 10 }}
                />
            </View>
        </SafeAreaView>
    )
}

export default InboxScreen;