import pathway as pw
import google.generativeai as genai
from fastapi import FastAPI, BackgroundTasks
from pydantic import BaseModel
import uuid
import asyncio

app = FastAPI()

results = {}

class PromoRequest(BaseModel):
    api_key: str
    name: str
    price: float
    old_price: float = None
    description: str
    request_id: str

@pw.udf
def generate_tagline(api_key: str, name: str, price: float, old_price: float, desc: str) -> str:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-pro")
    prompt = f'''Generate ONE compelling promotional tagline for this product.

Product: {name}
Price: ${price}
Original Price: ${old_price if old_price else 'N/A'}
Description: {desc}

Create a single catchy tagline (max 12 words) that:
- Highlights value or savings
- Uses action words
- Is memorable and impactful
- Emphasizes benefits or urgency

Example: "Smart lighting that saves you 40% - Transform your home today!"

Tagline:'''
    response = model.generate_content(prompt)
    return response.text.strip()

class ProductSchema(pw.Schema):
    api_key: str
    name: str
    price: float
    old_price: float = None
    description: str
    request_id: str

input_data = []
input_table = pw.debug.table_from_rows(input_data, schema=ProductSchema)

with_promos = input_table.select(
    api_key=input_table.api_key,
    name=input_table.name,
    price=input_table.price,
    old_price=input_table.old_price,
    description=input_table.description,
    request_id=input_table.request_id,
    tagline=generate_tagline(
        input_table.api_key,
        input_table.name,
        input_table.price,
        input_table.old_price,
        input_table.description
    )
)

def pathway_runner():
    for row in with_promos:
        results[row.request_id] = row.tagline

@app.post("/generate-tagline")
async def generate_tagline_api(req: PromoRequest, background_tasks: BackgroundTasks):
    # Add to input table
    input_data.append({
        "api_key": req.api_key,
        "name": req.name,
        "price": req.price,
        "old_price": req.old_price,
        "description": req.description,
        "request_id": req.request_id
    })
    background_tasks.add_task(pathway_runner)
    for _ in range(20):
        await asyncio.sleep(0.5)
        if req.request_id in results:
            tagline = results.pop(req.request_id)
            return {"tagline": tagline}
    return {"error": "Timeout waiting for tagline."}

class ChatRequest(BaseModel):
    api_key: str
    message: str

@app.post("/chat")
async def chat(req: ChatRequest):
    genai.configure(api_key=req.api_key)
    model = genai.GenerativeModel("gemini-pro")
    response = model.generate_content(req.message)
    return {"response": response.text.strip()}