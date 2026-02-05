import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    FlatList,
    Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '@/utils/theme';

interface DocumentUploaderProps {
    documents: string[];
    onDocumentsChange: (docs: string[]) => void;
    maxDocs?: number;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
    documents,
    onDocumentsChange,
    maxDocs = 5,
}) => {
    const pickDocument = async () => {
        if (documents.length >= maxDocs) {
            Alert.alert('Limite atingido', `Você pode enviar no máximo ${maxDocs} documentos.`);
            return;
        }

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: false,
                allowsMultipleSelection: true,
                quality: 0.8,
                selectionLimit: maxDocs - documents.length,
            });

            if (!result.canceled) {
                const newUris = result.assets.map((asset) => asset.uri);
                onDocumentsChange([...documents, ...newUris]);
            }
        } catch (error) {
            console.error('Error picking document:', error);
            Alert.alert('Erro', 'Não foi possível selecionar o documento.');
        }
    };

    const removeDocument = (index: number) => {
        const newDocs = [...documents];
        newDocs.splice(index, 1);
        onDocumentsChange(newDocs);
    };

    const renderItem = ({ item, index }: { item: string; index: number }) => (
        <View style={styles.docContainer}>
            <View style={styles.docIcon}>
                <MaterialIcons name="description" size={32} color={colors.primary} />
            </View>
            <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeDocument(index)}
            >
                <MaterialIcons name="close" size={16} color="#FFF" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.label}>Documentação Técnica ({documents.length}/{maxDocs})</Text>
                <TouchableOpacity onPress={pickDocument} disabled={documents.length >= maxDocs}>
                    <Text style={[
                        styles.actionText,
                        documents.length >= maxDocs && styles.disabledText
                    ]}>
                        + Adicionar
                    </Text>
                </TouchableOpacity>
            </View>

            {documents.length > 0 ? (
                <FlatList
                    data={documents}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => `${item}-${index}`}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                />
            ) : (
                <TouchableOpacity
                    style={styles.emptyState}
                    onPress={pickDocument}
                    activeOpacity={0.7}
                >
                    <MaterialIcons name="file-upload" size={48} color={colors.border} />
                    <Text style={styles.emptyText}>Adicionar Fotos de Documentos</Text>
                    <Text style={styles.emptySubtext}>Título de propriedade, plantas, etc.</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.lg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    label: {
        ...typography.label,
        color: colors.foreground,
    },
    actionText: {
        ...typography.label,
        color: colors.primary,
    },
    disabledText: {
        color: colors.mutedForeground,
    },
    listContent: {
        paddingVertical: spacing.xs,
        gap: spacing.md,
    },
    docContainer: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: spacing.sm,
        position: 'relative',
        backgroundColor: colors.muted,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    docIcon: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    removeButton: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: colors.destructive,
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: colors.background,
    },
    emptyState: {
        height: 120,
        borderWidth: 2,
        borderColor: colors.border,
        borderStyle: 'dashed',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.md,
        backgroundColor: colors.card,
    },
    emptyText: {
        ...typography.label,
        color: colors.mutedForeground,
        marginTop: spacing.sm,
    },
    emptySubtext: {
        ...typography.caption,
        color: colors.mutedForeground,
        marginTop: 4,
    },
});
