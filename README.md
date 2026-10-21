# OverloadFit — Personalized Fitness & Workout Platform

**Train Smarter. Track Progress. Get Stronger.**

OverloadFit is a full-stack fitness web application designed to help users manage their fitness journey through personalized workout planning, nutrition recommendations, exercise tracking, and performance analytics.

The platform combines fitness assessments, workout generation, progressive overload tracking, and nutrition planning to help users follow a more structured and goal-oriented fitness routine.

## Key Features

### 1. User Authentication
- User registration and login.
- JWT-based authentication.
- Password hashing for secure credential storage.
- Protected application routes and API endpoints.

### 2. Fitness Assessment
- Collect fitness-related information and preferences.
- Support fitness goals and physique-oriented planning.
- Use assessment information to personalize fitness recommendations.

### 3. Personalized Workout Planning
- Generate workout plans based on fitness goals and assessment data.
- Organize exercises into structured training routines.
- Support progressive overload principles to help users improve their performance over time.

### 4. Exercise Library
- Explore exercises and their relevant information.
- Support exercise selection when planning workouts.
- Organize exercise information for easier reference.

### 5. Workout Logging
- Record completed workouts.
- Track exercise performance and training history.
- Maintain workout records for reviewing progress.

### 6. Nutrition and Diet Planning
- Generate diet recommendations based on fitness goals.
- Support calorie and macronutrient calculations.
- Help users align nutrition planning with their workout objectives.

### 7. Progress Analytics
- Review workout history and performance trends.
- Track strength and training progression.
- Visualize relevant fitness metrics using charts.

### 8. User Profile
- Manage personal and fitness-related information.
- Maintain preferences used for personalized recommendations.

## Technology Stack

### Frontend
- **React** — Component-based user interface.
- **Vite** — Frontend development server and build tool.
- **React Router** — Client-side navigation.
- **Axios** — HTTP requests to backend APIs.
- **Chart.js** — Data visualization and progress analytics.
- **CSS** — Styling and responsive interface design.

### Backend
- **Node.js** — JavaScript runtime.
- **Express.js** — REST API and server framework.
- **MongoDB** — Database.
- **Mongoose** — MongoDB object modeling.
- **JSON Web Token (JWT)** — Authentication.
- **bcryptjs** — Password hashing.
- **Validation Middleware** — Request validation and input handling.

## Project Structure

```text
OverloadFit/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── package.json
│   └── ...
│
└── README.md
```

*Note: This is a representative structure. Folder names and locations should match the actual files in your repository.*

## Prerequisites

Before running the project, install:

- [Node.js](https://nodejs.org/)
- npm, included with Node.js
- [MongoDB](https://www.mongodb.com/) locally or through MongoDB Atlas
- [Git](https://git-scm.com/)

## Installation and Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/sinstvgod-create/Web-Development.git
cd Web-Development
```

### Step 2: Install Backend Dependencies

Open a terminal at the repository root and run:

```bash
cd backend
npm install
```

### Step 3: Configure Environment Variables

Create a `.env` file inside `backend/`, using the variable names expected by your backend configuration.

For example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_secret
```

These are example names and values. Confirm the exact environment-variable names in your backend source code before using them.

Never commit real database credentials, authentication secrets, or `.env` files to GitHub.

### Step 4: Start the Backend Server

Check the scripts in `backend/package.json`:

```bash
npm run dev
```

If a `dev` script is not defined, use the appropriate script from your package file, such as:

```bash
npm start
```

The backend URL and port depend on your server configuration.

### Step 5: Install Frontend Dependencies

Open a second terminal at the repository root:

```bash
cd frontend
npm install
```

### Step 6: Start the Frontend

Run:

```bash
npm run dev
```

Vite will display the local development URL in your terminal, commonly:

`http://localhost:5173`

Open that URL in your browser.

### Step 7: Connect Frontend and Backend

Make sure the frontend API service is configured to use the backend's actual URL and port. If the frontend uses environment variables for API configuration, create the appropriate frontend environment file using the variable name expected by the code.

If requests fail, check the API base URL, CORS configuration, backend status, and MongoDB connection.

## Application Workflow

1. Register a new account or log in.
2. Complete the fitness assessment.
3. Explore personalized workout recommendations.
4. Review exercise information and training routines.
5. Record completed workouts.
6. Explore diet and nutrition recommendations.
7. Review workout history and performance analytics.
8. Manage profile information and fitness preferences.

The availability of each workflow depends on the routes and functionality enabled in the current application version.

## API and Backend Architecture

The backend follows a REST API architecture, with routes handling incoming requests and controllers/services managing application logic.

Major functional areas include:

- Authentication and user management.
- Fitness assessment and workout generation.
- Exercise information.
- Workout logging and training history.
- Diet planning and nutrition calculations.
- Progress tracking and user profiles.

MongoDB and Mongoose support the storage and retrieval of application data.

## Security Considerations

- Store passwords as secure hashes rather than plaintext.
- Protect private API endpoints with appropriate authentication middleware.
- Validate incoming requests.
- Keep JWT secrets and database credentials out of source control.
- Configure CORS according to the application's deployment environment.
- Avoid exposing private user information in API responses.

## Future Improvements

- Expanded exercise library and training recommendations.
- More detailed progress charts and performance comparisons.
- Improved nutrition personalization.
- Additional workout templates and training splits.
- Enhanced mobile responsiveness and accessibility.
- Production deployment and automated testing.

## Contributing

Contributions and suggestions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Implement and test your changes.
4. Commit your changes with a descriptive message.
5. Submit a pull request.

## License

No license has been specified in this README. Unless a license is added to the repository, permissions to reuse, distribute, or modify the project should not be assumed.

---

**OverloadFit — Your Fitness Journey, Structured.**
