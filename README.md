# Discover

A full-stack project that leverages the power of Laravel for the back-end and the reactivity of React for the front-end, providing a solid and modern foundation for web application development.

## ✨ Overview

The project is structured into two main parts:

- **`back-end`**: A Laravel 12 application that serves as the main API.
- **`front-end`**: A React 19 application, built with Vite for fast and efficient development.

## 🚀 Technologies Used

Discover is built with a set of modern and robust technologies:

| Category    | Technology                                        |
| :---------- | :------------------------------------------------ |
| **Back-end**  | PHP 8.2, Laravel 12, Laravel Sanctum              |
| **Front-end** | React 19, Vite, Rolldown-Vite                     |
| **Database**  | SQLite (default), MySQL, PostgreSQL (configurable) |
| **DevOps**    | Composer, NPM, Vite                               |

## 📂 Project Structure

The repository is organized as follows to keep the code clean and modular:

```
/Discover
├── back-end/
│   └── Discover/      # Laravel application (API)
└── front-end/
    └── src/           # React application source code
```

## 🏁 Getting Started

Follow these steps to set up and run the project in your local development environment.

### Prerequisites

Make sure you have the following tools installed:

- [PHP](https://www.php.net/downloads.php) >= 8.2
- [Composer](https://getcomposer.org/)
- [Node.js](https://nodejs.org/) and [NPM](https://www.npmjs.com/)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Pedro-Jorge18/Discover.git
    cd Discover
    ```

2.  **Set up the Back-end (Laravel):**

    ```bash
    cd back-end/Discover
    composer install
    cp .env.example .env
    php artisan key:generate
    php artisan migrate
    ```

3.  **Set up the Front-end (React):**

    ```bash
    cd ../../front-end
    npm install
    ```

### Running the Application

1.  **Start the Back-end server:**

    ```bash
    cd back-end/Discover
    php artisan serve
    ```

2.  **Start the Front-end development server:**

    ```bash
    cd ../../front-end
    npm run dev
    ```

After starting both servers, the application will be available at `http://localhost:5173` (or another port indicated by Vite).

## 🤝 Contributing

Contributions are always welcome! Feel free to open *issues* and *pull requests* to improve this project.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
