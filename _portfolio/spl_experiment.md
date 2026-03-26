---
title: "Design and Implementation of a Self-Paced Listening Experiment with Integrated Bilingual Language Profiling (Quechua-Spanish)"
excerpt: "End-to-end psycholinguistic experiment built in PsychoPy, combining self-paced listening with bilingual profiling and a reproducible Python data pipeline."
collection: portfolio
---
<p align="center">
  <img src="/images/psychopy.png" style="width: 100%; max-width: 700px; height: auto; border-radius: 12px;">
</p>

# Overview

<div style="text-align: justify; line-height: 1.7;">

This project presents the design, implementation, and analysis pipeline of a <strong>Self-Paced Listening (SPL) experiment</strong> integrated with a <strong>Bilingual Language Profile (BLP) questionnaire</div>, developed as part of my work in the LABORATIORIO CAMBIAR NOMBRE ACA.

</div>

The primary goal of the project was to create a <strong>fully reproducible psycholinguistic experiment pipeline</strong>, including:

- Experimental design and stimulus presentation. (PsychoPy)
- Participant interaction and reaction time collection.
- Bilingual profiling through structured questionnaires.
- Automated data cleaning and restructuring (Python).
- A repository-ready architecture for reproducibility and reuse.

This project reflects the intersection of <strong>computational linguistics, experimental design, and data engineering</strong>.

  
## Project Goals

The project was designed around three main objectives:

1. **Implement a controlled SPL paradigm**
   - Present auditory stimuli segmented across multiple steps.
   - Record precise reaction times at each segment.
   - Capture comprehension responses following each trial.

2. **Integrate a bilingual profiling system**
   - Collect demographic and linguistic background data.
   - Measure language use, proficiency, and attitudes.
   - Ensure usability across Spanish and Quechua contexts.

3. **Develop a reproducible data pipeline**
   - Clean and standardize raw PsychoPy outputs.
   - Merge experimental and questionnaire data.
   - Prepare datasets for statistical analysis.

---

## Experimental Design

### Self-Paced Listening Paradigm

The SPL task is a widely used method in psycholinguistics to study **incremental sentence processing**. In this implementation:

- Each sentence is divided into **7 audio segments**.
- Participants press the **spacebar** to advance between segments.
- Reaction time is recorded at each step.

After the final segment:

- A **comprehension question (segment 8)** is presented.
- Participants respond using:
  - **F = Sí [Yes]**
  - **J = No [No]**

This design allows us to measure the processing time at each segment, sensitivity to linguistic structure and comprehension accuracy

---

### Stimuli Structure

Audio stimuli follow a structured naming convention:

d_<list><sublist>_seg<number>.wav

Example:

- d_1a_seg1.wav = Segment 1
- d_1a_seg8.wav = Question audio

- **SEC Filings (8-K, 10-K, Exhibit 21):**  
  Used to extract executive information, corporate structure, and subsidiary relationships through document parsing and text processing.

- **FEC Political Contribution Data:**  
  Used to analyze PAC activity and classify companies based on political donation behavior.

- **Internal Company Datasets (Snowflake/Firebase):**  
  Provided structured corporate data, including company identifiers and PAC contribution records, enabling cross-dataset integration.

- **User-Generated Email Data (Gmail API):**  
  Historical “brand request” emails (~300k+) used to extract and aggregate user interest signals.

- **Web Data (Company Websites & Social Media):**  
  Collected via web scraping to enrich company profiles with contact information and external links.

---

### Tools and Technologies

- **Programming Languages:**  
  Python, SQL

- **NLP and Data Processing:**  
  pandas, NumPy, regex, spaCy, NLTK

- **Machine Learning / Statistical Methods:**  
  scikit-learn

- **Data Engineering and Storage:**  
  Snowflake, Firebase (Firestore), CSV

- **APIs and Web Scraping:**  
  SEC EDGAR API, Gmail API, BeautifulSoup, DuckDuckGo search integration, Rapidfuzz

- **Cloud Platforms:**  
  AWS, Azure, Google Cloud

- **Visualization and Analysis:**  
  matplotlib

---

## Project Breakdown

### 1. Executive and Corporate Information Extraction

This project focused on extracting and structuring executive-level information from SEC filings (8-K and 10-K), transforming unstructured financial documents into clean, analyzable datasets.

#### Objectives
- Identify executive names and roles from filings.  
- Normalize and standardize titles.
- Create a clean, deduplicated executive dataset.  

#### Approach
- Applied **regex-based extraction** and **spaCy NLP models** for entity recognition.  
- Implemented **multi-tier confidence validation** (high/low/spaCy).  
- Removed false positives (e.g., financial terms misidentified as names).  
- Standardized titles into canonical categories (CEO, CFO, etc.).  
- Built validation and deduplication pipelines.  

#### Outcome
- Produced a structured dataset of executives across thousands of companies.  
- Improved consistency and usability of executive-level data.  
- Enabled downstream analysis and integration with other datasets.  

_SpaCy Extraction snippet: This pipeline combines statistical NLP (spaCy NER) with rule-based post-processing to extract and normalize executive names from noisy SEC filing text. By filtering false positives and enforcing structural constraints, it improves precision and produces a high-quality, deduplicated entity dataset._

```python
# Load SpaCy English model
nlp = spacy.load("en_core_web_sm")

# Load cleaned low data
raw_path = "executive_cleaned_low.csv"
df = pd.read_csv(raw_path)

# Extraction
def extract_persons(text):
    if pd.isna(text):
        return None
    doc = nlp(text)
    names = [ent.text.strip() for ent in doc.ents if ent.label_ == "PERSON"]
    return names[0] if names else None

df["executive_name"] = df["executive_name"].apply(extract_persons)

# --- STEP 3: Basic text cleaning ---
df["executive_name"] = (
    df["executive_name"]
    .astype(str)
    .str.replace(r"\b(Email|Phone)\b", "", regex=True)
    .str.strip()
)

# Remove false positives
false_positive_keywords = [
    "Prepared Remarks", "Good Standing", "Qualified Transferee", "Diligence", "Milestones",
    "Retirement", "Witness", "Indemnifying", "Securities", "Transfer Restricted", "Baton Rouge",
    "Ganado Advocates", "Due Diligence", "Mutual Acknowledgment", "Hasche Sigle",
    "Dykema Gossett", "Gunderson Dettmer", "Advocates", "Consulting", "LLP", "LLC", "Group",
    "Corp", "Holdings", "Capital", "Incorporated", "Partners", "PLC", "Advisors", "Associates",
    "Inc", "Company", "Enterprises", "Legal", "Strategy", "Bank", "Investments", "Management",
    "Services"
]
pattern = re.compile("|".join([re.escape(k) for k in false_positive_keywords]), re.IGNORECASE)

def is_valid_name(name):
    if pd.isna(name) or name.strip() == "":
        return False
    if pattern.search(name):
        return False
    if len(name.split()) > 6 or any(char.isdigit() for char in name):
        return False
    if name.isupper() and len(name) > 2:
        return False
    return True

df = df[df["executive_name"].apply(is_valid_name)]

# Delete duplicates
df = df.drop_duplicates(subset=["executive_name"]).reset_index(drop=True)

# --- STEP 6: Save final cleaned file ---
final_path = "executive_cleaned_spacy.csv"
df.to_csv(final_path, index=False)

print(f"Cleaned dataset saved as {final_path} ({len(df)} rows)")
```

### 2. Corporate Structure and Subsidiary Mapping

This project focused on identifying parent–subsidiary relationships using SEC filings, enabling analysis of corporate hierarchies.

#### Objectives
- Extract subsidiary information from Exhibit 21 filings.  
- Build a unified dataset of corporate relationships.  

#### Approach
- Used the **SEC EDGAR API** to retrieve 10-K filings.  
- Parsed Exhibit 21 documents for subsidiary disclosures.    
- Normalized company and subsidiary names.  

#### Outcome
- Created a structured parent–subsidiary dataset.  
- Enabled hierarchical analysis of corporate structures.  
- Provided foundational data for linking companies to broader datasets.  

_BeautifulSoup Extraction Snippet: This extraction function combines HTML parsing with rule-based entity detection to identify subsidiary companies from SEC Exhibit 21 filings. By prioritizing structured table data and incorporating fallback text parsing, it handles variability in document formats and ensures reliable recovery of corporate entities._

```python
def parse_exhibit_21(url):
    r = requests.get(url, headers=SEC_HEADERS)
    if not r.ok:
        return []

    soup = BeautifulSoup(r.text, "html.parser")

    subs = []

    # Extract from tables first
    tables = soup.find_all("table")
    for table in tables:
        for row in table.find_all("tr"):
            cells = row.find_all(["td", "th"])
            if not cells:
                continue

            text = cells[0].get_text(" ", strip=True)

            # Skip header-like entries
            if text.lower() in ["name", "subsidiary", "entity", "company"]:
                continue

            # Skip junk rows
            if len(text) < 3:
                continue

            # Must contain an indicator of corporate entity
            if not re.search(r'\b(inc|llc|ltd|corp|co|company|bank|group)\b', text, re.I):
                continue

            subs.append(text)

    if subs:
        return subs

    # Raw text parsing
    text = soup.get_text("\n")
    lines = [line.strip() for line in text.split("\n") if line.strip()]

    pattern = re.compile(r"\b(inc|llc|ltd|corp|company|co|bank|group)\b", re.I)

    clean = [line for line in lines if pattern.search(line)]
    
    return clean
```
### 3. Contact Enrichment and Email-Based NLP Pipelines

This project focused on extracting structured information from web data and large-scale email datasets.

#### Objectives
- Enrich company data with contact and social media information.  
- Extract user-generated brand requests from historical emails.  

#### Approach
- Built **web scraping pipelines** using BeautifulSoup and search APIs.  
- Implemented filtering to remove irrelevant or broken links.  
- Developed a **Gmail API pipeline** to process ~300k emails.  
- Normalized brand names and aggregated request frequencies.  

#### Outcome
- Generated enriched company profiles with contact data.  
- Produced ranked datasets of user-requested brands.  
- Enabled analysis of user demand and trends.

_Gmail Brand Extraction Snippet: This rule-based extraction function converts semi-structured email text into structured brand request candidates. It uses regex-based span detection, fallback parsing, and delimiter-aware splitting to preserve useful entities while reducing noise from inconsistent user input._

```python
BRAND_BLOCK_RE = re.compile(
    r"i['’]d\s+like\s+to\s+know\s+more\s+details\s+about:\s*(.*?)\s*thanks",
    flags=re.IGNORECASE | re.DOTALL
)

SUBJECT_FALLBACK_RE = re.compile(
    r"details\s+about:\s*(.*?)\s*(?:thanks|\Z)",
    flags=re.IGNORECASE | re.DOTALL
)

def extract_brand_block(body: str, subject: str):
    if body:
        m = BRAND_BLOCK_RE.search(body)
        if m:
            raw = m.group(1).strip()
            return (raw if raw else None), "body"

    if subject:
        m = SUBJECT_FALLBACK_RE.search(subject)
        if m:
            raw = m.group(1).strip()
            return (raw if raw else None), "subject"

    return None, "none"


def split_brands(raw: str):
    raw = (raw or "").strip()
    if not raw:
        return []

    parts = []
    for chunk in raw.split("/"):
        chunk = re.sub(r"\s+", " ", chunk).strip()
        if chunk:
            parts.append(chunk)

    final = []
    for p in parts:
        final.extend([x.strip() for x in p.split(",") if x.strip()])

    return final
```

### 4. Political Data Integration and Validation

This project integrated corporate data with political contribution datasets to analyze corporate political activity.

#### Objectives
- Determine PAC activity at the company level.  
- Validate and classify political contribution data.  
- Extend analysis to executive-level political behavior.  

#### Approach
- Integrated **FEC data** with internal **Snowflake datasets** . 
- Built classification pipelines for PAC activity (donated / not donated / none).  
- Implemented **exact and fuzzy matching** against official records.  
- Linked executives to company identifiers for future donation analysis.  

#### Outcome
- Created a company-level PAC activity dataset.  
- Achieved high validation accuracy (~95% match rate).  
- Established groundwork for executive-level political analysis.

_Snowflake FEC Normalization Function Snippet: This normalization function supports entity resolution by converting noisy committee names into a canonical form, improving join accuracy across external (FEC) and internal datasets. It is a key preprocessing step for linking political contribution data at scale._

```python
def norm_committee_name(s: str) -> str:
    if s is None:
        return ""
    s = str(s).lower()
    s = re.sub(r"[^a-z0-9\s]", " ", s)  # remove punctuation
    s = re.sub(r"\b(pac|political|action|committee|fund|the|and|of|for|employees)\b", " ", s)
    s = re.sub(r"\s+", " ", s).strip()
    return s

fec_p["committee_name_clean"] = fec_p["CMTE_NM"].map(norm_committee_name)
sf["committee_name_clean"] = sf["COMMITTEE_NAME"].map(norm_committee_name)

#Left join
merged = fec_p.merge(
    sf[["committee_name_clean", "TOTAL_AMOUNT", "HAS_DONATED", "FIRST_CYCLE", "LAST_CYCLE"]],
    on="committee_name_clean",
    how="left",
    suffixes=("_fec", "_sf")
)

merged["TOTAL_AMOUNT"] = merged["TOTAL_AMOUNT"].fillna(0)
merged["HAS_DONATED"] = merged["HAS_DONATED"].fillna(False)
```

## Results and Outcomes

The internship resulted in several structured datasets and reusable workflows that improved the organization’s ability to analyze corporate, executive, and political data at scale.

Some of the main outputs included:

- **Executive extraction dataset:** a cleaned dataset containing **11,283 executive records** across **4,631 companies**, with normalized job titles and confidence labels for extraction quality.
- **Executive title categorization:** a standardized mapping of raw executive titles into canonical categories such as CEO, CFO, President, and Vice President.
- **Company contact enrichment dataset:** a structured dataset of **4,631 companies** with extracted domains, investor-relations pages, contact emails, and social media links.
- **Parent–subsidiary dataset:** a unified dataset built from SEC Exhibit 21 filings, linking companies to subsidiary information and flagging cases where Exhibit 21 was unavailable.
- **Brand request aggregation dataset:** a cleaned summary of historical user-submitted company requests extracted from email data, including normalized brand names, frequency counts, and time ranges.
- **PAC donation superset:** a company-level dataset classifying firms into **PAC_DONATED**, **PAC_NO_DONATIONS**, and **NO_PAC** categories based on FEC and Snowflake data.
- **PAC validation layer:** a matching workflow that achieved approximately **95% alignment** between Snowflake committee names and official FEC records.
- **Executive change event dataset:** a structured dataset built from Official Board alert emails, capturing appointments, promotions, departures, and role changes across companies and industries.

_For more detailed information about the project's code and output please visit the following [Repository](https://github.com/lldavoll/NLP-Pipelines-for-Corporate-and-Policy-Data)_

## What I Learned...

<div style="text-align: justify; line-height: 1.7;">
This internship allowed me to apply theoretical knowledge from the MSHLT program to real-world data problems in the context of noisy, large-scale, and heterogeneous datasets.
</div>

### Applying NLP to Real-World Data

<div style="text-align: justify; line-height: 1.7;">
Through tasks such as executive extraction and email-based brand parsing, I learned how to apply NLP techniques beyond controlled environments. Unlike classroom datasets, real-world data required combining statistical methods (e.g., spaCy NER) with rule-based approaches to handle ambiguity, inconsistency, and noise.
</div>

### Importance of Data Preprocessing and Normalization

<div style="text-align: justify; line-height: 1.7;">
My major takeaway was the importance of preprocessing in NLP pipelines. Tasks such as executive title normalization, committee name standardization, and brand cleaning showed me that raw data is rarely usable without extensive transformation. Small inconsistencies in text can significantly impact downstream tasks such as matching and aggregation.
</div>

### Entity Resolution and Data Integration

<div style="text-align: justify; line-height: 1.7;">
Working across multiple datasets (SEC, FEC, Snowflake, email data) highlighted the complexity of entity resolution. I learned how to design normalization strategies and matching workflows (including fuzzy matching) to link entities across sources, which is a key challenge in applied NLP and data engineering.
</div>

### Scalability and Performance

<div style="text-align: justify; line-height: 1.7;">
Handling large datasets (SEC filings, hundreds of thousands of emails, Snowflake datasets) required thinking about performance and memory efficiency. I learned to design pipelines that scale, using chunked processing, efficient transformations, and careful validation to ensure reliability.
</div>

### Professional and Collaborative Skills

<div style="text-align: justify; line-height: 1.7;">
More important than technical skills, I gained experience working in a collaborative environment outside my native language (Spanish) were I was able to communicate progress, refining solutions based on feedback, and aligning with my coworkers to achieve the project goals. 
</div>

### Bridging Theory and Practice (Connection to MSHLT Coursework)

<div style="text-align: justify; line-height: 1.7;">
<p> 
One of the most valuable aspects of this internship was the opportunity to directly apply concepts from my Master’s in Human Language Technology to real-world data challenges.
</p>

<p>
  
Coursework in <em>Statistical Natural Language Processing, HLT I & II, Computational Linguistics, and Computational Techniques for Linguists</em> provided the foundation for designing NLP pipelines for tasks such as named entity recognition, text normalization, and entity extraction. In practice, however, these methods needed to be combined with rule-based approaches to handle inconsistencies and edge cases that are rarely present in controlled academic datasets.

</p>

<p>
Additionally, courses such as <em>Statistical Analysis for Linguistics, Data Mining and Discovery, and Data Analysis and Visualization</em> provided the statistical foundation necessary to evaluate data quality, validate outputs, and identify patterns in large datasets. These skills were important for tasks such as PAC donation classification and entity matching, where even small inconsistencies could significantly impact results. These courses also strengthened my ability to communicate results clearly and effectively.
</p>
</div>

## Conclusion and Future Work

<div style="text-align: justify; line-height: 1.7;">

<p> 
As a final takeaway, the internship provided me experience in building NLP-driven data pipelines for real-world datasets. By integrating corporate, financial, and user-generated data sources, I developed systems that transform unstructured text into structured, analyzable information which required combining statistical NLP methods with rule-based approaches, emphasizing the importance of flexibility when working with noisy and heterogeneous data.
</p>

<p> 
Beyond the technical implementation, this experience reinforced key data engineering principles such as scalability, validation, and reproducibility. It also highlighted the importance of designing workflows that not only produce accurate results, but are also maintainable and useful for downstream applications.
</p>

</div>

### Future Work

For future project I would like to extend my work on:

- **Advanced entity resolution:**  
  Incorporate machine learning or embedding-based methods to improve matching accuracy across datasets.

- **Automation and pipeline orchestration:**  
  Integrate tools such as dbt or workflow schedulers to improve reproducibility and deployment.

- **Real-time data integration:**  
  Extend pipelines to support streaming or near real-time updates from APIs and external sources.

- **Containerization:**  
  Containerize pipelines using Docker to ensure reproducibility, portability, and consistent execution across environments.
