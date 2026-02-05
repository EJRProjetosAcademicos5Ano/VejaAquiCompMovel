import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Switch,
    TouchableOpacity,
    SafeAreaView,
    Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { colors, spacing, typography } from '../utils/theme';

const SettingsScreen = () => {
    const { user, signOut } = useAuth();
    const [notifications, setNotifications] = useState({
        emailNewProperties: true,
        emailMessages: true,
        pushMessages: true,
        pushVisits: true,
    });

    const toggleSwitch = (key: keyof typeof notifications) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleLogout = () => {
        Alert.alert(
            'Sair',
            'Tem certeza que deseja sair da sua conta?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Sair', onPress: signOut, style: 'destructive' },
            ]
        );
    };

    const SettingRow = ({ label, sublabel, icon, value, onValueChange, type = 'switch' }: any) => (
        <View style={styles.settingRow}>
            <View style={styles.settingIcon}>
                <Ionicons name={icon} size={22} color={colors.primary} />
            </View>
            <View style={styles.settingText}>
                <Text style={styles.settingLabel}>{label}</Text>
                {sublabel && <Text style={styles.settingSublabel}>{sublabel}</Text>}
            </View>
            {type === 'switch' ? (
                <Switch
                    value={value}
                    onValueChange={onValueChange}
                    trackColor={{ false: '#CBD5E1', true: colors.primary }}
                />
            ) : (
                <Ionicons name="chevron-forward" size={18} color={colors.border} />
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView style={styles.container} contentContainerStyle={styles.content}>

                {/* Notifications Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Notificações</Text>
                    <View style={styles.card}>
                        <SettingRow
                            label="E-mail: Novos Imóveis"
                            sublabel="Receba alertas de novos imóveis que combinam com você"
                            icon="mail-outline"
                            value={notifications.emailNewProperties}
                            onValueChange={() => toggleSwitch('emailNewProperties')}
                        />
                        <View style={styles.separator} />
                        <SettingRow
                            label="E-mail: Mensagens"
                            sublabel="Avisar quando receber uma nova mensagem"
                            icon="chatbubble-outline"
                            value={notifications.emailMessages}
                            onValueChange={() => toggleSwitch('emailMessages')}
                        />
                        <View style={styles.separator} />
                        <SettingRow
                            label="Push: Mensagens"
                            icon="notifications-outline"
                            value={notifications.pushMessages}
                            onValueChange={() => toggleSwitch('pushMessages')}
                        />
                    </View>
                </View>

                {/* Account Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Conta & Segurança</Text>
                    <View style={styles.card}>
                        <TouchableOpacity onPress={() => Alert.alert('Perfil', 'Funcionalidade de edição de perfil em breve.')}>
                            <SettingRow
                                label="Editar Perfil"
                                icon="person-outline"
                                type="link"
                            />
                        </TouchableOpacity>
                        <View style={styles.separator} />
                        <TouchableOpacity onPress={() => Alert.alert('Segurança', 'Alteração de senha enviada para seu e-mail.')}>
                            <SettingRow
                                label="Alterar Senha"
                                icon="lock-closed-outline"
                                type="link"
                            />
                        </TouchableOpacity>
                        <View style={styles.separator} />
                        <TouchableOpacity onPress={() => Alert.alert('Assinatura', 'Gerir plano Premium.')}>
                            <SettingRow
                                label="Pano & Assinatura"
                                icon="star-outline"
                                type="link"
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Preferences Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Preferências</Text>
                    <View style={styles.card}>
                        <TouchableOpacity onPress={() => Alert.alert('Moeda', 'A moeda padrão é AOA.')}>
                            <SettingRow
                                label="Moeda Padrão"
                                sublabel="Atualmente em AOA (Kz)"
                                icon="cash-outline"
                                type="link"
                            />
                        </TouchableOpacity>
                        <View style={styles.separator} />
                        <TouchableOpacity onPress={() => Alert.alert('Língua', 'O app está em Português.')}>
                            <SettingRow
                                label="Idioma"
                                sublabel="Português"
                                icon="globe-outline"
                                type="link"
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Danger Zone */}
                <View style={styles.section}>
                    <TouchableOpacity
                        style={[styles.card, styles.logoutCard]}
                        onPress={handleLogout}
                    >
                        <Ionicons name="log-out-outline" size={22} color={colors.destructive} />
                        <Text style={styles.logoutText}>Terminar Sessão</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{ marginTop: spacing.lg, alignItems: 'center' }}
                        onPress={() => Alert.alert('Eliminar Conta', 'Esta ação é irreversível. Contacte o suporte.')}
                    >
                        <Text style={{ color: colors.destructive, fontSize: 13, opacity: 0.7 }}>Eliminar minha conta</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.versionText}>VejaAquí Mobile v1.0.0</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#F8FAFC' },
    container: { flex: 1 },
    content: { padding: spacing.lg },
    section: { marginBottom: spacing.xl },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: colors.mutedForeground,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: spacing.sm,
        marginLeft: spacing.xs,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: 'hidden',
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
    },
    settingIcon: {
        width: 36,
        height: 36,
        borderRadius: 8,
        backgroundColor: colors.primary + '10',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    settingText: {
        flex: 1,
    },
    settingLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.foreground,
    },
    settingSublabel: {
        fontSize: 12,
        color: colors.mutedForeground,
        marginTop: 2,
    },
    separator: {
        height: 1,
        backgroundColor: colors.border,
        marginLeft: spacing.md + 36 + spacing.md, // Align with text
    },
    logoutCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.md,
        borderColor: colors.destructive + '40',
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.destructive,
        marginLeft: spacing.sm,
    },
    footer: {
        paddingVertical: spacing.xl,
        alignItems: 'center',
    },
    versionText: {
        fontSize: 12,
        color: colors.mutedForeground,
        opacity: 0.5,
    },
});

export default SettingsScreen;
