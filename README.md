# Saraha App

تطبيق Saraha هو تطبيق ويب مبني باستخدام Node.js و Express.js يسمح للمستخدمين بإرسال رسائل مجهولة.

## المميزات

- نظام تسجيل دخول وتسجيل مستخدمين جديد
- إرسال رسائل مجهولة
- نظام مصادقة آمن
- تشفير البيانات
- رفع الملفات
- إرسال إشعارات عبر البريد الإلكتروني

## التقنيات المستخدمة

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **File Upload**: Multer
- **Email**: Nodemailer
- **Security**: bcrypt, crypto

## التثبيت والتشغيل

### المتطلبات الأساسية
- Node.js (v14 أو أحدث)
- MongoDB
- npm أو yarn

### خطوات التثبيت

1. استنساخ المشروع:
```bash
git clone <repository-url>
cd SarahaApp
```

2. تثبيت التبعيات:
```bash
npm install
```

3. إعداد متغيرات البيئة:
```bash
cp .env.example .env
# تعديل ملف .env بالمعلومات المطلوبة
```

4. تشغيل المشروع:
```bash
npm start
```

## هيكل المشروع

```
src/
├── app.controller.js
├── config/
├── DB/
│   ├── connection.js
│   ├── db.service.js
│   └── models/
├── middleware/
├── modules/
│   ├── auth/
│   ├── message/
│   └── user/
├── utils/
└── index.js
```

## المسارات المتاحة

- `POST /auth/register` - تسجيل مستخدم جديد
- `POST /auth/login` - تسجيل الدخول
- `POST /message/send` - إرسال رسالة
- `GET /user/profile` - عرض الملف الشخصي

## المساهمة

نرحب بمساهماتكم! يرجى إنشاء fork للمشروع وإرسال pull request.

## الترخيص

هذا المشروع مرخص تحت رخصة MIT.
