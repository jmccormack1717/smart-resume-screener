from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import PyPDF2
import docx
import io
import openai
import os
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI()

# Deployment-safe CORS: allow your frontend origin(s)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://smart-resume-screener-df4o.onrender.com"],  # adjust as needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Async-safe text extraction
async def extract_text(file: UploadFile):
    content = await file.read()
    if file.filename.endswith(".pdf"):
        reader = PyPDF2.PdfReader(io.BytesIO(content))
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
        return text
    elif file.filename.endswith(".docx"):
        doc = docx.Document(io.BytesIO(content))
        return " ".join([para.text for para in doc.paragraphs])
    else:
        return content.decode("utf-8", errors="ignore")

def analyze_resumes(job_text, resumes_text):
    prompt = f"Job description:\n{job_text}\n\nResumes:\n"
    for r in resumes_text:
        prompt += f"{r['filename']}:\n{r['content']}\n\n"
    prompt += "Rank the resumes from best to worst fit for the job and provide a short justification for each."

    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        temperature=0
    )
    return response.choices[0].message.content

@app.post("/upload")
async def upload_files(
    job_description: UploadFile = File(...),
    resumes: List[UploadFile] = File(...)
):
    job_text = await extract_text(job_description)
    resumes_text = []
    for r in resumes:
        text = await extract_text(r)
        resumes_text.append({"filename": r.filename, "content": text})

    llm_output = analyze_resumes(job_text, resumes_text)

    return {
        "job_description_preview": job_text[:300],
        "resumes": resumes_text,
        "llm_output": llm_output
    }

from fastapi.responses import JSONResponse
from fastapi import Request

@app.options("/upload")
async def options_upload(request: Request):
    return JSONResponse(
        content={},  # <-- must include content
        status_code=200,
        headers={
            "Access-Control-Allow-Origin": "https://smart-resume-screener-df4o.onrender.com",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "*",
        },
    )

