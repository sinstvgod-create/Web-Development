# OverloadFit — Personalized Fitness Platform

OverloadFit is a fitness platform designed to help users manage their fitness journey through personalized workout plans, diet recommendations, exercise tracking, and progress monitoring. The platform aims to make fitness planning easier by providing users with tools to organize workouts and track their progress over time.

## Features

- **User Authentication** — Register and log in securely.
- **Fitness Assessment** — Provide fitness-related information to personalize your experience.
- **Personalized Workout Plans** — Follow workout routines based on individual fitness goals.
- **Diet Planning** — Access diet recommendations to support fitness goals.
- **Workout Logging** — Record workouts and exercises.
- **Progressive Overload Tracking** — Track workout performance and gradually increase training intensity.
- **Exercise Library** — Explore exercises for different muscle groups.
- **Progress Tracking** — Monitor fitness and workout improvements over time.
- **Profile Management** — Manage personal details and fitness preferences.

## Technology Stack

The project uses a frontend and backend architecture.

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- Express.js
- MongoDB
- JWT authentication

> Note: The original frontend was developed using React and JSX. Update the frontend technology list if your current version still uses React instead of vanilla HTML, CSS, and JavaScript.

## Project Structure

```text
OverloadFit/
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── ...
├── backend/
│   ├── package.json
│   ├── .env
│   └── ...
└── README.md
```

The exact files and folders may vary depending on your current project version.

## Installation and Setup

### Prerequisites

Install the following before running the project:

- Node.js and npm
- MongoDB, either locally or through MongoDB Atlas
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/sinstvgod-create/Web-Development.git
cd Web-Development
```

### 2. Set Up the Backend

Navigate to the backend directory:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory and configure the required environment variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Replace the placeholder values with your actual MongoDB connection string and a secure JWT secret.

Start the backend server:

```bash
npm run dev
```

The backend is expected to run at `http://localhost:5000`, provided that the application is configured to use this port.

### 3. Set Up the Frontend

Open a new terminal at the repository root and navigate to the frontend directory:

```bash
cd frontend
npm install
```

Start the frontend:

```bash
npm run dev
```

If your frontend uses Vite, it will typically be available at:

`http://localhost:5173`

Use the local URL displayed in your terminal if it differs.

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Port used by the backend server |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign and verify authentication tokens |

**Security:** Never commit your `.env` file, database credentials, or private authentication secrets to GitHub. Add `.env` to your `.gitignore` file.

## Usage

1. Start the backend server.
2. Start the frontend application.
3. Open the frontend URL in your browser.
4. Register or log in to your account.
5. Complete your fitness assessment, if available.
6. Explore workout plans, diet recommendations, and the exercise library.
7. Log your workouts and monitor your progress.

## Future Enhancements

- Advanced fitness analytics and progress visualizations.
- More personalized workout and nutrition recommendations.
- Additional exercise categories and training programs.
- Improved mobile responsiveness and user experience.

## Contributing

Contributions and suggestions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Commit your changes with a descriptive message.
5. Open a pull request.

## License

No license has been specified yet. All rights remain with the respective copyright holder unless a license is added to the repository.

---

**OverloadFit — Train Smarter. Track Progress. Get Stronger.**
