import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing } from '../../utils/theme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/AuthStack';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export default function RegisterScreen({ navigation, route }: Props) {
  const { signUp, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');

  const accountType = route.params?.accountType || 'arrendatario';
  const isOwner = accountType === 'proprietario';

  const handleRegister = async () => {
    if (!name.trim()) {
      Alert.alert('Erro', 'Por favor, preencha seu nome');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Erro', 'Por favor, preencha seu email');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Erro', 'Por favor, preencha uma senha');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      console.log('Iniciando registro com:', { email, accountType, name });
      await signUp(email, password, accountType, name);
      console.log('Registro concluído com sucesso');
      
      // Mostrar mensagem de sucesso e permitir que a navegação automática aconteça
      Alert.alert(
        'Sucesso!', 
        `Conta de ${accountType === 'proprietario' ? 'proprietário' : 'arrendatário'} criada com sucesso!\n\nSerá redirecionado em breve...`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Não fazer nada, deixar a navegação automática acontecer
            }
          }
        ]
      );
    } catch (error: any) {
      console.error('Erro no registro:', error);
      Alert.alert('Erro ao registrar', error.message || 'Tente novamente');
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Text style={styles.title}>
              {isOwner ? 'Criar Conta de Proprietário' : 'Criar Conta'}
            </Text>
            <Text style={styles.subtitle}>
              {isOwner ? 'Comece a anunciar seu imóvel' : 'Junte-se à nossa comunidade'}
            </Text>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nome</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Seu nome completo"
                  placeholderTextColor={colors.mutedForeground}
                  autoCapitalize="words"
                  autoCorrect={false}
                  editable={!isLoading}
                  value={name}
                  onChangeText={setName}
                  testID="name-input"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="seu@email.com"
                  placeholderTextColor={colors.mutedForeground}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                  value={email}
                  onChangeText={setEmail}
                  testID="email-input"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Senha</Text>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor={colors.mutedForeground}
                  secureTextEntry={true}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                  value={password}
                  onChangeText={setPassword}
                  testID="password-input"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirmar Senha</Text>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor={colors.mutedForeground}
                  secureTextEntry={true}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  testID="confirm-password-input"
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    backgroundColor: colors.primary,
                    opacity: isLoading ? 0.6 : 1,
                  },
                ]}
                onPress={handleRegister}
                disabled={isLoading || !name.trim() || !email.trim() || !password.trim()}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? 'Criando conta...' : 'Criar Conta'}
                </Text>
              </TouchableOpacity>

              <View style={styles.loginLink}>
                <Text style={styles.loginText}>Já tem conta? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={[styles.loginText, styles.loginLinkText]}>Faça login</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.backLink}
                onPress={() => navigation.navigate('AccountType')}
              >
                <Text style={styles.backLinkText}>← Voltar à seleção de tipo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.foreground,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: colors.mutedForeground,
    marginBottom: spacing.xl,
  },
  form: {
    gap: spacing.md,
  },
  inputGroup: {
    gap: spacing.sm,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.foreground,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.muted,
    fontSize: 16,
    color: colors.foreground,
  },
  placeholder: {
    color: colors.mutedForeground,
  },
  button: {
    paddingVertical: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  buttonText: {
    color: colors.primaryForeground,
    fontWeight: '600',
    fontSize: 16,
  },
  loginLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  loginText: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  loginLinkText: {
    color: colors.primary,
    fontWeight: '600',
  },
  backLink: {
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  backLinkText: {
    color: colors.mutedForeground,
    fontWeight: '500',
    fontSize: 14,
  },
});
