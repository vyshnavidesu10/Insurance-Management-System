# Insurance Management System

## Project Overview
The Insurance Management System is a full-stack web application developed to manage insurance policies, customers, and claims. It provides separate functionalities for administrators and clients.

## Technologies Used

### Frontend
- React.js
- JavaScript
- HTML5
- CSS3

### Backend
- Java
- Spring Boot
- Spring Data JPA
- Spring Security
- Maven

### Database and Tools
- MySQL
- Postman
- VS Code
- Eclipse / Spring Tool Suite
- Git and GitHub

## Project Features

### Admin Module
- Admin login
- Dashboard management
- Add, view, update, and delete customers
- Add, view, update, and delete insurance policies
- View and manage insurance claims
- Update claim status

### Client Module
- Client registration and login
- View personal profile
- View available insurance policies
- Submit insurance claims
- Track claim status

## Project Structure

```text
Insurance-Management-System/
│
├── Insurance-Management-System-main/
│   ├── src/
│   ├── pom.xml
│   ├── mvnw
│   └── mvnw.cmd
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── index.html
│
└── README.md
```

## Database Configuration

1. Install and start MySQL.
2. Create a database named `insurance`.
3. Configure the database URL, username, and password in the backend `application.properties` file.
4. Do not publish real database passwords or secret keys on GitHub.

## How to Run the Project

### 1. Run the Backend

Open the backend folder:

```bash
cd Insurance-Management-System-main
```

Run the Spring Boot application:

```bash
mvnw.cmd spring-boot:run
```

Backend URL:

```text
http://localhost:8080
```

### 2. Run the Frontend

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the React application:

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

## API Testing
Postman is used to test backend REST APIs and verify application functionality.

## Future Enhancements
- Online payment integration
- Email notifications
- Enhanced reporting and analytics
- Cloud deployment

## Author
**Vaishnavi Desu**

B.Tech – Information Technology

## License
This project is developed for educational purposes.
