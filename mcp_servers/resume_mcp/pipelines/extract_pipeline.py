"""
Step 6: Resume Extraction Pipeline
This file composes:
- text normalization
- section splitting
- entity extraction

"""

from utils.text_utils import normalize_text
from services.section_splitter import split_sections
from services.entity_extractor import extract_entities


def extract_resume(raw_text):
    """
    Run the full resume extraction pipeline.

    Input:
        raw_text (str): raw resume text (already extracted from PDF)

    Output:
        dict: structured resume data
    """

    if not raw_text or not raw_text.strip():
        return {
            "sections": {},
            "entities": {},
        }

    # Step 1: Normalize text
    normalized_text = normalize_text(raw_text)

    # Step 2: Split into sections
    sections = split_sections(normalized_text)

    # Step 3: Extract entities
    entities = extract_entities(sections)

    return {
        "sections": sections,
        "entities": entities,
    }
