# services/job_email_filter.py

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
    "software engineer",
    "sde",
    "backend",
    "frontend",
    "full stack",
    "data analyst",
    "data scientist",
    "machine learning",
    "ai engineer",
    "devops",
    "application status",
    "interview invitation",
    "thank you for applying",
    "regret to inform",
    "not selected",
]

TRUSTED_DOMAINS = [
    "linkedin.com",
    "linkedinmail.com",
    "naukri.com",
    "indeed.com",
    "glassdoor.com",
    "monster.com",
    "cutshort.io",
    "wellfound.com",
    "instahyre.com",
    "unstop.com",
    "dare2compete.news",
    "hackerrank.com",
    "greenhouse.io",
    "lever.co",
    "workday.com",
    "myworkdayjobs.com",
    "successfactors.com",
    "smartrecruiters.com",
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


def compute_job_score(email: dict) -> int:
    """
    Returns a score representing how likely this email is job-related.
    """

    score = 0

    subject = (email.get("subject") or "").lower()
    sender = (email.get("from") or "").lower()
    body = (email.get("body") or "").lower()

    text = f"{subject} {body}"


    if any(keyword in text for keyword in JOB_KEYWORDS):
        score += 1

    if any(domain in sender for domain in TRUSTED_DOMAINS):
        score += 2

  
    if "interview" in text or "assessment" in text:
        score += 2

    return score


def is_job_related(email: dict, threshold: int = 3) -> bool:
    """
    Decide if email is job-related based on weighted score.
    """
    score = compute_job_score(email)
    return score >= threshold
