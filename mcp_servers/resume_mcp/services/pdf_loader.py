import io

def extract_text_from_pdf(pdf_bytes):
    """
    Extract raw text from PDF bytes.
    """
    text = ""

    try:
        import fitz  # pymupdf

        with fitz.open(stream=pdf_bytes, filetype="pdf") as doc:
            pages = []
            for page in doc:
                pages.append(page.get_text("text"))

            text = "\n".join(pages)

        if text.strip():
            return text

    except Exception:
        pass  # fallback to pdfplumber

    try:
        import pdfplumber

        with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
            pages = []
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    pages.append(page_text)

            text = "\n".join(pages)

        return text

    except Exception as e:
        raise RuntimeError("Failed to extract text from PDF") from e
