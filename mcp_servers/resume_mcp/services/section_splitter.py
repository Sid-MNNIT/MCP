import re
import json
import logging

logger = logging.getLogger(__name__)

SECTION_ALIASES = {
    "summary":        ["summary", "professional summary", "career summary", "executive summary",
                       "profile", "professional profile", "about me", "about", "objective",
                       "career objective", "personal statement", "overview"],
    "experience":     ["experience", "work experience", "professional experience", "employment",
                       "employment history", "work history", "career history", "internships",
                       "internship", "relevant experience", "positions held"],
    "projects":       ["projects", "project", "personal projects", "academic projects",
                       "key projects", "project work", "project experience", "portfolio",
                       "open source", "open-source contributions"],
    "skills":         ["skills", "technical skills", "technologies", "tech stack", "tools",
                       "core competencies", "key skills", "areas of expertise", "expertise",
                       "technical expertise", "programming skills", "technical proficiencies",
                       "skills & technologies", "tools & technologies", "skills & tools",
                       "technical skills and interests", "skills and interests",
                       "technical skills & interests"],
    "education":      ["education", "academics", "academic background", "qualifications",
                       "educational background", "academic history", "degrees"],
    "certifications": ["certifications", "certificates", "licenses", "courses", "training",
                       "professional development", "workshops", "online courses"],
    "achievements":   ["achievements", "accomplishments", "awards", "honors", "honours",
                       "recognition", "prizes", "distinctions", "scholarships"],
    "publications":   ["publications", "papers", "research", "patents"],
    "volunteer":      ["volunteer", "volunteering", "community service",
                       "extracurricular", "extracurricular activities", "leadership"],
    "languages":      ["languages", "language skills", "spoken languages"],
    "interests":      ["interests", "hobbies", "hobbies & interests"],
    "other":          ["other", "other information", "additional information",
                       "miscellaneous", "references", "declaration"],
}

ALL_KEYS = list(SECTION_ALIASES.keys())

# build regex patterns (allows trailing symbols, ALL-CAPS, etc.)
def _build_patterns():
    patterns = {}
    for section, aliases in SECTION_ALIASES.items():
        escaped = "|".join(re.escape(a) for a in aliases)
        patterns[section] = re.compile(
            rf"^\s*(?:[-–—•*]+\s*)?(?:{escaped})\s*(?:[:\-–—#*\/|.]+\s*)?(?:\(.*?\))?\s*$",
            re.IGNORECASE
        )
    return patterns

HEADING_PATTERNS = _build_patterns()

# ALL-CAPS lookup
_CAPS_MAP = {alias.upper(): sec for sec, aliases in SECTION_ALIASES.items() for alias in aliases}


def _match_heading(line):
    s = line.strip()
    for section, pattern in HEADING_PATTERNS.items():
        if pattern.match(s):
            return section
    # ALL-CAPS heuristic: short line, all uppercase letters
    if len(s.split()) <= 8 and re.match(r'^[A-Z][A-Z\s&/\-]+$', s):
        if s in _CAPS_MAP:
            return _CAPS_MAP[s]
        for key, sec in _CAPS_MAP.items():
            if key in s:
                return sec
    return None


def _groq_split(text):
    """Primary: ask Groq to split resume into sections. Returns dict or None on failure."""
    try:
        import os, sys
        sys.path.insert(0, os.path.dirname(__file__))
        from groq_client import GroqClient
        client = GroqClient()

        prompt = (
            f"You are a resume parser. Split the resume below into sections.\n\n"
            f"Return ONLY a valid JSON object with exactly these keys:\n{json.dumps(ALL_KEYS)}\n\n"
            f"Rules:\n"
            f"- Do NOT include section headings in the values\n"
            f"- Preserve all content exactly as written\n"
            f"- Use empty string for missing sections\n\n"
            f"RESUME:\n\"\"\"\n{text[:8000]}\n\"\"\""
        )

        resp = client._client.chat.completions.create(
            model=client.model,
            messages=[
                {"role": "system", "content": "Output only valid JSON. No markdown. No explanation."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.1,
            max_tokens=2500,
        )
        content = resp.choices[0].message.content.strip()
        if content.startswith("```"):
            content = re.sub(r"^```[a-z]*\n?", "", content).rstrip("`").strip()

        parsed = json.loads(content)
        if not isinstance(parsed, dict):
            return None

        result = {k: str(parsed.get(k, "")).strip() for k in ALL_KEYS}
        if sum(1 for k, v in result.items() if k != "other" and v) < 1:
            return None
        return result

    except Exception as e:
        logger.warning("Groq section split failed: %s", e)
        return None


def _regex_split(text):
    """Fallback: regex + ALL-CAPS heuristic."""
    sections = {k: [] for k in ALL_KEYS}
    current = "other"
    for line in text.split("\n"):
        stripped = line.strip()
        if not stripped:
            continue
        matched = _match_heading(stripped)
        if matched:
            current = matched
        else:
            sections[current].append(stripped)
    return {k: "\n".join(v).strip() for k, v in sections.items()}


def split_sections(text):
    if not text or not text.strip():
        return {k: "" for k in ALL_KEYS}
    result = _groq_split(text)
    if result:
        logger.info("section_splitter: used Groq")
        return result
    logger.info("section_splitter: Groq failed, using regex fallback")
    return _regex_split(text)
