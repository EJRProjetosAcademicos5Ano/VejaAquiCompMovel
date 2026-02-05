import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import { useVisits } from '../hooks/useVisits';
import { supabase } from '../services/supabase';
import { getSavedSearches, deleteSavedSearch, SavedSearch } from '../services/savedSearches';
import { getViewHistory } from '../services/history';
import { getUserBookings, Booking } from '../services/bookings';
import { getUserVisits, Visit } from '../services/visits';
import { colors, spacing, typography } from '../utils/theme';
import { useSearchFilters } from '../hooks/useSearchFilters';


type Profile = {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  account_type: 'proprietario' | 'arrendatario' | null;
  is_premium: boolean | null;
};

const Tab = createMaterialTopTabNavigator();

/* ===========================
   MAIN SCREEN
=========================== */
export default function ProfileScreen() {
  const { user, isLoading: authLoading } = useAuth();
  const navigation = useNavigation();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    account_type: 'arrendatario' as 'proprietario' | 'arrendatario',
  });

  /* Redirect if not logged */
  useEffect(() => {
    if (!authLoading && !user) {
      navigation.navigate('Auth' as never);
    }
  }, [user, authLoading]);

  /* Fetch profile */
  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        Alert.alert('Erro', 'Falha ao carregar perfil');
        return;
      }

      if (data) {
        setProfile(data);
        setFormData({
          full_name: data.full_name || '',
          phone: data.phone || '',
          account_type: data.account_type || 'arrendatario',
        });
      }
      setLoading(false);
    };

    loadProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update(formData)
      .eq('user_id', user.id);

    setSaving(false);

    if (error) {
      Alert.alert('Erro', 'Não foi possível salvar');
    } else {
      Alert.alert('Sucesso', 'Perfil atualizado');
    }
  };

  if (authLoading || loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.settingsBtn}
          onPress={() => navigation.navigate('Settings' as never)}
        >
          <Ionicons name="settings-outline" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(formData.full_name || user?.email || 'U')
              .slice(0, 2)
              .toUpperCase()}
          </Text>
        </View>

        <Text style={styles.name}>
          {formData.full_name || 'Meu Perfil'}
        </Text>
        <Text style={styles.email}>{user?.email}</Text>

        {/* ADMIN BUTTON */}
        {user?.role === 'admin' && (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#F59E0B', marginTop: 12 }]}
            onPress={() => navigation.navigate('AdminMode' as never)}
          >
            <Ionicons name="shield-checkmark" size={18} color="#fff" />
            <Text style={styles.buttonText}>Painel Administrativo</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* TABS */}
      <Tab.Navigator>
        <Tab.Screen name="Perfil">
          {() => (
            <ScrollView contentContainerStyle={styles.container}>
              <Text style={styles.label}>Nome Completo</Text>
              <TextInput
                style={styles.input}
                value={formData.full_name}
                onChangeText={(v) =>
                  setFormData({ ...formData, full_name: v })
                }
              />

              <Text style={styles.label}>Telefone</Text>
              <TextInput
                style={styles.input}
                keyboardType="phone-pad"
                value={formData.phone}
                onChangeText={(v) =>
                  setFormData({ ...formData, phone: v })
                }
              />

              <TouchableOpacity
                style={styles.button}
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons name="save-outline" size={18} color="#fff" />
                    <Text style={styles.buttonText}>Guardar</Text>
                  </>
                )}
              </TouchableOpacity>
            </ScrollView>
          )}
        </Tab.Screen>

        <Tab.Screen name="Visitas">
          {() => <VisitsTab userId={user!.id} />}
        </Tab.Screen>

        <Tab.Screen name="Reservas">
          {() => <BookingsTab userId={user!.id} />}
        </Tab.Screen>

        <Tab.Screen name="Histórico">
          {() => <HistoryTab userId={user!.id} />}
        </Tab.Screen>

        <Tab.Screen name="Buscas">
          {() => <SavedSearchesTab userId={user!.id} />}
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  );
}

/* ===========================
   VISITS TAB (MOBILE ENHANCED)
=========================== */
function VisitsTab({ userId }: { userId: string }) {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVisits();
  }, []);

  const loadVisits = async () => {
    const data = await getUserVisits(userId);
    setVisits(data);
    setLoading(false);
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 20 }} />;

  if (visits.length === 0) {
    return (
      <View style={styles.center}>
        <Ionicons name="calendar-outline" size={48} color="#CBD5E1" />
        <Text style={{ color: '#64748B', marginTop: 12 }}>Nenhuma visita agendada</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {visits.map((visit) => (
        <View key={visit.id} style={styles.card}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Text style={styles.cardTitle}>
              {visit.properties?.title || visit.property?.title || 'Propriedade'}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(visit.status) }]}>
              <Text style={styles.statusText}>{visit.status.toUpperCase()}</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Ionicons name="calendar-outline" size={14} color="#64748B" />
            <Text style={{ fontSize: 13, color: '#64748B' }}>
              {new Date(visit.visit_date).toLocaleDateString()} às {new Date(visit.visit_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

/* ===========================
   BOOKINGS TAB
=========================== */
function BookingsTab({ userId }: { userId: string }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    const data = await getUserBookings(userId);
    setBookings(data);
    setLoading(false);
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 20 }} />;

  if (bookings.length === 0) {
    return (
      <View style={styles.center}>
        <Ionicons name="flash-outline" size={48} color="#CBD5E1" />
        <Text style={{ color: '#64748B', marginTop: 12 }}>Nenhuma reserva realizada</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {bookings.map((booking) => (
        <View key={booking.id} style={styles.card}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Text style={styles.cardTitle}>
              {booking.properties?.title || booking.property?.title || 'Propriedade'}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: '#10B981' }]}>
              <Text style={styles.statusText}>{booking.status.toUpperCase()}</Text>
            </View>
          </View>

          <Text style={{ fontSize: 13, color: '#64748B', marginBottom: 4 }}>
            Total: {booking.total_price.toLocaleString('pt-BR')} MT
          </Text>
          <Text style={{ fontSize: 11, color: '#94A3B8' }}>
            Reservado em: {new Date(booking.created_at).toLocaleDateString()}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

/* ===========================
   HISTORY TAB
=========================== */
function HistoryTab({ userId }: { userId: string }) {
  const navigation = useNavigation<any>();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const data = await getViewHistory(userId);
    setHistory(data);
    setLoading(false);
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 20 }} />;

  if (history.length === 0) {
    return (
      <View style={styles.center}>
        <Ionicons name="eye-outline" size={48} color="#CBD5E1" />
        <Text style={{ color: '#64748B', marginTop: 12 }}>Histórico vazio</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {history.map((property) => (
        <TouchableOpacity
          key={property.id}
          style={styles.card}
          onPress={() => navigation.navigate('PropertyDetail', { propertyId: property.id })}
        >
          <Text style={styles.cardTitle}>{property.title}</Text>
          <Text style={{ fontSize: 13, color: '#64748B' }}>
            {property.city}, {property.province}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmada': return '#10B981';
    case 'cancelada': return '#EF4444';
    case 'concluida': return '#6366F1';
    default: return '#F59E0B';
  }
};

/* ===========================
   STYLES
=========================== */
const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#0284C7',
    position: 'relative',
  },
  settingsBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0284C7',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  email: {
    color: '#E0F2FE',
  },
  container: {
    padding: 16,
  },
  label: {
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  button: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#0284C7',
    padding: 14,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  cardTitle: {
    fontWeight: '700',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
});

/* ===========================
   SAVED SEARCHES TAB
=========================== */
function SavedSearchesTab({ userId }: { userId: string }) {
  const navigation = useNavigation<any>();
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSearches();
  }, []);

  const loadSearches = async () => {
    const data = await getSavedSearches(userId);
    setSearches(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const result = await deleteSavedSearch(id);
    if (result.success) {
      setSearches(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleApply = (filters: any) => {
    navigation.navigate('Search', { savedFilters: filters });
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 20 }} />;

  if (searches.length === 0) {
    return (
      <View style={styles.center}>
        <Ionicons name="search-outline" size={48} color="#CBD5E1" />
        <Text style={{ color: '#64748B', marginTop: 12 }}>Nenhuma busca salva</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {searches.map(search => (
        <View key={search.id} style={styles.card}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => handleApply(search.filters)}>
              <Text style={styles.cardTitle}>{search.name}</Text>
              <Text style={{ fontSize: 12, color: '#64748B' }}>
                {new Date(search.created_at).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(search.id)}>
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
