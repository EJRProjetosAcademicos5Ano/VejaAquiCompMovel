import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, typography } from '@/utils/theme';

const ComingSoonScreen = ({ route }: any) => {
    const navigation = useNavigation();
    const title = route.name || 'Em Breve';

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>Esta funcionalidade está em desenvolvimento.</Text>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.button}>
                <Text style={styles.buttonText}>Voltar</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
        padding: 20,
    },
    title: {
        ...typography.h2,
        color: colors.primary,
        marginBottom: 10,
    },
    subtitle: {
        ...typography.body,
        color: colors.mutedForeground,
        marginBottom: 20,
        textAlign: 'center',
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: colors.primary,
        borderRadius: 8,
    },
    buttonText: {
        color: colors.primaryForeground,
        fontWeight: 'bold',
    },
});

export default ComingSoonScreen;
