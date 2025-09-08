# Jersey Hub - Frontend

Jersey Hub is a modern e-commerce platform for football jersey enthusiasts, built with **React, TypeScript, Vite, Redux Toolkit, and TailwindCSS**. It provides a seamless shopping experience for users to browse, filter, and purchase jerseys, along with a comprehensive dashboard for administrators to manage products and orders.

---

## 🚀 Features

### 👤 Public & User Features

*   Browse a wide collection of football jerseys.
*   Filter products by league, team, price, and other attributes.
*   Sort products by name, price, and new arrivals.
*   Detailed product pages with image galleries, size guides, and descriptions.
*   Add products to a persistent shopping cart.
*   Responsive and user-friendly checkout process with multiple payment options.
*   Secure user authentication (Login/Register).
*   User profile dashboard to view and track order history.

### 👨‍💻 Admin Features

*   Full CRUD (Create, Read, Update, Delete) functionality for products.
*   Manage product details, including images, variants (sizes, stock), and pricing.
*   View and manage all customer orders.
*   Role-based access control to secure admin functionalities.

### 🌐 Public Pages

*   Home page with featured products, new arrivals, and testimonials.
*   Collections page with advanced filtering and sorting.
*   About, FAQ, Delivery Policy, and Contact Us pages.

---

## 🛠️ Tech Stack

*   **Frontend Framework**: React + TypeScript + Vite
*   **State Management**: Redux Toolkit + RTK Query
*   **Styling**: TailwindCSS + shadcn/ui components
*   **Routing**: React Router
*   **UI Libraries**: Radix UI, Lucide Icons, Recharts (for charts)
*   **Form Handling**: React Hook Form + Zod for validation
*   **Notifications**: Sonner

---

## 📂 Project Structure

```
jersey-hub-frontend/
│── src/
│   ├── components/       # Reusable UI & layout components (modules, ui, layout)
│   ├── pages/            # Page-level components (Admin, AllRoles, Public)
│   ├── redux/            # Redux store, APIs (RTK Query), and feature slices
│   ├── routes/           # Route configurations
│   ├── lib/              # Utility functions
│   ├── constants/        # App constants (e.g., team data)
│   └── interfaces/       # TypeScript interfaces
│
│── package.json          # Project dependencies & scripts
│── vite.config.ts        # Vite configuration
│── tsconfig.json         # TypeScript configuration
```

---

## ⚙️ Installation & Setup

1.  **Clone the repository**

    ```bash
    git clone https://github.com/sakincse21/jersey-hub-frontend.git
    cd jersey-hub-frontend
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Run development server**

    ```bash
    npm run dev
    ```

4.  **Build for production**

    ```bash
    npm run build
    ```

---

## 🔐 Authentication & Roles

*   JWT-based authentication for secure access.
*   Role-based access control distinguishing between **User** and **Admin**.
*   Protected routes to restrict access to admin and user-specific pages.

