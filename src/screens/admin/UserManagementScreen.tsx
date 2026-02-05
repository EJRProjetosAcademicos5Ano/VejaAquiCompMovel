import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Modal,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getAllUsers, updateUserRole, UserProfile } from '@/services/users';
import { colors, spacing, typography } from '@/utils/theme';
import { Card } from '@/components/ui/Card';

export default function UserManagementScreen() {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
    const [roleModalVisible, setRoleModalVisible] = useState(false);
    const [updating, setUpdating] = useState(false);

    const roles = ['admin', 'agent', 'owner', 'user'];

    const loadUsers = async () => {
        setLoading(true);
        const data = await getAllUsers();
        setUsers(data);
        setFilteredUsers(data);
        setLoading(false);
    };

    useEffect(() => {
        loadUsers();
    }, []);

    useEffect(() => {
        const filtered = users.filter(u =>
            u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.user_id.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [searchQuery, users]);

    const handleRoleUpdate = async (newRole: string) => {
        if (!selectedUser) return;

        setUpdating(true);
        const success = await updateUserRole(selectedUser.user_id, newRole);
        setUpdating(false);

        if (success) {
            setUsers(prev => prev.map(u => u.user_id === selectedUser.user_id ? { ...u, role: newRole } : u));
            Alert.alert('Sucesso', 'Role atualizada com sucesso!');
            setRoleModalVisible(false);
        } else {
            Alert.alert('Erro', 'Falha ao atualizar role.');
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'admin': return '#EF4444';
            case 'agent': return '#3B82F6';
            case 'owner': return '#10B981';
            default: return '#64748B';
        }
    };

    const renderItem = ({ item }: { item: UserProfile }) => (
        <Card style={styles.card}>
            <View style={styles.userRow}>
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>{item.full_name || 'Sem Nome'}</Text>
                    <Text style={styles.userId}>{item.user_id}</Text>
                    <View style={[styles.roleBadge, { backgroundColor: getRoleColor(item.role || '') + '20' }]}>
                        <Text style={[styles.roleText, { color: getRoleColor(item.role || '') }]}>
                            {(item.role || 'user').toUpperCase()}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => {
                        setSelectedUser(item);
                        setRoleModalVisible(true);
                    }}
                >
                    <MaterialIcons name="edit" size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>
        </Card>
    );

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <MaterialIcons name="search" size={20} color={colors.mutedForeground} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar por nome ou ID..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {loading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={filteredUsers}
                    renderItem={renderItem}
                    keyExtractor={item => item.user_id}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <View style={styles.empty}>
                            <Text style={styles.emptyText}>Nenhum usuário encontrado</Text>
                        </View>
                    }
                />
            )}

            <Modal
                visible={roleModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setRoleModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Alterar Role</Text>
                        <Text style={styles.modalSubtitle}>{selectedUser?.full_name}</Text>

                        {roles.map(role => (
                            <TouchableOpacity
                                key={role}
                                style={[
                                    styles.roleOption,
                                    selectedUser?.role === role && styles.selectedRoleOption
                                ]}
                                onPress={() => handleRoleUpdate(role)}
                                disabled={updating}
                            >
                                <Text style={[
                                    styles.roleOptionText,
                                    selectedUser?.role === role && styles.selectedRoleOptionText
                                ]}>
                                    {role.toUpperCase()}
                                </Text>
                                {selectedUser?.role === role && (
                                    <MaterialIcons name="check" size={20} color={colors.primary} />
                                )}
                            </TouchableOpacity>
                        ))}

                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setRoleModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.card,
        margin: spacing.md,
        paddingHorizontal: spacing.md,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 12,
        marginLeft: spacing.sm,
        ...typography.body,
    },
    list: {
        padding: spacing.md,
    },
    card: {
        marginBottom: spacing.sm,
        padding: spacing.md,
    },
    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        ...typography.h4,
        color: colors.foreground,
    },
    userId: {
        ...typography.caption,
        color: colors.mutedForeground,
        marginBottom: 4,
    },
    roleBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    roleText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    editButton: {
        padding: 8,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    empty: {
        marginTop: 50,
        alignItems: 'center',
    },
    emptyText: {
        color: colors.mutedForeground,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: colors.background,
        width: '80%',
        borderRadius: 16,
        padding: spacing.xl,
    },
    modalTitle: {
        ...typography.h3,
        marginBottom: 4,
        textAlign: 'center',
    },
    modalSubtitle: {
        ...typography.body,
        color: colors.mutedForeground,
        marginBottom: spacing.lg,
        textAlign: 'center',
    },
    roleOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: spacing.md,
        borderRadius: 8,
        marginBottom: 8,
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
    },
    selectedRoleOption: {
        borderColor: colors.primary,
        backgroundColor: colors.primary + '10',
    },
    roleOptionText: {
        ...typography.h4,
        fontSize: 14,
        color: colors.foreground,
    },
    selectedRoleOptionText: {
        color: colors.primary,
    },
    closeButton: {
        marginTop: spacing.md,
        alignItems: 'center',
        padding: spacing.md,
    },
    closeButtonText: {
        color: colors.mutedForeground,
        fontWeight: 'bold',
    },
});
