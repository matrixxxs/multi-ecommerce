# 🛒 Multi-Ecommerce Backend API

<p align="center">
  A multi-store e-commerce backend built with Node.js, TypeScript, Express, PostgreSQL, and Prisma.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma ORM" />
</p>

<p align="center">
  <a href="https://github.com/matrixxxs/multi-ecommerce">Repository</a> ·
  <a href="https://github.com/matrixxxs">Developer Profile</a>
</p>

---

## 📌 About

**Multi-Ecommerce** is a backend engineering project focused on building the server-side infrastructure for a multi-store e-commerce platform.

It uses a relational PostgreSQL database and a TypeScript-powered Express API, with Prisma for database access and integrations for authentication, image uploads, and email delivery.

The project explores practical backend engineering concepts, including API design, data modelling, request validation, security, and external service integration.

## ⚙️ Tech Stack

<p>
  <img src="https://skillicons.dev/icons?i=nodejs,typescript,express,postgres,prisma&theme=dark" alt="Node.js, TypeScript, Express, PostgreSQL and Prisma" />
</p>

| Technology | Role |
|---|---|
| Node.js | Server-side JavaScript runtime |
| TypeScript | Static typing |
| Express 5 | HTTP server and routing |
| PostgreSQL | Relational database |
| Prisma ORM 7 | Database access and schema management |
| Zod | Request and data validation |
| JWT & bcrypt | Token-based authentication support and password hashing |
| Cloudinary & Multer | Image storage integration and upload handling |
| Helmet & CORS | HTTP security headers and cross-origin configuration |
| Resend | Email delivery integration |
| node-cron | Scheduled task support |

## ✨ Engineering Focus

- 🏬 **Multi-store architecture** — building backend foundations for a platform that supports multiple stores.
- 🗄️ **Relational data modelling** — structuring e-commerce data with PostgreSQL.
- 🔐 **Authentication and security** — password hashing, JWT support, validation, and security middleware.
- 🖼️ **Image upload integration** — handling uploaded files and Cloudinary integration.
- 📧 **External services** — email delivery and scheduled task tooling.
- 🧩 **Maintainable code** — TypeScript, structured configuration, and Prisma database access.

*Feature descriptions reflect the project's technology and intended scope; individual implementations should be verified against the source code.*

## 🚀 Getting Started

### Prerequisites

- Node.js and npm
- PostgreSQL database
- Git

### 1. Clone the repository

```bash
git clone https://github.com/matrixxxs/multi-ecommerce.git
cd multi-ecommerce
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a local `.env` file and configure the variables required by the application.

```bash
touch .env
```

Use the Prisma configuration and application source code to determine the exact environment variable names. Never commit real credentials.

### 4. Validate the Prisma schema

```bash
npx prisma validate
```

Configure your PostgreSQL connection before running database migrations or starting the application.

### 5. Run the application

The project currently defines these scripts:

```bash
npm run dev
```

```bash
npm run build
```

```bash
npm start
```

Verify that the script entry points match the actual source files before relying on these commands.

## 🗂️ Project Structure

```text
multi-ecommerce/
├── prisma/              # Database schema and migrations
├── src/                 # Backend application source
├── prisma.config.ts     # Prisma configuration
├── package.json         # Dependencies and scripts
├── package-lock.json    # Dependency lockfile
├── tsconfig.json        # TypeScript configuration
├── .gitignore
├── .env.example
├── LICENSE
└── README.md
```

## 🔒 Security Practices

- Keep secrets out of version control.
- Hash passwords instead of storing plaintext passwords.
- Validate incoming data.
- Configure security middleware deliberately.
- Use environment variables for sensitive configuration.
- Keep dependencies reproducible with the lockfile.

## 🛠️ Future Improvements

- Automated unit and integration tests
- OpenAPI documentation
- Centralized error handling
- CI workflows
- Database performance optimization
- Docker-based development environment

## 👨‍💻 Author

**Matrix** — Software engineering student and developer interested in backend engineering, database systems, and building practical software.

[GitHub: @matrixxxs](https://github.com/matrixxxs)

---

<p align="center">
  <i>Building practical systems, one commit at a time.</i>
</p>
