from ..db.collections.files import files_collection
from bson import ObjectId
from pdf2image import convert_from_path
import os
from dotenv import load_dotenv
import base64
from openai import OpenAI

load_dotenv()

client = OpenAI()


def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")


async def process_file(id: str, file_path: str):
    print(id)
    await files_collection.update_one({"_id": ObjectId(id)}, {
        "$set": {
            "status": "processing"
        }
    })

    await files_collection.update_one({"_id": ObjectId(id)}, {
        "$set": {
            "status": "converting to images"
        }
    })

    print(f"I have to process the file with id {id}")
    pages = convert_from_path(file_path)
    images = []

    for i, page in enumerate(pages):
        image_save_path = f'/mnt/uploads/images/{id}/image-{i}.jpg'
        os.makedirs(os.path.dirname(image_save_path), exist_ok=True)
        page.save(image_save_path, 'JPEG')
        images.append(image_save_path)

    await files_collection.update_one({"_id": ObjectId(id)}, {
        "$set": {
            "status": "success"
        }
    })

    base64_image = [encode_image(img) for img in images]

    SYSTEM_PROMPT = """
    
    "You are a skill extractor. Given a resume in plain text, extract only the relevant skills. Categorize them into two lists: technical_skills and soft_skills, and return them as JSON like this:

json
Copy
Edit
{
  'technical_skills': ['Python', 'React', 'SQL'],
  'soft_skills': ['Teamwork', 'Problem-solving']
}
Do not include anything else in the output."
    
    """

    result = client.responses.create(
        model="gpt-4.1",
        input=[
            {
                "role": "user",
                "content": [
                    {"type": "input_text",
                        "text": SYSTEM_PROMPT},
                    {
                        "type": "input_image",
                        "image_url": f"data:image/jpeg;base64,{base64_image[0]}",
                    },
                ],
            }
        ],
    )
    await files_collection.update_one({"_id": ObjectId(id)}, {
        "$set": {
            "status": "Processed",
            "result": result.output_text
        }
    })
