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



