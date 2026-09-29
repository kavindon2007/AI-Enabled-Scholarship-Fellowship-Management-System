# AI-SFMS — FULL TECHNICAL SOLUTION DOCUMENT

AI-Enabled Scholarship & Fellowship Management System

Ministry of Tribal Affairs, Government of India

## 1. SCHEMES IN SCOPE — COMPLETE RULES & REQUIREMENTS

There are five schemes managed by MoTA. Each has its own eligibility rules, document requirements, selection method, and disbursement structure. The platform must handle all five through a single configurable rule engine — not five separate hardcoded systems.

### 1.1 Pre-Matric Scholarship (Class IX and X)

**Scheme type:** Centrally Sponsored. GoI funds 75%, state funds 25% (90/10 for NE and hill states, 100% for UTs without legislature).

**Volume:** ~15 lakh applications per year.

**Portal currently:** dbttribal.gov.in / NSP.

**Eligibility rules the system must enforce:**

1. Applicant must belong to Scheduled Tribe as notified in relation to their domicile State/UT. This is the state of actual belonging, not just current study location.

2. Must be studying in Class IX or Class X in a Government school or government-recognized school, or one affiliated to a Central or State Board of Secondary Education.

3. Family income from all sources must not exceed Rs. 2,50,000 per annum. Income is computed by combining father and mother income only — other earning family members not counted. For single-parent households, only the surviving parent income counts. For orphans supported by guardian, income criteria does not apply.

4. Must have a valid Scheduled Bank account linked with Aadhaar and mobile number.

5. Must not be receiving any other scholarship simultaneously.

6. Scholarship for a class is only available once. If a student repeats a class, they do not get the scholarship again for that class.

**Value the system must calculate:**

Day Scholar: Rs. 225 per month (Rs. 2,250 for 10 months) + Rs. 750 books and ad hoc grant annually. Total Rs. 3,000.

Hosteler: Rs. 525 per month (Rs. 5,250 for 10 months) + Rs. 1,000 books and ad hoc grant annually. Total Rs. 6,250.

Disability allowance (additional): Hosteler gets Rs. 800 per month (Rs. 9,600 annually), Day Scholar gets Rs. 600 per month (Rs. 7,200 annually). Applies also to leprosy-cured, sickle cell anemia, Thalassemia students.

Scholarship is paid for 10 months. Disability allowance is paid for all 12 months.

**Documents required (what OCR must extract from each):**

Aadhaar Number — identity link and DBT seed.

Domicile Certificate — confirms state of belonging.

ST Certificate — issued by competent authority of domicile State/UT. OCR extracts: applicant name, community name, issuing authority name and designation, issuing district, date of issue, certificate number.

Family Income Certificate — OCR extracts: annual income figure, names of earning members listed (to verify only parents counted), issuing authority.

Disability Certificate — only if claiming disability allowance. OCR extracts: disability type, disability percentage, certifying medical authority.

Passport size photograph — stored as-is, no OCR.

**Workflow:** Applicant submits on national portal (or integrated state portal). AI pre-screening runs. Application forwarded to State Nodal Officer queue. State officer does Level 2/3 verification. Verified list forwarded to MoTA for central fund release. State disburses via DBT. State submits SOE and UC through portal.

**Timeline:** Portal opens April 1. Student registration April 1 to July 31. Institute verification complete by August 31. Institute/State verification complete by September 30. Disbursement by October 31.

### 1.2 Post-Matric Scholarship (Class XI to Post-Graduation)

**Scheme type:** Centrally Sponsored. Same funding pattern as Pre-Matric.

**Volume:** ~12 lakh applications per year.

**Portal currently:** dbttribal.gov.in / NSP.

**Eligibility rules the system must enforce:**

1. Must belong to Scheduled Tribe of their domicile State/UT.

2. Must have passed Matriculation or Higher Secondary or any higher examination from a recognized University or Board.

3. Family income must not exceed Rs. 2,50,000 per annum. Same computation as Pre-Matric.

4. Must have a valid Scheduled Bank account linked with Aadhaar and mobile.

5. Must not be receiving any other scholarship.

6. Course must be in an eligible institution — All Government Institutes, Institutions of National Importance, Central/State Universities recognized by UGC, Deemed Universities, Private Universities with NAAC A or equivalent, Private Professional Institutions affiliated to recognized universities, Schools/colleges recognized for Class XI-XII, Diploma Institutions, ITI/NCVT institutes, institutions approved by MCI/AICTE or any regulatory body.

7. Students pursuing courses in Top Class Institutes (252 institutes listed on tribal.nic.in) must NOT be given Post-Matric Scholarship — they fall under the National Scholarship (Top Class) scheme. The system must cross-check the institution code.

8. Students who complete one stream cannot take a different stream diploma or degree — e.g., cannot get scholarship for B.Com after completing B.A., or MBBS after B.Tech. The system tracks the student stream history.

**Value the system must calculate — Fee Component:**

The fee component depends on course group. Group I: Graduate and PG degree/PG Diploma/MPhil/PhD in professional courses. Group II: Non-professional courses — BA/BSc/BCom/MA/MSc/MCom. Group III: Vocational/ITI/3-year diploma in Polytechnics. Group IV: Post-matric non-degree courses for which entrance qualification is Class X — i.e., Class XI and XII.

Fee ceiling for private institutes (GoI share): Engineering — Rs. 2,50,000 per annum. MBBS/MS/MD — Rs. 6,00,000 per annum. Other courses — Rs. 1,00,000 per annum. States can provide more from their own funds, accounted separately.

**Value the system must calculate — Stipend Component:**

Group I Hosteler: Rs. 1,200/month (Rs. 12,000/year). Group I Day Scholar: Rs. 550/month (Rs. 5,500/year).

Group II Hosteler: Rs. 820/month (Rs. 8,200/year). Group II Day Scholar: Rs. 530/month (Rs. 5,300/year).

Group III Hosteler: Rs. 570/month (Rs. 5,700/year). Group III Day Scholar: Rs. 300/month (Rs. 3,000/year).

Group IV Hosteler: Rs. 380/month (Rs. 3,800/year). Group IV Day Scholar: Rs. 230/month (Rs. 2,300/year).

Disability Allowance: Same as Pre-Matric — Rs. 800/month hosteler, Rs. 600/month day scholar.

Stipend is paid from April 1 or month of admission, whichever is later, for maximum 10 months. Disability allowance for 12 months.

**Documents required:**

Aadhaar Number. Domicile Certificate. All academic certificates and marksheets from all examinations passed. Last qualifying marks in percentage or equivalent. ST Certificate. Family Income Certificate. Disability Certificate if applicable. Passport photograph. AISHE/U-DISE/NCVT/SCVT code of the institution — the system validates this against the eligible institution registry.

**Renewal:** Scholarship continues year to year on passing. Fail means no scholarship till the student clears and is promoted. Income certificate taken once at course start — not required again at renewal.

### 1.3 National Fellowship and Scholarship for Higher Education (NFST — Part A: Fellowship and Part B: Scholarship)

**Scheme type:** Central Sector — 100% funded by Ministry of Tribal Affairs.

**Volume:** 750 fresh fellowships per year (Part A). ~1,000 scholarships per year (Part B — Top Class).

**Portal currently:** fellowship.tribal.gov.in (Part A). scholarships.gov.in (Part B).

#### Part A — National Fellowship (MPhil/PhD)

**Eligibility:**

Must have passed Post-Graduation/Masters with minimum 55% marks or equivalent CGPA.

Maximum age 36 years as on July 1 of the relevant year.

No income criteria for this scheme.

Must take admission in universities under UGC 2(f)/12(B), Deemed Universities under UGC Section 3, Universities/Institutes receiving Central/State grants, or Institutes of National Importance.

**Slot distribution the system must enforce:**

Total 750 slots. Divyangjan (minimum 40% disability certified): 38 slots — priority 1. PVTG (from list at Annexure VIII of guidelines): 25 slots — priority 2. Female (including Divyangjan and PVTG females): 225 slots — priority 3. ST Others: 462 slots — priority 4.

If adequate applications not received for a sub-category, unfilled slots roll down to the next priority category and ultimately to ST open category. Students in IITs/AIIMS/IIMs/IISERs get priority within ST Others — those slots are carved out first.

Selection is merit-based on PG marks for most applicants. Students with offer from IITs/AIIMS/IIMs/IISERs are given first priority within their sub-category.

**Value the system must calculate:**

MPhil — Humanities and Social Sciences: Rs. 31,000/month + Rs. 10,000 contingency annually.

MPhil — Science/Engineering/Technology: Rs. 31,000/month + Rs. 12,000 contingency annually.

PhD first two years — same as MPhil rates above. PhD remaining three years — Rs. 35,000/month for Humanities, Rs. 35,000/month for Science (note: same enhanced rate per guidelines).

HRA: Equal to UGC rates — 8%, 16%, or 24% of basic based on city classification. Not payable if university hostel accommodation provided; only hostel fee payable instead.

Escort allowance for Divyangjan: Rs. 2,000/month.

Duration: MPhil — 2 years or date of dissertation submission, whichever earlier. MPhil + PhD — 5 years or dissertation submission. PhD — 5 years or dissertation submission.

**Documents required:**

Passport size photograph. ST/PVTG Certificate — OCR extracts community name, issuing authority, district, date, certificate number. Matriculation/10th certificate — for date of birth verification. Divyangjan Certificate — minimum 40% disability, OCR extracts disability percentage and certifying authority. PG Marksheet — OCR extracts aggregate percentage, CGPA and conversion formula if applicable. Admission/Joining Certificate for MPhil/PhD from the University. Offer letter from IIT/AIIMS/IIM/IISER if applicable.

**Post-selection workflow:**

Scholar submits progress report on the portal every 6 months. University/Institute Nodal Officer verifies enrollment and submits joining report. Fellowship released through PFMS system after enrollment confirmation. Annual renewal requires progress report and enrollment continuation certificate. Change of university requires advance permission through portal. Discontinuation must be reported — recovery of paid amount may be initiated.

#### Part B — National Scholarship (Top Class Institutes)

**Eligibility:**

Must have passed Class XII or graduation or post-graduation from a recognized Board/University.

Family income must not exceed Rs. 6,00,000 per annum for fresh applicants from 2021-22 onwards.

Must have secured admission in one of the 252 Top Class Institutes listed on tribal.nic.in. The system maintains and validates against this list using institution codes.

Courses: Professional courses in Management, Medicine, Engineering, IT, Law, and other professional fields at Graduate and Post-Graduate level.

**Value:** Tuition fee as actuals paid to the institution + maintenance stipend as per institution rates. Exact amounts configured per institution in the system.

**Documents:** Same as Post-Matric plus admission letter from Top Class Institute. Institution code validated against the 252-institute registry.

### 1.4 National Overseas Scholarship (NOS)

**Scheme type:** Central Sector — 100% funded by MoTA, disbursed through MEA/Indian Missions abroad.

**Volume:** 20 awards per year.

**Portal currently:** overseas.tribal.gov.in.

**Eligibility rules the system must enforce:**

Must belong to Scheduled Tribe.

Family income must not exceed Rs. 6,00,000 per annum.

One child per family — applicant must submit self-certification. System flags if another sibling from same family has previously received or currently holds this award.

One-time benefit — applicant cannot be considered for same or higher level award a second time.

30% slots reserved for female candidates. If insufficient female candidates, unutilized slots open to male.

**Course and qualification rules:**

Post-Doctoral Research: 55% or equivalent in Masters + awarded PhD. Maximum age 38 years as on July 1 of selection year.

PhD: 55% or equivalent in Masters. Maximum age 35 years.

Masters Degree: 55% or equivalent in relevant Bachelors. Maximum age 32 years.

Exception: Marks criteria does not apply to candidates already admitted to top 1,000 QS World Ranked institutes.

Bachelor-level courses are NOT covered.

**Slot distribution:**

17 slots for ST candidates, 3 slots for PVTG candidates. Total 20.

Field-wise slots: STEM (Pure/Applied Science/Engineering/Technology/Mathematics) — 10. Management/Economics/Finance/Law — 4. Agriculture/Medicine — 4. Humanities/Social Science/Fine Arts — 2.

**Value the system must calculate:**

Annual Maintenance Allowance: USD 15,400 for US. GBP 9,900 for UK. USD equivalent for other countries.

Annual Contingency and Equipment Allowance: USD 1,532 for US. GBP 1,116 for UK.

Poll tax: Actuals where applicable.

Visa fees: Actual in Indian Rupees.

Incidental journey expenses: Up to USD 20 or equivalent.

Tuition fees: Actuals, compulsory non-refundable fees only.

Medical Insurance Premium: Actuals as charged, reasonableness examined by Indian Mission.

Air passage: Economy class, shortest route, best available price, India to institution and back.

Local travel: Second class rail from port to place of study and return.

For online study periods (e.g. pandemic): Maintenance at JRF rate for Masters, SRF rate for PhD/Post-Doc.

**Duration:**

Post-Doctoral: Maximum 2 years. PhD: Maximum 4 years. Masters: 1 or 2 years depending on course.

Extension beyond prescribed duration has no financial support except return air passage.

**Selection method — this is the most complex scheme:**

Priority 1: Candidates already admitted and studying in QS top 1,000 institutes. Merit list ranked by QS ranking of the institute. Tie-broken by marks in qualifying examination.

Priority 2: Candidates with preliminary offer/admission letter from QS top 1,000 institutes not yet joined. Same ranking methodology.

Priority 3: Remaining eligible candidates called for personal interview by Expert Committee. Preference to candidates who have cleared GRE/GMAT/TOEFL.

Finally selected candidates must secure admission and join a QS top 1,000 institute within 2 years of award letter communication, or the award is automatically cancelled.

Expert Committee interview: Candidates get reimbursement of second-class train/bus fare from residence to interview venue.

**Documents required:**

Passport size photograph. ST Certificate. PVTG Certificate if applicable. 10th Certificate/Marksheet for date of birth. Graduation/Post-Graduation marksheets with aggregate percentage, or CGPA conversion sheet from institution. PhD completion certificate where applicable. Offer of Admission from foreign university. Income Certificate. GRE/GMAT/TOEFL scorecard if available.

**Post-selection workflow:**

Scholar submits progress report every 6 months on NOS portal. Indian Mission abroad obtains performance report from university and updates on portal. Before leaving India, scholar takes permission from Indian Mission and updates portal. Course change and institution change are not permitted without prior Ministry approval. On completion, scholar uploads course completion details and brief of study in Alumni Module before return tickets are booked. Disbursement through Indian Mission — Ministry reimburses MEA.

**Cancellation triggers:** False documents. Returning to India without completing course (medical exception with Mission-nominated doctor certificate). Illegal/antinational activity or misconduct or narcotics or law violation abroad.

## 2. SYSTEM ARCHITECTURE

### 2.1 Architecture Style

Cloud-native microservices architecture deployed on NIC MeghRaj Cloud (Government of India sovereign infrastructure). All data stays within India. Services communicate via secure REST APIs through a central API gateway. An AI/ML engine runs as a cross-cutting service layer consumed by all other services.

Five architectural layers:

**Presentation Layer:** Applicant Portal (Web PWA + Mobile), Admin Dashboard, University Portal, State/UT Portal, Embassy/Mission Portal (NOS only).

**API Gateway Layer:** Kong or NGINX — handles authentication, rate limiting, SSL termination, request routing.

**Application Services Layer:** Microservices — Application, Document, Eligibility, Selection, Communication, Disbursement, Grievance, Analytics, Admin/Config.

**AI/ML Engine Layer:** OCR Service, Document Intelligence, NLP Classifier, Fraud Detection/Risk Scoring, Merit Engine, Chatbot.

**Data Layer:** PostgreSQL 15 (transactional), MongoDB 7 (document metadata + extracted fields), Redis 7 (session/cache), Elasticsearch 8 (audit log + full-text search), MinIO on MeghRaj (document object storage — S3-compatible).

**Integration Layer:** DigiLocker API, PFMS/DBT API, UIDAI Aadhaar eKYC, NPCI BASE API, NSP API, CPGRAMS, NIC SMS/Email Gateway, UMANG, Canara Bank API, MEA/Embassy portal (NOS), State Portal Web Services.

### 2.2 Microservices — What Each One Does

**Application Service:** Registration, application CRUD, scheme-specific dynamic form rendering driven by scheme config JSON, draft auto-save every 60 seconds, submission, status tracking. APIs: POST /apply, GET /application/{id}, PATCH /application/{id}/draft, POST /application/{id}/submit.

**Document Service:** Document upload (PDF/JPG, max 5MB), storage to MinIO, retrieval, versioning, DigiLocker pull integration, document type classification. APIs: POST /documents/upload, POST /documents/digilocker-pull, GET /documents/{applicationId}.

**Eligibility Engine:** Configurable rule evaluation per scheme. Reads scheme_config JSON for the selected scheme, evaluates each rule against extracted OCR data and application form fields, outputs PASS/FAIL/DEFICIENT with rule-level breakdown. APIs: POST /eligibility/evaluate, GET /eligibility/rules/{schemeId}, POST /eligibility/configure-rules.

**AI/OCR Service:** Document classification, text extraction per field, field validation against application, confidence scoring, fraud signal detection. Detailed in Section 3. APIs: POST /ai/ocr, POST /ai/classify-document, POST /ai/fraud-score.

**Selection Service:** Merit list generation per scheme with configurable weightages, quota/preference rule application, shortlisting, interview scheduling for NOS, human approval workflow before publication. APIs: POST /selection/run, GET /selection/merit-list/{schemeId}, POST /selection/approve, POST /selection/publish.

**Communication Service:** Automated notifications (SMS/email/in-app) for every stage transition, deficiency notices with specific corrective action, offer letters, renewal reminders. All templates configurable per scheme per stage. APIs: POST /notify, POST /deficiency-notice, POST /offer-letter.

**Disbursement Service:** PFMS payment order generation, NPCI BASE Aadhaar-seeding pre-check (30 days before each disbursement cycle), bank account validation, installment schedule management, reconciliation of PFMS confirmations, Canara Bank integration for NFST HRA. APIs: POST /disburse, GET /disbursement-status/{applicationId}, POST /reconcile, POST /disburse/pre-check.

**Grievance Service:** Ticket creation, auto-categorization, auto-assignment, SLA countdown, escalation engine, resolution workflow, CPGRAMS integration. APIs: POST /grievance, GET /grievance/{ticketId}, PATCH /grievance/{ticketId}/resolve, GET /grievance/dashboard.

**Analytics Service:** Real-time dashboards, scheme KPIs, fund utilization, SLA compliance, fraud risk distribution, officer workload, OCR accuracy tracking. APIs: GET /analytics/dashboard, GET /analytics/scheme/{schemeId}, GET /analytics/export.

**Admin/Config Service:** Scheme configuration management (the rule engine backend), user and role management, workflow configuration, audit log access. APIs: POST /scheme/configure, GET /schemes, POST /users/role, GET /audit-log.

### 2.3 Data Flow — How a New Application Moves Through the System

Step 1 — Registration: Applicant visits the portal and initiates Aadhaar OTP eKYC. UIDAI API returns name, DOB, gender, address. Account created. Applicant_id assigned. No password — subsequent logins via Aadhaar OTP.

Step 2 — Scheme Discovery: Applicant enters basic details — caste category, current class/course, state of domicile, family income range. The system queries the eligibility engine with these inputs and shows only the schemes the applicant is likely eligible for.

Step 3 — Form Render: Applicant selects a scheme. Application Service fetches the form_config JSON for that scheme from the scheme_config table. The form renders dynamically — only the fields relevant to that scheme appear. Validation rules applied per field based on the config.

Step 4 — Document Collection: For each document in the scheme doc_checklist, the applicant either (a) pulls from DigiLocker with one click, or (b) uploads manually. Document Service stores to MinIO, assigns document_id, triggers OCR job via Kafka message.

Step 5 — OCR Processing (async): OCR Service picks up the Kafka message. Classifies document type. Runs Azure AI Document Intelligence against the document image. Extracts fields per the document type field map (defined in Section 3). Scores each field confidence. Stores results in MongoDB as extracted_fields JSON. Publishes OCR_COMPLETE event to Kafka.

Step 6 — Applicant Confirmation: Application Service receives OCR_COMPLETE event. Renders extracted fields to applicant in the UI for visual confirmation — for example, the income figure extracted from income certificate is shown next to the field they declared. If a critical field confidence is below 0.80, the system highlights it and asks the applicant to confirm or correct.

Step 7 — Submission: Applicant submits. Application Service sends APPLICATION_SUBMITTED event to Kafka. Eligibility Engine and OCR Service / Fraud Detection Service both consume this event and run simultaneously.

Step 8 — AI Pre-Screening: Eligibility Engine evaluates every rule for the scheme. Fraud Detection Service computes risk score. NLP Deficiency Classifier checks for missing documents and field inconsistencies. All three results written to PostgreSQL. If any critical rule is FAIL and not just deficient — application immediately marked ineligible with reason. If deficiencies found — Communication Service sends structured deficiency notice. If fraud score above 70 — routed to senior scrutiny queue with signals highlighted.

Step 9 — Officer Queue: Application appears in Admin Dashboard verification queue, pre-sorted by risk score descending. Low-risk applications appear at bottom of queue. Officer opens application — sees side-by-side view of original document image, OCR-extracted data, and declared application fields. AI-generated eligibility report pre-populated showing each rule verdict.

Step 10 — Officer Decision: Officer reviews, confirms or overrides AI verdict, adds comments. If deficiency — structured notice generated and sent. If approved — moves to selection stage. Every officer action immutably logged in Elasticsearch.

Step 11 — Selection: For merit-based schemes (NFST, NOS, Top Class) — Selection Service computes merit scores using configured weightages, applies quota rules, generates ranked list. For Pre/Post Matric — eligible list forwarded to State Nodal Officer queue. For NOS — Expert Committee interview scheduling triggered.

Step 12 — Disbursement: On JS/Director approval of merit list — Disbursement Service checks NPCI BASE seeding status for each scholar in the batch. Any seeding issues trigger proactive alerts (Section 4 for detail). Payment order sent to PFMS. PFMS disburses. Confirmation received. Scholar notified. Reconciliation record created.

Step 13 — Post-Selection Management: Scholar submits progress reports through portal (every 6 months for NFST/NOS). Renewal forms submitted digitally. Institution confirms enrollment annually. Each confirmation triggers the next installment disbursement.

## 3. OCR PIPELINE — COMPLETE TECHNICAL DETAIL

### 3.1 What OCR Needs to Do

The OCR system is not just a text reader. It is a structured field extractor that maps unstructured document images to typed, validated data fields in the database. It must work across 14 document types, 11 Indian languages, and varying document quality — printed, scanned, photographed with phone camera, handwritten in some fields.

Every extracted field gets a confidence score between 0 and 1. Fields below 0.80 are flagged for applicant or officer confirmation. Fields below 0.50 on critical fields (income amount, caste community name, DOB) trigger a mandatory re-upload request before submission.

### 3.2 Primary and Fallback OCR Stack

**Primary:** Azure AI Document Intelligence (custom model trained on Indian government document formats). Handles structured layout analysis, table extraction, handwriting, and multi-language content. Supports pre-built models for ID documents and receipts plus custom models for government certificates.

**Fallback (on-premise):** Tesseract OCR version 5 with OpenCV for image pre-processing. Used when Azure service is unavailable, for cost-sensitive bulk processing, or as secondary validation on low-confidence extractions. Tesseract language packs: hin, ben, tel, tam, kan, mal, mar, guj, ori, pan, asm (all 11 supported languages).

**Language detection:** Before OCR, language of the document is detected using a compact text classification model. The appropriate OCR model/language pack is loaded based on detected language. Documents with mixed languages (common in state certificates with English headers and regional body text) are processed with multi-language mode.

**Image pre-processing pipeline (before OCR):** Deskew — correct tilted scans. Denoise — remove salt-and-pepper noise from photographed documents. Binarization — convert to black-and-white for clean text extraction. Resolution normalization — upscale images below 150 DPI to 300 DPI. Shadow removal — for phone-photographed documents. Border crop — remove document borders and margins.

### 3.3 Document Type Registry — Field Map

Each document type has a defined field map. The OCR service loads the appropriate field map based on document classification result, then attempts to extract each field from the correct region of the document.

#### Document Type 1: ST Certificate (Scheduled Tribe Certificate)

**Fields to extract:**

applicant_name — Full name of certificate holder. Critical field (confidence threshold 0.85).

tribal_community — Name of the specific Scheduled Tribe community claimed. Critical field (threshold 0.85). This field feeds the NLP community-name matcher in fraud detection.

state_of_issuance — State in which the certificate was issued. Must match applicant declared domicile state.

issuing_district — District within the state.

issuing_authority_name — Name and designation of the officer who issued the certificate.

issuing_authority_code — Official code of the issuing authority (cross-referenced against district authority registry for fraud detection).

date_of_issue — Date certificate was issued. Must be within validity period for the scheme.

certificate_number — Unique certificate identifier. Used for duplicate detection across applications.

applicant_father_name — Father name on certificate.

applicant_address — Address on certificate.

**Validation after extraction:** tribal_community must appear in the MoTA tribal community list for the stated state. issuing_authority_code must match a known active authority in the district registry. date_of_issue must be within 5 years (configurable per scheme). Name on certificate vs name in application must fuzzy-match above 0.85 score.

#### Document Type 2: Income Certificate

**Fields to extract:**

annual_income_figure — The total annual income declared. Critical field (threshold 0.90). Must be a numeric value with currency indicator.

income_year — Financial year for which income is certified.

earning_members_listed — Names and relationships of earning members listed in the certificate.

issuing_authority — Name, designation, and office of the certifying officer.

applicant_name — Must match ST certificate and application form.

applicant_father_name — Must match across documents.

certificate_date — Must be in the same financial year as application (per scheme guideline — income certificate taken same year as admission).

**Validation after extraction:** annual_income_figure compared against scheme income limit (Rs. 2,50,000 for Pre/Post Matric; Rs. 6,00,000 for NOS and Top Class). income_year must match the financial year corresponding to the application academic year. Self-declarations and affidavits must be rejected — the system detects these by the absence of an official office stamp and designating authority code.

#### Document Type 3: Marksheet (Class X, XII, Graduation, Post-Graduation)

**Fields to extract:**

institution_name — Name of school/college/university.

board_or_university_name — Examining body.

roll_number — Examination roll number.

exam_year — Year of examination.

subject_marks — Marks in each subject (table extraction).

total_marks_obtained — Total marks scored.

total_marks_possible — Maximum marks.

percentage — Aggregate percentage. If not present, computed from subject marks.

cgpa — CGPA if applicable.

cgpa_conversion_formula — Conversion factor to percentage if CGPA system. Extracted from attached conversion sheet.

result — Pass/Distinction/etc.

applicant_name — Must match other documents.

**Validation after extraction:** Percentage meets scheme threshold (55% for NFST/NOS, no marks criterion for Pre/Post Matric selection but marks used for merit ranking). CGPA converted to percentage using extracted conversion formula. Name fuzzy-match across documents.

#### Document Type 4: Aadhaar Card

**Fields to extract:**

aadhaar_number — 12-digit number (masked to last 4 digits in storage per UIDAI regulation).

name_on_aadhaar — Cross-checked against all other documents and eKYC data.

dob_on_aadhaar — Cross-checked for age eligibility.

gender — Cross-checked for gender-based quota rules.

address — State extracted for domicile verification.

**Note:** Aadhaar eKYC at registration already captures these fields from UIDAI. OCR on Aadhaar card is a secondary check, not the primary data source. Discrepancies between eKYC data and card data are flagged.

#### Document Type 5: Domicile Certificate

**Fields to extract:**

state_of_domicile — Must match claimed domicile state.

issuing_authority — District Collector or designated state authority.

applicant_name — Cross-check.

date_of_issue — Must be recent (within 3 years typically, configurable per scheme).

#### Document Type 6: Admission/Offer Letter from University

**Fields to extract:**

institution_name — Name of institution. Validated against eligible institution list for the scheme.

institution_country — For NOS — must be a foreign institution. For domestic schemes — must be in India.

qs_rank — For NOS — QS ranking extracted if mentioned in letter, or looked up from QS registry using institution_name.

course_name — Must match the course applied for under the scheme.

course_level — Masters/PhD/Post-Doc — validated against scheme eligibility.

academic_year — Must match application year.

student_name — Cross-check.

date_of_issue — Must be within the valid application window.

#### Document Type 7: Disability Certificate

**Fields to extract:**

disability_type — Type of disability as per Rights of Persons with Disabilities Act.

disability_percentage — Must be minimum 40% for Divyangjan sub-category in NFST.

certifying_authority — Medical authority designated by State/UT.

date_of_issue — Must be recent.

applicant_name — Cross-check.

#### Document Type 8: PVTG Certificate

**Fields to extract:**

pvtg_group_name — Must appear in MoTA PVTG list (Annexure VIII of NFST guidelines — 75 PVTG groups).

state — State where PVTG group is recognized.

issuing_authority — Must be a designated state authority.

#### Document Type 9: Passport (for NOS)

**Fields to extract:**

passport_number. name. dob. nationality — must be Indian. date_of_issue. date_of_expiry — must be valid for at least duration of course.

visa_country — For scholars already abroad.

#### Document Type 10: GRE/GMAT/TOEFL Scorecard (for NOS — preference factor)

**Fields to extract:**

test_name. test_score. test_date — must be within valid score period (typically 5 years for GRE/GMAT, 2 years for TOEFL).

#### Document Type 11: PhD Completion/Award Certificate (for NOS Post-Doctoral applicants)

**Fields to extract:**

degree_awarded — Must be PhD. awarding_institution. year_of_award. applicant_name.

#### Document Type 12: Progress Report / Enrollment Certificate (for renewal and continuation)

**Fields to extract:**

institution_name. academic_year. student_name. enrollment_status — active/enrolled. course_and_year. certifying_authority_from_institution.

#### Document Type 13: Joining Report (for NFST)

**Fields to extract:**

university_name. date_of_joining. course. supervisor_name. certifying_registrar_signature_present — boolean check.

#### Document Type 14: Course Completion Certificate (for NOS alumni module)

**Fields to extract:**

institution_name. course_completed. date_of_completion. degree_awarded. student_name.

### 3.4 Document Tampering Detection

Beyond field extraction, the OCR service runs a set of integrity checks on every uploaded document:

**Font consistency check:** OCR model detects when different fonts or font sizes appear within what should be a uniform printed field — common indicator of digital manipulation (pasting different text over original).

**Metadata mismatch:** PDF metadata (creator, modification date, software) is extracted. If a document shows creation in an image editing tool rather than a government print system, it is flagged.

**Resolution anomaly:** Regions within a document that have significantly different DPI than surrounding content indicate pasted or replaced sections.

**Perceptual hash deduplication:** Every document gets a pHash fingerprint. The fingerprint is checked against all previously uploaded documents across all applications. An exact or near-exact match (Hamming distance below threshold) with a document from a different applicant profile is a strong fraud signal.

**Stamp and seal detection:** Government certificates must have official stamps. The OCR service runs a stamp/seal detection model (CNN-based). Absence of an expected stamp on an income certificate or ST certificate is flagged.

**Digital alteration artifacts:** JPEG compression artifacts concentrated around specific text regions (not uniformly across the image) indicate localized editing — a standard forensic signal.

### 3.5 OCR Processing Architecture

**Trigger:** Document uploaded to MinIO. MinIO event triggers a Kafka message: topic=document-uploaded, payload={document_id, application_id, doc_type_hint}.

**OCR Worker:** OCR Service (FastAPI + Celery workers) consumes from topic=document-uploaded. Worker retrieves document from MinIO. Runs image pre-processing pipeline. Classifies document type (if doc_type_hint not provided or needs confirmation). Selects appropriate field map. Calls Azure AI Document Intelligence API with document bytes. Receives structured extraction result. Maps to field schema. Runs tamping detection checks. Computes per-field confidence scores. Runs name cross-match against previously extracted documents for this application. Writes result to MongoDB: document_id, extracted_fields (JSON), confidence_scores (JSON), tampering_flags (JSON), ocr_model_version, processing_time_ms.

**Fallback:** If Azure API call fails or returns confidence below 0.60 on critical fields — Tesseract fallback pipeline runs. If Tesseract also below threshold — document flagged for manual officer review rather than blocking applicant.

**Completion event:** OCR Service publishes to Kafka topic=ocr-complete with document_id, application_id, overall_confidence, critical_field_flags. Application Service consumes this to show extracted fields to applicant for confirmation.

**Processing time target:** Under 30 seconds for a standard PDF document set (approximately 6-8 documents). Under 60 seconds for high-resolution photographed documents requiring pre-processing.

**Scale:** During peak Pre-Matric application window, up to 50,000 applications per day = ~300,000 document OCR jobs per day. Celery worker pool auto-scales on Kubernetes from 10 to 100 workers based on Kafka consumer lag metric.

## 4. FRAUD DETECTION AND DBT PRE-FAILURE MONITOR

### 4.1 Fraud Detection — Risk Scoring Engine

The fraud detection engine runs as a separate microservice within the AI/ML layer. It consumes the OCR output and application data to produce a risk score between 0 and 100 for every submitted application. This score determines queue routing — not automatic rejection. A human officer always makes the final decision; the score determines who sees the application first and what signals are highlighted.

**Signal 1 — Caste Certificate Authority Verification:**

The issuing_authority_code extracted by OCR from the ST certificate is looked up against the District Authority Registry — a database of all currently active and historically active officers authorized to issue ST certificates per district, per state. The system maintains this registry through a scheduled sync from state government records. If the authority code does not match any record for the stated issuing district and state, the application gets a +30 risk score addition. If the code matches a revoked or deregistered authority, +40.

**Signal 2 — Name-to-Community NLP Matcher:**

A fine-tuned IndicBERT model is trained on a corpus of genuine ST applicant names from MoTA historical data, tagged by tribal community. At inference time, the model takes the applicant name and claimed tribal community as input and outputs a probability score for the linguistic consistency of that name with that community. A probability below 0.40 adds +15 to the risk score. This signal has moderate weight because names can be non-traditional across communities — it is a supporting signal, not a primary one.

**Signal 3 — Document Perceptual Hash Deduplication:**

Every document is pHash-fingerprinted after upload. The fingerprint is checked against the document store for all other applications in the current and previous 5 academic years. Hamming distance below 10 (near-identical documents) from a different applicant profile: +50 risk score addition and immediate flag for senior scrutiny regardless of total score. Distance between 10 and 25 (similar but not identical): +20. This catches the common fraud of recycling the same ST certificate or income certificate across multiple applications.

**Signal 4 — Income Statistical Outlier:**

The declared annual income is compared against the income distribution of applicants from the same district and academic year in NSP historical data. A Z-score of more than 2.5 standard deviations below the district mean (claiming unusually low income for the district) adds +10 to the risk score. This is a soft signal — rural-urban income variance means income can legitimately vary widely. Used in combination with other signals.

**Signal 5 — Cross-Scheme Duplicate Detection:**

The applicant Aadhaar hash and bank account number are checked against all active scholarship beneficiaries on NSP, fellowship.tribal.gov.in, and the SFMS database. An active beneficiary under the same or a conflicting scheme gets a hard block (not just a risk score addition) with a specific duplicate_scheme message displayed to the officer.

**Signal 6 — OCR Tampering Flags:**

Each tampering signal from the OCR pipeline (font inconsistency, resolution anomaly, missing stamp, metadata mismatch, pasted region artifact) adds +10 to +25 to the risk score depending on signal type and severity.

**Signal 7 — Family Benefit Limit (NOS):**

For NOS specifically — the one-child-per-family rule is enforced by checking the applicant parent names against all previous NOS beneficiaries. A matching parent name combination gets a hard block with family_limit_exceeded message.

**Score thresholds:**

0 to 30: Low risk. Application goes to standard officer queue.

31 to 69: Medium risk. Application goes to standard queue but with risk signals listed in the officer interface.

70 to 100: High risk. Application goes to senior scrutiny queue. All triggered signals shown in detail. Officer must explicitly confirm they reviewed each signal before approving.

**Model:** Gradient boosted trees (XGBoost) trained on MoTA historical application data with confirmed fraud labels. Retrained quarterly on new confirmed fraud/override feedback data. Feature importance monitored — if any single signal dominates disproportionately, model is reviewed to prevent discriminatory patterns.

### 4.2 DBT Pre-Failure Alert System

This system runs on a scheduled job 30 days before each disbursement cycle for each scheme. It is the most operationally impactful component in the platform — addressing the documented failure where 1,428 students were rejected with \"UID NEVER ENABLED FOR DBT\" in 2024-25 with no proactive alert.

**Job schedule:** Runs at 2 AM on the 1st of every month. Disbursement Service queries for all scholars with approved disbursements scheduled in the next 30 days.

**NPCI BASE API call:** For each scholar, makes a GET request to NPCI BASE API endpoint with Aadhaar hash and bank IFSC/account number. Response includes: seeding_status (ACTIVE/INACTIVE/NEVER_ENABLED), bank_name, account_type, last_updated_date.

**If seeding is ACTIVE:** No action. Scholar proceeds to disbursement.

**If seeding is INACTIVE or NEVER_ENABLED:**

Day -30: SMS sent to scholar registered mobile: \"Your scholarship payment of Rs. X is scheduled on \[date\]. However, your Aadhaar is not linked to your bank account for DBT payment. Please link immediately at \[NPCI BASE link\]. Helpdesk: 1800-XXX-XXXX.\" Simultaneously, in-app notification appears on next login with the same information plus step-by-step guide. Assigned administrative officer receives an alert dashboard notification showing scholar name, scheme, amount, and seeding status.

Day -23: If seeding status still inactive on re-check — follow-up SMS sent to scholar. Officer dashboard shows \"7 days elapsed — student not responded.\"

Day -15: If still unresolved — auto-escalation to Section Officer. Finance Officer also notified. Case flagged for alternate channel routing consideration.

Day -7: Final check. If still unresolved — Disbursement Service marks the record for India Post Payments Bank (IPPB) alternate routing and notifies the scholar that their payment will be processed through IPPB at their nearest post office.

Day 0 (disbursement): Active seeding cases proceed through PFMS normally. Remaining unresolved cases route to IPPB or are held with a formal notice to the scholar.

**Bank account validation (separate from seeding):** Before any disbursement, PFMS penny-drop verification is run on the bank account — a Re. 1 test credit to confirm the account is active and accepts the exact account number. Accounts that fail penny-drop get the same alert flow as seeding failures.

## 5. DATABASE SCHEMA — CORE TABLES

### 5.1 PostgreSQL — Transactional Data

applicants

applicant_id UUID PRIMARY KEY. aadhaar_hash VARCHAR(64) UNIQUE NOT NULL — SHA-256 with salt, never plain Aadhaar. name VARCHAR(200) NOT NULL. dob DATE NOT NULL. gender VARCHAR(10). state_of_domicile VARCHAR(50). caste_category VARCHAR(20) DEFAULT ST. contact_mobile VARCHAR(10). contact_email VARCHAR(200). bank_account_id UUID REFERENCES bank_accounts. created_at TIMESTAMPTZ. last_login_at TIMESTAMPTZ. ekyk_verified BOOLEAN DEFAULT FALSE.

bank_accounts

bank_account_id UUID PRIMARY KEY. applicant_id UUID REFERENCES applicants. account_number_encrypted TEXT — AES-256 encrypted. ifsc_code VARCHAR(11). bank_name VARCHAR(100). account_holder_name VARCHAR(200). aadhaar_seeding_status VARCHAR(20) — ACTIVE/INACTIVE/NEVER_ENABLED/UNKNOWN. seeding_last_checked_at TIMESTAMPTZ. pfms_penny_drop_status VARCHAR(20). penny_drop_checked_at TIMESTAMPTZ. is_primary BOOLEAN DEFAULT TRUE.

applications

application_id UUID PRIMARY KEY. scheme_id UUID REFERENCES schemes. applicant_id UUID REFERENCES applicants. academic_year VARCHAR(9) — e.g. \"2025-26\". form_data JSONB — all scheme-specific form field values. status VARCHAR(30) — DRAFT/SUBMITTED/AI_SCREENING/DEFICIENCY_RAISED/RESUBMITTED/OFFICER_REVIEW/APPROVED/REJECTED/SHORTLISTED/SELECTED/DISBURSED. risk_score INTEGER DEFAULT 0. risk_flags JSONB — array of triggered fraud signals. submitted_at TIMESTAMPTZ. created_at TIMESTAMPTZ. last_updated_at TIMESTAMPTZ. assigned_officer_id UUID REFERENCES users. is_renewal BOOLEAN DEFAULT FALSE. previous_application_id UUID REFERENCES applications.

schemes

scheme_id UUID PRIMARY KEY. scheme_code VARCHAR(20) UNIQUE — e.g. PREMATRIC, POSTMATRIC, NFST, NOS, TOPCLASS. scheme_name VARCHAR(200). scheme_type VARCHAR(30) — CENTRAL_SECTOR/CENTRALLY_SPONSORED. eligibility_rules JSONB — the complete rule set for the Eligibility Engine. form_config JSONB — dynamic form field definitions. doc_checklist JSONB — required documents with type codes and validation rules. quota_config JSONB — slot distribution rules (PVTG, female, Divyangjan percentages). selection_method VARCHAR(20) — MERIT/INTERVIEW/FIRST_COME. scholarship_formula JSONB — amount calculation rules by group/hostel/day-scholar. notification_templates JSONB — SMS/email/in-app templates per stage. sla_config JSONB — hours allowed at each stage. is_active BOOLEAN. application_window_start DATE. application_window_end DATE.

documents

document_id UUID PRIMARY KEY. application_id UUID REFERENCES applications. doc_type VARCHAR(50) — ST_CERTIFICATE/INCOME_CERTIFICATE/MARKSHEET_PG/etc. storage_path TEXT — MinIO object key. original_filename VARCHAR(255). file_size_bytes INTEGER. mime_type VARCHAR(50). ocr_job_id UUID. ocr_status VARCHAR(20) — PENDING/PROCESSING/COMPLETE/FAILED. ocr_confidence_overall DECIMAL(4,3). extracted_fields JSONB — stored in MongoDB, referenced here by document_id. tampering_flags JSONB. verified_status VARCHAR(20) — PENDING/VERIFIED/REJECTED/FLAGGED. verified_by_officer_id UUID REFERENCES users. uploaded_at TIMESTAMPTZ. source VARCHAR(20) — MANUAL_UPLOAD/DIGILOCKER.

eligibility_results

result_id UUID PRIMARY KEY. application_id UUID REFERENCES applications. scheme_id UUID REFERENCES schemes. rule_set_version VARCHAR(20). outcome VARCHAR(20) — PASS/FAIL/DEFICIENT. rule_results JSONB — per-rule verdict with reason. evaluated_at TIMESTAMPTZ. evaluated_by VARCHAR(20) — AI/OFFICER. officer_override BOOLEAN DEFAULT FALSE. officer_id UUID REFERENCES users. override_reason TEXT.

disbursements

disbursement_id UUID PRIMARY KEY. application_id UUID REFERENCES applications. scheme_id UUID REFERENCES schemes. academic_year VARCHAR(9). installment_number INTEGER. component VARCHAR(50) — TUITION/MAINTENANCE/CONTINGENCY/HRA/DISABILITY_ALLOWANCE. amount DECIMAL(12,2). currency VARCHAR(5) DEFAULT INR. pfms_order_id VARCHAR(50). pfms_utr VARCHAR(50). status VARCHAR(20) — PENDING/SEEDING_CHECK/SEEDING_FAILED/INITIATED/CONFIRMED/FAILED/ALTERNATE_ROUTED. seeding_check_date DATE. seeding_status_at_check VARCHAR(20). attempted_at TIMESTAMPTZ. confirmed_at TIMESTAMPTZ. failure_reason TEXT. retry_count INTEGER DEFAULT 0.

grievances

grievance_id UUID PRIMARY KEY. applicant_id UUID REFERENCES applicants. application_id UUID REFERENCES applications NULLABLE. scheme_id UUID REFERENCES schemes NULLABLE. category VARCHAR(50) — TECHNICAL/DOCUMENT_UPLOAD/ELIGIBILITY_DISPUTE/PAYMENT_ISSUE/STATUS_QUERY/OTHER. description TEXT. status VARCHAR(20) — OPEN/ACKNOWLEDGED/IN_PROGRESS/RESOLVED/ESCALATED/CLOSED. assigned_to UUID REFERENCES users. sla_deadline TIMESTAMPTZ. escalated_to UUID REFERENCES users NULLABLE. escalation_level INTEGER DEFAULT 1. resolution_notes TEXT. cpgrams_ref VARCHAR(50) NULLABLE. created_at TIMESTAMPTZ. resolved_at TIMESTAMPTZ.

### 5.2 MongoDB — Document OCR Store

Collection: ocr_results. Each document stores: document_id (matches PostgreSQL), application_id, doc_type, extracted_fields (nested JSON with field names, raw extracted values, and confidence scores), tampering_analysis (object with individual tampering check results and severity), cross_match_results (name match scores against other documents in the same application), model_version, processing_log (timestamps and fallback flags), raw_tesseract_output (stored for 30 days for debugging, then purged).

Collection: scheme_form_configs. Stores the complete form configuration JSON for each scheme version. Versioned — when a scheme rule changes, a new version is stored and the active_version pointer is updated. Old versions retained for applications submitted under them.

### 5.3 Elasticsearch — Audit Log

Index: audit_log (WORM — write once read many, no updates or deletes). Each document: log_id, entity_type (APPLICATION/DOCUMENT/USER/SCHEME/DISBURSEMENT/GRIEVANCE), entity_id, action (VIEW/CREATE/UPDATE/APPROVE/REJECT/ESCALATE/CONFIGURE/LOGIN), actor_id, actor_role, timestamp, ip_address, session_id, before_state (JSON snapshot), after_state (JSON snapshot). Index is append-only — enforced at the Elasticsearch index level with index.blocks.write settings and ILM policy.

## 6. DASHBOARD LAYOUTS — WHAT EACH USER SEES

### 6.1 Applicant Portal Dashboard

This is what an ST student sees after logging in. Mobile-first. Offline-capable. Available in Hindi and 8 regional languages.

**Top section — My Applications:** A card for each active or recent application showing scheme name, academic year, current status as a progress bar with labelled stages (Submitted → AI Review → Officer Review → Selected → Disbursed), and the date last updated. Tapping a card opens the full application detail.

**Active Alerts panel:** Any deficiency notices appear here in red with the specific document required and deadline. Any DBT seeding warnings appear here in orange with the action link. Any grievance responses appear here.

**Scheme Discovery:** A \"Find My Scheme\" button takes the applicant through a 5-question guided flow — class/course level, state, income range, whether currently studying — and shows the schemes they qualify for with a \"Apply Now\" button.

**Application Status Detail:** Each application has a timeline view showing every stage with timestamps. The applicant can see exactly which document is being reviewed, which rule is pending, and who the assigned officer is (name and officer ID, not contact details).

**Documents:** A document library showing all submitted documents per application with their verification status — Pending (grey), Verified (green), Flagged (red with reason). Option to re-upload flagged documents within the deficiency window.

**Disbursements:** A payment history showing each installment — amount, date, PFMS UTR if confirmed, status. For pending disbursements, shows the expected date and whether Aadhaar seeding has been confirmed.

**Grievances:** Raise new grievance button. List of all grievances with status and response. Ticket number provided for follow-up.

**Chatbot (TriBot):** Bottom-right corner. Always available. Answers scheme FAQs, guides through application steps, provides real-time status on request.

### 6.2 Admin Dashboard — Ministry Officials

Role-based. Each role sees a different set of panels. Built in React.js. Real-time data via WebSocket connection to Analytics Service.

**Data Entry Operator view:** Application queue for assigned scheme. Filter by status, state, date range, risk score range. Sort by date or risk score. Each row shows applicant name, scheme, status, risk score (colour-coded), last action. Click opens application for review. Bulk actions — bulk move to scrutiny queue, bulk request deficiency.

**Scrutiny Officer view:** All DEO features plus full document review interface. Side-by-side viewer: left panel shows original document image (zoomable). Right panel shows OCR-extracted fields with confidence scores colour-coded (green above 0.85, yellow 0.65-0.85, red below 0.65). Eligibility report pre-populated with AI verdict per rule. Officer clicks each rule to confirm or override. Override requires a typed reason. Deficiency notice composer: officer selects the deficiency type from a structured list; the system auto-generates the notice text in English and the applicant preferred language. Risk flags panel shows all triggered fraud signals with evidence snippets.

**Joint Secretary / Director view:** Executive summary panel at top: total applications this cycle by scheme, percentage in each status, percentage processed within SLA. Merit list approval queue — for NFST/NOS/Top Class, the final merit list appears here for JS approval with download as PDF before publishing. SLA breach dashboard — any applications or grievances that have breached SLA shown with officer responsible. Grievance escalation inbox — all Level 3 escalated grievances land here.

**System Administrator view:** Scheme configuration interface — form to edit the eligibility_rules, doc_checklist, quota_config, scholarship_formula JSONs for each scheme, with version control and sandbox test mode. User management — create/deactivate officer accounts, assign roles and scheme access. OCR model performance — confidence score distribution by document type, flag rates, model version history. Audit log explorer — searchable, filterable access to Elasticsearch audit log.

**Analytics panels visible to all officers (read-only):** Application funnel for each scheme (total → submitted → eligible → scrutinised → selected → disbursed). Disbursement pipeline — amount released vs pending by scheme and installment. Grievance heatmap by state and scheme. Processing time by stage — bar chart showing average days at each stage vs SLA target.

### 6.3 State/UT Portal Dashboard

For State Nodal Officers managing Pre-Matric and Post-Matric. Separate authentication through NIC SSO with state-level role.

**Verification queue:** Applications forwarded from national portal for state-level verification. Pre-sorted by AI risk score. Bulk verification workflow for low-risk batches. Individual document review for high-risk or flagged applications.

**Institute verification status:** List of all registered institutes in the state with their portal registration status, AISHE/U-DISE code, and number of applications submitted from their students. Institute Nodal Officer verification completion percentage.

**Fund management:** Central fund release status — amount received from MoTA, amount disbursed to students, amount pending. SOE submission form — digital submission with auto-calculation from system records. UC upload module.

**DBT portal sync:** Beneficiary data upload to dbttribal.gov.in via integrated Web Service. Upload status, error log, retry interface.

**Grievance dashboard:** State-level grievances. First response required within 48 hours. Escalation history visible.

### 6.4 University / Institution Portal Dashboard

For institution Nodal Officers handling NFST and Top Class scholars.

**Scholar registry:** List of all scholars enrolled at the institution under any MoTA scheme. Status of each — enrolled/discontinued/completed.

**Verification queue:** Applications submitted by students at this institution awaiting first-level verification. Officer confirms enrollment details, validates uploaded documents against physical records, marks verified/defective/rejected with mandatory reason.

**Progress report submission:** For NFST scholars — semi-annual progress report form. System reminds university when reports are due. Unfiled reports block next installment.

**Disbursement tracker:** Amount paid to students from this institution, next expected disbursement, any pending bank linking issues.

### 6.5 Indian Mission / Embassy Dashboard (NOS Only)

**Scholar tracker:** List of NOS scholars in the country covered by the mission. Name, university, course, current year, scholarship status.

**Verification tasks:** Applications for Priority 1 (scholars already enrolled) verification by the mission.

**Progress report receipt:** Scholar-submitted progress reports arrive here for mission review and update on the portal.

**Disbursement:** Mission verifies and approves each installment for their scholars. PFMS reimbursement claim generation from Ministry to MEA.

## 7. TECH STACK — EVERY DECISION WITH REASONING

### 7.1 Backend Services

**Python FastAPI — for AI/ML services:** FastAPI is the fastest Python web framework (async, based on Starlette). It is the natural choice for services that interface with ML models and OCR pipelines because the entire ML ecosystem is Python — PyTorch, scikit-learn, Tesseract bindings, Hugging Face Transformers. Using FastAPI means OCR processing, fraud scoring, eligibility rule evaluation, and merit list computation all run in the same runtime as the models without a language boundary overhead.

**Node.js with Express — for high-throughput application APIs:** The Application Service, Document Service, Communication Service, and Grievance Service handle extremely high concurrent request volumes during peak application windows — up to 50,000 submissions per day. Node.js event-loop architecture handles I/O-bound concurrency (database reads, API calls, file storage operations) far more efficiently than threaded models. It is also NIC-approved for government web services.

**Why not a single language for everything:** The AI/ML services and the application services have fundamentally different performance profiles. ML inference is CPU/GPU-bound. Application APIs are I/O-bound. Mixing them in one runtime means one type of load degrades the other. The microservices boundary solves this cleanly — FastAPI workers scale independently from Express workers.

### 7.2 Frontend

**React.js for web:** Component-based architecture allows the dynamic scheme form (which changes entirely per scheme) to be rendered from a JSON config without rewriting the UI. The form renderer is a single React component that reads the form_config JSON and renders the appropriate fields — no separate form codebase per scheme. React also has the most mature government UI component library ecosystem.

**Progressive Web App (PWA) for mobile:** A PWA is a React web app with a service worker layer that caches the app shell, form components, and in-progress draft data in the browser\'s IndexedDB. This means it works offline. It is installable from the browser without an app store. It runs on any Android 9+ or iOS 14+ browser. For ST applicants in remote areas with low-end Android phones and intermittent connectivity — a PWA is the correct architecture. A native Android app would require Play Store availability and device storage. A React Native app would require separate codebases for Android and iOS. The PWA gives 90% of the mobile experience with a single codebase.

**UMANG integration:** UMANG (Unified Mobile Application for New-age Governance) exposes APIs for partner government services. The application status tracking feature is registered as a UMANG service — applicants who already have UMANG installed can check their scholarship status without visiting the SFMS portal. Read-only integration.

### 7.3 AI/ML

**Azure AI Document Intelligence:** Microsoft\'s document AI service has pre-built models for Indian government document formats and supports Hindi and regional languages. It handles complex layouts — tables, multi-column text, handwritten annotations alongside printed text. It outputs structured JSON with bounding box coordinates and confidence scores per word and field. The custom model capability allows training on MoTA-specific document formats (ST certificates vary significantly by state). Already used in Indian government digitization at scale by NIC and UIDAI.

**Tesseract OCR version 5:** Open-source, runs on-premise, supports all required Indian language scripts through separate traineddata packs. Used as fallback when Azure is unavailable and as secondary validation. Tesseract 5 uses LSTM-based recognition which is significantly more accurate than earlier versions on printed documents.

**IndicBERT:** A pre-trained BERT model specifically trained on Indian language corpora including Hindi, Bengali, Tamil, Telugu, Kannada, Malayalam, Marathi, Gujarati, Oriya, Punjabi, and Assamese. Fine-tuned for two specific tasks in this system: (1) name-to-community linguistic consistency classification for fraud detection, and (2) deficiency pattern detection from document and form text. IndicBERT is available through AI4Bharat — an IIT Madras initiative — and is hosted on Hugging Face.

**XGBoost for fraud risk scoring:** Gradient boosted trees are the right choice for tabular fraud detection data. The feature set is structured (confidence scores, boolean flags, numeric income values, categorical community codes). XGBoost handles mixed feature types natively, is fast at inference (under 10ms per application), and its SHAP feature importance values provide interpretable explanations for each fraud score — which is essential for officer transparency and legal defensibility.

**scikit-learn for eligibility rule evaluation:** The eligibility engine is not a learned ML model — it is a rule engine. scikit-learn\'s pipeline infrastructure is used to compose and execute rule chains from the JSON config. Each rule is a Python function registered by rule_type. The engine loads the scheme\'s eligibility_rules JSON, instantiates the corresponding rule functions, and runs the evaluation pipeline. This gives a clean, testable, version-controlled rule execution framework without any machine learning involved in the eligibility decision itself.

### 7.4 Databases

**PostgreSQL 15:** ACID-compliant relational database for all financial and transactional data. Scholarship disbursements, application records, eligibility results, and grievances require full transaction support — partial updates must roll back on failure. PostgreSQL JSONB columns are used for structured but variable data (form_data, rule_results, risk_flags) allowing SQL queries over JSON content without the overhead of a separate document store for this data. Row-level security enforces that officers can only access applications within their scheme and role scope at the database level — not just at the application level.

**MongoDB 7:** Used exclusively for OCR extracted field storage. The OCR output for each document is a deeply nested JSON object with variable structure depending on document type — an ST certificate has different fields from a marksheet. Storing this in PostgreSQL would require either a rigid schema with many nullable columns or complex JSONB — MongoDB\'s native document model is a better fit. Each document in the collection is indexed by document_id for fast retrieval during officer review.

**Redis 7:** Session management (JWT refresh tokens, CSRF tokens), API response caching for scheme configuration reads (scheme config doesn\'t change per request — cache it with a 1-hour TTL), and rate limiting counters at the API gateway. Also used as the Celery broker for OCR task queuing before Kafka takes over for higher-volume events.

**Elasticsearch 8:** Two purposes. First, the immutable audit log — every action logged to an append-only index with WORM storage policy. Second, full-text search across applications — officers can search applicant name, university name, state, or any text field across millions of applications in under 100ms. The audit log capability is critical for CAG audits and RTI responses.

**MinIO on NIC MeghRaj:** S3-compatible object storage deployed on NIC infrastructure. All uploaded documents and OCR evidence bundles stored here. Server-side AES-256 encryption. Bucket policies restrict access to the Document Service only — no direct access from other services or the internet. Presigned URLs with 15-minute expiry used for secure document display in the officer review interface. All data stays on Government of India infrastructure — no documents ever reach external cloud storage.

### 7.5 Infrastructure

**Apache Kafka:** Message broker for all async event flows — document uploaded, OCR complete, application submitted, eligibility evaluated, deficiency raised, disbursement triggered. Kafka decouples services — when OCR processing is slow during peak load, the queue absorbs the backlog without blocking applicant submission. Consumer groups allow multiple OCR workers to process the queue in parallel. Topic retention is 7 days — failed events can be replayed if a service was down.

**Kubernetes on NIC MeghRaj:** Container orchestration. Each microservice runs in its own Kubernetes Deployment with auto-scaling based on CPU and Kafka consumer lag. During peak Pre-Matric application window, OCR worker deployments scale from 10 pods to 100 pods automatically. After the window closes, they scale back. This is cost-efficient and eliminates the need to provision for peak capacity permanently.

**Kong API Gateway:** Handles all inbound traffic. JWT validation, Aadhaar OTP eKYC session verification, rate limiting (100 requests per minute per IP for public endpoints, 1000 per minute for authenticated officer sessions), request routing to microservices, SSL termination. Kong plugins handle CORS, request transformation, and logging to the ELK Stack.

**Prometheus + Grafana:** Prometheus scrapes metrics from all services — request rate, error rate, latency percentiles, Kafka consumer lag, OCR processing time, database connection pool usage. Grafana dashboards visualize these metrics. Alerts configured for: OCR processing time above 60 seconds (SLA breach), Kafka consumer lag above 10,000 messages (backlog building), API error rate above 1%, database connection pool above 80% utilization.

**ELK Stack (Elasticsearch + Logstash + Kibana):** Logstash collects logs from all services, parses and enriches them, writes to Elasticsearch. Kibana provides log search and dashboards for the System Administrator. Application error logs, API access logs, and OCR processing logs all searchable in one interface. Separate from the audit log index — operational logs have a 30-day retention, audit log has 7-year retention.

### 7.6 Security Stack

**Aadhaar OTP eKYC (UIDAI):** Applicant identity verified at registration through UIDAI\'s AUA/KUA API. OTP sent to Aadhaar-registered mobile. Identity confirmed before account creation. No passwords for applicants — all subsequent logins via Aadhaar OTP. This eliminates the password reset support burden and ensures every account is tied to a verified identity.

**NIC SSO (OpenID Connect):** All Ministry officials authenticate through NIC\'s existing SSO infrastructure. No separate credential management for officers. Role assignments managed in the Admin/Config Service and enforced at both API gateway and service level.

**TLS 1.3:** All communications — client to API gateway, service to service, service to database — encrypted with TLS 1.3. HSTS headers prevent protocol downgrade attacks.

**AES-256-GCM:** All documents encrypted at rest in MinIO using server-side encryption. Bank account numbers encrypted in PostgreSQL at the application level before storage. Aadhaar numbers hashed (SHA-256 with unique salt per record) and never stored in plain text — UIDAI regulation requirement.

**RBAC at database level:** PostgreSQL row-level security policies ensure that a Scrutiny Officer in the Pre-Matric scheme cannot query NFST applications even if they bypass the application layer. Database-enforced access control is the last line of defence.

**CERT-In VAPT:** Mandatory Vulnerability Assessment and Penetration Testing by a CERT-In empanelled agency before go-live and annually thereafter. NIC security audit required before deployment on MeghRaj.

**DPDP Act 2023 compliance:** Explicit consent collected at registration for each data category (identity, academic, financial, contact). Data minimisation — only data required for the specific scheme is collected. Right to correction — applicants can update contact and bank details through a verified workflow. Data retention policy — application data retained 7 years post scheme closure per GoI records management rules, then deleted.

## 8. GRIEVANCE SLA ENGINE — DETAILED DESIGN

### 8.1 Categories and SLA Windows

**Technical / Portal Issue (password, OTP, form not loading):** Level 1 SLA — 48 hours. Assigned to: Technical Support Team. Level 2 escalation at 80% — 38 hours. Level 3 escalation at 100% — Director IT.

**Document Upload Failure or DigiLocker pull error:** Level 1 SLA — 48 hours. Assigned to: Scheme Technical Officer. Level 2 at 80% — 38 hours. Level 3 — Director, Scholarship Division.

**Eligibility Dispute (applicant contests rule evaluation):** Level 1 SLA — 5 working days. Assigned to: Scrutiny Officer for the scheme. Level 2 at 80% — 4 working days, escalates to Senior Scrutiny Officer. Level 3 — Joint Secretary.

**Payment / Disbursement Issue (not received, wrong amount, bank error):** Level 1 SLA — 72 hours. Assigned to: Scheme Finance Officer. Level 2 at 80% — 57 hours, escalates to Finance Director. Level 3 — Joint Secretary (Financial Adviser).

**Status Query (no update in expected time):** Level 1 SLA — 24 hours. Auto-response system can handle these — status is fetched from the application database and returned automatically if the query matches a known status. Human review only if auto-response fails or applicant escalates.

**Selection Dispute (contest merit list position):** Level 1 SLA — 5 working days. Assigned to: Selection Committee Member. Level 2 — Joint Secretary. Level 3 — Secretary, MoTA. Audit trail of merit score calculation mandatory for response.

### 8.2 Auto-Categorization

When a grievance is submitted, the Grievance Service runs the description text through an NLP classifier (fine-tuned IndicBERT) to predict the category. The classifier is trained on a corpus of past grievances from the fellowship portal with human-assigned categories. The predicted category determines the SLA, the assigned officer pool, and the template response framework. The applicant can also manually select a category — if the manual selection conflicts with the model prediction, a human supervisor is notified to review the categorization.

### 8.3 Resolution Quality Scoring

A grievance is only marked RESOLVED when one of these conditions is met: The applicant clicks \"Mark as Resolved\" in the app after receiving the response. The system detects the underlying issue is fixed — for a payment grievance, the disbursement status moves to CONFIRMED; for a document rejection grievance, the document status moves to VERIFIED. The grievance is marked CLOSED by a senior officer with a mandatory resolution summary.

If an officer types a reply but the underlying issue is not resolved and the applicant does not confirm — the SLA clock continues. The reply extends the SLA window by 24 hours to allow for applicant response, but a reply alone does not stop the escalation clock. This directly addresses the documented behavior where officers were typing acknowledgments but not resolving the underlying issue.

### 8.4 CPGRAMS Integration

When a grievance is received through CPGRAMS (Centralised Public Grievance Redress and Monitoring System), the CPGRAMS API pushes it to the SFMS Grievance Service. The ticket is created with a cpgrams_ref field. Resolution status is pushed back to CPGRAMS API when the ticket is resolved. This ensures grievances escalated to the Prime Minister\'s Office or other ministries through CPGRAMS are handled within the same SLA framework.

## 9. CONFIGURABLE SCHEME RULE ENGINE — HOW IT WORKS

### 9.1 Why This Is the Most Important Architecture Decision

Every government scholarship system built before this one has hardcoded eligibility rules in the application backend. When a scheme changes — income limit revised, new courses added, age limit modified — developers must change code, go through UAT, and deploy a new version. This takes weeks and often introduces bugs in adjacent functionality.

The rule engine in SFMS stores every rule as a JSON configuration. Administrators change rules through a UI. The system tests the new rules against historical data in a sandbox before activation. No code changes required for any rule modification.

### 9.2 Rule Configuration Structure

The eligibility_rules JSON for a scheme is an array of rule objects. Each rule object has:

rule_id: Unique identifier for the rule.

rule_type: One of INCOME_LIMIT, CASTE_CHECK, COURSE_LEVEL, INSTITUTION_CHECK, MARKS_THRESHOLD, AGE_LIMIT, EXISTING_SCHOLARSHIP_CHECK, DOMICILE_CHECK, FAMILY_BENEFIT_LIMIT, COURSE_STREAM_CHECK.

source_field: Where the data comes from — the OCR extracted field or application form field that will be evaluated. e.g. \"ocr.income_certificate.annual_income_figure\" or \"form.course_level\".

operator: The comparison operator — LTE (less than or equal), GTE, EQ, IN, NOT_IN, REGEX, CUSTOM.

value: The threshold or list value. For INCOME_LIMIT — 250000. For COURSE_LEVEL — \[\"MASTERS\", \"PHD\", \"POST_DOC\"\].

failure_mode: FAIL or DEFICIENT. FAIL means the application is ineligible. DEFICIENT means the applicant needs to provide more/corrected information.

failure_message: The message shown to the applicant if this rule fails or is deficient. Stored in English plus configured regional languages.

exception_rules: Optional — overrides the main rule under specified conditions. For example, the NOS marks threshold rule has an exception_rule that bypasses the 55% requirement if the institution QS rank is in the top 1,000.

### 9.3 Rule Evaluation Engine

The Eligibility Engine service receives an evaluation request with application_id and scheme_id. It loads the current rule set version for the scheme from the scheme_config table. For each rule in sequence, it resolves the source_field — looking up the extracted OCR value or the form field value. It applies the operator and value comparison. It records PASS, FAIL, or DEFICIENT with the actual value compared and the rule that was evaluated. If any rule returns FAIL — evaluation continues for all remaining rules (to give the applicant a complete deficiency list, not just the first failure). The final outcome is the worst result across all rules: any FAIL means overall FAIL, all PASS means PASS, any DEFICIENT with no FAIL means DEFICIENT.

The evaluation result is immutably logged with the rule_set_version, so if rules change after an application is submitted, the officer can always see which rules were in effect at the time of evaluation. Historical applications are not re-evaluated against new rules.

### 9.4 Sandbox Testing

Before activating any rule change, the System Administrator can run the new rule set against the last 1,000 submitted applications as a dry run. The sandbox evaluation shows: how many applications would change outcome (PASS to FAIL, FAIL to PASS, or DEFICIENT to PASS), which specific rules caused the change, and a downloadable comparison report. The Administrator reviews this report and either confirms activation or revises the rule. Activation requires confirmation from a second administrator (four-eyes principle).

## 10. IMPLEMENTATION ROADMAP

#### Phase 0 — Discovery and Design (Months 1-2)

Requirements gathering sessions with MoTA Scholarship Division officers, State Nodal Officers from 5 pilot states, and a cohort of NFST and NOS scholars. Finalize all scheme rule configurations in JSON format with MoTA sign-off. UI/UX design — wireframes for all five portal types, tested with low-literacy ST applicants through usability sessions at Common Service Centres in Jharkhand and Odisha. Architecture sign-off from NIC. DigiLocker API agreement and UIDAI AUA/KUA onboarding (these processes take 4-6 weeks and must start immediately). Azure AI Document Intelligence trial with MoTA sample documents to validate OCR accuracy targets.

#### Phase 1 — Core Platform (Months 3-6)

Applicant Portal — registration, dynamic form rendering, document upload, DigiLocker integration, draft saving, status tracking. Admin Dashboard — basic queue management, document viewer, officer action logging. Application Service and Document Service microservices deployed on Kubernetes. Eligibility Rule Engine with first 3 scheme configurations (NFST, NOS, Top Class). Scheme Config Admin UI. PostgreSQL and MongoDB schema deployment. Kafka cluster setup. MinIO on MeghRaj deployment.

#### Phase 2 — AI Integration (Months 5-8)

OCR Service — Azure AI Document Intelligence integration with all 14 document type field maps. Tesseract fallback pipeline. Image pre-processing pipeline. Tamper detection module. Perceptual hash deduplication system. IndicBERT fine-tuning for deficiency detection and name-community matching. XGBoost fraud scoring model trained on historical data. AI-assisted scrutiny interface in Admin Dashboard — side-by-side document viewer with OCR overlays and risk flag highlighting.

#### Phase 3 — Selection and Disbursement (Months 7-10)

Merit list generation engine with quota rules for all schemes. NOS Expert Committee interview scheduling module. PFMS/DBT API integration — payment order generation, status polling, reconciliation. NPCI BASE API integration — DBT pre-failure monitoring job. Bank account validation (penny-drop). Canara Bank API integration for NFST fellowship disbursement. Disbursement Service full deployment.

#### Phase 4 — State and Institution Portals (Months 9-11)

State/UT Portal deployment. SOE and UC digital submission module. State beneficiary data sync to dbttribal.gov.in via Web Services. Institution Portal for NFST and Top Class. Embassy/Mission portal for NOS. Pre-Matric and Post-Matric scheme configuration and state-level workflow deployment. CPGRAMS integration.

#### Phase 5 — Analytics and Scale Features (Months 10-12)

Executive dashboards — all analytics panels. Scheme performance reports with export. SLA monitoring dashboards. UMANG App integration for status tracking. Chatbot (TriBot) training and deployment in applicant portal. Auto-report scheduler. Data migration ETL pipeline for historical applications from legacy portals.

#### Phase 6 — Testing and Go-Live (Months 12-15)

VAPT by CERT-In empanelled agency. Load testing to 1 lakh concurrent users. UAT with MoTA officials, 5 state nodal officers, and 50 pilot applicants from NFST/NOS cohort. NIC security audit and MeghRaj deployment certification. Soft launch with NFST and NOS for the next application cycle. Full launch covering all schemes.

#### Phase 7 — Stabilisation and Scale (Months 15-18)

Pre-Matric at scale — 15 lakh applications in the first full season. Performance optimization based on live load data. AI model retraining on first season of live data. OCR accuracy audit and model improvement cycle. Helpdesk setup and first-line support training. SLA review and tuning based on actual processing times observed.

## 11. EXPECTED OUTCOMES AND SUCCESS METRICS

**Application processing time (NFST/NOS):** Baseline 60-90 days manual. Target: 21 days AI-assisted.

**Document verification accuracy:** Baseline ~70% variable manual. Target: 95% OCR + AI.

**Deficiency resolution cycle:** Baseline 15-30 days email-based. Target: 5 days in-app structured workflow.

**Grievance resolution time:** Baseline 30+ days. Target: 7 working days SLA-driven.

**Duplicate/fraudulent applications detected:** Baseline low — manual spot check only. Target: 90% detected pre-scrutiny by risk model.

**Disbursement failure rate:** Baseline 5-8% bank linking issues. Target: below 1% with PFMS validation pre-disbursement.

**Portal drop-off rate:** Baseline ~40% incomplete applications. Target: below 15% with guided pre-check, draft saving, deficiency guidance.

**Officer man-hours per 1,000 applications:** Baseline ~500 hours manual scrutiny. Target: below 100 hours AI-assisted review.

**DBT seeding failure rate:** Baseline 1,428 silent rejections in 2024-25. Target: zero silent rejections — all seeding issues caught 30 days before disbursement.

**Scheme onboarding time for new schemes:** Baseline weeks of development. Target: 1 day for administrator to configure and activate a new scheme through the rule engine UI.
