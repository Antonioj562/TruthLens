Start the backend (Flask)
Make sure you have Python dependencies installed:
cd backend
pip install -r requirements.txt

requirements.txt should include at least:

Flask
pymongo
flask-cors
scikit-learn
Run the Flask server:
python run.py

You should see:

 * Running on http://0.0.0.0:5000


Start the frontend (Bun + React + Vite)
Navigate to your frontend directory:
cd frontend
Install dependencies using Bun:
bun install
Start the dev server:
bun run dev

You should see something like:

  VITE v4.x.x  ready in 300ms

  ➜  Local:   http://localhost:5173/