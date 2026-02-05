import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { useUnreadMessages } from '@/hooks/useUnreadMessages';
import { MobileMenu } from './MobileMenu';
import { colors, spacing, typography } from '@/utils/theme';

export default function Header() {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const { unreadCount } = useUnreadMessages();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.left}
          onPress={() => navigation.navigate('HomeTab')}
          activeOpacity={0.7}
        >
          <View style={styles.logoBox}>
            <MaterialCommunityIcons name="office-building" size={20} color="#fff" />
          </View>
          <Text style={styles.title}>VejaAquí</Text>
        </TouchableOpacity>

        <View style={styles.right}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate('SearchTab')}
          >
            <Ionicons name="search" size={22} color={colors.foreground} />
          </TouchableOpacity>

          {user && (
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => navigation.navigate('ProfileTab')}
            >
              <Ionicons name="chatbubble-ellipses-outline" size={22} color={colors.foreground} />
              {unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}

          {user && (
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => navigation.navigate('PublishTab')}
            >
              <Ionicons name="add-circle-outline" size={24} color={colors.primary} />
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.menuBtn} onPress={() => setMenuOpen(true)}>
            <Ionicons name="menu" size={28} color={colors.foreground} />
          </TouchableOpacity>
        </View>
      </View>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { backgroundColor: '#fff' },
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eaeaea',
    backgroundColor: '#fff',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#0ea5a5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: '700',
    color: colors.foreground,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    padding: 8,
    marginHorizontal: 4,
  },
  menuBtn: {
    padding: 8,
    marginLeft: spacing.xs,
  },
  badge: {
    position: 'absolute',
    right: 2,
    top: 2,
    backgroundColor: colors.destructive,
    borderRadius: 10,
    paddingHorizontal: 4,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: colors.primaryForeground,
    fontSize: 10,
    fontWeight: '700',
  },
});