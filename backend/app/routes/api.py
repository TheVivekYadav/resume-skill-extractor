from fastapi import APIRouter, Depends, Response
from app.models.user import User, UserLogin
from app.controllers import user_controller

router = APIRouter()

@router.post("/register")
async def register(user: User):
    return await user_controller.register_user(user)

@router.post("/login")
async def login(user: UserLogin):
    return await user_controller.login_user(user)

@router.get("/me")
async def read_current_user(current_user: dict = Depends(user_controller.get_current_user)):
    return current_user

@router.post("/logout")
def logout():
    return user_controller.logout_user()