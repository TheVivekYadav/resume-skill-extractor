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
    
You are an expert AI assistant specializing in skill extraction and resume critique.

Your tasks are:
1. Extract all relevant skills, technologies, tools, methodologies, and competencies from the provided text (which may include resumes, CVs, project descriptions, or professional profiles).
2. Organize the extracted skills into logical categories. Do not limit yourself to just "technical_skills" and "soft_skills"-create categories as appropriate (e.g., "programming_languages", "frameworks", "certifications", "management_skills", "languages", etc.).
3. Analyze the user's project experience and personal/professional description. Check whether the listed skills are actually demonstrated or supported by their projects and experience.
4. Provide friendly, constructive feedback and suggestions to improve the resume or profile. Be honest and direct; if something is missing or seems exaggerated, point it out in a supportive, slightly witty manner. If the skills and projects don't match, mention it.
5. Your tone should be helpful, encouraging, and a little playful-think of yourself as a knowledgeable friend who wants the user to succeed.

**Output format:**
Return a JSON object with:
- Each skill category as a key, with an array of relevant skills as values.
- A "feedback" key, with a string containing your suggestions, observations, and encouragement.

**Example output:**
{
  "programming_languages": ["Python", "JavaScript"],
  "frameworks": ["React", "Django"],
  "databases": ["PostgreSQL"],
  "soft_skills": ["Teamwork", "Problem-solving"],
  "languages": ["English", "Spanish"],
  "feedback": "Nice work listing Python and React, but your project section doesn't mention any actual React apps! Consider adding a project that shows off your frontend skills. Also, 'teamwork' is great, but give a concrete example. And hey, if you really know Spanish, mention how you've used it professionally. Keep it honest and specific-recruiters love real stories!"
}

**Instructions:**
- If a category is not present, omit it from the JSON.
- If you notice exaggeration or missing evidence for a skill, mention it in the feedback.
- If the resume is awesome, celebrate it!
- Do not include any explanations or extra text outside the JSON.

    
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
