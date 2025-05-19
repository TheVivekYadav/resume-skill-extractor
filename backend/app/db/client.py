from motor.motor_asyncio import AsyncIOMotorClient

client = AsyncIOMotorClient("mongodb://admin:admin@localhost:27017/?authSource=admin")
db = client["auth_db"]
user_collection = db["users"]