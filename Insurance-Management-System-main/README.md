<div align="center">

# 🛡️ Insurance Management System

### A Secure, Layered REST API for Managing Clients, Policies & Claims

![Java](https://img.shields.io/badge/Java-17-orange?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.0.5-brightgreen?style=for-the-badge&logo=springboot&logoColor=white)
![Spring Security](https://img.shields.io/badge/Spring%20Security-Secured-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Maven](https://img.shields.io/badge/Maven-Build-C71A36?style=for-the-badge&logo=apachemaven&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

<img src="https://placehold.co/900x260/1a2b4c/ffffff?text=Insurance+Management+System&font=montserrat" alt="Insurance Management System banner" width="100%"/>

</div>

---

## 📖 Overview

**Insurance Management System** is a Java + Spring Boot **REST API** that gives an insurance company one clean, secure backend to manage:

- 👤 **Clients** — the people who hold policies
- 📋 **Insurance Policies** — Vehicle, Health, Home, and Term Life coverage
- 💰 **Claims** — submitted, tracked, and resolved against a policy
- 🔐 **Users & Roles** — authenticated access with `ADMIN` / `USER` separation

It follows a clean **Controller → Service → Repository → Database** architecture built on **Spring Data JPA**, **Hibernate**, and **MySQL**, so it's easy to read, extend, and test.

---

## 🎬 How It All Connects

```text
                    🧑 USER / ADMIN
                          │
                          ▼
                 🔐 SPRING SECURITY (BCrypt + Roles)
                          │
                          ▼
              🌐 SPRING BOOT REST CONTROLLERS
                          │
            ┌─────────────┼─────────────┐
            ▼             ▼             ▼
        👤 CLIENTS    📋 POLICIES    💰 CLAIMS
            │             │             │
            └─────────────┼─────────────┘
                          ▼
                  ⚙️ SERVICE LAYER
                          ▼
                🗃️ JPA / HIBERNATE REPOSITORIES
                          ▼
                    🗄️ MYSQL DATABASE
```



---

## ✨ Features

### 👤 Client Management
Full CRUD for the people insured under a policy.

| Action | Method & Endpoint |
|---|---|
| ➕ Add a client | `POST /client/add` |
| 🔍 Get a client | `GET /client/get/{id}` |
| 📚 Get all clients | `GET /client/getAll` |
| ✏️ Update a client | `PUT /client/edit/{id}` |
| 🗑️ Delete a client | `DELETE /client/delete/{id}` |

### 📋 Insurance Policy Management
Create policies and link them to a client. Supports four coverage types via the `InsuranceType` enum: `Vehicle_Insurance`, `Health_Insurance`, `Home_Insurance`, `Term_Life_Insurance`.

| Action | Method & Endpoint |
|---|---|
| ➕ Add a policy | `POST /insurance/add` |
| 🔍 Get a policy | `GET /insurance/get/{id}` |
| 📚 Get all policies | `GET /insurance/getAll` |
| ✏️ Update a policy | `PUT /insurance/edit/{id}` |
| 🗑️ Delete a policy | `DELETE /insurance/delete/{id}` |

### 💰 Claim Management
Submit and track claims against a policy. Status is tracked via the `ClaimStatus` enum: `Under_Process`, `Successful`, `Rejected`.

| Action | Method & Endpoint |
|---|---|
| 📝 Submit a claim | `POST /claim/add` |
| 🔍 Get a claim | `GET /claim/get/{id}` |
| 📚 Get all claims | `GET /claim/getAll` |
| ✏️ Update a claim | `PUT /claim/edit/{id}` |
| 🗑️ Delete a claim | `DELETE /claim/delete/{id}` |

### 🔐 Users & Authentication

| Action | Method & Endpoint | Access |
|---|---|---|
| 🆕 Register a user | `POST /user/add` | Public (no login required) |
| 🌐 All other routes (`/client/**`, `/insurance/**`, `/claim/**`) | — | Requires login (`formLogin`) |

Passwords are hashed with **`BCryptPasswordEncoder`** — nothing is ever stored in plain text.

---

## 🏗️ Architecture

```text
┌───────────────────────────────────────────┐
│              👨‍💻 CLIENT / USER             │
└──────────────────────┬────────────────────┘
                        │ HTTP / JSON
                        ▼
┌───────────────────────────────────────────┐
│             🌐 CONTROLLER LAYER            │
│  ClientController · ClaimController        │
│  InsurancePolicyController · UserInfoController │
└──────────────────────┬────────────────────┘
                        ▼
┌───────────────────────────────────────────┐
│              ⚙️ SERVICE LAYER              │
│  ClientService · ClaimService · InsuranceService │
└──────────────────────┬────────────────────┘
                        ▼
┌───────────────────────────────────────────┐
│             🗃️ REPOSITORY LAYER            │
│  ClientRepository · ClaimRepository         │
│  InsuranceRepository · UserInfoRepository   │
└──────────────────────┬────────────────────┘
                        │ JPA / Hibernate
                        ▼
┌───────────────────────────────────────────┐
│                 🗄️ MYSQL                   │
│      Client · Policy · Claim · User         │
└───────────────────────────────────────────┘
```

---

## 🧰 Tech Stack

| Technology | Purpose |
|---|---|
| ☕ Java 17 | Core language |
| 🌱 Spring Boot 3.0.5 | Application framework |
| 🌐 Spring Web | REST API layer |
| 🔐 Spring Security | Authentication & authorization |
| 🗃️ Spring Data JPA + Hibernate | ORM & database access |
| 🐬 MySQL | Persistent storage |
| 🔄 Jackson | JSON (de)serialization |
| ✂️ Lombok | Boilerplate reduction |
| 📦 Maven | Build & dependency management |
| 🧪 JUnit / Spring Boot Test | Testing |

> 👉 Full version details and every prerequisite live in **[REQUIREMENTS.md](./REQUIREMENTS.md)**.

---

## 📁 Project Structure

```text
Insurance-Management-System/
│
├── 📂 src/
│   ├── 📂 main/
│   │   ├── 📂 java/com/example/IMTAssignment/
│   │   │   ├── ⚙️  Config/       → Security & user-details config
│   │   │   ├── 🌐 Controller/    → REST endpoints
│   │   │   ├── 📦 DTOs/          → Request/response objects
│   │   │   ├── 🔖 Enum/          → InsuranceType, ClaimStatus
│   │   │   ├── 🧱 Models/        → JPA entities
│   │   │   ├── 🗃️  Repository/   → Spring Data JPA repositories
│   │   │   └── ⚙️  Service/      → Business logic
│   │   └── 📂 resources/
│   │       └── application.properties
│   └── 📂 test/
│
├── 📄 pom.xml
├── 📄 mvnw / mvnw.cmd
├── 📄 README.md
└── 📄 REQUIREMENTS.md
```

---

## 🚀 Quick Start

### 1️⃣ Clone the repo
```bash
git clone https://github.com/<your-username>/Insurance-Management-System.git
cd Insurance-Management-System
```

### 2️⃣ Create the database
```sql
CREATE DATABASE imt_assignment;
```

### 3️⃣ Configure your credentials
Edit `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/imt_assignment?createTableIfNotExists=true
spring.datasource.username=root
spring.datasource.password=root
spring.jpa.hibernate.ddl-auto=update
```
> ⚠️ Replace `username`/`password` with your local MySQL credentials. Never commit real credentials — use environment variables in production.

### 4️⃣ Build & run
```bash
# macOS / Linux
./mvnw clean install
./mvnw spring-boot:run

# Windows
mvnw.cmd clean install
mvnw.cmd spring-boot:run
```

### 5️⃣ It's alive! 🎉
```text
http://localhost:8080
```

---

## 🧪 Testing the API

Register a user first (this endpoint is public):

```bash
curl -X POST http://localhost:8080/user/add \
  -H "Content-Type: application/json" \
  -d '{"username":"admin1","password":"admin123","role":"ADMIN"}'
```

Then call a protected endpoint with your credentials (basic/form auth):

```bash
curl -u admin1:admin123 http://localhost:8080/client/getAll
```

Recommended tools: 🟠 Postman · 🔵 Insomnia · 💻 IntelliJ HTTP Client · ⌨️ cURL

---

## 🎯 What This Project Demonstrates

✅ Java Backend Development · ✅ Spring Boot · ✅ REST API Design · ✅ CRUD Operations  
✅ Spring Security · ✅ Role-Based Access Control · ✅ BCrypt Password Hashing  
✅ MySQL · ✅ JPA & Hibernate · ✅ DTO-based API Design · ✅ Layered Architecture · ✅ Maven

---

## 🚀 Roadmap

- [ ] 🔑 JWT-based authentication
- [ ] 📚 Swagger / OpenAPI documentation
- [ ] ⚠️ Global exception handling
- [ ] ✅ Bean validation on DTOs
- [ ] 🔎 Search & filtering
- [ ] 📄 Pagination and sorting
- [ ] 🔄 Claim approval workflow
- [ ] 📧 Email notifications
- [ ] 🐳 Docker containerization
- [ ] 🔄 CI/CD pipeline

---

## 🤝 Contributing

Contributions are welcome!

1. 🍴 Fork the repo
2. 🌿 Create a branch: `git checkout -b feature/your-feature`
3. 💾 Commit: `git commit -m "Add your feature"`
4. 📤 Push: `git push origin feature/your-feature`
5. 🔁 Open a Pull Request


---


### ⭐ If this project helped you, consider giving it a star!

**Built with ☕ Java + 🌱 Spring Boot + 🐬 MySQL**

</div>
