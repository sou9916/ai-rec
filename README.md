# How to run this application

## Setup - Open 5 terminals

### Terminal 1: FastAPI Backend (ML Recommendations)
```bash
cd ai-rec/backend/back2
pip install -r requirements.txt
uvicorn saas_api:app --reload
```
This runs the ML recommender API on **http://localhost:8000**

### Terminal 2: MLflow UI (Model Registry)
```bash
cd ai-rec/backend/back2
mlflow ui --backend-store-uri sqlite:///mlflow.db --default-artifact-root ./mlflow_artifacts
```
This runs MLflow UI on **http://localhost:5000**

### Terminal 3: Webhook & App Registration Service
```bash
cd ai-rec/backend/webhooks_services
npm install
node server.js
```
This runs the webhook and app registration service on **http://localhost:3001**

### Terminal 4: Frontend (Vite)
```bash
cd ai-rec/frontend/s
npm install
npm run dev
```
This runs the frontend on **http://localhost:5173**

### Terminal 5: Mock Webhook Server (Optional)
```bash
cd ai-rec/backend/webhooks_services
node mock_webhook_server.js
```
This runs a mock webhook listener on **http://localhost:4000** to test webhook notifications

## Running the application

1. **Start all services** in the order above
2. Open **http://localhost:5173** in your browser
3. Go to the **Webhook Dashboard** tab
4. Register a new app with:
   - App Name: "My Music App" (or any name)
   - Webhook URL: "http://localhost:4000/api/music"
5. Copy the generated **API Key**
6. Use the **API Key** in the external client or test with curl

## Testing the External Client

1. Open `xternal_client/index.html` in a browser
2. Paste your API Key
3. Enter a song title (e.g., "Fader")
4. Enter the Project ID (e.g., 7)
5. Click "Get Recommendations"

You should see recommendations and webhook notifications in the mock webhook server terminal!

## Upload dataset(if not with you, use datasets in example_dataset folder) and enter into required fields,select ready model and select required fields and click get recommendations


