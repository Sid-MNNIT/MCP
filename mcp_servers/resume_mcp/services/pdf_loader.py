import io


def _fitz(pdf_bytes):
    """Multi-column aware extraction using pymupdf blocks."""
    import fitz
    pages = []
    with fitz.open(stream=pdf_bytes, filetype="pdf") as doc:
        for page in doc:
            blocks = [b for b in page.get_text("blocks") if b[6] == 0]
            blocks.sort(key=lambda b: (round(b[1] / 20), b[0]))  # sort by row then x
            text = "\n".join(b[4].strip() for b in blocks if b[4].strip())
            if text:
                pages.append(text)
    return "\n\n".join(pages)


def _pdfplumber(pdf_bytes):
    """Fallback extractor."""
    import pdfplumber
    pages = []
    with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
        for page in pdf.pages:
            t = page.extract_text()
            if t and t.strip():
                pages.append(t.strip())
    return "\n\n".join(pages)


def extract_text_from_pdf(pdf_bytes):
    """
    Extract text from PDF bytes.
    Raises RuntimeError("SCANNED_PDF: ...") for image-only PDFs.
    Raises RuntimeError("EXTRACTION_FAILED: ...") if both extractors crash.
    """
    text = ""
    err_fitz = err_plumber = None

    try:
        text = _fitz(pdf_bytes)
    except Exception as e:
        err_fitz = e

    if not text.strip():
        try:
            text = _pdfplumber(pdf_bytes)
        except Exception as e:
            err_plumber = e

    if not text.strip() and err_fitz and err_plumber:
        raise RuntimeError(f"EXTRACTION_FAILED: fitz={err_fitz} | pdfplumber={err_plumber}")

    if not text.strip():
        raise RuntimeError(
            "SCANNED_PDF: No embedded text found. "
            "Please upload a text-based PDF or DOCX file."
        )

    return text.strip()
