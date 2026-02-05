import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '@/utils/theme';
import { useAuth } from '@/context/AuthContext';
import { getMessages, sendMessage, subscribeToMessages, Message } from '@/services/messages';

export default function ChatScreen() {
    const route = useRoute<any>();
    const navigation = useNavigation();
    const { user } = useAuth();
    const { chatId, otherUser, property } = route.params;

    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        loadMessages();
        const subscription = subscribeToMessages(chatId, (newMessage) => {
            setMessages(prev => [...prev, newMessage]);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [chatId]);

    const loadMessages = async () => {
        setLoading(true);
        const data = await getMessages(chatId);
        setMessages(data);
        setLoading(false);
    };

    const handleSend = async () => {
        if (!inputText.trim() || !user || sending) return;

        setSending(true);
        const success = await sendMessage(chatId, user.id, inputText.trim());
        if (success) {
            setInputText('');
        }
        setSending(false);
    };

    const renderMessage = ({ item }: { item: Message }) => {
        const isMine = item.sender_id === user?.id;
        return (
            <View style={[
                styles.messageBubble,
                isMine ? styles.myMessage : styles.otherMessage
            ]}>
                <Text style={[
                    styles.messageText,
                    isMine ? styles.myMessageText : styles.otherMessageText
                ]}>
                    {item.content}
                </Text>
                <Text style={[
                    styles.messageTime,
                    isMine ? styles.myMessageTime : styles.otherMessageTime
                ]}>
                    {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color={colors.foreground} />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    <Text style={styles.userName}>{otherUser?.full_name || 'Usuário'}</Text>
                    <Text style={styles.propertyHint} numberOfLines={1}>{property?.title}</Text>
                </View>
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderMessage={renderMessage}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
                />
            )}

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={inputText}
                        onChangeText={setInputText}
                        placeholder="Escreva uma mensagem..."
                        multiline
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
                        onPress={handleSend}
                        disabled={!inputText.trim() || sending}
                    >
                        {sending ? (
                            <ActivityIndicator size="small" color="#FFF" />
                        ) : (
                            <MaterialIcons name="send" size={24} color="#FFF" />
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
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
        backgroundColor: colors.card,
    },
    backButton: {
        marginRight: spacing.md,
    },
    headerInfo: {
        flex: 1,
    },
    userName: {
        ...typography.label,
        fontSize: 16,
        color: colors.foreground,
    },
    propertyHint: {
        fontSize: 12,
        color: colors.primary,
    },
    listContent: {
        padding: spacing.md,
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 16,
        marginBottom: spacing.sm,
    },
    myMessage: {
        alignSelf: 'flex-end',
        backgroundColor: colors.primary,
        borderBottomRightRadius: 4,
    },
    otherMessage: {
        alignSelf: 'flex-start',
        backgroundColor: colors.muted,
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: 15,
        lineHeight: 20,
    },
    myMessageText: {
        color: '#FFF',
    },
    otherMessageText: {
        color: colors.foreground,
    },
    messageTime: {
        fontSize: 10,
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    myMessageTime: {
        color: 'rgba(255,255,255,0.7)',
    },
    otherMessageTime: {
        color: colors.mutedForeground,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: spacing.md,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: colors.border,
        backgroundColor: colors.card,
    },
    input: {
        flex: 1,
        backgroundColor: colors.background,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        maxHeight: 100,
        color: colors.foreground,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: spacing.sm,
    },
    sendButtonDisabled: {
        backgroundColor: colors.muted,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
