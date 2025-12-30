import re
from functools import lru_cache
from datetime import datetime

# ==================================================
# TIME CONSTANTS
# ==================================================

CURRENT_YEAR = datetime.now().year
CURRENT_MONTH = datetime.now().month

MONTH_MAP = {
    "jan": 1, "january": 1,
    "feb": 2, "february": 2,
    "mar": 3, "march": 3,
    "apr": 4, "april": 4,
    "may": 5,
    "jun": 6, "june": 6,
    "jul": 7, "july": 7,
    "aug": 8, "august": 8,
    "sep": 9, "sept": 9, "september": 9,
    "oct": 10, "october": 10,
    "nov": 11, "november": 11,
    "dec": 12, "december": 12,
}

# ==================================================
# ROLE PATTERNS (FULL, YOUR LIST)
# ==================================================

ROLE_PATTERNS = [
    "engineer", "developer", "programmer", "technologist",
    "technical associate", "intern", "trainee",
    "graduate engineer trainee", "get",
    "sde", "sde i", "sde ii", "sde iii",

    "software engineer", "software developer",
    "application developer", "systems engineer",
    "platform engineer", "product engineer",

    "backend engineer", "backend developer",
    "server-side engineer", "api engineer",
    "microservices engineer",

    "frontend engineer", "frontend developer",
    "ui engineer", "ui developer",
    "web developer", "javascript developer",

    "full stack engineer", "full-stack engineer",
    "full stack developer", "full-stack developer",

    "data scientist", "data engineer", "data analyst",
    "machine learning engineer", "ml engineer",
    "ai engineer", "research engineer",
    "applied scientist", "business intelligence engineer",
    "bi engineer",

    "devops engineer", "site reliability engineer", "sre",
    "cloud engineer", "infrastructure engineer",
    "platform reliability engineer",

    "security engineer", "application security engineer",
    "cyber security engineer", "information security engineer",
    "penetration tester", "ethical hacker",

    "mobile engineer", "android developer", "android engineer",
    "ios developer", "ios engineer",
    "flutter developer", "react native developer",

    "qa engineer", "quality assurance engineer",
    "test engineer", "software tester",
    "automation engineer", "automation test engineer",

    "embedded engineer", "firmware engineer",
    "hardware engineer", "systems programmer",

    "blockchain developer", "blockchain engineer",
    "web3 developer", "smart contract developer",

    "technical product manager", "product manager",
    "program manager", "engineering manager",

    "junior engineer", "associate engineer",
    "senior engineer", "lead engineer",
    "principal engineer", "staff engineer",
    "architect", "solutions architect",
]

ROLE_REGEX = re.compile(
    "|".join(rf"\b{re.escape(r)}\b" for r in ROLE_PATTERNS),
    re.IGNORECASE
)

# ==================================================
# ROLE NORMALIZATION + SENIORITY
# ==================================================

ROLE_CANONICAL_MAP = {
    "sde": "software engineer",
    "sde i": "software engineer",
    "sde ii": "software engineer",
    "sde iii": "software engineer",

    "backend developer": "backend engineer",
    "api engineer": "backend engineer",
    "microservices engineer": "backend engineer",

    "frontend developer": "frontend engineer",
    "ui developer": "frontend engineer",
    "web developer": "frontend engineer",

    "full stack developer": "full stack engineer",
    "full-stack developer": "full stack engineer",

    "ml engineer": "machine learning engineer",
    "ai engineer": "machine learning engineer",

    "software tester": "qa engineer",
}

SENIORITY_KEYWORDS = {
    "intern": "intern",
    "trainee": "intern",
    "junior": "junior",
    "associate": "junior",
    "senior": "senior",
    "lead": "lead",
    "principal": "principal",
    "staff": "staff",
    "manager": "manager",
    "architect": "architect",
}

def normalize_role(role):
    return ROLE_CANONICAL_MAP.get(role, role)

def extract_seniority(role):
    for key, level in SENIORITY_KEYWORDS.items():
        if key in role:
            return level
    return None

# ==================================================
# DATE REGEX
# ==================================================

MONTH_RANGE_PATTERN = re.compile(
    r"""
    (jan|january|feb|february|mar|march|apr|april|may|
     jun|june|jul|july|aug|august|sep|sept|september|
     oct|october|nov|november|dec|december)
    [\s,\-’']*
    ((?:19|20)\d{2})
    \s*(?:-|–|to)\s*
    (jan|january|feb|february|mar|march|apr|april|may|
     jun|june|jul|july|aug|august|sep|sept|september|
     oct|october|nov|november|dec|december|present)
    [\s,\-’']*
    ((?:19|20)\d{2})?
    """,
    re.IGNORECASE | re.VERBOSE
)

YEAR_PATTERN = re.compile(r"\b(?:19|20)\d{2}\b")

# ==================================================
# SPACY (CONSTRAINED FALLBACK)
# ==================================================

@lru_cache(maxsize=1)
def _load_spacy():
    try:
        import spacy
        return spacy.load("en_core_web_sm")
    except Exception:
        return None

# ==================================================
# EXPERIENCE UTILS
# ==================================================

def _completed_years(sy, sm, ey, em):
    months = (ey - sy) * 12 + (em - sm)
    years = months // 12
    if months % 12 >= 11:
        years += 1
    return max(years, 0)

# ==================================================
# MAIN EXTRACTOR
# ==================================================

def extract_entities(sections):
    entities = {
        "roles": set(),
        "normalized_roles": set(),
        "seniority": set(),
        "skills": set(),
        "companies": set(),
        "dates": set(),
        "experience_years": 0,
    }

    # ---------- SKILLS ----------
    for skill in re.split(r"[,\n/|]", sections.get("skills", "")):
        skill = skill.strip()
        if 1 < len(skill) <= 40:
            entities["skills"].add(skill)

    experience_text = sections.get("experience", "")
    project_text = sections.get("projects", "")
    combined_text = experience_text + "\n" + project_text
    experience_lines = experience_text.split("\n")

    # ---------- ROLES ----------
    role_lines = []
    for line in experience_lines:
        m = ROLE_REGEX.search(line)
        if m:
            role = m.group().lower()
            role_lines.append(line.strip())
            entities["roles"].add(role)
            entities["normalized_roles"].add(normalize_role(role))
            level = extract_seniority(role)
            if level:
                entities["seniority"].add(level)

    # ---------- COMPANIES (STRUCTURE FIRST) ----------
    COMPANY_PATTERNS = [
        re.compile(r"\bat\s+([A-Z][A-Za-z0-9&.\- ]{2,})$"),
        re.compile(r"[-–|]\s*([A-Z][A-Za-z0-9&.\- ]{2,})$"),
    ]

    for line in role_lines:
        for p in COMPANY_PATTERNS:
            m = p.search(line)
            if m:
                entities["companies"].add(m.group(1).strip())

    # ---------- COMPANIES (SPACY FALLBACK, CLEAN) ----------
    nlp = _load_spacy()
    if nlp and role_lines:
        doc = nlp("\n".join(role_lines))
        for ent in doc.ents:
            if ent.label_ == "ORG":
                name = ent.text.strip()
                if "\n" not in name and len(name) > 2:
                    entities["companies"].add(name)

    # ---------- DATES ----------
    for y in YEAR_PATTERN.findall(combined_text):
        entities["dates"].add(y)

    # ---------- EXPERIENCE YEARS ----------
    years = set()
    for m in MONTH_RANGE_PATTERN.findall(combined_text.lower()):
        sm, sy, em, ey = m[0], int(m[1]), m[2], m[3]
        sm = MONTH_MAP[sm.lower()]
        if em.lower() == "present":
            em = CURRENT_MONTH
            ey = CURRENT_YEAR
        else:
            em = MONTH_MAP[em.lower()]
            ey = int(ey)
        for y in range(sy, sy + _completed_years(sy, sm, ey, em)):
            years.add(y)

    entities["experience_years"] = len(years)

    return {
        "roles": sorted(entities["roles"]),
        "normalized_roles": sorted(entities["normalized_roles"]),
        "seniority": sorted(entities["seniority"]),
        "skills": sorted(entities["skills"]),
        "companies": sorted(entities["companies"]),
        "dates": sorted(entities["dates"]),
        "experience_years": entities["experience_years"],
    }
