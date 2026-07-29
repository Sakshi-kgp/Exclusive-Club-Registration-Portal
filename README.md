# Exclusive Club Registration Portal 🎟️✨

A Spring Boot REST API built with Spring Data JPA and MySQL for managing exclusive club memberships. The application enforces strict validation rules, prevents duplicate registrations, and implements a Soft Delete mechanism to ensure no member data is permanently lost.

---

## 🚀 Features

- Member Registration API
- Input Validation using Spring Validation
- Duplicate Email Prevention
- Soft Delete Functionality
- View Active Members Only
- Layered Architecture (Controller → Service → Repository → Entity)
- MySQL Database Integration
- RESTful API Design

---

## 🛠️ Tech Stack

- Java
- Spring Boot
- Spring Web
- Spring Data JPA
- Spring Validation
- MySQL
- Lombok
- Maven

---

## 📂 Project Structure

```text
src/main/java
│
├── controller
│   └── MemberController.java
│
├── service
│   └── MemberService.java
│
├── repository
│   └── MemberRepository.java
│
├── dto
│   └── MemberDTO.java
│
└── model
    └── Member.java
```

---

## ⚙️ How It Works

### Member Registration

1. User submits registration details.
2. DTO validation checks:
   - Name is not blank.
   - Name contains at least 3 characters.
   - Email is not blank.
   - Email format is valid.
3. Service checks whether the email already exists.
4. If email exists, registration is rejected.
5. Otherwise, the member is saved in the database.

### Soft Delete

Instead of permanently deleting records, the application updates the `isDeleted` flag:

```java
member.setDeleted(true);
```

This keeps the record in the database while hiding it from active member listings.

### Active Members

Only members with:

```java
isDeleted = false
```

are returned when fetching active members.

---

## 🗄️ Database Configuration (MySQL)

### Create Database

```sql
CREATE DATABASE clubdb;
```

### application.properties

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ClubRegistration
spring.datasource.username=root
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
```

### MySQL Dependency

```xml
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
</dependency>
```

---

## ▶️ Running the Application

### Clone the Repository

```bash
git clone https://github.com/your-username/exclusive-club-registration-portal.git
```

### Navigate to the Project

```bash
cd exclusive-club-registration-portal
```

### Run the Application

```bash
mvn spring-boot:run
```

Or run the Spring Boot main class directly from your IDE.

---

## 📡 API Endpoints

### Register Member

**POST** `/api/register`

#### Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

#### Success Response

```http
201 CREATED
```

#### Error Response

```http
400 BAD REQUEST
```

Example:

```json
{
  "name": "",
  "email": "john@example.com"
}
```

---

### Soft Delete Member

**DELETE** `/api/{id}`

Example:

```http
DELETE /api/1
```

#### Success Response

```http
200 OK
```

#### Member Not Found

```http
404 NOT FOUND
```

---

### Get Active Members

**GET** `/api/`

#### Success Response

```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "deleted": false
  }
]
```

---

## ✅ Validation Rules

### Name Validation

- Cannot be null
- Cannot be blank
- Cannot contain only spaces
- Must contain at least 3 characters

### Email Validation

- Cannot be blank
- Must be a valid email address

### Duplicate Email Check

If an email already exists:

```text
Email already registered!
```

---

## 🧪 Example Test Cases

### Valid Registration

```json
{
  "name": "Alice",
  "email": "alice@example.com"
}
```

Response:

```http
201 CREATED
```

### Duplicate Email

```json
{
  "name": "Alice",
  "email": "alice@example.com"
}
```

Response:

```http
400 BAD REQUEST
```

Message:

```text
Email already registered!
```

### Invalid Email

```json
{
  "name": "Alice",
  "email": "alice.com"
}
```

Response:

```http
400 BAD REQUEST
```

### Soft Delete

```http
DELETE /api/1
```

Response:

```http
200 OK
```

The record remains in the database with:

```java
isDeleted = true;
```

---

## 🎯 Learning Outcomes

This project demonstrates:

- Spring Boot REST API Development
- DTO Validation
- JPA Entity Mapping
- Repository Pattern
- Constructor-Based Dependency Injection
- Custom JPQL Queries
- Soft Delete Design Pattern
- Exception Handling
- MySQL Integration

---

## 👨‍💻 Author

**Your Name**

Built as part of the Exclusive Club Registration Portal Project to demonstrate backend development using Spring Boot, JPA, Validation, and MySQL.

⭐ Star this repository if you found it useful.
