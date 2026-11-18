# 📋 Requirements & Setup Guide

Everything you need installed and configured to run the **Insurance Management System** locally.

---

## 🧾 System Requirements

| Requirement | Minimum Version | Notes |
|---|---|---|
| ☕ **Java (JDK)** | 17+ | Project is built and tested on Java 17 |
| 🐬 **MySQL** | 8.0+ | Used as the primary datastore |
| 📦 **Maven** | 3.8+ (optional) | The Maven Wrapper (`mvnw` / `mvnw.cmd`) is bundled, so a separate install isn't required |
| 🔧 **Git** | Any recent version | For cloning the repository |
| 💻 **IDE** | IntelliJ IDEA / Eclipse / VS Code | Any Java-capable IDE works |
| 🌐 **API Client** | Postman / Insomnia / cURL | For testing endpoints |

---

## 📦 Maven Dependencies (from `pom.xml`)

| Dependency | Role |
|---|---|
| `spring-boot-starter-web` | Build REST controllers |
| `spring-boot-starter-data-jpa` | ORM / database access via Hibernate |
| `spring-boot-starter-security` | Authentication & authorization |
| `mysql-connector-j` | MySQL JDBC driver |
| `jackson-databind` / `jackson-datatype-jsr310` | JSON serialization (incl. dates) |
| `lombok` | Reduces boilerplate (getters/setters/constructors) |
| `spring-boot-starter-test` / `spring-security-test` | Unit & integration testing |

You don't need to install these manually — Maven resolves them automatically on the first build.

---

## 🗄️ Database Setup

1. Install and start MySQL locally (or via Docker).
2. Create the database:
   ```sql
   CREATE DATABASE imt_assignment;
   ```
3. Update `src/main/resources/application.properties` with your own credentials:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/imt_assignment?createTableIfNotExists=true
   spring.datasource.username=<your-mysql-username>
   spring.datasource.password=<your-mysql-password>
   spring.jpa.hibernate.ddl-auto=update
   ```
   `ddl-auto=update` means Hibernate will automatically create/update tables to match the JPA entities — no manual schema scripts needed.

> 🔒 **Security tip:** for anything beyond local development, move credentials into environment variables (e.g. `${DB_USERNAME}`, `${DB_PASSWORD}`) instead of committing them in plain text.

---

## ⚙️ Environment Checklist

- [ ] JDK 17 installed and `JAVA_HOME` set
- [ ] MySQL server running on `localhost:3306` (or update the URL accordingly)
- [ ] `imt_assignment` database created
- [ ] `application.properties` updated with valid credentials
- [ ] Port `8080` free (default Spring Boot port)

---

## 🚀 Build & Run Commands

```bash
# Install dependencies & build
./mvnw clean install        # macOS/Linux
mvnw.cmd clean install      # Windows

# Run the application
./mvnw spring-boot:run      # macOS/Linux
mvnw.cmd spring-boot:run    # Windows
```

The API will be available at `http://localhost:8080`.

---

## 🔐 Creating Your First User

The `/user/add` endpoint is public, so you can register a user before authenticating anywhere else:

```bash
curl -X POST http://localhost:8080/user/add \
  -H "Content-Type: application/json" \
  -d '{"username":"admin1","password":"admin123","role":"ADMIN"}'
```

All other endpoints (`/client/**`, `/insurance/**`, `/claim/**`) require this login.

---

## 🧪 Running Tests

```bash
./mvnw test
```

---

## ❓ Troubleshooting

| Issue | Likely Fix |
|---|---|
| `Communications link failure` | MySQL isn't running, or the URL/port is wrong |
| `Access denied for user` | Wrong username/password in `application.properties` |
| `Port 8080 already in use` | Stop the other process, or set `server.port=8081` in `application.properties` |
| `401 Unauthorized` on client/insurance/claim routes | Register a user via `/user/add` first, then authenticate with those credentials |
