# Bristol Park Hospital Management System

A modern hospital management system built with React, TypeScript, and Tailwind CSS. This system provides a comprehensive solution for managing patients, appointments, admissions, and other hospital operations.

## Features

- **Patient Management**: Register, update, and manage patient information
- **Appointment Scheduling**: Schedule and manage patient appointments
- **Admission Management**: Manage patient admissions and room assignments
- **Staff Management**: Manage doctors, nurses, and other hospital staff
- **Billing and Payments**: Process payments and generate invoices
- **Reporting**: Generate various reports for hospital operations
- **Multi-Branch Support**: Support for multiple hospital branches
- **Role-Based Access Control**: Different access levels for different user roles

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Docker and Docker Compose (for containerized deployment)

### Installation

#### Option 1: Docker (Recommended)

1. Clone the repository:
   ```bash
   git clone https://github.com/Ricoamal/bristolparkhospital.git
   cd bristolparkhospital
   ```

2. Start with Docker:
   ```bash
   # Development mode with hot-reloading
   docker-compose -f docker-compose.dev.yml up

   # Production mode
   docker-compose up

   # Or use the deployment script
   ./deploy.sh -e dev    # Development
   ./deploy.sh -e prod   # Production
   ```

3. Access the application:
   - Development: http://localhost:5173
   - Production: http://localhost:80

#### Option 2: Manual Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Ricoamal/bristolparkhospital.git
   cd bristolparkhospital
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal)

## Project Structure

```
bristolparkhospital/
├── public/             # Static assets
├── src/
│   ├── components/     # React components
│   │   ├── common/     # Common UI components
│   │   ├── dashboard/  # Dashboard components
│   │   ├── patients/   # Patient-related components
│   │   └── ...
│   ├── context/        # React context providers
│   ├── hooks/          # Custom React hooks
│   ├── services/       # API services
│   ├── utils/          # Utility functions
│   ├── types/          # TypeScript type definitions
│   ├── config/         # Configuration files
│   ├── styles/         # Global styles
│   ├── App.tsx         # Main App component
│   └── main.tsx        # Entry point
├── .gitignore          # Git ignore file
├── index.html          # HTML template
├── package.json        # Project dependencies
├── tsconfig.json       # TypeScript configuration
├── vite.config.ts      # Vite configuration
└── README.md           # Project documentation
```

## Backend Migration

Instead of integrating with the legacy Java backend, we are migrating data to a new modern backend stack. For detailed information on the migration strategy and implementation, please refer to the [Backend Migration Guide](./BACKEND_MIGRATION.md).

## Available Scripts

### Local Development
- `npm run dev` - Start the development server
- `npm run build` - Build the production-ready application
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check for code quality issues
- `npm run test` - Run tests

### Docker Commands
- `docker-compose -f docker-compose.dev.yml up` - Start development environment
- `docker-compose up` - Start production environment
- `./deploy.sh -e dev` - Start development with deployment script
- `./deploy.sh -e prod -b -d` - Build and start production in detached mode
- `./health-check.sh` - Check the health of all services

## Design System

The application uses a custom design system based on Tailwind CSS. The main colors are:
- Primary Blue: `#2B3990`
- Accent Red: `#A61F1F`
- Font Family: NEXA

A complete showcase of all UI components can be found in the Design System page within the application.

## Branch-Based Access

The system supports location-based login with access control for 5 branches:
- Fedha
- Utawala
- Machakos
- Tassia
- Kitengela

## User Roles

The system supports multiple user roles with different access levels:
- Supa Admin
- Admin
- Doctor
- Accountant
- Front Office
- Nurses
- Pharmacy
- Mortuary Attendant

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

## Contact

For any questions or support, please contact the development team at dev@bristolparkhospital.com.
