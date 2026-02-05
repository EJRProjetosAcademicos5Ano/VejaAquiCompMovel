import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    FlatList,
    Alert,
    ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '@/utils/theme';

interface ImageUploaderProps {
    images: string[];
    onImagesChange: (images: string[]) => void;
    maxImages?: number;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
    images,
    onImagesChange,
    maxImages = 10,
}) => {
    const [uploading, setUploading] = useState(false);

    const pickImage = async () => {
        if (images.length >= maxImages) {
            Alert.alert('Limite atingido', `Você pode enviar no máximo ${maxImages} imagens.`);
            return;
        }

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: false, // Multi-selection often conflicts with editing
                allowsMultipleSelection: true,
                quality: 0.8,
                selectionLimit: maxImages - images.length,
            });

            if (!result.canceled) {
                const newUris = result.assets.map((asset) => asset.uri);
                onImagesChange([...images, ...newUris]);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
        }
    };

    const removeImage = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        onImagesChange(newImages);
    };

    const renderItem = ({ item, index }: { item: string; index: number }) => (
        <View style={styles.imageContainer}>
            <Image source={{ uri: item }} style={styles.thumbnail} />
            <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeImage(index)}
            >
                <MaterialIcons name="close" size={16} color="#FFF" />
            </TouchableOpacity>
            {index === 0 && (
                <View style={styles.coverBadge}>
                    <Text style={styles.coverText}>Capa</Text>
                </View>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.label}>Fotos do Imóvel ({images.length}/{maxImages})</Text>
                <TouchableOpacity onPress={pickImage} disabled={images.length >= maxImages}>
                    <Text style={[
                        styles.actionText,
                        images.length >= maxImages && styles.disabledText
                    ]}>
                        + Adicionar
                    </Text>
                </TouchableOpacity>
            </View>

            {images.length > 0 ? (
                <FlatList
                    data={images}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => `${item}-${index}`}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                />
            ) : (
                <TouchableOpacity
                    style={styles.emptyState}
                    onPress={pickImage}
                    activeOpacity={0.7}
                >
                    <MaterialIcons name="add-photo-alternate" size={48} color={colors.border} />
                    <Text style={styles.emptyText}>Toque para adicionar fotos</Text>
                    <Text style={styles.emptySubtext}>A primeira foto será a capa do anúncio</Text>
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
    imageContainer: {
        width: 120,
        height: 120,
        borderRadius: 8,
        marginRight: spacing.sm,
        position: 'relative',
    },
    thumbnail: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
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
    coverBadge: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingVertical: 4,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        alignItems: 'center',
    },
    coverText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    emptyState: {
        height: 150,
        borderWidth: 2,
        borderColor: colors.border,
        borderStyle: 'dashed',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.lg,
        backgroundColor: colors.card,
    },
    emptyText: {
        ...typography.label,
        color: colors.mutedForeground,
        marginTop: spacing.md,
    },
    emptySubtext: {
        ...typography.caption,
        color: colors.mutedForeground,
        marginTop: 4,
    },
});
