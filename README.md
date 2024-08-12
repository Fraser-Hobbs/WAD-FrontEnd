
# Frontend - Charity Shop Inventory System

This repository contains the frontend portion of the Charity Shop Inventory System, built with Angular. The frontend interacts with the backend API to provide a dynamic and responsive user interface.

## Table of Contents

- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development](#development)
- [Build](#build)
- [Docker](#docker)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

This section will guide you through setting up the frontend project for development or deployment.

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [Angular CLI](https://angular.io/cli)
- [pnpm](https://pnpm.io/) (recommended for package management)

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/frontend.git
   cd frontend
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

## Development

To run the frontend application locally:

```bash
pnpm start
```

This will start the Angular development server. The application will be accessible at `http://localhost:4200`.

## Build

To build the application for production:

```bash
pnpm build --configuration production
```

The output will be located in the `dist/` directory.

## Docker

To build and run the frontend application using Docker:

1. **Build the Docker image:**

   ```bash
   docker build -t myapp-frontend .
   ```

2. **Run the Docker container:**

   ```bash
   docker run -p 8080:80 myapp-frontend
   ```

The application will be accessible at `http://localhost:8080`.

## Contributing

To contribute to this project, follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-branch-name`.
3. Make your changes and commit them: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature-branch-name`.
5. Submit a pull request.

## License

This project is licensed under the MIT License
