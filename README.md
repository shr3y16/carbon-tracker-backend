# 🌱 Carbon Tracker Backend

This is a Node.js + TypeScript backend for a Carbon Footprint Tracker. It provides secure, validated APIs to log activities, compute emissions, and generate summaries. The service uses PostgreSQL for storage, Redis for caching, and includes CI/CD setup via GitHub Actions.

---

## 🚀 Features

- JWT-based Authentication
- CRUD APIs for activity tracking
- Search, pagination, and sorting
- Emission summary API with Redis caching
- Input validation using express-validator
- Dockerized backend
- CI setup with GitHub Actions
  - Lint, TypeScript check, Prettier check, Tests
  - Docker build and push to Docker Hub

---

## 🛠 Tech Stack

- **Node.js** + **Express**
- **TypeScript**
- **PostgreSQL** via Prisma ORM
- **Redis** (for caching summaries)
- **Docker** (backend containerized)
- **GitHub Actions** (CI pipeline)
- **Jest** (unit tests)
- **Zod** / **express-validator** (validation)

---

## 📦 Setup

### 1. Clone the repo
```bash
git clone https://github.com/shr3y16/carbon-tracker-backend
cd carbon-tracker-backend
