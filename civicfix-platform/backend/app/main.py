from fastapi import FastAPI

app = FastAPI(title="CivicFix API")

@app.get("/")
def root():
    return {"message": "CivicFix backend running successfully"}