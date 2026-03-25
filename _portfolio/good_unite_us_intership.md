---
title: "Goods Unite Us Internship: NLP Pipelines for Corporate and Policy Data"
excerpt: "During my internship at Goods Unite Us, I developed NLP-driven data pipelines to process large-scale corporate and policy datasets, including SEC filings and political contribution records. This project focused on extracting, normalizing, and integrating unstructured data from into structured insights to support transparency, check reliable patterns and integrated to the Mobile App."
collection: portfolio
---
<p align="center">
  <img src="/images/good.png" style="width: 100%; max-width: 700px; height: 320px; object-fit: cover; border-radius: 12px;">
</p>

# Summary
<div style="text-align: justify; line-height: 1.7;">
<p>
During my internship at Goods Unite Us, I worked as an NLP Intern developing data pipelines to process large-scale structured and unstructured datasets related to corporations, executives, political contributions, and user-generated requests. My work focused on transforming noisy sources such as SEC filings, FEC records, email-based brand requests, and internal company datasets into structured, analyzable outputs that could support transparency, improve data quality, and contribute to the company’s products.
</p>

<p>
A central part of the internship involved applying natural language processing and data science methods to data problems. I built workflows for information extraction, text normalization, entity resolution, and cross-dataset integration, with the goal of producing reliable datasets from sources that were often inconsistent, incomplete, or semi-structured. This directly aligned with the internship goals of strengthening my NLP and preprocessing skills, gaining experience with large-scale text data, and learning technical analysis skills in a collaborative environment.
</p>

<p>
Across the internship, I contributed to several connected projects, including executive extraction from SEC filings, title normalization, contact enrichment, subsidiary extraction from Exhibit 21, PAC donation classification and validation, email-based brand request aggregation, and executive change extraction from alert emails. Together, these tasks formed a broader corporate intelligence pipeline that connected public filings, political data, and internal datasets into reusable analytical resources. 
</p>
</div>
  
## Project Goals
<div style="text-align: justify; line-height: 1.7;">
  
The primary goal of this internship was to apply natural language processing and data science techniques to real-world, large-scale datasets using Python involving corporate, financial, and policy-related information. Rather than working with clean, preprocessed data, the focus was on developing robust workflows capable of handling noisy, inconsistent, and semi-structured sources such as SEC filings, political contribution records, and user-generated text.
</div>

**Key objectives included:**

- Developing preprocessing pipelines for noisy and unstructured data (SEC filings, FEC records, email text).
- Implementing information extraction and normalization workflows.
- Performing entity resolution across inconsistent datasets.
- Integrating multiple data sources into unified, structured outputs.
- Translating technical results into insights for real-world applications.
- Collaborating in a professional engineering environment.

## My Role and Contributions

As an NLP Intern, I:

- **Built end-to-end NLP pipelines** to process structured and unstructured data from SEC filings, FEC records, and internal datasets. 
- **Extracted executive information** (names, roles, company relationships) from SEC filings using regex-based and NLP methods (e.g., spaCy, RapidFuzzy), with multi-tier confidence validation (filters).  
- **Normalized and standardized executive titles**, reducing hundreds of raw variants into consistent categories (e.g., CEO, CFO, President). 
- **Performed entity resolution across datasets**, matching companies and executives despite inconsistencies in naming and formatting.  
- **Integrated corporate and political data**, linking company records with PAC contribution data to enable analysis of corporate political activity.  
- **Developed data validation workflows**, including filtering, deduplication, and fuzzy matching to improve data quality and reliability.  
- **Processed large-scale datasets**, such as SEC filings and over 300k user-generated emails, using memory-efficient and scalable workflows.  
- **Removing false positives**, such as  non-person entities and refining extraction pipelines through iterative validation 
- **Optimized long-running processes**, including multi-day web scraping workflows with filtering, retry logic, and domain validation  
- **Built web-scraping pipelines** to collect company contact information such as domains, emails, social media.  
- **Developed email-based extraction systems** using the Gmail API (with Google Cloud) to process historical brand requests, normalize entities.
- **Extracted subsidiary relationships** from SEC Exhibit 21 filings using the EDGAR API, creating structured parent–subsidiary datasets.
- **Engineered data integration workflows** for Firebase (Firestore), Snowflake for normalization mismatches, and joins.

During the internship I worked most    ly with **Python** (pandas, regex, NLP libraries), SQL/Snowflake, and cloud platforms such as AWS, Azure, Firebase, and Google Cloud APIs.

## Data Sources and Tools

This project involved integrating datasets from heterogeneous sources, requiring both NLP techniques and data engineering workflows.

### Data Sources

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

### Connection to MSHLT Coursework

The internship allow me to apply the knowledge that that I acquired during the program, during this internship I was able to use directly concepts and techniques such as:

- **Statistical NLP:**  
  Text preprocessing, feature extraction, and handling of noisy language data.

- **Programming for NLP (Python):**  
  Implementation of scalable data pipelines and data manipulation workflows.

- **Data Analysis and Visualization:**  
  Summarizing and interpreting large datasets through statistical methods and visual outputs.

- **Corpus Processing:**  
  Working with large, real-world text corpora (SEC filings, emails) requiring normalization and structured representation.



* **Length**: A summary of the project goals, technology used, and outcomes, as appropriate for a general technical audience, between 1000 and 3000 words (not counting code)
* **Content**: student’s experience demonstrates the learning outcomes for the MSHLT program [^note]
* **Code**: Code is contained in the site, or a link to the code (such as in a GitHub repository) exists on the site.
* **Professionalism**: Free of grammatical, mechanical, and stylistic issues
* **Above and beyond**: How well does this component communicate the most relevant features?


[^note]: The learning outcomes of the MSHLT program are:
    
    1. Students will demonstrate programming skills for the workplace.
    2. Students will be able to use fundamental algorithms and concepts in Natural Language Processing.
    3. Students will show knowledge of tools and packages used in Natural Language Processing.
