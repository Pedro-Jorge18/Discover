# Discover

Um projeto full-stack que utiliza o poder do Laravel para o back-end e a reatividade do React para o front-end, proporcionando uma base sólida e moderna para o desenvolvimento de aplicações web.

## ✨ Visão Geral

O projeto está estruturado em duas partes principais:

- **`back-end`**: Uma aplicação Laravel 12 que serve como a API principal.
- **`front-end`**: Uma aplicação React 19, criada com Vite para um desenvolvimento rápido e eficiente.

## 🚀 Tecnologias Utilizadas

O Discover é construído com um conjunto de tecnologias modernas e robustas:

| Categoria   | Tecnologia                                       |
| :---------- | :----------------------------------------------- |
| **Back-end**  | PHP 8.2, Laravel 12, Laravel Sanctum             |
| **Front-end** | React 19, Vite, Rolldown-Vite                    |
| **Database**  | SQLite (padrão), MySQL, PostgreSQL (configurável) |
| **DevOps**    | Composer, NPM, Vite                              |

## 📂 Estrutura do Projeto

O repositório está organizado da seguinte forma para manter o código limpo e modular:

```
/Discover
├── back-end/
│   └── Discover/      # Aplicação Laravel (API)
└── front-end/
    └── src/           # Código fonte da aplicação React
```

## 🏁 Começando

Siga estes passos para configurar e executar o projeto em seu ambiente de desenvolvimento local.

### Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas:

- [PHP](https://www.php.net/downloads.php) >= 8.2
- [Composer](https://getcomposer.org/)
- [Node.js](https://nodejs.org/) e [NPM](https://www.npmjs.com/)

### Instalação

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/Pedro-Jorge18/Discover.git
    cd Discover
    ```

2.  **Configure o Back-end (Laravel):**

    ```bash
    cd back-end/Discover
    composer install
    cp .env.example .env
    php artisan key:generate
    php artisan migrate
    ```

3.  **Configure o Front-end (React):**

    ```bash
    cd ../../front-end
    npm install
    ```

### Executando a Aplicação

1.  **Inicie o servidor do Back-end:**

    ```bash
    cd back-end/Discover
    php artisan serve
    ```

2.  **Inicie o servidor de desenvolvimento do Front-end:**

    ```bash
    cd ../../front-end
    npm run dev
    ```

Após iniciar os dois servidores, a aplicação estará disponível em `http://localhost:5173` (ou outra porta indicada pelo Vite).

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Sinta-se à vontade para abrir *issues* e *pull requests* para melhorar este projeto.

## 📄 Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
