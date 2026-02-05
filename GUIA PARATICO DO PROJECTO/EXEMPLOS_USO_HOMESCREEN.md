# 📚 Exemplos de Uso - HomeScreen Mobile

## 1️⃣ Usar HomeScreen no App

A HomeScreen já está integrada na navegação existente:

```typescript
// src/navigation/HomeStack.tsx
import HomeScreen from '../screens/home/HomeScreen';

// Já configurado!
<Stack.Screen
  name="HomeMain"
  component={HomeScreen}
  options={{ headerTitle: 'Home' }}
/>
```

Nenhuma alteração necessária - está 100% integrada.

---

## 2️⃣ Usar PropertyCard Individualmente

Se quiser usar o `PropertyCard` em outro lugar:

```typescript
import PropertyCard from '../../components/PropertyCard';
import { Property } from '../../types/property';

function MyComponent() {
  const property: Property = {
    id: '123',
    title: 'Apartamento moderno',
    price: 100000,
    city: 'Luanda',
    province: 'Luanda',
    bedrooms: 2,
    bathrooms: 1,
    area_sqm: 80,
    cover_image: 'https://...',
    is_featured: true,
    is_available: true,
    status: 'approved',
    property_type: 'apartment'
  };

  return (
    <PropertyCard
      property={property}
      onPress={(id) => console.log('Clicked:', id)}
      onFavoritePress={(id) => console.log('Fav toggled:', id)}
      isFavorite={false}
      size="medium"
    />
  );
}
```

---

## 3️⃣ Usar useHome Hook Independentemente

Você pode usar o hook em qualquer tela:

```typescript
import { useHome } from '../../hooks/useHome';

function MyCustomScreen() {
  const {
    featuredProperties,
    latestProperties,
    propertyTypes,
    locations,
    loading,
    error,
    refresh
  } = useHome();

  if (loading) {
    return <Text>Carregando...</Text>;
  }

  return (
    <View>
      <Text>Featured: {featuredProperties.length}</Text>
      <Text>Latest: {latestProperties.length}</Text>
      <Text>Types: {propertyTypes.length}</Text>
      
      <Button title="Refresh" onPress={refresh} />
    </View>
  );
}
```

---

## 4️⃣ Usar Services Diretamente

Se quiser chamar as queries Supabase diretamente:

```typescript
import {
  getFeaturedProperties,
  getLatestProperties,
  getPropertiesByType,
  searchProperties,
  getPropertyById
} from '../../services/properties';

async function exemplo() {
  // Buscar imóveis em destaque
  const featured = await getFeaturedProperties(10);
  console.log('Featured:', featured);

  // Buscar apartamentos
  const apartments = await getPropertiesByType('apartment', 5);
  console.log('Apartments:', apartments);

  // Buscar com filtros avançados
  const results = await searchProperties({
    query: 'luxo',
    property_type: 'apartment',
    city: 'Luanda',
    min_price: 100000,
    max_price: 500000,
    bedrooms: 3,
    limit: 20
  });
  console.log('Search results:', results);

  // Buscar um imóvel específico
  const property = await getPropertyById('prop-123');
  console.log('Property:', property);
}
```

---

## 5️⃣ Navegação com Filtros

### Do HomeScreen para SearchScreen

```typescript
const navigation = useNavigation();

// Busca simples
navigation.navigate('Search', {
  query: 'apartamento moderno'
});

// Filtro por tipo
navigation.navigate('Search', {
  filters: {
    property_type: 'apartment'
  }
});

// Filtro por localização
navigation.navigate('Search', {
  filters: {
    province: 'Luanda',
    city: 'Benilson'
  }
});

// Filtro complexo
navigation.navigate('Search', {
  query: 'T2',
  filters: {
    property_type: 'apartment',
    province: 'Luanda',
    min_price: 50000,
    max_price: 200000,
    bedrooms: 2
  }
});
```

---

## 6️⃣ Tipos Disponíveis

```typescript
// Property Type
interface Property {
  id: string;
  title: string;
  description?: string;
  property_type: 'apartment' | 'house' | 'office' | 'shop' | 'land' | 'other';
  price: number;
  rental_duration?: 'daily' | 'monthly' | 'yearly';
  city: string;
  province: string;
  address?: string;
  bedrooms?: number;
  bathrooms?: number;
  area_sqm?: number;
  cover_image?: string;
  images?: string[];
  is_featured: boolean;
  is_available: boolean;
  status: 'pending' | 'approved' | 'rejected' | 'archived';
  owner_id?: string;
  created_at?: string;
  updated_at?: string;
  amenities?: string[];
  phone?: string;
  email?: string;
}

// PropertyType
interface PropertyType {
  id: string;
  label: string;
  type: Property['property_type'];
  icon: string;
  count?: number;
}

// Location
interface Location {
  province: string;
  cities: string[];
  count?: number;
}
```

---

## 7️⃣ Tema e Cores

Adicionar cores customizadas em `src/utils/theme.ts`:

```typescript
export const colors = {
  primary: '#3B82F6',
  primaryForeground: '#FFFFFF',
  secondary: '#10B981',
  background: '#FFFFFF',
  foreground: '#1F2937',
  muted: '#F3F4F6',
  mutedForeground: '#6B7280',
  border: '#E5E7EB',
  destructive: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  info: '#3B82F6',
  // Adicione aqui
  customColor: '#yourcolor'
};
```

---

## 8️⃣ Estados de Carregamento

HomeScreen já trata:

```typescript
// Loading state
if (loading) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text>Carregando propriedades...</Text>
      </View>
    </SafeAreaView>
  );
}

// Error state
{error && (
  <View style={styles.errorContainer}>
    <MaterialCommunityIcons name="alert-circle" />
    <Text>{error}</Text>
  </View>
)}

// Empty state
{!loading && featuredProperties.length === 0 && latestProperties.length === 0 && (
  <View style={styles.emptyStateContainer}>
    <MaterialCommunityIcons name="home-search" size={48} />
    <Text>Nenhuma propriedade disponível</Text>
    <Text>Tente ajustar seus filtros</Text>
  </View>
)}
```

---

## 9️⃣ Testar Supabase Real

Verificar se dados estão sendo retornados:

```typescript
// Adicione em useHome.ts para debug
async function loadData() {
  try {
    const featured = await getFeaturedProperties(6);
    console.log('🌟 Featured Properties:', featured);
    
    const latest = await getLatestProperties(8);
    console.log('📦 Latest Properties:', latest);
    
    const types = await getPropertyTypesCounts();
    console.log('🏠 Property Types:', types);
    
    const locs = await getLocations();
    console.log('📍 Locations:', locs);
    
    // ... resto do código
  } catch (error) {
    console.error('❌ Error loading home data:', error);
  }
}
```

Verifique no console do Expo:
```
🌟 Featured Properties: Array(6) [...]
📦 Latest Properties: Array(8) [...]
🏠 Property Types: Array(5) [...]
📍 Locations: Array(18) [...]
```

---

## 🔟 Favoritos (Estrutura Pronta)

Atualmente os favoritos são gerenciados localmente com `Set<string>`:

```typescript
const [favorites, setFavorites] = React.useState<Set<string>>(new Set());

const handleFavoritePress = (propertyId: string) => {
  setFavorites((prev) => {
    const newFavorites = new Set(prev);
    if (newFavorites.has(propertyId)) {
      newFavorites.delete(propertyId);
    } else {
      newFavorites.add(propertyId);
    }
    return newFavorites;
  });
};
```

**Para persistência no Supabase (futura):**

```typescript
// Criar tabela: favorites
// Columns: id, user_id, property_id, created_at

async function toggleFavorite(propertyId: string) {
  if (favorites.has(propertyId)) {
    // DELETE
    await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('property_id', propertyId);
  } else {
    // INSERT
    await supabase
      .from('favorites')
      .insert({ user_id: user.id, property_id: propertyId });
  }
}
```

---

## 1️⃣1️⃣ Pull-to-Refresh

HomeScreen inclui `RefreshControl`:

```typescript
<ScrollView
  refreshControl={
    <RefreshControl 
      refreshing={refreshing} 
      onRefresh={refresh} 
    />
  }
>
  {/* Conteúdo */}
</ScrollView>
```

**Para customizar cores:**

```typescript
<RefreshControl
  refreshing={refreshing}
  onRefresh={refresh}
  tintColor={colors.primary}
  progressBackgroundColor={colors.muted}
  progressViewOffset={0}
/>
```

---

## 1️⃣2️⃣ Exemplos Completos

### Exemplo 1: Filtrar por Tipo
```typescript
import { getPropertiesByType } from '../../services/properties';

async function carregarApartamentos() {
  const apts = await getPropertiesByType('apartment', 10);
  console.log('Apartamentos:', apts);
  // → Property[]
}
```

### Exemplo 2: Buscar em Luanda
```typescript
import { getPropertiesByCity } from '../../services/properties';

async function carregarEmLuanda() {
  const props = await getPropertiesByCity('Luanda', 20);
  console.log('Luanda properties:', props);
  // → Property[]
}
```

### Exemplo 3: Busca Avançada
```typescript
import { searchProperties } from '../../services/properties';

async function buscarT2Moderno() {
  const results = await searchProperties({
    query: 'T2 moderno',
    property_type: 'apartment',
    city: 'Luanda',
    min_price: 80000,
    max_price: 250000,
    bedrooms: 2,
    limit: 15
  });
  console.log('Results:', results);
  // → Property[]
}
```

### Exemplo 4: Render Dinâmico
```typescript
function MeuCard({ propertyId }: { propertyId: string }) {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPropertyById(propertyId).then(prop => {
      setProperty(prop);
      setLoading(false);
    });
  }, [propertyId]);

  if (loading) return <ActivityIndicator />;
  if (!property) return <Text>Propriedade não encontrada</Text>;

  return <PropertyCard property={property} onPress={() => {}} />;
}
```

---

## 📞 Suporte

### Erros Comuns

| Erro | Solução |
|------|---------|
| "Cannot find module" | Verifique paths relativos (../../) |
| "Property undefined" | Dados não carregaram - check Supabase |
| "Image won't load" | URL inválida ou sem internet |
| "Navigation not found" | Route name errado ou não definida |
| "Hook can't be called" | useHome() só em screens/components |

---

**Implementado com:** React Native + Expo + Supabase + TypeScript
**Padrão de Código:** Service → Hook → Component → Screen
**Status:** ✅ Production Ready
