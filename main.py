from fastapi import FastAPI

from Routes.complaints import router as complaint_router
from Routes.users import router as user_router
from Routes.admin import router as admin_router
from Routes.tracking import router as tracking_router
from Routes.analytics import router as analytics_router

app = FastAPI(title="AI Civic Complaint Platform")

app.include_router(user_router)
app.include_router(complaint_router)
app.include_router(admin_router)
app.include_router(tracking_router)
app.include_router(analytics_router)


@app.get("/")
def home():
    return {"message": "AI Civic Complaint Platform API"}