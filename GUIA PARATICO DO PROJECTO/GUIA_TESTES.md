# 🧪 GUIA DE TESTES PASSO A PASSO

## ✅ Teste 1: Iniciar o App

### Passo 1.1: Abrir Terminal
```bash
cd c:\Users\Dell\Documents\GitHub\mobile-app
```

### Passo 1.2: Iniciar o desenvolvimento
```bash
npm start
```

**Esperado:**
- Expo CLI abre
- QR code gerado
- Opções: `i`, `a`, `w`, `r`, `q`

### Passo 1.3: Escolher emulador
- `i` para iOS Simulator
- `a` para Android Emulator
- `w` para Web browser

**Esperado:**
- App compila sem erros
- LoginScreen aparece na tela

---

## ✅ Teste 2: Fluxo de Autenticação

### Passo 2.1: Tela de Login aparece
**Verificar:**
- ✅ Título "Welcome Back"
- ✅ Subtítulo "Login to your account"
- ✅ Campo Email
- ✅ Campo Password
- ✅ Botão "Sign In"

### Passo 2.2: Clique em "Sign In"
1. Toque no botão "Sign In"
2. Texto muda para "Signing in..."
3. Após ~500ms o app navega

**Esperado:**
- App não fecha
- Sem erros no console
- Navega para HomeScreen ✅

### Passo 2.3: Verificar Bottom Tabs
**Verificar que aparecem:**
- ✅ 🏠 Home (primeiro ícone)
- ✅ 🔍 Search (segundo ícone)
- ✅ ➕ Publish (terceiro ícone)
- ✅ 👤 Profile (quarto ícone)

**Todos com cores:**
- Ativo: azul (#3B82F6)
- Inativo: cinza (#6B7280)

---

## ✅ Teste 3: HomeScreen

### Passo 3.1: Verificar layout
**Verificar:**
- ✅ Título "Hello, User Teste"
- ✅ Subtítulo "Welcome back to our app"
- ✅ Botão "Logout" no canto
- ✅ Lista de propriedades abaixo

### Passo 3.2: Verificar propriedades
**Verificar lista:**
- ✅ Card 1: "Cozy Apartment" - $1200 - Downtown
- ✅ Card 2: "Modern House" - $2500 - Suburbs
- ✅ Card 3: "Beach Villa" - $5000 - Coastal

### Passo 3.3: Clique em uma propriedade
1. Toque no card "Cozy Apartment"

**Esperado:**
- Navega para PropertyDetailScreen ✅
- Mostra detalhes do imóvel
- Botão de voltar aparece no header

### Passo 3.4: Voltar para Home
1. Clique no botão "< Home" (ou swipe back)

**Esperado:**
- Volta para HomeScreen
- Lista está no mesmo lugar (cache)

---

## ✅ Teste 4: Alternar entre Abas

### Passo 4.1: Ir para SearchTab
1. Clique no ícone 🔍 (Search)

**Esperado:**
- ✅ SearchScreen aparece
- ✅ Título "Search Properties"
- ✅ Barra de busca visível
- ✅ Lista de propriedades abaixo

### Passo 4.2: Buscar propriedade
1. Clique na barra de busca
2. Digite "cozy" ou "modern"

**Esperado:**
- ✅ Lista filtra em tempo real
- ✅ Mostra apenas propriedades que combinam
- ✅ Se digitar algo inexistente → "No properties found"

### Passo 4.3: Voltar para Home
1. Clique em 🏠 (Home)

**Esperado:**
- ✅ Volta para HomeScreen
- ✅ HomeScreen está intacta (cache preservado)

---

## ✅ Teste 5: PublishTab

### Passo 5.1: Ir para PublishTab
1. Clique no ícone ➕ (Publish)

**Esperado:**
- ✅ PublishScreen aparece
- ✅ Título "Publish Your Property"
- ✅ Subtítulo "List a new property for rent or sale"

### Passo 5.2: Verificar formulário
**Verificar campos:**
- ✅ Title
- ✅ Description (multiline)
- ✅ Price
- ✅ Location
- ✅ Botão "Publish Property"

### Passo 5.3: Preencher formulário
1. Clique no campo Title
2. Digite "Beautiful Apartment"
3. Clique no campo Description
4. Digite "Great location"
5. Clique no campo Price
6. Digite "1500"
7. Clique no campo Location
8. Digite "Downtown"

**Esperado:**
- ✅ Todos os campos aceitam input
- ✅ Sem erros
- ✅ Teclado aparece/desaparece corretamente

### Passo 5.4: Clique em "Publish Property"
1. Clique no botão

**Esperado:**
- ✅ Sem erro
- ✅ Console não mostra warnings
- ✅ Botão é responsivo

---

## ✅ Teste 6: ProfileTab

### Passo 6.1: Ir para ProfileTab
1. Clique no ícone 👤 (Profile)

**Esperado:**
- ✅ ProfileScreen aparece
- ✅ Avatar com inicial "U"
- ✅ Nome "User Teste"
- ✅ ID do usuário

### Passo 6.2: Verificar seção de conta
**Verificar:**
- ✅ Email: user@example.com
- ✅ Phone: +1 234 567 8900

### Passo 6.3: Clique em "Logout"
1. Clique no botão "Logout" (vermelho)

**Esperado:**
- ✅ App retorna para LoginScreen
- ✅ AuthStack renderizado novamente
- ✅ Sem erros de navegação

---

## ✅ Teste 7: Login Novamente

### Passo 7.1: Tela de Login
**Verificar:**
- ✅ LoginScreen exibida
- ✅ Mesma tela do início

### Passo 7.2: Clique em "Sign In" novamente
1. Toque em "Sign In"

**Esperado:**
- ✅ Navega para HomeScreen novamente
- ✅ Bottom Tabs aparecem
- ✅ Mesmo fluxo de antes

---

## ✅ Teste 8: Ciclo Completo

### Passo 8.1: Testar RegisterScreen
1. Na LoginScreen, procure por opção "Sign Up"
2. Se houver botão, clique

**Esperado:**
- ✅ Navega para RegisterScreen
- ✅ Campos: Name, Email, Password
- ✅ Botão "Sign Up"

### Passo 8.2: Preencher e registrar
1. Preencha os campos
2. Clique "Sign Up"

**Esperado:**
- ✅ Navega para HomeScreen
- ✅ Mesmo fluxo

---

## ✅ Teste 9: Validação de Código

### Passo 9.1: TypeScript
```bash
npx tsc --noEmit
```

**Esperado:**
- ✅ Sem erros
- ✅ Exit Code: 0

### Passo 9.2: Dependências
```bash
npm list @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
```

**Esperado:**
- ✅ Todas as dependências listadas
- ✅ Sem versões em conflito

### Passo 9.3: Verificar imports
```bash
grep -r "import.*from.*@react-navigation" src/ --include="*.tsx" | head -10
```

**Esperado:**
- ✅ Múltiplos imports de navegação
- ✅ Sem erros de importação

---

## ✅ Teste 10: Performance

### Passo 10.1: Trocar de abas rapidamente
1. Clique 🏠 → 🔍 → ➕ → 👤 → 🏠 → ... (rapidamente)

**Esperado:**
- ✅ Sem lag
- ✅ Transições suaves
- ✅ Sem memory leaks

### Passo 10.2: Histórico de navegação
1. HomeTab → PropertyDetail → voltar → PropertyDetail → voltar

**Esperado:**
- ✅ Histórico funciona
- ✅ Cache preservado
- ✅ Estados mantidos

---

## 🐛 Possíveis Problemas & Soluções

### Problema: "Port 8081 is being used"
**Solução:**
```bash
# Kill processo na porta 8081
# Windows
netstat -ano | findstr :8081
taskkill /PID <PID> /F

# Ou usar outra porta
npm start -- --port 8082
```

### Problema: "Module not found"
**Solução:**
```bash
npm install
npm install @react-navigation/bottom-tabs
npm install @expo/vector-icons
```

### Problema: TypeScript errors
**Solução:**
```bash
npx tsc --noEmit
# Se houver erros, corrigir arquivos
# Todos os erros conhecidos já foram corrigidos!
```

### Problema: App não renderiza
**Solução:**
1. Verificar console para erros
2. Recarregar com `r` no terminal
3. Fazer `npm start` novamente

---

## ✨ Checklist Final de Testes

- ✅ [ ] App inicia sem erro
- ✅ [ ] LoginScreen aparece
- ✅ [ ] Sign In leva para HomeScreen
- ✅ [ ] Bottom Tabs exibe 4 abas
- ✅ [ ] HomeScreen mostra propriedades
- ✅ [ ] Clique em propriedade = PropertyDetail
- ✅ [ ] SearchTab funciona com filtro
- ✅ [ ] PublishTab mostra formulário
- ✅ [ ] ProfileTab mostra perfil
- ✅ [ ] Logout volta para LoginScreen
- ✅ [ ] Sign In novamente funciona
- ✅ [ ] Histórico por aba preservado
- ✅ [ ] TypeScript sem erros
- ✅ [ ] Sem console errors
- ✅ [ ] Performance OK

---

## 📊 Resultado Esperado

Se todos os testes passarem:

```
✅ Estrutura de navegação funcional
✅ Autenticação mock funcionando
✅ 4 abas independentes
✅ Histórico por aba preservado
✅ Design system integrado
✅ TypeScript validado
✅ Pronto para integração com API
```

---

**Bom teste!** 🚀

Se algum teste falhar, verifique:
1. Console para erros
2. Versões das dependências
3. Arquivos foram criados corretamente
4. TypeScript compilou OK

**Status do Projeto: PRONTO PARA TESTE!** ✨

