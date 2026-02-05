import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { colors, spacing } from '../../utils/theme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/AuthStack';

type Props = NativeStackScreenProps<AuthStackParamList, 'AccountType'>;

export default function AccountTypeScreen({ navigation }: Props) {
  const handleSelectType = (accountType: 'arrendatario' | 'proprietario') => {
    navigation.navigate('Register', { accountType });
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Qual é o seu perfil?</Text>
          <Text style={styles.subtitle}>
            Escolha como deseja usar a plataforma
          </Text>

          {/* Arrendatário Card */}
          <TouchableOpacity
            style={[styles.card, { borderColor: colors.primary }]}
            activeOpacity={0.7}
            onPress={() => handleSelectType('arrendatario')}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>🔍</Text>
              <Text style={styles.cardTitle}>Sou Arrendatário</Text>
            </View>
            <Text style={styles.cardDescription}>
              Procuro imóvel para arrendar
            </Text>
            <View style={styles.featuresList}>
              <Text style={styles.feature}>✓ Buscar imóveis</Text>
              <Text style={styles.feature}>✓ Favoritos e histórico</Text>
              <Text style={styles.feature}>✓ Agendar visitas</Text>
              <Text style={styles.feature}>✓ Fazer reservas</Text>
            </View>
            <View style={[styles.selectButton, { backgroundColor: colors.primary }]}>
              <Text style={styles.selectButtonText}>Continuar</Text>
            </View>
          </TouchableOpacity>

          {/* Proprietário Card */}
          <TouchableOpacity
            style={[styles.card, { borderColor: colors.muted }]}
            activeOpacity={0.7}
            onPress={() => handleSelectType('proprietario')}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>🏠</Text>
              <Text style={styles.cardTitle}>Sou Proprietário</Text>
            </View>
            <Text style={styles.cardDescription}>
              Quero anunciar meu imóvel
            </Text>
            <View style={styles.featuresList}>
              <Text style={styles.feature}>✓ Painel de gestão</Text>
              <Text style={styles.feature}>✓ Upload de imagens</Text>
              <Text style={styles.feature}>✓ Gestão de calendário</Text>
              <Text style={styles.feature}>✓ Comunicação com interessados</Text>
            </View>
            <View style={[styles.selectButton, { backgroundColor: colors.muted }]}>
              <Text style={[styles.selectButtonText, { color: colors.foreground }]}>
                Continuar
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.foreground,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.mutedForeground,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  card: {
    borderWidth: 2,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    backgroundColor: colors.muted,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardIcon: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.foreground,
    flex: 1,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.mutedForeground,
    marginBottom: spacing.md,
  },
  featuresList: {
    marginBottom: spacing.md,
  },
  feature: {
    fontSize: 13,
    color: colors.foreground,
    marginBottom: spacing.xs,
    lineHeight: 20,
  },
  selectButton: {
    paddingVertical: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectButtonText: {
    color: colors.primaryForeground,
    fontWeight: '600',
    fontSize: 14,
  },
  backButton: {
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  backButtonText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
});
