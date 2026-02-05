# 🎬 FLUXO VISUAL DE NAVEGAÇÃO

## Mapa Mental Completo

```
┌─────────────────────────────────────────────────────────────┐
│                     APP.TSX                                 │
│  GestureHandlerRootView                                     │
│  └─ NavigationContainer                                     │
│     └─ AuthProvider                                         │
│        └─ RootNavigator                                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Lê: user do AuthContext
                     │
              ┌──────┴──────┐
              │             │
        user = null     user ≠ null
              │             │
              ▼             ▼
        ┌─────────┐     ┌────────────┐
        │ AuthStack   │ BottomTabs  │
        └─────┬───┘     └─────┬──────┘
              │               │
        ┌─────┴─────┐    ┌────┴────────────────┐
        │           │    │    │    │    │      │
        │  LOGIN    │    │ H  S  P  F  │      │
        │           │    │ o  e  u  a  │      │
        │ REGISTER  │    │ m  a  b  v  │      │
        └───────────┘    │ e  r  l  o  │      │
                         │ S  c  i  r  │      │
                         │ t  h  s  i  │      │
                         │ a  S  h  t  │      │
                         │ c  c  S  e  │      │
                         │ k  r  t  S  │      │
                         │    e  a  c  │      │
                         │    e  c  r  │      │
                         │    n  k  e  │      │
                         │          e  │      │
                         │          n  │      │
                         └────────────────────┘
```

---

## Fluxo de Autenticação

```
USUÁRIO NÃO AUTENTICADO
│
├─ RootNavigator renderiza AuthStack
│
├─ AuthStack mostra:
│  ├─ LoginScreen (padrão)
│  └─ RegisterScreen (após clique)
│
├─ Usuário clica "Sign In"
│
├─ Callback signIn() do AuthContext
│
├─ user atualizado para { id: "1", name: "User Teste" }
│
├─ RootNavigator detecta mudança
│
└─ RootNavigator renderiza BottomTabs ✅

        USUÁRIO AUTENTICADO (BottomTabs)
        │
        └─ 4 Abas:
           ├─ 🏠 HomeTab
           │   └─ HomeStack
           │       ├─ HomeScreen
           │       └─ PropertyDetailScreen
           │
           ├─ 🔍 SearchTab
           │   └─ SearchStack
           │       └─ SearchScreen
           │
           ├─ ➕ PublishTab
           │   └─ PublishStack
           │       └─ PublishScreen
           │
           └─ 👤 ProfileTab
               └─ ProfileStack
                   └─ ProfileScreen
```

---

## Fluxo de Logout

```
USUÁRIO CLICA LOGOUT (em Profile ou Home)
│
├─ Callback signOut() do AuthContext
│
├─ user = null
│
├─ RootNavigator detecta mudança
│
└─ RootNavigator renderiza AuthStack novamente ✅
   └─ LoginScreen é exibida
      (volta ao início do fluxo)
```

---

## Fluxo de Navegação entre Abas

```
HomeTab (🏠) → [user clica SearchTab] → SearchTab (🔍)
│                                       │
├─ HomeStack ativo                      ├─ SearchStack ativo
│ └─ HomeScreen renderizado             │ └─ SearchScreen renderizado
│                                       │
├─ Histórico preservado                 ├─ Novo histórico
│ (volta voltar, volta para Home)       │ (independente)
│
[volta para HomeTab] → HomeStack reativado ✅
└─ Mesma posição anterior (cache)
```

---

## Estrutura de Cada Stack

### HomeStack
```
HomeStack Navigator
├─ Screen: HomeMain
│  └─ HomeScreen
│     ├─ Lista propriedades
│     ├─ useNavigation para navigate('PropertyDetail')
│     └─ Logout button
│
└─ Screen: PropertyDetail (params: { propertyId })
   └─ PropertyDetailScreen
      ├─ Detalhes do imóvel
      └─ Botão voltar automático
```

### SearchStack
```
SearchStack Navigator
├─ Screen: SearchMain
   └─ SearchScreen
      ├─ Barra de busca
      ├─ Filtro resultados
      └─ Lista dinâmica
```

### PublishStack
```
PublishStack Navigator
├─ Screen: PublishMain
   └─ PublishScreen
      ├─ Formulário
      ├─ Campos: Title, Description, Price, Location
      └─ Botão Publish
```

### ProfileStack
```
ProfileStack Navigator
├─ Screen: ProfileMain
   └─ ProfileScreen
      ├─ Avatar + Nome
      ├─ Email + Phone
      └─ Logout button
```

---

## Hierarquia de Contexto

```
┌─────────────────────────────────────┐
│      AuthProvider                   │
│  (AuthContext.Provider)             │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  Valor:                      │  │
│  │  {                           │  │
│  │    user: null | { id, name }│  │
│  │    signIn: async function    │  │
│  │    signUp: async function    │  │
│  │    signOut: async function   │  │
│  │    isLoading: boolean        │  │
│  │  }                           │  │
│  │                              │  │
│  │  Uso: const { user } = useAuth()
│  │                              │  │
│  └──────────────────────────────┘  │
│                                     │
│  Acessível em TODAS as screens!    │
│                                     │
└─────────────────────────────────────┘
```

---

## Fluxo de Renderização

### Primeira Renderização
```
1. App monta
   └─ AuthProvider inicializa
      └─ user = null (padrão)

2. RootNavigator renderiza
   └─ Vê user = null
   └─ Renderiza AuthStack

3. AuthStack renderiza
   └─ LoginScreen exibida ao usuário
```

### Após Login
```
1. Usuário clica "Sign In"
   └─ signIn() chamado

2. AuthContext atualiza
   └─ user = { id: "1", name: "User Teste" }

3. RootNavigator re-renderiza
   └─ Vê user ≠ null
   └─ Renderiza BottomTabs (MainApp)

4. BottomTabs renderiza
   └─ 4 abas com HomeTab ativo
   └─ HomeScreen exibida ao usuário
```

### Mudança de Aba
```
1. Usuário clica ícone SearchTab (🔍)

2. BottomTabs renderiza SearchStack
   └─ SearchScreen é exibida

3. HomeStack histórico é preservado
   └─ Volta para HomeTab = volta ao mesmo estado

4. Cada aba = próprio navigator
   └─ Histórico independente
```

### Logout
```
1. Usuário clica "Logout"
   └─ signOut() chamado

2. AuthContext atualiza
   └─ user = null

3. RootNavigator re-renderiza
   └─ Vê user = null
   └─ Renderiza AuthStack novamente

4. LoginScreen exibida
   └─ Volta ao início
```

---

## Diagrama de Componentes

```
┌─────────────────────────────────────────┐
│            App Component                │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│      GestureHandlerRootView             │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│         AuthProvider                    │
│  Fornece: user, signIn, signOut, etc    │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│      NavigationContainer                │
│  (React Navigation setup)               │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│        RootNavigator                    │
│  if (user === null)                     │
│    ├─ AuthStack                         │
│    │  ├─ LoginScreen                    │
│    │  └─ RegisterScreen                 │
│  else                                   │
│    └─ BottomTabs                        │
│       ├─ HomeStack → HomeScreen         │
│       ├─ SearchStack → SearchScreen     │
│       ├─ PublishStack → PublishScreen   │
│       └─ ProfileStack → ProfileScreen   │
└─────────────────────────────────────────┘
```

---

## Exemplo de Uso em Screen

```typescript
// Qualquer screen dentro do contexto:

import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function MyScreen() {
  const { user, signOut } = useAuth();
  const navigation = useNavigation();

  const handleLogout = async () => {
    await signOut();
    // RootNavigator muda automaticamente!
  };

  const handleNavigate = () => {
    // Type-safe navigation
    (navigation as any).navigate('PropertyDetail', {
      propertyId: '123'
    });
  };

  return (
    <View>
      <Text>Olá {user?.name}</Text>
      <Button onPress={handleLogout} title="Logout" />
      <Button onPress={handleNavigate} title="Ver detalhes" />
    </View>
  );
}
```

---

## Estado Global (AuthContext)

```
┌─────────────────────────────────┐
│      ESTADO GLOBAL              │
├─────────────────────────────────┤
│  user:                          │
│    ├─ null → não autenticado    │
│    └─ {...} → autenticado       │
│                                 │
│  isLoading:                     │
│    ├─ true → operação em curso  │
│    └─ false → pronto            │
│                                 │
│  Funções:                       │
│    ├─ signIn(email, password)   │
│    ├─ signUp(email, password)   │
│    └─ signOut()                 │
│                                 │
│  Todos acessível via useAuth()  │
└─────────────────────────────────┘
```

---

## Conclusão do Fluxo

```
┌─────────────────┐
│  Início App     │
└────────┬────────┘
         │
         ├─ AuthProvider inicializa
         │
         ├─ RootNavigator decide fluxo
         │  (baseado em user)
         │
         └─ Renderiza:
            ├─ AuthStack (sem user)
            └─ BottomTabs (com user)
               ├─ HomeTab (🏠)
               ├─ SearchTab (🔍)
               ├─ PublishTab (➕)
               └─ ProfileTab (👤)

┌──────────────────────────┐
│  Toda navegação funciona │
│  com histórico separado  │
│  por aba                 │
└──────────────────────────┘
```

**Pronto para testar!** 🚀
