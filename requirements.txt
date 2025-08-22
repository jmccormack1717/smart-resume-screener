from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import PyPDF2
import docx

app = FastAPI()

# Allow frontend (React dev server on localhost:3000) to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
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
        resumes_text.append({"filename": resume.filename, "content": text[:300]})  # truncate preview

    return {
        "job_description_preview": job_text[:300],
        "resumes": resumes_text
    }
