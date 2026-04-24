# Learning Assistant OJT

A comprehensive learning assistant application featuring real-time chat, AI integration (Gemini), document management, and more. 

## Tech Stack

### Frontend
- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Real-time**: Socket.io-client
- **Document Viewing**: React-pdf

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Real-time**: Socket.io
- **Storage**: Cloudinary
- **AI Integration**: Google Generative AI (Gemini)
- **Authentication**: JWT & bcryptjs

## Prerequisites

Before you begin, ensure you have the following installed and set up:
- Node.js (v18 or higher recommended)
- npm or yarn
- MongoDB instance (local or MongoDB Atlas)
- Cloudinary account (for file uploads)
- Google Gemini API key (for AI features)

## Setup Guide

Follow these steps to get your development environment set up and running locally.

### 1. Clone the repository

```bash
git clone https://github.com/Anirudh0465/Learning-Assistant--OJT-.git
cd Learning-Assistant--OJT-
```

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in the `backend` directory based on the `.env.example` file:
   ```env
   PORT=3400
   NODE_ENV=development
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=replace_with_a_long_random_secret
   JWT_EXPIRES_IN=7d
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   GEMINI_API_KEY=your_gemini_api_key
   GEMINI_MODEL=gemini-2.5-flash-lite
   CLIENT_URL=http://localhost:5173
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup

1. Open a new terminal window/tab and navigate to the frontend directory:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in the `Frontend` directory based on the `.env.example` file:
   ```env
   VITE_API_BASE_URL=http://localhost:3400/api
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Running the Application

Once both servers are successfully running:
- The **Frontend** application will be accessible at `http://localhost:5173`
- The **Backend** API will be running at `http://localhost:3400`