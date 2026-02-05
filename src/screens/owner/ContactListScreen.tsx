import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '@/utils/theme';
import { useAuth } from '@/context/AuthContext';
import { getUserChats, Chat } from '@/services/chats';

export default function ContactListScreen() {
    const navigation = useNavigation<any>();
    const { user } = useAuth();
    const [chats, setChats] = useState<Chat[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchChats = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const data = await getUserChats(user.id);
            setChats(data);
        } catch (error) {
            console.error('Error fetching chats:', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchChats();
        }, [user])
    );

    const renderItem = ({ item }: { item: Chat }) => (
        <TouchableOpacity
            style={styles.chatCard}
            onPress={() => navigation.navigate('Chat', { chatId: item.id, otherUser: item.other_user, property: item.property })}
        >
            <View style={styles.avatarContainer}>
                {item.other_user?.avatar_url ? (
                    <Image source={{ uri: item.other_user.avatar_url }} style={styles.avatar} />
                ) : (
                    <View style={[styles.avatar, styles.placeholderAvatar]}>
                        <MaterialIcons name="person" size={24} color={colors.mutedForeground} />
                    </View>
                )}
            </View>

            <View style={styles.chatInfo}>
                <View style={styles.headerRow}>
                    <Text style={styles.userName}>{item.other_user?.full_name || 'Usuário'}</Text>
                    <Text style={styles.date}>
                        {new Date(item.created_at).toLocaleDateString()}
                    </Text>
                </View>
                <Text style={styles.propertyTitle} numberOfLines={1}>
                    Interesse em: {item.property?.title || 'Imóvel'}
                </Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.mutedForeground} />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color={colors.foreground} />
                </TouchableOpacity>
                <Text style={styles.title}>Conversas</Text>
            </View>

            {loading && chats.length === 0 ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={chats}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchChats} />}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <MaterialIcons name="chat-bubble-outline" size={64} color={colors.muted} />
                            <Text style={styles.emptyTitle}>Nenhuma conversa ainda</Text>
                            <Text style={styles.emptySubtitle}>As mensagens dos interessados aparecerão aqui.</Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    backButton: {
        marginRight: spacing.md,
    },
    title: {
        ...typography.h3,
        color: colors.foreground,
    },
    listContent: {
        flexGrow: 1,
    },
    chatCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: colors.card,
    },
    avatarContainer: {
        marginRight: spacing.md,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    placeholderAvatar: {
        backgroundColor: colors.muted,
        alignItems: 'center',
        justifyContent: 'center',
    },
    chatInfo: {
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    userName: {
        ...typography.label,
        fontSize: 16,
        color: colors.foreground,
    },
    date: {
        fontSize: 12,
        color: colors.mutedForeground,
    },
    propertyTitle: {
        fontSize: 13,
        color: colors.primary,
        fontWeight: '500',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xl,
        marginTop: 100,
    },
    emptyTitle: {
        ...typography.h3,
        color: colors.foreground,
        marginTop: spacing.lg,
    },
    emptySubtitle: {
        textAlign: 'center',
        color: colors.mutedForeground,
        marginTop: spacing.sm,
    },
});
