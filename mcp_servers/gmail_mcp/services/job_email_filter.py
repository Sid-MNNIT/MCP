# services/job_email_filter.py

# -----------------------------
# HARD BLOCKED DOMAINS
# -----------------------------
# These platforms send feed-style / marketing emails
# NOT real job communications
BLOCKED_DOMAINS = [
    "linkedin.com",
    "linkedinmail.com",
    "notifications.linkedin.com",
    "careers.linkedin.com",

    "glassdoor.com",
    "indeed.com",
    "naukri.com",
    "monster.com",
    "wellfound.com",
    "cutshort.io",
]

# -----------------------------
# TRUSTED RECRUITMENT DOMAINS
# -----------------------------
TRUSTED_DOMAINS = [
    "greenhouse.io",
    "lever.co",
    "workday.com",
    "myworkdayjobs.com",
    "successfactors.com",
    "smartrecruiters.com",

    # Big tech & companies
    "amazon.com",
    "google.com",
    "microsoft.com",
    "meta.com",
    "apple.com",
    "uber.com",
    "flipkart.com",
    "swiggy.com",
    "zomato.com",
]

# -----------------------------
# GENERIC JOB KEYWORDS
# -----------------------------
JOB_KEYWORDS = [
    "interview",
    "job",
    "hiring",
    "application",
    "applied",
    "shortlisted",
    "shortlist",
    "recruiter",
    "recruitment",
    "offer",
    "offer letter",
    "joining",
    "onboarding",
    "assessment",
    "coding test",
    "technical round",
    "hr round",
    "assignment",
    "challenge",
    "intern",
    "internship",
]

# -----------------------------
# STRONG INTENT PHRASES
# -----------------------------
# These indicate REAL job communication
INTENT_PHRASES = [
    "thank you for applying",
    "we received your application",
    "application received",
    "interview scheduled",
    "invite you to interview",
    "interview invitation",
    "shortlisted",
    "offer letter",
    "we are pleased to offer",
    "we regret to inform",
    "not selected",
    "unfortunately",
]

# -----------------------------
# SCORING FUNCTION
# -----------------------------
def compute_job_score(email: dict) -> int:
    """
    Returns a score representing how likely this email
    is a REAL job-related communication.
    """

    score = 0

    subject = (email.get("subject") or "").lower()
    sender = (email.get("from") or "").lower()
    body = (email.get("body") or "").lower()

    text = f"{subject} {body}"


    if any(phrase in text for phrase in INTENT_PHRASES):
        score += 4


    if any(domain in sender for domain in TRUSTED_DOMAINS):
        score += 3

   
    if any(keyword in text for keyword in JOB_KEYWORDS):
        score += 2

    return score


# -----------------------------
# FINAL DECISION FUNCTION
# -----------------------------
def is_job_related(email: dict, threshold: int = 4) -> bool:
    """
    Decide if an email should be ingested into Jobsy.
    Uses hard exclusions + weighted intent scoring.
    """

    sender = (email.get("from") or "").lower()

    if any(domain in sender for domain in BLOCKED_DOMAINS):
        return False

    score = compute_job_score(email)

    return score >= threshold
