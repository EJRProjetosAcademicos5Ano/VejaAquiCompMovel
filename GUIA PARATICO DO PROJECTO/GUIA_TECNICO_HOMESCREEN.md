# 🏠 HomeScreen Mobile - Guia Técnico Rápido

## Estrutura de Arquivos Criados

```
src/
├── types/
│   └── property.ts .......................... ✅ Interfaces Property, PropertyType, Location
│
├── services/
│   └── properties.ts ........................ ✅ 9 funções Supabase (Featured, Latest, Search, etc)
│
├── hooks/
│   └── useHome.ts ........................... ✅ Custom Hook + State Management
│
├── components/
│   ├── PropertyCard.tsx ..................... ✅ Componente Card reutilizável
│   └── index.ts ............................ ✅ Exports centralizados
│
└── screens/
    ├── home/
    │   └── HomeScreen.tsx ................... ✅ REWRITTEN - Completa com 6 seções
    └── search/
        └── SearchScreen.tsx ................ ✅ UPDATED - Integração Supabase + filtros
```

---

## 🔄 Data Flow (HomeScreen)

```
RootNavigator
    ↓
BottomTabs (MainApp)
    ↓
HomeStack
    ↓
HomeScreen (default: HomeMain)
    ├── useHome() Hook
    │   ├── getFeaturedProperties() ←→ Supabase
    │   ├── getLatestProperties() ←→ Supabase
    │   ├── getPropertyTypesCounts() ←→ Supabase
    │   └── getLocations() ←→ Supabase
    │
    ├── State:
    │   ├── featuredProperties: Property[]
    │   ├── latestProperties: Property[]
    │   ├── propertyTypes: PropertyType[]
    │   ├── locations: Location[]
    │   ├── loading: boolean
    │   └── favorites: Set<string>
    │
    └── Renders 6 Sections:
        ├── SearchHeader
        ├── PropertyTypes (FlatList horizontal)
        ├── FeaturedProperties (vertical)
        ├── LatestProperties (FlatList horizontal)
        ├── Locations (FlatList horizontal)
        └── PremiumCTA
```

---

## 🎨 Component Tree (HomeScreen)

```
SafeAreaView
│
└── ScrollView (RefreshControl)
    │
    ├── View [HeroSection]
    │   ├── Text "Encontre o seu imóvel"
    │   └── View [SearchContainer]
    │       ├── TextInput (query)
    │       └── Pressable (submit button)
    │
    ├── View [PropertyTypes Section]
    │   └── FlatList (horizontal)
    │       └── PropertyType Card × 5
    │           ├── Icon
    │           ├── Label
    │           └── Count
    │
    ├── View [FeaturedProperties Section] (if > 0)
    │   └── PropertyCard × N (vertical)
    │       ├── Image
    │       ├── Badge
    │       ├── Favorite Button
    │       ├── Title
    │       ├── Location
    │       ├── Price
    │       └── Features (bed, bath, m²)
    │
    ├── View [LatestProperties Section] (if > 0)
    │   └── FlatList (horizontal)
    │       └── PropertyCard × N (small)
    │
    ├── View [Locations Section] (if > 0)
    │   └── FlatList (horizontal)
    │       └── LocationCard × N
    │           ├── Icon
    │           ├── Province Name
    │           └── Cities Count
    │
    ├── Pressable [PremiumCTA]
    │   ├── Icon (crown)
    │   ├── Title & Description
    │   └── Arrow Icon
    │
    └── View [ErrorContainer | EmptyState]
```

---

## 📊 Supabase Query Examples

```typescript
// Featured Properties
const { data } = await supabase
  .from('properties')
  .select('*')
  .eq('is_featured', true)
  .eq('is_available', true)
  .eq('status', 'approved')
  .order('created_at', { ascending: false })
  .limit(6);

// Latest Properties
const { data } = await supabase
  .from('properties')
  .select('*')
  .eq('is_available', true)
  .eq('status', 'approved')
  .order('created_at', { ascending: false })
  .limit(8);

// Search with Filters
const { data } = await supabase
  .from('properties')
  .select('*')
  .eq('property_type', 'apartment')
  .eq('city', 'Luanda')
  .gte('price', 50000)
  .lte('price', 500000)
  .ilike('title', '%luxury%')
  .eq('is_available', true)
  .eq('status', 'approved')
  .limit(20);
```

---

## 🎯 Pontos de Entrada Principais

### HomeScreen
- **Props:** navigation (auto injetado)
- **Hook:** useHome() para dados
- **Navegações:**
  - `navigate('PropertyDetail', { propertyId })`
  - `navigate('Search', { query, filters })`
  - `navigate('Premium')`

### SearchScreen
- **Route Params:** 
  - `query?: string`
  - `filters?: { property_type?, city?, province?, ... }`
- **Função:** `searchProperties(filters)`
- **Navegação:**
  - `navigate('PropertyDetail', { propertyId })`

### PropertyCard
- **Props:**
  - `property: Property`
  - `onPress: (propertyId) => void`
  - `onFavoritePress?: (propertyId) => void`
  - `isFavorite?: boolean`
  - `size?: 'small' | 'medium' | 'large'`
  - `horizontal?: boolean`

---

## 🔌 Hooks & Custom Hooks

### useHome()
```typescript
const {
  featuredProperties,     // Property[]
  latestProperties,       // Property[]
  propertyTypes,          // PropertyType[] with counts
  locations,              // Location[] with cities
  loading,                // boolean
  error,                  // string | null
  refreshing,             // boolean
  loadData,               // () => Promise<void>
  refresh                 // () => Promise<void>
} = useHome();
```

### useAuth() (Existing)
```typescript
const {
  user,                   // User | null
  signIn,
  signOut,
  signUp,
  isLoading
} = useAuth();
```

---

## 🎨 Styling System

### Colors
```typescript
colors.primary              // #3B82F6
colors.primaryForeground    // #FFFFFF
colors.background           // #FFFFFF
colors.foreground           // #1F2937
colors.muted               // #F3F4F6
colors.mutedForeground     // #6B7280
colors.border              // #E5E7EB
colors.destructive         // #EF4444
```

### Spacing
```typescript
spacing.xs   // 4
spacing.sm   // 8
spacing.md   // 12
spacing.lg   // 16
spacing.xl   // 24
spacing['2xl'] // 32
```

### Typography
```typescript
typography.h1  // { fontSize: 32, fontWeight: 'bold' }
typography.h2  // { fontSize: 28, fontWeight: 'bold' }
typography.h3  // { fontSize: 24, fontWeight: 'bold' }
typography.h4  // { fontSize: 20, fontWeight: '600' }
typography.body // { fontSize: 16, fontWeight: '400' }
```

---

## 🧪 Testando Localmente

### 1. Verificar Dados Supabase
```bash
# No projeto Expo, adicione console.logs
useEffect(() => {
  console.log('Featured:', featuredProperties);
  console.log('Latest:', latestProperties);
}, [featuredProperties, latestProperties]);
```

### 2. Testar cada Seção
- **Hero:** Digite algo e pressione seta
- **Types:** Toque em Apartamento
- **Featured:** Scroll down
- **Latest:** Scroll right
- **Locations:** Toque em Luanda
- **Premium:** Toque no CTA

### 3. Testar Navegação
```bash
npx expo start -c
# Scan QR code com Expo Go
# Toque em propriedades → PropertyDetail
```

### 4. Testar Refresh
- Drag down no ScrollView
- Deve recarregar dados

---

## 🚨 Troubleshooting

### "Cannot find module PropertyCard"
```bash
# Certifique-se que está importando corretamente:
import PropertyCard from '../../components/PropertyCard';
```

### "Supabase query returns empty"
```bash
# Verifique:
1. Conexão Supabase (test em supabase.ts)
2. Tabela 'properties' existe
3. Dados têm status='approved', is_available=true
4. Network request em Network tab
```

### "Images não carregam"
```bash
# PropertyCard image:
// Certifique-se que cover_image é válida URL
// ou use placeholder: https://via.placeholder.com/300x200
```

---

## 📝 Resumo de Mudanças

| Arquivo | Tipo | Descrição |
|---------|------|-----------|
| `property.ts` | ✅ Created | 3 interfaces (Property, PropertyType, Location) |
| `properties.ts` | ✅ Created | 9 serviços Supabase |
| `useHome.ts` | ✅ Created | Custom hook com state management |
| `PropertyCard.tsx` | ✅ Created | Componente card reutilizável |
| `components/index.ts` | ✅ Updated | Exports PropertyCard |
| `HomeScreen.tsx` | ✅ Rewritten | 6 seções, ScrollView, integração completa |
| `SearchScreen.tsx` | ✅ Updated | Supabase real, filtros, PropertyCard |

**Total de linhas:** ~2000+
**Componentes:** 2 (PropertyCard, HomeScreen)
**Services:** 9 funções Supabase
**Hooks:** 1 (useHome)
**Tipos:** 3 interfaces

---

## 🎓 Arquitetura Padrão

```
Screen (React Navigation)
  ↓
Custom Hook (State + Data Fetching)
  ↓
Service Layer (Supabase Queries)
  ↓
Components (UI Elements)
  ↓
Theme System (Colors, Spacing, Typography)
```

Este padrão garante:
- ✅ Separation of concerns
- ✅ Reutilização de código
- ✅ Fácil testabilidade
- ✅ Escalabilidade
- ✅ Manutenibilidade

---

*Status:* 🟢 **PRODUÇÃO READY**
