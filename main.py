from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from Routes.complaints import router as complaint_router
from Routes.users import router as user_router
from Routes.admin import router as admin_router
from Routes.tracking import router as tracking_router
from Routes.analytics import router as analytics_router
from Routes.schemes import router as schemes_router
from Routes.documents import router as documents_router
from Routes.applications import router as applications_router
from Routes.notifications import router as notifications_router
from Routes.saved import router as saved_router
from Routes.support import router as support_router
from Routes.eligibility import router as eligibility_router

app = FastAPI(title="AI Civic Complaint Platform")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for dev preview
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router)
app.include_router(complaint_router)
app.include_router(admin_router)
app.include_router(tracking_router)
app.include_router(analytics_router)
app.include_router(schemes_router)
app.include_router(documents_router)
app.include_router(applications_router)
app.include_router(notifications_router)
app.include_router(saved_router)
app.include_router(support_router)
app.include_router(eligibility_router)

@app.get("/")
def home():
    return {"message": "AI Civic Complaint Platform API"}