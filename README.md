# fin_ctrl

# FinCtrl - Role-Based Finance Tracker

FinCtrl is a **role-based finance tracking web application** built using **React.js** for the frontend and **Node.js with MongoDB** for the backend. It enables users to **track finances, manage event budgets, share financial data, and receive money management guidance**, while **admins** can **manage users, control visibility, and invest on behalf of users**.

---

## 🚀 Features
- **User Authentication**: Secure login and registration using **Auth0**
- **Role-Based Access**:
  - **User**: Track finances, manage events, share insights
  - **Admin**: Manage users, control finance plans, oversee investments
- **Event Management**: Create, update, and track budgets for events
- **Financial Insights**: Get guidance on money management
- **Data Security**: JWT authentication for backend API protection

---

## 🛠 Tech Stack
### **Frontend** (React.js)
- React.js
- React Router
- Tailwind CSS (or other styling frameworks)

### **Backend** (Node.js & Express)
- Node.js
- Express.js
- MongoDB (NoSQL database)
- Mongoose (MongoDB ODM)
- JSON Web Tokens (JWT) for authentication

### **Deployment**
- Frontend: **Deployed on Render**
- Backend: **Deployed on Render**
- Database: **MongoDB Atlas**

---

## 🔧 Installation & Setup
### **1. Clone the Repository**
```sh
 git clone https://github.com/shubhamiscodding/Fin_Ctrl.git
 cd Fin_Ctrl
```
### **2. Install Dependencies**
#### **Frontend**
```sh
 cd frontend  # Navigate to frontend directory
 npm install  # Install dependencies
```
#### **Backend**
```sh
 cd backend  # Navigate to backend directory
 npm install  # Install dependencies
```

### **3. Configure Environment Variables**
Create a `.env` file in the **backend** folder and add:
```env
not avalaible
```

### **4. Run the Application**
#### **Frontend**
```sh
 npm run dev
```
#### **Backend**
```sh
 node server.js
```

---

## 📂 Project Structure
```
Fin_Ctrl/
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/  # Different pages of the app
│   │   ├── context/  # Global state management
│   │   ├── utils/  # Helper functions
│   │   ├── App.js  # Main React component
│   │   ├── index.js  # React entry point
│   ├── package.json  # Frontend dependencies
│
├── backend/
│   ├── model/  # MongoDB Schemas (User, Admin, Finance, Event)
│   ├── routes/  # API Routes (User, Admin, Event)
│   ├── server.js  # Main backend file
│   ├── .env  # Environment variables
│   ├── package.json  # Backend dependencies
│
├── README.md  # Project Documentation
```

---

## 📌 API Routes Overview

### **User Routes (**``**)**

| Method | Endpoint       | Description               |
| ------ | -------------- | ------------------------- |
| POST   | `/register`    | Register a new user       |
| POST   | `/login`       | Login user (manual login) |
| GET    | `/profile/:id` | Get user profile by ID    |
| PUT    | `/update/:id`  | Update user profile       |
| DELETE | `/delete/:id`  | Delete a user account     |

### **Admin Routes (**``**)**

| Method | Endpoint       | Description                            |
| ------ | -------------- | -------------------------------------- |
| POST   | `/create`      | Register a new admin                   |
| GET    | `/users`       | Retrieve all users managed by an admin |
| GET    | `/profile/:id` | Get admin profile by ID                |
| PUT    | `/update/:id`  | Update admin profile                   |
| DELETE | `/delete/:id`  | Delete an admin account                |

### **Finance Routes (**``**)**

| Method | Endpoint                    | Description                                            |
| ------ | --------------------------- | ------------------------------------------------------ |
| POST   | `/`                         | Create a new finance record                            |
| GET    | `/`                         | Retrieve all finance records                           |
| GET    | `/period`                   | Get finance records by time period (month/week/custom) |
| POST   | `/:id/expenses`             | Add an expense to a finance record                     |
| POST   | `/:id/plan/:planId/savings` | Add savings to a finance plan                          |
| DELETE | `/:id`                      | Delete a finance record                                |

### **Event Routes (**``**)**

| Method | Endpoint      | Description             |
| ------ | ------------- | ----------------------- |
| POST   | `/create`     | Create a new event      |
| GET    | `/list`       | Retrieve all events     |
| GET    | `/:id`        | Get event details by ID |
| PUT    | `/update/:id` | Update an event         |
| DELETE | `/delete/:id` | Delete an event         |



## 🤝 Contributing
We welcome contributions! Follow these steps to contribute:
1. **Fork** the repository
2. **Create a new branch** (`feature-branch`)
3. **Make your changes** and commit them
4. **Push to your fork** and submit a PR


## 🔗 Connect with Me
- **GitHub**: [shubhamiscodding](https://github.com/shubhamiscodding)
- **LinkedIn**: [Your LinkedIn Profile](#)
- **Email**: [your-email@example.com](mailto:your-email@example.com)



## Figma link
https://www.figma.com/proto/DNBtQzukvRqvlJOR15WNiD/FINAL-PROJECT?node-id=103-636&t=pu4XjTKv2pbC3geb-1



