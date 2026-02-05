import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '@/services/supabase';
import { Button, Input } from '../../components/ui';
import { colors, spacing, typography } from '../../utils/theme';

const ForgotPasswordScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async () => {
    setError('');

    if (!email) {
      setError('Email é obrigatório');
      return;
    }

    setLoading(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://vejaaqui.app/reset-password',
    });
    setLoading(false);

    if (err) {
      Alert.alert('Erro', err.message || 'Falha ao enviar email de reset');
    } else {
      setSuccess(true);
      Alert.alert(
        'Email Enviado',
        'Verifique seu email para instruções de reset de senha'
      );
    }
  };

  if (success) {
    return (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: colors.background,
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.xl,
          justifyContent: 'center',
        }}
      >
        <View style={{ alignItems: 'center', gap: spacing.lg }}>
          <Text
            style={{
              ...typography.h2,
              color: colors.foreground,
              textAlign: 'center',
            }}
          >
            Email Enviado
          </Text>
          <Text
            style={{
              ...typography.body,
              color: colors.mutedForeground,
              textAlign: 'center',
            }}
          >
            Verifique seu email para instruções de reset de senha
          </Text>
          <Button onPress={() => navigation.navigate('Login')}>
            Voltar ao Login
          </Button>
        </View>
      </ScrollView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: colors.background,
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.xl,
        }}
      >
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <View style={{ marginBottom: spacing.xl }}>
            <Text
              style={{
                ...typography.h1,
                color: colors.foreground,
                marginBottom: spacing.md,
              }}
            >
              Redefinir Senha
            </Text>
            <Text
              style={{
                ...typography.body,
                color: colors.mutedForeground,
              }}
            >
              Digite seu email para receber instruções de reset
            </Text>
          </View>

          <View style={{ gap: spacing.lg }}>
            <Input
              label="Email"
              placeholder="seu@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />

            <Button
              onPress={handleResetPassword}
              disabled={loading}
              style={{ marginTop: spacing.md }}
            >
              Enviar Email
            </Button>
          </View>

          <View
            style={{
              marginTop: spacing.xl,
              alignItems: 'center',
            }}
          >
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text
                style={{
                  ...typography.bodySmall,
                  color: colors.primary,
                  fontWeight: '600',
                }}
              >
                Voltar ao Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordScreen;
