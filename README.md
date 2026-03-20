# InterviewCircle

A student-focused platform for sharing structured interview experiences — filtered by company, role, and round so you can prepare with real, recent accounts instead of generic advice.

## Authors

- **Sanjeev Kushal Pendekanti** — Interview Experience Submissions
- **Harsh Raj** — Accuracy and Relevance Signals

## Course Details

**Course:** [CS 5610 — Web Development](https://johnguerra.co/classes/webDevelopment_online_spring_2026/)

**Professor:** [John Alexis Guerra Gomez](https://johnguerra.co/)

**Semester:** Spring 2026

## Links

[View Deployed App](https://interview-circle.onrender.com)

[View Demo Video]()

[View Design Document](https://drive.google.com/file/d/1AevZGUlXZkUT2PzhNpeC4g2NXxyohoiA/view?usp=sharing)

## Project Objective

Interview preparation resources are often too generic, while the most useful details — round format, question themes, difficulty level, and what caught candidates off guard — are usually only known by students who recently went through the process. That information often disappears quickly in private chats, Discord messages, or scattered notes.

InterviewCircle solves this by allowing students to submit interview experiences in a structured way and browse previous experiences by company, role, round, and recency. It also adds community signals like helpfulness ratings and outdated flags so users can better judge what to trust.

## Screenshots

**Landing Page**

![Landing Page](screenshots/landing.png)

**Browse Experiences**

![Browse Experiences](screenshots/browse.png)

**Experience Detail**

![Experience Detail](screenshots/experience_detail.png)

**Submit Experience**

![Submit Experience](screenshots/submit_experience.png)

**My Submissions**

![My Submissions](screenshots/my_submissions.png)

## Tech Stack

- **Backend:** Node.js, Express 5
- **Database:** MongoDB (native driver, no Mongoose)
- **Frontend:** React 19 with Hooks, React Router, React Bootstrap
- **Authentication:** Passport.js (local strategy) with express-session
- **Tooling:** Vite, ESLint, Prettier, Nodemon

## Test Accounts

All seeded accounts use the password `password123`:

| Username    | Password      |
| ----------- | ------------- |
| `sanjeev`   | `password123` |
| `harsh`     | `password123` |
| `alex_chen` | `password123` |

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB running locally or a MongoDB Atlas connection string

### Installation

1. Clone the repo:

   ```bash
   git clone https://github.com/Kushal187/interview-circle.git
   cd interview-circle
   ```

2. Install backend dependencies:

   ```bash
   npm install
   ```

3. Install frontend dependencies:

   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. Create a `.env` file in the root (see `.env.example`):

   ```
   MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/
   PORT=3000
   SESSION_SECRET=your-random-secret-string
   ```

5. Seed the database with sample data (1000+ records):

   ```bash
   npm run seed
   ```

6. Start the backend server:

   ```bash
   npm run dev
   ```

7. In a separate terminal, start the frontend dev server:

   ```bash
   cd frontend
   npm run dev
   ```

8. Open [http://localhost:5174](http://localhost:5174) in your browser.


### Production Build

To serve the frontend from Express directly:

```bash
cd frontend
npm run build
cd ..
npm start
```

Then open [http://localhost:3000](http://localhost:3000).

### Available Scripts

| Command          | Description                           |
| ---------------- | ------------------------------------- |
| `npm start`      | Start the Express server              |
| `npm run dev`    | Start with nodemon (auto-restart)     |
| `npm run seed`   | Seed all collections with sample data |
| `npm run lint`   | Run ESLint                            |
| `npm run format` | Format code with Prettier             |

Frontend (run from `frontend/`):

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start Vite dev server    |
| `npm run build`   | Build for production     |
| `npm run preview` | Preview production build |

## Project Structure

```
interview-circle/
├── index.js                 # Express server entry point
├── config/
│   └── passport.js          # Passport.js local strategy config
├── db/
│   └── connectDB.js         # MongoDB connection (singleton)
├── middleware/
│   └── auth.js              # Authentication middleware
├── controllers/
│   ├── authController.js    # Register, login, logout, session
│   ├── userController.js    # Current user endpoint
│   ├── experienceController.js  # CRUD for interview experiences
│   └── signalController.js  # CRUD for helpfulness/outdated signals
├── routes/
│   ├── auth.js              # /api/auth endpoints
│   ├── users.js             # /api/users endpoints
│   ├── experiences.js       # /api/experiences endpoints
│   └── signals.js           # /api/signals endpoints
├── seed/
│   └── seed.js              # Database seed script (1050+ records)
└── frontend/
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── main.jsx         # React entry point
        ├── App.jsx          # Routes and layout
        ├── context/         # UserContext (auth state)
        ├── services/        # API service layer (fetch calls)
        ├── components/      # Reusable UI components
        │   ├── Navbar.jsx
        │   ├── ProtectedRoute.jsx
        │   ├── ExperienceCard.jsx
        │   ├── ExperienceForm.jsx
        │   ├── ExperienceFilters.jsx
        │   ├── SortControls.jsx
        │   ├── HelpfulVote.jsx
        │   └── OutdatedFlag.jsx
        └── pages/           # Page-level components
            ├── LandingPage.jsx
            ├── LoginPage.jsx
            ├── RegisterPage.jsx
            ├── ExperienceListPage.jsx
            ├── ExperienceDetailPage.jsx
            ├── CreateExperiencePage.jsx
            ├── EditExperiencePage.jsx
            └── MySubmissionsPage.jsx
```

## AI Disclosure

We used Claude (Anthropic) in a limited capacity during development:

- **Seed data generation** — helped write the seed script that produces 1000+ sample records for experiences and signals.
- **CSS layout debugging** — used it to troubleshoot styling issues with Bootstrap overrides and component layouts.
- **Authentication** — helped troubleshoot parts of the Passport.js setup and session configuration.
- **Code review** — used it to identify lint errors, missing PropTypes, and potential issues across the codebase.
- **README** — used it to help draft and structure this README.

All application logic, database queries, React components, authentication flow, and project architecture were written by us. We referenced the MongoDB Node.js driver docs, Express 5 docs, React docs, and Passport.js docs.

## License

[MIT](/LICENSE)
