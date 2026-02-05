# 🔧 Correções - Erro de Atualização de Propriedades

## Problema Identificado

### 1. Erro PGRST204: Coluna 'special_conditions' não encontrada
```
ERROR: "Could not find the 'special_conditions' column of 'properties' in the schema cache"
```

**Causa:** O código TypeScript tentava atualizar um campo `special_conditions` que não existe na tabela `properties` do Supabase.

---

## Soluções Implementadas

### ✅ 1. Atualização da Função `updateProperty` 
**Arquivo:** [src/services/properties.ts](src/services/properties.ts#L558-L630)

**Antes:**
```typescript
export async function updateProperty(id: string, updates: Partial<Property>) {
  const { data: updatedProperty, error } = await supabase
    .from('properties')
    .update(updates)  // ❌ Enviava todos os campos, incluindo special_conditions
    .eq('id', id)
    .select()
    .single();
}
```

**Depois:**
```typescript
export async function updateProperty(id: string, updates: Partial<Property>) {
  // 1. Extrai campos inválidos (não existem na tabela properties)
  const { images, amenities, documentation_urls, cover_image, has_documents, 
          special_conditions, property_images, ...data } = updates as any;

  // 2. Apenas campos válidos que existem no schema properties
  const validFields: any = {};
  const validFieldNames = [
    'title', 'description', 'property_type', 'price', 'currency',
    'bedrooms', 'bathrooms', 'area_sqm', 'address', 'neighborhood',
    'city', 'province', 'latitude', 'longitude', 'rental_duration',
    'is_furnished', 'has_garden', 'has_parking', 'has_pool', 'has_security',
    'allows_renovations', 'status', 'owner_id', 'is_available', 'is_approved'
  ];

  validFieldNames.forEach(field => {
    if (field in data && data[field] !== undefined) {
      validFields[field] = data[field];
    }
  });

  // 3. Atualiza apenas com campos válidos
  const { data: updatedProperty, error } = await supabase
    .from('properties')
    .update(validFields)  // ✅ Apenas campos válidos
    .eq('id', id)
    .select()
    .single();

  // 4. Manipula imagens separadamente
  if (images && Array.isArray(images) && images.length > 0) {
    // ...
  }
}
```

**Benefícios:**
- ✅ Evita erro PGRST204
- ✅ Filtra campos antes de enviar ao Supabase
- ✅ Manipula imagens separadamente na tabela `property_images`

---

### ✅ 2. Melhoria do EditPropertyScreen
**Arquivo:** [src/screens/owner/EditPropertyScreen.tsx](src/screens/owner/EditPropertyScreen.tsx#L140-L180)

**Adicionado:**
- ✅ Recarregamento de dados (`loadProperty()`) após atualização bem-sucedida
- ✅ Melhor feedback de erro para o usuário
- ✅ Verificação do resultado da operação antes de navegar

**Novo Fluxo:**
```typescript
if (propertyId) {
  const result = await updateProperty(propertyId, data);
  if (result) {
    // Recarregar dados para atualizar UI
    await loadProperty();
    Alert.alert('Sucesso', 'Anúncio atualizado!', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  } else {
    Alert.alert('Erro', 'Falha ao atualizar. Verifique os dados.');
  }
}
```

**Benefícios:**
- ✅ Dados atualizados são mostrados imediatamente
- ✅ Melhor feedback visual ao usuário
- ✅ Evita navegar se houver erro

---

## Campos Válidos para Atualização

A tabela `properties` no Supabase suporta os seguintes campos:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| title | text | Título do imóvel |
| description | text | Descrição detalhada |
| property_type | text | Tipo (apartamento, casa, etc) |
| price | numeric | Preço |
| currency | text | Moeda (MT, USD, AOA) |
| bedrooms | integer | Número de quartos |
| bathrooms | integer | Número de casas de banho |
| area_sqm | numeric | Área em m² |
| address | text | Endereço |
| neighborhood | text | Bairro |
| city | text | Cidade |
| province | text | Província |
| latitude | numeric | Latitude (GPS) |
| longitude | numeric | Longitude (GPS) |
| rental_duration | text | Duração (curta, média, longa) |
| is_furnished | boolean | Mobiliado? |
| has_garden | boolean | Tem jardim? |
| has_parking | boolean | Tem garagem? |
| has_pool | boolean | Tem piscina? |
| has_security | boolean | Tem segurança? |
| allows_renovations | boolean | Permite reformas? |
| status | text | Status (novo, usado, em_obras) |
| owner_id | uuid | ID do proprietário |
| is_available | boolean | Disponível? |
| is_approved | boolean | Aprovado? |

---

## Campos que NÃO existem na tabela `properties`

Estes campos são armazenados em outras tabelas ou não são persistidos:

| Campo | Recomendação |
|-------|--------------|
| `special_conditions` | ❌ Não existe - Remover ou criar tabela separada |
| `images` | 📦 Usar tabela `property_images` |
| `amenities` | ❌ Não existe - Remover ou criar tabela separada |
| `documentation_urls` | ❌ Não existe - Remover ou criar tabela separada |
| `cover_image` | ✅ Calculado a partir de `property_images` |
| `has_documents` | ✅ Existe (boolean) |
| `property_images` | 📦 Relação N:1 com tabela separada |

---

## Teste das Correções

### Passos para testar:
1. No Expo Go, clique em editar uma propriedade
2. Modifique alguns campos (título, preço, descrição)
3. Clique em "Salvar"
4. ✅ Deve aparecer mensagem de sucesso
5. ✅ Dados modificados devem aparecer após recarregar

### Logs esperados:
```
LOG  Updating property with fields: ['title','description','price'...]
LOG  Property updated successfully: [property-id]
```

### Erro anterior (não deve mais aparecer):
```
❌ ERROR  Error updating property: {"code": "PGRST204", ... "special_conditions" ...}
```

---

## Próximos Passos Recomendados

1. **Se precisar armazenar `special_conditions`:**
   - Criar tabela `property_special_conditions` no Supabase
   - Adicionar função `upsertSpecialConditions()` em properties.ts
   - Mapear dados em `propertyMapper.ts`

2. **Se precisar armazenar `amenities`:**
   - Criar tabela `property_amenities` no Supabase
   - Similar ao padrão de `property_images`

3. **Se precisar armazenar `documentation_urls`:**
   - Usar tabela `legal_documents` existente
   - Ou expandir `property_images` para múltiplos tipos

---

## Arquivos Modificados

- [src/services/properties.ts](src/services/properties.ts) - Função `updateProperty` 
- [src/screens/owner/EditPropertyScreen.tsx](src/screens/owner/EditPropertyScreen.tsx) - Fluxo de atualização

---

**Data:** 5 de fevereiro de 2026  
**Status:** ✅ RESOLVIDO
