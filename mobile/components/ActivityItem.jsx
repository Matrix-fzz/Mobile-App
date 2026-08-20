// components/ActivityItem.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Card, Paragraph, Title, Text } from 'react-native-paper';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from "expo-router";

// This component renders the correct icon based on the activity type
const ActivityIcon = ({ type }) => {
    const iconProps = { size: 40, style: { marginRight: 15 } };
    switch (type) {
        case 'new_message': return <Avatar.Icon {...iconProps} icon="message-reply-text" />;
        case 'price_drop': return <Avatar.Icon {...iconProps} icon="trending-down" color="#4CAF50" style={[iconProps.style, { backgroundColor: '#E8F5E9' }]} />;
        case 'new_listing_match': return <Avatar.Icon {...iconProps} icon="magnify-plus-outline" color="#2196F3" style={[iconProps.style, { backgroundColor: '#E3F2FD' }]} />;
        case 'visit_request': return <Avatar.Icon {...iconProps} icon="calendar-check" color="#FF9800" style={[iconProps.style, { backgroundColor: '#FFF3E0' }]} />;
        case 'task_complete_profile': return <Avatar.Icon {...iconProps} icon="account-check-outline" color="#9C27B0" style={[iconProps.style, { backgroundColor: '#F3E5F5' }]} />;
        case 'weekly_report': return <Avatar.Icon {...iconProps} icon="chart-line" color="#607D8B" style={[iconProps.style, { backgroundColor: '#ECEFF1'}]} />;
        default: return <Avatar.Icon {...iconProps} icon="bell-outline" />;
    }
};

// This component renders the correct text content based on the activity type
const ActivityContent = ({ activity }) => {
    
    
    const { type, content_params: params } = activity;
    switch (type) {
        case 'new_message': return (<><Title style={styles.title}>{params.senderName}</Title><Paragraph style={styles.paragraph} numberOfLines={1}>{params.lastMessage}</Paragraph></>);
        case 'price_drop': return <Paragraph style={styles.paragraph}>Price Drop! <Text style={{fontWeight: 'bold'}}>{params.propertyName}</Text> is now available for {params.newPrice} DH.</Paragraph>;
        case 'new_listing_match': return <Paragraph style={styles.paragraph}>A new property matching your search was added in <Text style={{fontWeight: 'bold'}}>{params.city}</Text>.</Paragraph>;
        case 'visit_request': return <Paragraph style={styles.paragraph}><Text style={{fontWeight: 'bold'}}>{params.userName}</Text> has requested a visit for your property <Text style={{fontWeight: 'bold'}}>{params.propertyName}</Text>.</Paragraph>;
        case 'task_complete_profile': return <Paragraph style={styles.paragraph}>Task: Complete your profile. You are currently at <Text style={{fontWeight: 'bold'}}>{params.completionPercentage}%</Text>.</Paragraph>;
        case 'weekly_report': return <Paragraph style={styles.paragraph}>Your Weekly Report: <Text style={{fontWeight: 'bold'}}>{params.newUsers} new users</Text> and <Text style={{fontWeight: 'bold'}}>{params.newProperties} new properties</Text>.</Paragraph>;
        default: return <Paragraph style={styles.paragraph}>New activity.</Paragraph>;
    }
};

const ActivityItem = ({ activity }) => {
     const router = useRouter();

    const handlePress = () => {
        if (activity.type === "new_message") {
            router.push({
                pathname: "/chat/[userId]",
                params: {
                    user_id: activity.content_params.senderId, // 👈 خاص يكون عندك senderId فـ API
                    last_message: activity.content_params.lastMessage, // 👈 باش تجيبه للـ chat
                },
            });
        }
    };
    return (
        <Card style={[styles.card, !activity.is_read && styles.unread]} onPress={handlePress}>
            <View style={styles.container}>
                <ActivityIcon type={activity.type} />
                <View style={styles.contentContainer}>
                    <ActivityContent activity={activity} />
                    <Text style={styles.time}>
                        {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                    </Text>
                </View>
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: { marginHorizontal: 10, marginVertical: 6, elevation: 1 },
    unread: { backgroundColor: '#E3F2FD' }, // A nice color for unread items
    container: { flexDirection: 'row', padding: 12, alignItems: 'center' },
    contentContainer: { flex: 1 },
    title: { fontSize: 16, lineHeight: 22, fontWeight: 'bold' },
    paragraph: { fontSize: 14, lineHeight: 20, color: '#333' },
    time: { fontSize: 12, color: 'gray', marginTop: 4, textAlign: 'right' }
});

export default ActivityItem;