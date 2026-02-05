import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    FlatList,
    TouchableOpacity,
    Modal,
    Dimensions,
    StyleSheet,
    StatusBar,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '@/utils/theme';

const { width, height } = Dimensions.get('window');

interface ImageGalleryProps {
    images: string[];
    coverImage?: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
    images,
    coverImage,
}) => {
    const [fullscreenVisible, setFullscreenVisible] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const allImages = images && images.length > 0 ? images : coverImage ? [coverImage] : [];

    if (allImages.length === 0) {
        return (
            <View style={styles.placeholderContainer}>
                <MaterialIcons name="image" size={64} color={colors.mutedForeground} />
                <Text style={styles.placeholderText}>Sem imagens disponíveis</Text>
            </View>
        );
    }

    const openFullscreen = (index: number) => {
        setCurrentIndex(index);
        setFullscreenVisible(true);
    };

    const closeFullscreen = () => {
        setFullscreenVisible(false);
    };

    return (
        <>
            {/* Thumbnail Gallery */}
            <View style={styles.container}>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={allImages}
                    pagingEnabled
                    onMomentumScrollEnd={(event) => {
                        const index = Math.round(event.nativeEvent.contentOffset.x / width);
                        setCurrentIndex(index);
                    }}
                    keyExtractor={(item, idx) => `image-${idx}`}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => openFullscreen(index)}
                        >
                            <Image
                                source={{ uri: item }}
                                style={styles.image}
                                resizeMode="cover"
                            />
                        </TouchableOpacity>
                    )}
                />

                {/* Image Counter */}
                <View style={styles.counter}>
                    <Text style={styles.counterText}>
                        {currentIndex + 1} / {allImages.length}
                    </Text>
                </View>

                {/* Fullscreen Button */}
                <TouchableOpacity
                    style={styles.fullscreenButton}
                    onPress={() => openFullscreen(currentIndex)}
                    activeOpacity={0.7}
                >
                    <MaterialIcons name="fullscreen" size={24} color={colors.primaryForeground} />
                </TouchableOpacity>
            </View>

            {/* Fullscreen Modal */}
            <Modal
                visible={fullscreenVisible}
                transparent={false}
                animationType="fade"
                onRequestClose={closeFullscreen}
            >
                <StatusBar hidden />
                <View style={styles.fullscreenContainer}>
                    <FlatList
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        data={allImages}
                        initialScrollIndex={currentIndex}
                        getItemLayout={(data, index) => ({
                            length: width,
                            offset: width * index,
                            index,
                        })}
                        onMomentumScrollEnd={(event) => {
                            const index = Math.round(event.nativeEvent.contentOffset.x / width);
                            setCurrentIndex(index);
                        }}
                        keyExtractor={(item, idx) => `fullscreen-${idx}`}
                        renderItem={({ item }) => (
                            <View style={styles.fullscreenImageContainer}>
                                <Image
                                    source={{ uri: item }}
                                    style={styles.fullscreenImage}
                                    resizeMode="contain"
                                />
                            </View>
                        )}
                    />

                    {/* Close Button */}
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={closeFullscreen}
                        activeOpacity={0.7}
                    >
                        <MaterialIcons name="close" size={28} color="#FFFFFF" />
                    </TouchableOpacity>

                    {/* Fullscreen Counter */}
                    <View style={styles.fullscreenCounter}>
                        <Text style={styles.fullscreenCounterText}>
                            {currentIndex + 1} / {allImages.length}
                        </Text>
                    </View>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        marginBottom: spacing.lg,
    },
    image: {
        width: width,
        height: 280,
    },
    counter: {
        position: 'absolute',
        bottom: spacing.md,
        right: spacing.md,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: 20,
    },
    counterText: {
        ...typography.label,
        color: '#FFFFFF',
        fontSize: 12,
    },
    fullscreenButton: {
        position: 'absolute',
        bottom: spacing.md,
        left: spacing.md,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholderContainer: {
        width: width,
        height: 280,
        backgroundColor: colors.muted,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.lg,
    },
    placeholderText: {
        ...typography.body,
        color: colors.mutedForeground,
        marginTop: spacing.md,
    },
    fullscreenContainer: {
        flex: 1,
        backgroundColor: '#000000',
    },
    fullscreenImageContainer: {
        width: width,
        height: height,
        alignItems: 'center',
        justifyContent: 'center',
    },
    fullscreenImage: {
        width: width,
        height: height,
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: spacing.lg,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    fullscreenCounter: {
        position: 'absolute',
        bottom: 40,
        alignSelf: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderRadius: 24,
    },
    fullscreenCounterText: {
        ...typography.h4,
        color: '#FFFFFF',
    },
});
