import re
import difflib

def fuzzy_match(query: str, choices: list[str], threshold: float = 0.8) -> str | None:
    best_match = None
    best_score = 0.0
    query = query.upper().strip()
    
    for choice in choices:
        c = choice.upper().strip()
        # difflib ratio is between 0 and 1
        score = difflib.SequenceMatcher(None, query, c).ratio()
        
        if score > best_score:
            best_score = score
            best_match = choice
            
    if best_score >= threshold:
        return best_match
    return None

def normalize(text: str) -> str:
    text = text.upper()
    text = re.sub(r'[^A-Z0-9/,-]', ' ', text)
    return " ".join(text.split())

def extract_st_certificate_fields(texts: list[str]) -> dict:
    joined = normalize(" ".join(texts))
    
    fields = {
        "certificate_no": None,
        "applicant_name": None,
        "issue_date": None,
        "issuing_authority": None
    }
    
    # 1. Certificate Number: e.g. ST/2026/12345
    cert_patterns = [
        r"(ST/\d{4}/\d+)",
        r"CERTIFICATE\s+NO\.?\s*([A-Z0-9/-]+)",
        r"NO\.?\s*([A-Z0-9/-]+)"
    ]
    for p in cert_patterns:
        m = re.search(p, joined)
        if m:
            fields["certificate_no"] = m.group(1).strip() if len(m.groups()) > 0 else m.group(0).strip()
            break
            
    # 2. Issue Date: e.g. 12/04/2026 or 12-04-2026
    date_patterns = [
        r"DATE\s*OF\s*ISSUE\s*[:\s]*(\d{2}[/-]\d{2}[/-]\d{4})",
        r"DATE\s*[:\s]*(\d{2}[/-]\d{2}[/-]\d{4})",
        r"\b(\d{2}[/-]\d{2}[/-]\d{4})\b"
    ]
    for p in date_patterns:
        m = re.search(p, joined)
        if m:
            fields["issue_date"] = m.group(1).strip()
            break
            
    # 3. Applicant Name: e.g. THIS IS TO CERTIFY THAT JOHN DOE
    name_patterns = [
        r"CERTIFY\s+THAT\s+([A-Z\s]+?)\s+(SON|DAUGHTER|WIFE)\s+OF",
        r"THIS\s+IS\s+TO\s+CERTIFY\s+THAT\s+([A-Z\s]+?)\s+BELONGS",
        r"NAME\s*[:\s]*([A-Z\s]+)"
    ]
    for p in name_patterns:
        m = re.search(p, joined)
        if m:
            fields["applicant_name"] = m.group(1).strip()
            break
            
    # 4. Issuing Authority
    authorities = ["TAHSILDAR", "SUB DIVISIONAL MAGISTRATE", "DISTRICT MAGISTRATE", "REVENUE OFFICER"]
    for auth in authorities:
        if auth in joined:
            fields["issuing_authority"] = auth
            break
    
    if not fields["issuing_authority"]:
        fields["issuing_authority"] = fuzzy_match(joined, authorities, 0.8)

    return fields
