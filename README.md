
# MERN Stack Availability Management System

## Overview

This project is a web-based application that allows users to dynamically set their availability for specific days or the entire week. It includes an admin interface for scheduling sessions and monitoring user availability. The application is built using the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

- **User Registration and Login**: Users can create accounts and log in to manage their availability.
- **Availability Management**: Users can add, edit, and delete their availability slots.
- **Admin Dashboard**: Admins can view all users' profiles and their availability.
- **Authentication**: Passwords are hashed, and users are authenticated to ensure security.

## Setup and Run Instructions

### Prerequisites

- Node.js (v14.x or higher)
- MongoDB (v4.x or higher)
- Git

### Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/jaheer037/D2.git
    cd D2
    ```

2. **Backend Setup**:
    - Navigate to the backend directory:
      ```bash
      cd backend
      ```
    - Install the required dependencies:
      ```bash
      npm install
      ```
    - Start the backend server:
      ```bash
      nodemon server.js //for running backend server, if nodemon is not installed then use npm i nodemon command then run run server
      ```

3. **Frontend Setup**:
    - Navigate to the frontend directory:
      ```bash
      cd ../dynamic-scheduling
      ```
    - Install the required dependencies:
      ```bash
      npm install
      ```
    - Start the frontend development server:
      ```bash
      npm start
      ```

4. **Access the Application**:
   - The browser automatically opens with the url `http://localhost:3000`, if not then
   - Open your browser and navigate to `http://localhost:3000`.
   - in the login form password feild is not clickable then press tab button to aceess the input feild

### Project Structure

- **Backend**:
  - **Models**: Mongoose schemas for `User` and `Availability`.
  - **Routes**: Express routes for handling user authentication, availability management, and admin functionalities.
  - **Controllers**: Functions that handle the business logic for routes.
  - **Middleware**: Custom middleware for authentication and error handling.

- **Frontend**:
  - **Components**: Reusable React components for user interface.
  - **Pages**: Main views such as `Login`, `Register`, `UserAvailability`, and `AdminDashboard`.
  - **CSS**: Custom styles for each component.

### System Architecture

- **Frontend**: Built with React.js, the frontend handles the user interface and communicates with the backend via API calls using `axios`. The application state is managed using React's built-in hooks like `useState` and `useEffect`.

- **Backend**: The backend is built with Node.js and Express.js, handling RESTful API requests, authentication, and database interactions. MongoDB is used for data storage, with Mongoose as the ODM for schema definition and interaction.

### Design Choices and Considerations

- **MERN Stack**: Chosen for its full-stack JavaScript capabilities, allowing for a seamless development experience from front to back.
- **Component-Based Architecture**: React.js components are designed to be reusable and modular, improving maintainability and scalability.
- **Security**: Passwords are hashed using bcrypt, and JWT tokens are used for authentication, ensuring secure user data management.
- **Responsive Design**: CSS styles are tailored to ensure the application is accessible and usable across different devices and screen sizes.

### Future Improvements

- **Session Management**: Implement session scheduling and management for both users and admins.
- **Notification Preferences**: Allow users to set preferences for notifications, such as email or SMS.

---
