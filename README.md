# DecisionHub Platform

A collaborative decision-making platform designed for teams to propose ideas, discuss options, and vote for solutions efficiently. This project demonstrates a full-stack implementation using modern web technologies and a relational database.

**Course Project Track 1: Database Application Development**

## Live Demo
**[Click here to visit the live demo](https://decision-hub-platform-x9p5.vercel.app/)**

## 🛠️ Technology Stack

* **Frontend**: React, TypeScript, Vite
* **UI Framework**: Shadcn/ui, Tailwind CSS
* **Backend & Database**: Supabase (PostgreSQL)
* **Authentication**: Supabase Auth
* **Hosting**: Vercel

## Key Features

* **User Authentication**: Secure sign-up and login system.
* **Create Decisions**: Users can initiate new decision topics with descriptions.
* **Propose Options**: Team members can add candidate options to any decision.
* **Voting System**: Real-time voting mechanism with stage control (Explore vs. Vote).
* **Discussions**: Comment section and emoji reactions for detailed feedback.
* **Reports**: Automatic generation of decision reports with visual charts.

## Database Schema

The application uses a normalized relational database schema designed in PostgreSQL.
You can find the full SQL source code in `database/schema.sql`.

* **decisions**: Stores the main topics with state management (explore/vote).
* **options**: Stores candidate choices linked to decisions (1-to-many).
* **votes**: Records user votes, ensuring one vote per user per decision.
* **comments & reactions**: Stores user interactions and feedback.

##  How to Run Locally

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/chuu324/decision-hub-platform.git](https://github.com/chuu324/decision-hub-platform.git)
    cd decision-hub-platform
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    The project is configured to connect to a live Supabase instance via `src/utils/supabase/info.tsx`. No extra `.env` setup is required for grading purposes.

4.  **Start the development server**
    ```bash
    npm run dev
    ```


##  Acknowledgments

* UI components built with [shadcn/ui](https://ui.shadcn.com/).
* Icons provided by [Lucide](https://lucide.dev/).
* Demo images sourced from Unsplash.