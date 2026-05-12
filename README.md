# PrimeBasket Frontend Architecture

![Angular Version](https://img.shields.io/badge/Angular-17.3-red)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Code Quality](https://img.shields.io/badge/SonarQube-Passing-blue)

PrimeBasket is a modern, highly responsive, and dynamic e-commerce platform built with **Angular 17** and **Tailwind CSS**. It connects seamlessly to the PrimeBasket Microservices backend to provide a robust shopping and merchant experience.

---

## 🏗️ Architecture & Portals

The application is structured into three distinct portals, each tailored to a specific user role, complete with role-based routing and navigation:

*   **Customer View**: 
    - The main storefront for browsing the product catalog.
    - Features include authenticated-gated features like Cart management, "remove-on-zero" cart interactions, checkout flows, and Order history.
    - **Wallet Integration**: Includes a built-in wallet system with real-time balance displays and recharge capabilities powered by the **Razorpay Payment Gateway**.
*   **Merchant Portal**: 
    - A dedicated dashboard for sellers.
    - Merchants can register, track their approval status (Pending -> Approved), manage their product catalogs ("My Products"), and utilize a side-collapsible navigation drawer for a premium user experience.
*   **Admin View (Mission Control)**: 
    - The central administrative dashboard.
    - Admins can manage the platform, oversee operations, and handle real-time merchant approvals.

---

## 🛠️ Technology Stack

*   **Framework:** Angular 17 (Standalone Components)
*   **Styling:** Tailwind CSS (with responsive layouts and modern UI aesthetics)
*   **Routing:** Angular Router with Role-Based Route Guards
*   **Payment Gateway:** Razorpay API Integration
*   **State Management:** RxJS / Signals
*   **Code Quality:** SonarQube

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- Angular CLI (`npm install -g @angular/cli`)
- A running instance of the **PrimeBasket Backend** microservices.

### 1. Installation
Clone the repository and install the dependencies:
```bash
npm install
```

### 2. Development Server
Run the local development server:
```bash
ng serve
```
Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

---

## 🛡️ Code Quality & Analysis

### SonarQube Integration
Static code analysis is integrated to maintain strict code quality gates and detect vulnerabilities, ensuring consistency with the backend standards.
To run an analysis locally:
1. Ensure your local SonarQube server is running.
2. Execute the included PowerShell script:
```powershell
.\run-sonar.ps1
```

---

## 🧪 Testing

To execute the unit tests via Karma:
```bash
ng test
```

## 📦 Build for Production

Run the build command to compile the project for production. The build artifacts will be stored in the `dist/` directory.
```bash
ng build --configuration production
```
