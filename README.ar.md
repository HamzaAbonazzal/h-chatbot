# Chatbot — تطبيق محادثة ذكي متكامل

> تطبيق محادثة بسيط وسريع مع الذكاء الاصطناعي، يدعم سجل المحادثات، البحث، الوضع الليلي، والاتجاه من اليمين لليسار. مبني بـ Next.js وTypeScript وMongoDB ومزود ذكاء اصطناعي مجاني.

<p align="center">
  <strong>العربية</strong> · <a href="README.md">English</a>
</p>

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

---

## المميزات

- **محادثة ذكية** — تحدث مع نموذج لغوي كبير (Gemini، OpenRouter، Groq... إلخ).
- **حفظ المحادثات** — كل المحادثات والرسائل محفوظة في MongoDB.
- **إدارة المحادثات** — إنشاء، تعديل العنوان، وحذف المحادثات.
- **بحث شامل** — ابحث في عناوين المحادثات وفي محتوى الرسائل.
- **الوضع الليلي/النهاري** — يُحفظ الاختيار ولا يوجد وميض عند التحميل.
- **تصميم متجاوب** — يعمل على الحاسوب واللوحي والجوال.
- **دعم RTL** — مُحسّن بالكامل للغة العربية.
- **إعادة الإرسال** — عند فشل الإرسال، يظهر زر إعادة المحاولة بدل فقدان الرسالة.
- **مسودات ذكية** — المحادثات الفارغة لا تُحفظ في قاعدة البيانات.
- **إشعارات أنيقة** — Toast بدل alert المزعجة.
- **بدون تسجيل دخول** — يُستخدم clientId عشوائي محفوظ في localStorage.

---

## التقنيات المستخدمة

| الطبقة           | التقنية                                                                              |
| ---------------- | ------------------------------------------------------------------------------------ |
| الإطار           | [Next.js 16](https://nextjs.org/) (App Router، Turbopack)                            |
| اللغة            | [TypeScript](https://www.typescriptlang.org/)                                        |
| التنسيق          | [Sass](https://sass-lang.com/) (SCSS Modules)                                        |
| قاعدة البيانات   | [MongoDB Atlas](https://www.mongodb.com/atlas) + [Mongoose](https://mongoosejs.com/) |
| الذكاء الاصطناعي | [Google Gemini](https://ai.google.dev/) أو [OpenRouter](https://openrouter.ai/)      |
| الاستضافة        | [Vercel](https://vercel.com/)                                                        |

---

## البدء السريع

### المتطلبات

- Node.js 18 أو أحدث
- قاعدة بيانات MongoDB (محلية أو Atlas)
- مفتاح API من مزود ذكاء اصطناعي (Gemini أو OpenRouter)

### 1. استنساخ المشروع

```bash
git clone https://github.com/USERNAME/chatbot.git
cd chatbot
```

### 2. تثبيت الحزم

```bash
npm install
```

### 3. إعداد متغيرات البيئة

أنشئ ملف `.env.local` في جذر المشروع:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/chatbot
AI_API_KEY=ضع_المفتاح_هنا
AI_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai/
AI_MODEL=gemini-flash-latest
```

**بديل — OpenRouter:**

```env
AI_API_KEY=sk-or-v1-xxxxx
AI_BASE_URL=https://openrouter.ai/api/v1
AI_MODEL=deepseek/deepseek-chat-v3.1:free
```

### 4. التشغيل

```bash
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000).

---

## متغيرات البيئة

| المتغير       | إلزامي | الوصف                                |
| ------------- | ------ | ------------------------------------ |
| `MONGODB_URI` | نعم    | رابط الاتصال بـ MongoDB.             |
| `AI_API_KEY`  | نعم    | مفتاح API لمزود الذكاء الاصطناعي.    |
| `AI_BASE_URL` | نعم    | نقطة النهاية المتوافقة مع OpenAI.    |
| `AI_MODEL`    | نعم    | اسم النموذج مثل gemini-flash-latest. |

---

## بنية المشروع

```
src/
├─ app/
│  ├─ api/
│  │  ├─ chat/route.ts                 # إرسال رسالة والحصول على رد
│  │  ├─ conversations/route.ts        # جلب/إنشاء المحادثات
│  │  ├─ conversations/[id]/route.ts   # تعديل/حذف محادثة
│  │  ├─ conversations/[id]/messages/route.ts  # جلب الرسائل
│  │  └─ search/route.ts               # البحث الشامل
│  ├─ globals.scss
│  ├─ layout.tsx
│  └─ page.tsx
├─ components/
│  ├─ ChatWindow.tsx
│  ├─ ConversationItem.tsx
│  ├─ MessageBubble.tsx
│  ├─ MessageInput.tsx
│  ├─ Sidebar.tsx
│  ├─ ConfirmModal/
│  ├─ ThemeToggle/
│  ├─ Toast/
│  └─ icons/
├─ lib/
│  ├─ ai.ts                            # غلاف مزود الذكاء الاصطناعي
│  ├─ clientId.ts                      # معرف مستخدم مجهول
│  ├─ mongodb.ts                       # اتصال مخزّن مؤقتًا
│  └─ theme.ts                         # حفظ الثيم
├─ models/
│  ├─ Conversation.ts
│  └─ Message.ts
└─ types/
   └─ index.ts
```

---

## مرجع واجهات API

كل المسارات تحت `/api`.

| الطريقة | المسار                        | الوصف                                 |
| ------- | ----------------------------- | ------------------------------------- |
| GET     | `/conversations?clientId=...` | جلب محادثات مستخدم.                   |
| POST    | `/conversations`              | إنشاء محادثة جديدة.                   |
| PATCH   | `/conversations/:id`          | تعديل عنوان محادثة.                   |
| DELETE  | `/conversations/:id`          | حذف محادثة ورسائلها.                  |
| GET     | `/conversations/:id/messages` | جلب رسائل محادثة.                     |
| POST    | `/chat`                       | إرسال رسالة، تلقي الرد، وحفظ الاثنين. |
| GET     | `/search?clientId=...&q=...`  | البحث في العناوين والرسائل.           |

---

## النشر

### النشر على Vercel

1. ارفع المشروع على GitHub.
2. اذهب إلى [vercel.com/new](https://vercel.com/new) واختر المستودع.
3. أضف متغيرات البيئة:
   - `MONGODB_URI` — يجب أن يكون MongoDB بعيدًا (مثل Atlas). المحلي 127.0.0.1 لن يعمل.
   - `AI_API_KEY`
   - `AI_BASE_URL`
   - `AI_MODEL`
4. اضغط **Deploy**.

### ملاحظة حول قاعدة البيانات

MongoDB المحلي ممتاز للتطوير، لكن Vercel لا يمكنه الوصول إلى localhost. استخدم [MongoDB Atlas](https://www.mongodb.com/atlas) (الخطة المجانية كافية) للإنتاج.

---

## أوامر npm

| الأمر           | الوصف                      |
| --------------- | -------------------------- |
| `npm run dev`   | تشغيل سيرفر التطوير.       |
| `npm run build` | بناء نسخة الإنتاج.         |
| `npm run start` | تشغيل نسخة الإنتاج محليًا. |
| `npm run lint`  | فحص الكود.                 |

---

## ملاحظات أمنية

- لا يوجد تسجيل دخول — يُعرَّف المستخدم عبر clientId عشوائي في localStorage.
- كل استدعاءات AI وقاعدة البيانات تمر عبر API Routes، فلا تصل المفاتيح للمتصفح أبدًا.
- `.env.local` مُستثنى من Git — لا ترفع مفاتيحك.
- للاستخدام الإنتاجي العام، أضف تسجيل دخول (مثل NextAuth) وحدًا لعدد الطلبات.

---

## الترخيص

MIT — حر للاستخدام والتعديل والتوزيع.

---

## المؤلف

**اسمك**

- GitHub: [@hamzaabonazzal](https://github.com/hamzaabonazzal)
