import re

SECTION_ALIASES = {
    "experience": [
        "experience",
        "work experience",
        "professional experience",
        "employment",
        "internships",
        "work history"
    ],
    "projects": [
        "projects",
        "personal projects",
        "academic projects",
        "key projects"
    ],
    "skills": [
        "skills",
        "technical skills",
        "technologies",
        "tech stack",
        "skills & technologies",
        "tools"
    ],
    "education": [
        "education",
        "academics",
        "academic background",
        "qualifications"
    ],
    "certifications": [
        "certifications",
        "certificates",
        "licenses",
        "courses"
    ],
    "achievements": [
        "achievements",
        "accomplishments",
        "awards",
        "honors"
    ],
    # ✅ FIX: explicitly capture OTHER INFORMATION
    "other": [
        "other",
        "other information",
        "additional information"
    ]
}


def _build_heading_patterns():
    patterns = {}

    for section, aliases in SECTION_ALIASES.items():
        escaped_aliases = [re.escape(a) for a in aliases]

        pattern = r"""
            ^\s*
            (?:[-–—]*\s*)?
            (?:\(?[0-9IVXivx]+[\).]?\s*)?
            (?:{aliases})
            \s*
            (?:[:\-–—]+)?
            \s*$
        """.format(aliases="|".join(escaped_aliases))

        patterns[section] = re.compile(
            pattern,
            re.IGNORECASE | re.VERBOSE
        )

    return patterns


HEADING_PATTERNS = _build_heading_patterns()


def split_sections(text):
    sections = {
        "experience": [],
        "projects": [],
        "skills": [],
        "education": [],
        "certifications": [],
        "achievements": [],
        "other": []
    }

    current_section = "other"

    if not text:
        return {k: "" for k in sections}

    lines = text.split("\n")

    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue

        matched_section = None

        for section, pattern in HEADING_PATTERNS.items():
            if pattern.match(stripped):
                matched_section = section
                break

        if matched_section:
            current_section = matched_section
            continue

        sections[current_section].append(stripped)

    for key in sections:
        sections[key] = "\n".join(sections[key]).strip()

    return sections
