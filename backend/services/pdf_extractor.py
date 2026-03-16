import io
import re
from pdfminer.high_level import extract_text
from pdfminer.layout import LAParams

class PDFExtractionError(Exception):
    pass

def extract_resume_text(pdf_bytes: bytes) -> str:
    """Extract text from a PDF byte stream with layout-aware parsing."""
    laparams = LAParams(
        line_margin=0.5,
        word_margin=0.1,
        char_margin=2.0,
        boxes_flow=0.5,
    )
    try:
        text = extract_text(
            io.BytesIO(pdf_bytes),
            laparams=laparams
        )
        # Clean up excessive whitespace
        text = re.sub(r'\n{3,}', '\n\n', text).strip()
        if len(text) < 50:
            raise PDFExtractionError("Extracted text too short — PDF may be image-based or empty.")
        return text
    except Exception as e:
        if isinstance(e, PDFExtractionError):
            raise e
        raise PDFExtractionError(f"Failed to extract text: {str(e)}")
