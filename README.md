# Medical Camps Management System ( MEDIC )

## Live Site Link
[https://medic-61958.web.app]

## Overview
This is a comprehensive React-based web application for managing medical camps. It allows participants to explore, register, and provide feedback on camps while enabling organizers to add, update, and manage their medical events. The system incorporates authentication, dashboards, analytics, and payment processing to enhance user experience.

## Features

### Home Page
- **Navbar:** Includes a logo, website name, Home, Available Camps, and Join Us (if not logged in). Logged-in users see their profile picture, which opens a dropdown with username, Dashboard, and Logout options.
- **Banner Section:** Displays a slider with success stories and impactful moments from past medical camps.
- **Popular Medical Camps:** Showcases up to six camps with details such as name, image, fees, date & time, location, healthcare professional, and participant count.
- **See All Camps:** Button linking to the "Available Camps" page.
- **Camp Details:** Users can view detailed camp information and join a camp via a registration modal.
- **Feedback & Ratings Section:** Displays participant feedback and ratings.
- **Additional Section:** Custom feature added for improved clarity and functionality.

### Available Camps Page
- Displays all camps added by organizers with essential details.
- **Search Bar:** Allows searching based on keywords, dates, or other criteria.
- **Sorting Feature:** Camps can be sorted by Most Registered, Camp Fees, or Alphabetical Order.
- **Layout Toggle:** Switch between three-column and two-column views.

### Organizer Dashboard (Private Route)
- **Organizer Profile:** Update personal details.
- **Add A Camp:** Input and validate new camp details via Formik or React Hook Form.
- **Manage Camps:** Edit or delete existing camps.
- **Manage Registered Camps:** View registered participants, payment status, confirmation status, and cancel registrations.

### Participant Dashboard (Private Route)
- **Analytics:** Displays participant's registered camp data via charts (using Recharts).
- **Participant Profile:** Update personal details.
- **Registered Camps:** View registered camps with options for payment, cancellation, and feedback submission.
- **Payment History:** Track camp payments and transaction details.

### Authentication & Authorization
- **Join Us Page:** Includes login form with social login.
- **Register Page:** Implements `react-hook-form` for validation.
- **JWT Authentication:** Secure sensitive routes using JSON Web Token (JWT) stored in local storage.

### Additional Features
- **Pagination & Search in Tables:** Implemented for better data management.
- **Animations:** Integrated Framer Motion / AOS for a smooth user experience.
- **Axios Interceptor:** Handles API requests efficiently.
- **Custom Dashboard Feature:** Example: Volunteer Management, Appointment Scheduling, Community Forums, etc.

## Technologies Used
- **Frontend:** React, React Router, TailwindCSS, shadcn/ui, Recharts, Framer Motion / AOS
- **State Management:** Context API / Redux (if applicable)
- **Form Handling:** React Hook Form / Formik
- **Backend:** Node.js, Express.js, MongoDB
- **Authentication:** Firebase, JWT
- **Payments:** Stripe
- **API Handling:** Axios (with interceptors)

## Installation Guide
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo-link.git
   ```
2. Navigate to the project directory:
   ```sh
   cd medical-camps-management
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Create a `.env` file and add necessary environment variables:
   ```env
   REACT_APP_API_URL=your_backend_api_url
   REACT_APP_FIREBASE_CONFIG=your_firebase_config
   ```
5. Start the development server:
   ```sh
   npm run dev
   ```

## Contribution
Feel free to contribute by creating issues or submitting pull requests. Make sure to follow the project's coding standards and guidelines.

## License
This project is open-source and available under the [MIT License](LICENSE).
