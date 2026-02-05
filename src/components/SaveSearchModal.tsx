import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '@/utils/theme';
import { SearchFilters } from '@/types/property';
import { saveSearch } from '@/services/savedSearches';

interface SaveSearchModalProps {
    visible: boolean;
    onClose: () => void;
    filters: SearchFilters;
    userId: string;
}

export const SaveSearchModal: React.FC<SaveSearchModalProps> = ({
    visible,
    onClose,
    filters,
    userId,
}) => {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert('Erro', 'Por favor, dê um nome à sua busca.');
            return;
        }

        setLoading(true);
        const result = await saveSearch(userId, name, filters);
        setLoading(false);

        if (result.success) {
            Alert.alert('Sucesso', 'Busca salva com sucesso!');
            setName('');
            onClose();
        } else {
            Alert.alert('Erro', 'Não foi possível salvar a busca.');
        }
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.content}>
                    <Text style={styles.title}>Salvar Esta Busca</Text>
                    <Text style={styles.subtitle}>Dê um nome para identificar rapidamente estes filtros depois.</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Ex: Apartamentos com Piscina"
                        placeholderTextColor={colors.mutedForeground}
                        value={name}
                        onChangeText={setName}
                        autoFocus
                    />

                    <View style={styles.buttons}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                            <Text style={styles.cancelText}>Cancelar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.saveButton, !name.trim() && styles.disabledButton]}
                            onPress={handleSave}
                            disabled={loading || !name.trim()}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFF" size="small" />
                            ) : (
                                <Text style={styles.saveText}>Salvar</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: spacing.xl,
    },
    content: {
        backgroundColor: colors.background,
        borderRadius: 16,
        padding: spacing.lg,
        elevation: 5,
    },
    title: {
        ...typography.h3,
        marginBottom: spacing.xs,
    },
    subtitle: {
        ...typography.bodySmall,
        color: colors.mutedForeground,
        marginBottom: spacing.lg,
    },
    input: {
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        padding: spacing.md,
        color: colors.foreground,
        ...typography.body,
        marginBottom: spacing.xl,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: spacing.md,
    },
    cancelButton: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
    },
    cancelText: {
        ...typography.label,
        color: colors.mutedForeground,
    },
    saveButton: {
        backgroundColor: colors.primary,
        borderRadius: 8,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.xl,
        minWidth: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    disabledButton: {
        opacity: 0.5,
    },
    saveText: {
        ...typography.label,
        color: '#FFF',
        fontWeight: 'bold',
    },
});
