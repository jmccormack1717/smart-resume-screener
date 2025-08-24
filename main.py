from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import PyPDF2
import docx

app = FastAPI()

# Allow frontend (React dev server on localhost:3000) to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://smart-resume-screener-df4o.onrender.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Helper: extract text from files
def extract_text(file: UploadFile):
    if file.filename.endswith(".pdf"):
        reader = PyPDF2.PdfReader(file.file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
        return text
    elif file.filename.endswith(".docx"):
        doc = docx.Document(file.file)
        return " ".join([para.text for para in doc.paragraphs])
    else:  # .txt or fallback
        return file.file.read().decode("utf-8", errors="ignore")

import openai
import os
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")


def analyze_resumes(job_text, resumes_text):
    """
    job_text: str
    resumes_text: list of dicts [{"filename":..., "content":...}, ...]
    """
    prompt = f"Job description:\n{job_text}\n\nResumes:\n"
    for r in resumes_text:
        prompt += f"{r['filename']}:\n{r['content']}\n\n"
    prompt += "Rank the resumes from best to worst fit for the job and provide a short justification for each."

    response = openai.ChatCompletion.create(
        model="gpt-4",  # or gpt-3.5-turbo
        messages=[{"role": "user", "content": prompt}],
        temperature=0
    )

    return response.choices[0].message.content


@app.post("/upload")
async def upload_files(
    job_description: UploadFile = File(...),
    resumes: List[UploadFile] = File(...)
):
    # Extract job description
    job_text = extract_text(job_description)

    # Extract resumes
    resumes_text = []
    for resume in resumes:
        text = extract_text(resume)
        resumes_text.append({"filename": resume.filename, "content": text})

    # Call LLM to rank & justify
    llm_output = analyze_resumes(job_text, resumes_text)

    return {
        "job_description_preview": job_text[:300],
        "resumes": resumes_text,
        "llm_output": llm_output
    }
