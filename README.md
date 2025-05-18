# 🎓 Internship Management System

A full-stack web app built for **Internee.pk** to help companies manage interns efficiently — onboard, assign tasks, track progress, and streamline communication.

---

## 🚀 Features

- 🔐 Role-Based Authentication (Admin & Intern)
- 📥 Internship Application Flow
- 📊 Real-Time Task Tracking
- 📝 Task Feedback & Approval System
- 🧑‍💼 Admin Dashboard (manage applications, assign tasks)
- 👨‍🎓 Intern Dashboard (submit tasks, track feedback)
- 📧 Email Notifications via NodeMailer
- ☁️ Cloudinary for file uploads
- 💸 Stripe Payments for course access

---

## 🛠️ Tech Stack

| Frontend        | Backend           | Database  | Tools & APIs                     |
|-----------------|-------------------|-----------|----------------------------------|
| React + Vite    | Node.js + Express | MongoDB   | JWT, Stripe, Cloudinary, Nodemailer |

---

## 🔧 Installation & Setup
### 🔃 Clone the repository
```
git clone https://github.com/yourusername/internship-management-system.git
cd internship-management-system
```

# 📁 Backend Setup

```
cd Intern-Guru Frontned
npm install
npm run dev
```

# 📁 Frontend Setup

```
cd Intern-Guru Frontned
npm install
npm run dev
```



# 📁 Backend Env-Variable
```
# MongoDB connection string
MONGO=your_mongodb_connection_string

# Secrets for JWT token signing
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_TOKEN_SECRET=your_access_token_secret

# Cloudinary credentials for file uploads
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Password for email service (used by NodeMailer)
APP_PASSWORD=your_email_app_password

# Stripe keys for payment processing
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

```


# 📁 Frontend Env-Variable
```
# Base URL of the backend API
VITE_BASE_URL=http://localhost:5000

# Stripe public key for handling payments on frontend
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```




