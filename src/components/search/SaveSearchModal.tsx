import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing } from '@/utils/theme';
import { Button } from '@/components/ui/Card';
import { SearchFilters } from '@/types/property';
import { saveSearch } from '@/services/savedSearches';

interface SaveSearchModalProps {
    visible: boolean;
    onClose: () => void;
    filters: SearchFilters;
    userId: string;
}

export default function SaveSearchModal({ visible, onClose, filters, userId }: SaveSearchModalProps) {
    const [name, setName] = useState('');
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert('Erro', 'Por favor, dê um nome para sua busca.');
            return;
        }

        setSaving(true);
        try {
            const result = await saveSearch(userId, name, filters);
            if (result.success) {
                Alert.alert('Sucesso', 'Sua busca foi salva!');
                setName('');
                onClose();
            } else {
                throw new Error('Falha ao salvar');
            }
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível salvar a busca.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal visible={visible} animationType="fade" transparent={true}>
            <View style={styles.overlay}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.container}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.header}>
                            <Text style={styles.title}>Salvar Busca</Text>
                            <TouchableOpacity onPress={onClose}>
                                <MaterialCommunityIcons name="close" size={24} color={colors.foreground} />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.label}>Nome da Busca</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: Apartamentos em Luanda"
                            value={name}
                            onChangeText={setName}
                            autoFocus={true}
                        />

                        <View style={styles.footer}>
                            <Button onPress={handleSave} disabled={saving} style={{ flex: 1 }}>
                                <Text style={styles.buttonText}>{saving ? 'Salvando...' : 'Salvar'}</Text>
                            </Button>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: spacing.lg,
    },
    container: {
        width: '100%',
    },
    modalContent: {
        backgroundColor: colors.background,
        borderRadius: 16,
        padding: spacing.lg,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.foreground,
    },
    label: {
        fontSize: 14,
        color: colors.mutedForeground,
        marginBottom: spacing.xs,
    },
    input: {
        backgroundColor: colors.muted,
        borderRadius: 8,
        padding: spacing.md,
        fontSize: 16,
        color: colors.foreground,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: spacing.lg,
    },
    footer: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    }
});
