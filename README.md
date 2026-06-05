# Evara Store 🛍️

> منصة تسوق إلكتروني عصرية مبنية بـ Next.js وFirebase

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com/)

## 🌐 Live Demo

**[evara-store.vercel.app](https://evara-store-two.vercel.app)**

---

## ✨ المميزات

| الميزة               | الوصف                                        |
| -------------------- | -------------------------------------------- |
| 🔐 **المصادقة**      | تسجيل دخول وإنشاء حساب آمن مع Firebase Auth  |
| 🛒 **سلة التسوق**    | إضافة وحذف المنتجات مع حفظ البيانات تلقائياً |
| ❤️ **قائمة الرغبات** | حفظ المنتجات المفضلة بضغطة واحدة             |
| 👤 **حسابي**         | إدارة البروفايل والعناوين وسجل الطلبات       |
| 📱 **تصميم متجاوب**  | واجهة جميلة تعمل على جميع الأجهزة            |
| 🔔 **إشعارات فورية** | تنبيهات مباشرة مع sonner                     |

---

## 🛠️ التقنيات المستخدمة

### Frontend

- **[Next.js 16](https://nextjs.org/)** — إطار عمل React متقدم مع SSR و SSG
- **[React 19](https://react.dev/)** — مكتبة واجهات المستخدم
- **[Tailwind CSS](https://tailwindcss.com/)** — تصميم سريع وجميل

### Backend & Database

- **[Firebase Authentication](https://firebase.google.com/products/auth)** — إدارة المستخدمين بأمان
- **[Cloud Firestore](https://firebase.google.com/products/firestore)** — قاعدة بيانات سحابية في الوقت الفعلي

### UI & UX

- **[React Icons](https://react-icons.github.io/react-icons/)** — أيقونات عالية الجودة
- **[Embla Carousel](https://www.embla-carousel.com/)** — عرض شرائح احترافي
- **[React Toastify](https://fkhadra.github.io/react-toastify/)** — إشعارات جميلة

---

## 📁 هيكل المشروع

```
src/
├── app/
│   ├── page.jsx             # الصفحة الرئيسية
│   ├── cart/                # سلة التسوق
│   ├── shop/                # صفحة المتجر
│   ├── wshlist/             # قائمة الرغبات
│   ├── profile/             # حسابي
│   ├── login/               # تسجيل الدخول
│   ├── signup/              # إنشاء حساب
│   ├── checkout/            # الدفع
│   ├── verify-email/        # تحقق من الايميل
│   └── Product/[id]/        # تفاصيل المنتج
├── components/
├── Contexts/
│   ├── AuthContext.jsx      # إدارة المصادقة
│   ├── CartContext.jsx      # إدارة السلة
│   ├── WishlistContext.jsx  # إدارة قائمة الرغبات
│   ├── FormContexts.jsx     # إدارة حقول الإدخال
│   └── ProductsContext.jsx  # إدارة المنتجات
└── lib/
    └── firebase.js          # إعدادات Firebase
```

---

## 🚀 تشغيل المشروع محلياً

### المتطلبات

- Node.js 18+
- npm أو yarn

### خطوات التثبيت

```bash
# 1. استنسخ المشروع
git clone https://github.com/zain-zaqout/evara-store.git
cd evara-store

# 2. ثبّت الاعتمادات
npm install

# 3. انسخ ملف البيئة
cp .env.example .env.local
```

### إعداد Firebase

1. أنشئ مشروعاً جديداً على [firebase.google.com](https://firebase.google.com)
2. فعّل **Authentication** (Email/Password)
3. أنشئ قاعدة بيانات **Firestore**
4. انسخ بيانات الإعداد إلى `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### تشغيل المشروع

```bash
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000) في متصفحك.

---

## ☁️ النشر على Vercel

### الطريقة السريعة

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/zain-zaqout/evara-store)

### يدوياً

```bash
# ثبّت Vercel CLI
npm i -g vercel

# سجّل الدخول
vercel login

# انشر المشروع
vercel --prod
```

> **مهم:** أضف متغيرات البيئة (Environment Variables) في إعدادات مشروعك على Vercel.

---

## 🎯 الصفحات الرئيسية

| الصفحة   | المسار          | الوصف                |
| -------- | --------------- | -------------------- |
| الرئيسية | `/`             | عرض المنتجات المميزة |
| المتجر   | `/shop`         | عرض جميع المنتجات    |
| المنتج   | `/product/[id]` | تفاصيل المنتج        |
| السلة    | `/cart`         | مراجعة السلة         |
| الرغبات  | `/wshlist`      | قائمة المفضلة        |
| حسابي    | `/profile`      | إدارة البروفايل      |
| الدخول   | `/login`        | تسجيل الدخول         |
| الاشتراك | `/signup`       | إنشاء حساب جديد      |
| التحقق   | `/verify-email` | تحقق من الإيميل      |

---

## 📝 الأوامر المتاحة

```bash
npm run dev      # تشغيل خادم التطوير
npm run build    # بناء الإنتاج
npm start        # تشغيل الإنتاج
npm run lint     # فحص الأكواد
```

---

## 🔐 الأمان

- **Firebase Authentication** للتحقق الآمن من الهوية
- **متغيرات البيئة** لحماية البيانات الحساسة
- **Firestore Security Rules** لحماية قاعدة البيانات

---

## 📄 الرخصة

هذا المشروع مرخص تحت [MIT License](LICENSE).

---

## 👨‍💻 المطور

**Zain**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/zain-zaqout)

---

> 💡 **ملاحظة:** هذا المشروع قيد التطوير المستمر. مرحباً بأي مساهمات أو اقتراحات!
