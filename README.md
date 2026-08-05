# The Future Animations - Certificate Verification Portal

A production-ready SaaS application for issuing, managing, and verifying internship certificates.

## Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS (v4), React Router, Framer Motion
- **Backend**: Python, Flask, SQLAlchemy, Flask-JWT-Extended, Flask-CORS
- **Database**: SQLite (Development) / PostgreSQL (Production)

## Development Setup

### 1. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python run.py
```
*Note: Run `python run.py` once to auto-create the SQLite database and seed the default admin user.*
- **Admin Username**: admin
- **Admin Password**: admin123

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Production Deployment Guide

### Database (Supabase PostgreSQL)
1. Create a project in Supabase.
2. Get the PostgreSQL connection string.
3. Update `SQLALCHEMY_DATABASE_URI` in the backend environment to use the Supabase connection string.

### Backend (Render)
1. Create a new Web Service on Render, connected to your GitHub repository.
2. Set the root directory to `backend`.
3. Build Command: `pip install -r requirements.txt`
4. Start Command: `gunicorn -w 4 -b 0.0.0.0:$PORT run:app`
5. Set Environment Variables:
   - `DATABASE_URL` = Your Supabase URI
   - `SECRET_KEY` = Strong random string
   - `JWT_SECRET_KEY` = Strong random string
   - `FRONTEND_URL` = Your Vercel frontend URL

### Frontend (Vercel)
1. Import the repository in Vercel.
2. Set the root directory to `frontend`.
3. The Build command will auto-detect as Vite.
4. Set Environment Variables (in Vercel):
   - `VITE_API_URL` = Your Render Backend URL (Update Axios base URL to point here).

### Storage (AWS S3 / Cloudinary)
To move away from local storage, modify `app/services/qr_service.py` to upload the generated QR Code image directly to AWS S3 using `boto3`, and save the S3 URL in the database instead of the local path.
