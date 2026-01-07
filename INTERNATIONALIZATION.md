# 🌍 Sistema de Internacionalização (i18n)

Este projeto implementa suporte completo para **Português (PT)** e **Inglês (EN)** tanto no frontend (React) quanto no backend (Laravel).

---

## 📱 **FRONTEND (React)**

### **Estrutura**

```
front-end/src/
├── contexts/
│   └── TranslationContext.jsx       # Context Provider para i18n
├── translations/
│   ├── pt.js                        # Traduções em Português
│   └── en.js                        # Traduções em Inglês
└── components/
    └── LanguageSwitcher/
        └── LanguageSwitcher.jsx     # Componente para trocar idioma
```

### **Como Usar**

#### **1. Importar o hook `useTranslation`**

```jsx
import { useTranslation } from '../../contexts/TranslationContext';

function MyComponent() {
  const { t, language, switchLanguage } = useTranslation();
  
  return (
    <div>
      <h1>{t('home.title')}</h1>
      <p>{t('common.loading')}</p>
      <button onClick={() => switchLanguage('en')}>Switch to English</button>
    </div>
  );
}
```

#### **2. Acessar Traduções**

Use o formato de chave com ponto: `categoria.subcategoria.chave`

**Exemplos:**
- `t('common.search')` → "Search" (EN) / "Pesquisar" (PT)
- `t('home.featuredPorto')` → "Featured Porto" (EN) / "Destaques Porto" (PT)
- `t('property.pricePerNight')` → "Price per night" (EN) / "Preço por noite" (PT)

#### **3. Trocar Idioma**

Use o componente `<LanguageSwitcher />` que já está integrado no Header ou use:

```jsx
const { switchLanguage } = useTranslation();
switchLanguage('en'); // Muda para inglês
switchLanguage('pt'); // Muda para português
```

**O idioma é salvo automaticamente no `localStorage`.**

---

## 🔧 **BACKEND (Laravel)**

### **Estrutura**

```
back-end/Discover/
├── app/Http/Middleware/
│   └── SetLocale.php                # Middleware para detectar idioma
├── lang/
│   ├── en/
│   │   ├── auth.php
│   │   ├── property.php
│   │   ├── reservation.php
│   │   ├── review.php
│   │   ├── payment.php
│   │   └── profile.php
│   └── pt/
│       ├── auth.php
│       ├── property.php
│       ├── reservation.php
│       ├── review.php
│       ├── payment.php
│       └── profile.php
```

### **Como Usar**

#### **1. Nos Controllers**

Use o helper `__()` do Laravel:

```php
return response()->json([
    'message' => __('auth.login.success'),
], 200);

// Resultado:
// EN: "Login successful"
// PT: "Login efetuado com sucesso"
```

#### **2. Com Parâmetros**

```php
return response()->json([
    'message' => __('reservation.min_nights', ['min' => 3]),
], 400);

// Resultado:
// EN: "Minimum 3 nights required"
// PT: "Mínimo de 3 noites necessário"
```

#### **3. Detecção Automática do Idioma**

O middleware `SetLocale` detecta automaticamente o idioma através do header HTTP:

```javascript
// O axios já está configurado para enviar o header automaticamente
config.headers['Accept-Language'] = language; // 'en' ou 'pt'
```

---

## 🎯 **Categorias de Tradução**

### **Frontend**

| Categoria | Descrição | Exemplo |
|-----------|-----------|---------|
| `common.*` | Textos comuns (botões, ações) | `common.save`, `common.cancel` |
| `header.*` | Textos do cabeçalho | `header.searchPlaceholder` |
| `home.*` | Página inicial | `home.featuredPorto` |
| `property.*` | Propriedades | `property.pricePerNight` |
| `reservation.*` | Reservas | `reservation.confirmReservation` |
| `review.*` | Avaliações | `review.writeReview` |
| `auth.*` | Autenticação | `auth.login`, `auth.register` |
| `host.*` | Painel do anfitrião | `host.addProperty` |
| `settings.*` | Definições | `settings.changePassword` |
| `filter.*` | Filtros | `filter.priceRange` |
| `payment.*` | Pagamentos | `payment.payNow` |
| `errors.*` | Mensagens de erro | `errors.required` |
| `success.*` | Mensagens de sucesso | `success.saved` |

### **Backend**

| Arquivo | Descrição |
|---------|-----------|
| `auth.php` | Autenticação (login, registro, logout) |
| `property.php` | Mensagens de propriedades |
| `reservation.php` | Mensagens de reservas |
| `review.php` | Mensagens de avaliações |
| `payment.php` | Mensagens de pagamentos |
| `profile.php` | Mensagens de perfil |

---

## 🚀 **Testando**

### **Frontend**

1. Inicie o servidor de desenvolvimento:
```bash
cd front-end
npm run dev
```

2. Abra o navegador e clique no botão de idioma no Header
3. Verifique se todos os textos mudam corretamente

### **Backend**

1. Envie requests com o header `Accept-Language`:

```bash
# Inglês
curl -H "Accept-Language: en" http://localhost:8000/api/properties

# Português
curl -H "Accept-Language: pt" http://localhost:8000/api/properties
```

2. As mensagens de erro/sucesso devem retornar no idioma correto

---

## 📝 **Adicionar Novas Traduções**

### **Frontend**

1. Abra `front-end/src/translations/pt.js` e `en.js`
2. Adicione a nova chave:

```javascript
// pt.js
export default {
  myNewCategory: {
    myNewKey: 'Meu novo texto',
  },
};

// en.js
export default {
  myNewCategory: {
    myNewKey: 'My new text',
  },
};
```

3. Use no componente:
```jsx
{t('myNewCategory.myNewKey')}
```

### **Backend**

1. Adicione a chave no arquivo apropriado em `lang/en/` e `lang/pt/`:

```php
// lang/pt/auth.php
return [
    'new_message' => 'Nova mensagem',
];

// lang/en/auth.php
return [
    'new_message' => 'New message',
];
```

2. Use no controller:
```php
return response()->json([
    'message' => __('auth.new_message'),
]);
```

---

## ✅ **Implementações Concluídas**

- ✅ TranslationContext e Provider no React
- ✅ Hook `useTranslation` para componentes
- ✅ Componente `LanguageSwitcher` no Header
- ✅ Traduções completas em PT e EN (frontend)
- ✅ Arquivos de tradução Laravel (backend)
- ✅ Middleware `SetLocale` para detecção automática
- ✅ Configuração do Axios para enviar header de idioma
- ✅ Persistência de idioma no `localStorage`
- ✅ Atualização dos componentes principais (Home, Header, Menu, PropertyCard)

---

## 🎨 **Design Pattern**

O sistema segue o padrão **Context API + i18n**:
- **Context Provider** envolve toda a aplicação
- **localStorage** persiste a escolha do usuário
- **Axios interceptor** envia o idioma em cada request
- **Laravel middleware** detecta e aplica o locale

Semelhante a: **Airbnb**, **Booking.com**, **Netflix**

---

**Desenvolvido com ❤️ para o projeto Discover**
