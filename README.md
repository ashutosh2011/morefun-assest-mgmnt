# Asset Management Portal

A comprehensive web application for managing company assets, handling scrap requests, and generating detailed reports. Built with Next.js, Prisma, and TypeScript.

## Features

### 1. Asset Management
- **Asset Tracking**: Maintain detailed records of all company assets
- **Asset Categories**: Organize assets by type (IT, Non-IT, etc.)
- **Asset Assignment**: Assign assets to users and departments
- **Depreciation Tracking**: Automatic calculation and tracking of asset depreciation
- **Bulk Upload**: Import multiple assets via CSV/Excel files
- **Export**: Download asset data in CSV or Excel format

### 2. User Management
- **Role-based Access**: Different permission levels (Admin, Manager, User)
- **Department Organization**: Group users by departments
- **Bulk User Upload**: Import multiple users via CSV
- **User Profile**: Manage user information and assignments

### 3. Scrap Request System
- **Request Workflow**: Structured process for asset disposal requests
- **Multi-level Approval**: Configurable approval hierarchy
- **Status Tracking**: Monitor request status and history
- **Email Notifications**: Automated alerts for approvers

### 4. Administrative Features
- **Branch Management**: Configure multiple company branches
- **Department Setup**: Manage organizational structure
- **Role Configuration**: Define user roles and permissions
- **System Settings**: Customize application behavior

### 5. Reporting & Analytics
- **Asset Reports**: Generate detailed asset status reports
- **Depreciation Reports**: Track asset value over time
- **Activity Logs**: Monitor system usage and changes
- **Custom Exports**: Download data in various formats

## Project Structure
asset-management/
├── app/ # Next.js app directory
│ ├── api/ # API routes
│ ├── admin/ # Admin panel pages
│ ├── assets/ # Asset management pages
│ ├── dashboard/ # Dashboard views
│ └── scrap-approval/ # Scrap request pages
├── components/ # React components
│ ├── Admin/ # Admin-related components
│ ├── Assets/ # Asset-related components
│ ├── Dashboard/ # Dashboard components
│ └── Layout/ # Layout components
├── lib/ # Utility functions and shared code
├── prisma/ # Database schema and migrations
└── public/ # Static files

## Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn package manager

## Development Guide

### Adding New Features

1. **Create New Pages**
   - Add new pages in the `app` directory
   - Follow the Next.js App Router structure

2. **Add API Endpoints**
   - Create new routes in `app/api`
   - Use the route.ts naming convention

3. **Create Components**
   - Add reusable components in the `components` directory
   - Follow the existing component structure

### Database Changes

1. **Update Schema**
   - Modify `prisma/schema.prisma`
   - Run `npx prisma generate`
   - Run `npx prisma migrate dev`

2. **Add Seeds**
   - Update `prisma/seed.ts`
   - Run `npx prisma db seed`

### Styling

- Uses Tailwind CSS for styling
- Custom theme configuration in `tailwind.config.ts`
- Global styles in `app/globals.css`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@example.com or create an issue in the repository.

## Testing Checklist

### 1. Authentication & Authorization
- [ ] User Registration
  - [ ] Valid email format validation
  - [ ] Password strength requirements
  - [ ] Duplicate email prevention
  - [ ] Success/error messages

- [ ] Login System
  - [ ] Valid credentials login
  - [ ] Invalid credentials handling
  - [ ] Session persistence
  - [ ] Logout functionality
  - [ ] Password reset flow

- [ ] Role-based Access
  - [ ] Admin access to all features
  - [ ] Manager limited access
  - [ ] User restricted access
  - [ ] Unauthorized access prevention

### 2. Asset Management
- [ ] Asset Creation
  - [ ] Required fields validation
  - [ ] Asset code uniqueness
  - [ ] File upload for asset images
  - [ ] Success/error handling

- [ ] Asset Listing
  - [ ] Pagination functionality
  - [ ] Sorting by columns
  - [ ] Filter combinations
  - [ ] Search functionality
  - [ ] Loading states

- [ ] Asset Updates
  - [ ] Field modifications
  - [ ] History tracking
  - [ ] Status changes
  - [ ] Location updates
  - [ ] Assignment changes

- [ ] Bulk Operations
  - [ ] CSV import validation
  - [ ] Excel import validation
  - [ ] Error handling
  - [ ] Success confirmation
  - [ ] Progress indication

### 3. Scrap Request System
- [ ] Request Creation
  - [ ] Form validation
  - [ ] Asset availability check
  - [ ] Document attachments
  - [ ] Submission confirmation

- [ ] Approval Workflow
  - [ ] Sequential approvals
  - [ ] Email notifications
  - [ ] Approval/rejection actions
  - [ ] Comments functionality
  - [ ] Status updates

### 4. Administrative Functions
- [ ] Branch Management
  - [ ] Create/Edit/Delete operations
  - [ ] Duplicate prevention
  - [ ] Association with assets
  - [ ] Location validation

- [ ] Department Configuration
  - [ ] CRUD operations
  - [ ] User assignments
  - [ ] Asset associations
  - [ ] Hierarchy management

- [ ] User Management
  - [ ] CRUD operations
  - [ ] Role assignments
  - [ ] Department assignments
  - [ ] Status changes

### 5. Data Export/Import
- [ ] Export Functions
  - [ ] CSV format
  - [ ] Excel format
  - [ ] PDF generation
  - [ ] Data accuracy
  - [ ] File download

- [ ] Import Functions
  - [ ] File format validation
  - [ ] Data validation
  - [ ] Error handling
  - [ ] Success confirmation
  - [ ] Duplicate handling

### 6. Reports & Analytics
- [ ] Report Generation
  - [ ] Date range filters
  - [ ] Department filters
  - [ ] Category filters
  - [ ] Data accuracy
  - [ ] Export options

- [ ] Dashboard Analytics
  - [ ] Chart rendering
  - [ ] Data accuracy
  - [ ] Real-time updates
  - [ ] Filter functionality

### 7. Performance Testing
- [ ] Load Testing
  - [ ] Multiple concurrent users
  - [ ] Large data sets
  - [ ] File upload/download
  - [ ] Report generation
  - [ ] Search operations

- [ ] Response Times
  - [ ] Page load times
  - [ ] API response times
  - [ ] Export generation time
  - [ ] Import processing time

### 8. Security Testing
- [ ] Input Validation
  - [ ] SQL injection prevention
  - [ ] XSS prevention
  - [ ] CSRF protection
  - [ ] File upload security

- [ ] Authentication Security
  - [ ] Session management
  - [ ] Password encryption
  - [ ] Token validation
  - [ ] Access control

### 9. UI/UX Testing
- [ ] Responsive Design
  - [ ] Desktop layout
  - [ ] Tablet layout
  - [ ] Mobile layout
  - [ ] Print layout

- [ ] Browser Compatibility
  - [ ] Chrome
  - [ ] Firefox
  - [ ] Safari
  - [ ] Edge

- [ ] Accessibility
  - [ ] Screen reader compatibility
  - [ ] Keyboard navigation
  - [ ] Color contrast
  - [ ] ARIA attributes

### 10. Error Handling
- [ ] Form Validations
  - [ ] Field-level errors
  - [ ] Form-level errors
  - [ ] Error message clarity
  - [ ] Recovery options

- [ ] System Errors
  - [ ] API error handling
  - [ ] Database error handling
  - [ ] File operation errors
  - [ ] Network error handling

### 11. Integration Testing
- [ ] API Endpoints
  - [ ] Request/response format
  - [ ] Status codes
  - [ ] Error responses
  - [ ] Data consistency

- [ ] Database Operations
  - [ ] CRUD operations
  - [ ] Transaction handling
  - [ ] Data integrity
  - [ ] Relationship maintenance

### 12. Backup & Recovery
- [ ] Data Backup
  - [ ] Automated backups
  - [ ] Manual backup option
  - [ ] Backup verification
  - [ ] Storage management

- [ ] System Recovery
  - [ ] Data restoration
  - [ ] Error recovery
  - [ ] Session recovery
  - [ ] Connection recovery

### Test Environment Setup
1. Development Environment
   - Local development setup
   - Test database configuration
   - Mock data generation
   - Environment variables

2. Staging Environment
   - Production-like setup
   - Data sanitization
   - Performance monitoring
   - Security scanning

3. Production Environment
   - Deployment checklist
   - Monitoring setup
   - Backup configuration
   - SSL certification

### Testing Tools Required
1. Unit Testing
   - Jest
   - React Testing Library

2. E2E Testing
   - Cypress
   - Playwright

3. API Testing
   - Postman
   - REST Client

4. Performance Testing
   - Lighthouse
   - WebPageTest

5. Security Testing
   - OWASP ZAP
   - SonarQube
