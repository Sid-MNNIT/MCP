import re
import html
from bs4 import BeautifulSoup


QUOTED_PATTERNS = [
    r"On .* wrote:",
    r"From: .*",
    r"Sent: .*",
    r"To: .*",
    r"Subject: .*"
]

SIGNATURE_MARKERS = [
    "--",
    "Regards,",
    "Best regards,",
    "Thanks,",
    "Sincerely,"
]


def clean_email_body(raw_body: str) -> str:
    """
    Clean raw Gmail email body before sending to LLM.
    Deterministic, rule-based, and safe.
    """

    if not raw_body:
        return ""

    text = raw_body.strip()

  
    if "<" in text and ">" in text:
        soup = BeautifulSoup(text, "html.parser")

 
        for block in soup.find_all("blockquote"):
            block.decompose()

        text = soup.get_text(separator="\n")


    text = html.unescape(text)


    for pattern in QUOTED_PATTERNS:
        text = re.split(pattern, text, flags=re.IGNORECASE)[0]


    for marker in SIGNATURE_MARKERS:
        if marker in text:
            text = text.split(marker)[0]


    text = re.sub(r"\n{3,}", "\n\n", text)
    text = re.sub(r"[ \t]{2,}", " ", text)

    return text.strip()
