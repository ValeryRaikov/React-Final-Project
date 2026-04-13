# i18n Translation Guide

## Overview
This project uses **i18next** for internationalization (i18n) with support for English and Bulgarian languages.

---

## **Admin Panel Translation Structure**

### Directory Layout
```
admin/src/
├── locales/
│   ├── en/
│   │   └── admin/
│   │       ├── common.json          # Shared UI elements
│   │       ├── navigation.json       # Navbar/Sidebar labels
│   │       ├── users.json           # User management strings
│   │       ├── products.json        # Product management strings
│   │       └── auth.json            # Login/Auth strings
│   └── bg/
│       └── admin/
│           ├── common.json
│           ├── navigation.json
│           ├── users.json
│           ├── products.json
│           └── auth.json
├── context/
│   └── LanguageContext.jsx          # Language state management
├── i18n.js                           # i18n configuration
└── main.jsx                          # App entry point
```

### File Purposes

| File | Purpose |
|------|---------|
| `common.json` | Buttons, labels, and standard UI text (Save, Cancel, Delete, etc.) |
| `navigation.json` | Sidebar links and dashboard title |
| `users.json` | User management forms, messages, and permission text |
| `products.json` | Product CRUD operation strings |
| `auth.json` | Login page and authentication messages |

---

## **Client-Side Translation Structure**

### Directory Layout
```
client/src/
├── locales/
│   ├── en/
│   │   └── shop/
│   │       ├── common.json          # Shared UI elements
│   │       ├── navigation.json       # Navbar labels
│   │       ├── products.json        # Product page strings
│   │       └── cart.json            # Shopping cart strings
│   └── bg/
│       └── shop/
│           ├── common.json
│           ├── navigation.json
│           ├── products.json
│           └── cart.json
├── context/
│   └── LanguageContext.jsx          # Language state management
├── i18n.js                           # i18n configuration
└── main.jsx                          # App entry point
```

### File Purposes

| File | Purpose |
|------|---------|
| `common.json` | Shared UI text (Save, Cancel, etc.) |
| `navigation.json` | Navbar menu items |
| `products.json` | Product listings and details |
| `cart.json` | Cart, checkout, and order strings |

---

## **How to Use Translations in Components**

### **1. Using useTranslation Hook**

```jsx
import { useTranslation } from 'react-i18next';

export default function MyComponent() {
    const { t } = useTranslation();
    
    return (
        <div>
            <h1>{t('navigation:dashboard')}</h1>
            <button>{t('common:save')}</button>
        </div>
    );
}
```

### **2. Translation Key Format**
- **Namespace prefix**: `namespace:key` (e.g., `navigation:dashboard`)
- **Without prefix**: Falls back to translation namespace (uses `common` by default)

### **3. Examples**

**Admin Component:**
```jsx
const { t } = useTranslation();

// Access specific namespace
<h1>{t('users:allUsers')}</h1>
<p>{t('users:cannotDeleteOwnAccount')}</p>
<button>{t('common:save')}</button>
```

**Client Component:**
```jsx
const { t } = useTranslation();

// Access cart namespace
<h2>{t('cart:cart')}</h2>
<div>{t('cart:total')}: ${total}</div>
<button>{t('cart:checkout')}</button>
```

---

## **Language Switcher Integration**

### **Admin Sidebar (Already Implemented)**
```jsx
import { useLanguage } from '../../context/LanguageContext';

export default function Sidebar() {
    const { currentLanguage, changeLanguage } = useLanguage();
    
    return (
        <div>
            <button onClick={() => changeLanguage('en')}>English</button>
            <button onClick={() => changeLanguage('bg')}>Български</button>
        </div>
    );
}
```

### **Client Navbar (Already Implemented)**
```jsx
import { useLanguage } from '../../context/LanguageContext';

export default function Navbar() {
    const { currentLanguage, changeLanguage } = useLanguage();
    
    return (
        <div className="nav-language-switcher">
            <button onClick={() => changeLanguage('en')}>EN</button>
            <button onClick={() => changeLanguage('bg')}>БГ</button>
        </div>
    );
}
```

---

## **How to Add New Translations**

### **Step 1: Add Translation Key to JSON Files**

**`admin/src/locales/en/admin/products.json`:**
```json
{
    "newProductFeature": "New Product Feature",
    "featureDescription": "This is a new feature..."
}
```

**`admin/src/locales/bg/admin/products.json`:**
```json
{
    "newProductFeature": "Нова характеристика на продукта",
    "featureDescription": "Това е нова функция..."
}
```

### **Step 2: Use in Component**

```jsx
const { t } = useTranslation();

// Use with namespace prefix
<div>
    <h2>{t('products:newProductFeature')}</h2>
    <p>{t('products:featureDescription')}</p>
</div>
```

---

## **How to Create a New Translation File**

### **1. Create JSON Files**

Create both English and Bulgarian versions:
```
admin/src/locales/en/admin/new-feature.json
admin/src/locales/bg/admin/new-feature.json
```

### **2. Update i18n Configuration**

**`admin/src/i18n.js`:**
```javascript
import newFeatureEn from './locales/en/admin/new-feature.json';
import newFeatureBg from './locales/bg/admin/new-feature.json';

const resources = {
    en: {
        newFeature: newFeatureEn,  // Add this namespace
        // ... existing namespaces
    },
    bg: {
        newFeature: newFeatureBg,  // Add this namespace
        // ... existing namespaces
    },
};
```

### **3. Use in Components**

```jsx
const { t } = useTranslation();

// With namespace
<div>{t('newFeature:someKey')}</div>
```

---

## **Language Persistence**

Language preference is automatically saved to **localStorage**:
- **Admin**: `localStorage.getItem('adminLanguage')`
- **Client**: `localStorage.getItem('shopLanguage')`

The stored language persists across sessions and is loaded on app startup.

---

## **Best Practices**

✅ **Do:**
- Keep translation keys lowercase with camelCase
- Organize translations by feature/domain (not one giant file)
- Keep translations in separate namespaces for clarity
- Always provide both English and Bulgarian translations
- Use descriptive key names (`confirmDeleteProduct` instead of `msg1`)

❌ **Don't:**
- Mix multiple languages in one JSON value
- Use special characters that might break JSON
- Create excessively long keys or values
- Place all translations in a single file

---

## **Supported Languages**

- ✅ **English** (`en`) - Default language
- ✅ **Bulgarian** (`bg`)

To add a new language (e.g., Spanish):
1. Create new locale folders: `admin/src/locales/es/admin/`
2. Add all JSON translation files
3. Update `i18n.js` with new language resources
4. Update language switcher buttons in UI

---

## **Troubleshooting**

### **Issue: Translations not showing (showing keys instead)**
- Check that key format matches: `namespace:key`
- Verify JSON file is valid (use JSONLint)
- Ensure namespace is registered in `i18n.js`
- Clear browser cache and reload

### **Issue: Language not switching**
- Check `LanguageContext` is wrapped in app root
- Verify `i18n.js` is imported in `main.jsx`
- Ensure `useLanguage` hook returns valid object
- Check localStorage isn't blocking language save

### **Issue: New translations not appearing**
- Restart dev server after adding new JSON files
- Verify i18n.js imports updated translation files
- Check namespace is correctly spelled in component
- Ensure both EN and BG versions exist

---

## **Files Already Implemented**

### Admin:
✅ `admin/src/i18n.js` - i18n config
✅ `admin/src/context/LanguageContext.jsx` - Language state & switcher
✅ `admin/src/main.jsx` - i18n initialization
✅ `admin/src/components/sidebar/Sidebar.jsx` - Language switcher buttons
✅ All translation JSON files in `admin/src/locales/`

### Client:
✅ `client/src/i18n.js` - i18n config
✅ `client/src/context/LanguageContext.jsx` - Language state & switcher
✅ `client/src/main.jsx` - i18n initialization
✅ `client/src/components/navbar/Navbar.jsx` - Language switcher buttons
✅ All translation JSON files in `client/src/locales/`

---

## **Next Steps for Full Integration**

To fully translate your application, update these components to use `useTranslation()`:

**Admin Components:**
- [ ] AdminUserController components (AddUser, ListUser, EditUser, DeleteUser)
- [ ] Product form components
- [ ] Promocode components
- [ ] Login component

**Client Components:**
- [ ] Product display pages
- [ ] Cart component
- [ ] Checkout forms
- [ ] Profile pages
- [ ] Category pages

For each component, simply import `useTranslation()` and wrap text with `t('namespace:key')`.
