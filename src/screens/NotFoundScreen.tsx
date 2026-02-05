import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Button } from '../components/ui';
import { colors, spacing, typography } from '../utils/theme';

const NotFoundScreen = ({ navigation }: any) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
        paddingHorizontal: spacing.lg,
      }}
    >
      <MaterialIcons name="error-outline" size={64} color={colors.destructive} />
      <Text
        style={{
          ...typography.h2,
          color: colors.foreground,
          marginTop: spacing.lg,
          marginBottom: spacing.md,
          textAlign: 'center',
        }}
      >
        Página Não Encontrada
      </Text>
      <Text
        style={{
          ...typography.body,
          color: colors.mutedForeground,
          marginBottom: spacing.xl,
          textAlign: 'center',
        }}
      >
        Desculpe, a página que você procura não existe.
      </Text>
      <Button onPress={() => navigation.goBack()}>
        Voltar
      </Button>
    </View>
  );
};

export default NotFoundScreen;
