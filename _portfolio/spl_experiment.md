---
title: "Design and Implementation of a Self-Paced Listening Experiment with Integrated Bilingual Language Profiling (Quechua-Spanish)"
excerpt: "End-to-end psycholinguistic experiment built in PsychoPy, combining self-paced listening with bilingual profiling and a reproducible Python data pipeline."
collection: portfolio
---
<p align="center">
  <img src="/images/psychopy.png" style="width: 100%; max-width: 700px; height: auto; border-radius: 12px;">
</p>

# Overview

<p align="center">
  <img src="/images/psychopy1.png" 
       style="width: 100%; max-width: 800px; height: auto; border-radius: 12px;">
</p>

<div style="text-align: justify; line-height: 1.7;">
<p>
  
This project presents the design, implementation, and analysis pipeline of a <strong>Self-Paced Listening (SPL) experiment</strong> integrated with a <strong>Bilingual Language Profile (BLP) questionnaire</strong>, developed as part of my work in the <a href="https://uavip.arizona.edu/arizona-applied-psycholinguistics-lab" target="_blank"> Arizona Applied Psycholinguistics Lab (AAPL) </a>.
</p>
</div>

The primary goal of the project was to create a <strong>fully reproducible psycholinguistic experiment pipeline</strong>, including:

- Experimental design and stimulus presentation. (PsychoPy)
- Participant interaction and reaction time collection.
- Bilingual profiling through structured questionnaires.
- Automated data cleaning and restructuring (Python).
- A repository-ready architecture for reproducibility and reuse.
  
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

This design allows us to measure the processing time at each segment, sensitivity to linguistic structure and comprehension accuracy.

---

### Stimuli Structure

Audio stimuli follow a structured naming convention:

d_[list][sublist]_seg[number].wav

Example:

- d_1a_seg1.wav = Segment 1
- d_1a_seg8.wav = Question audio
  
---

Each trial is associated with metadata:

- `item_id`
- `list`
- `fonologia` [phonology]
- `genero` [genre]
- `spl_exp` (experimental condition)

Four lists are used for **counterbalancing participants**, ensuring experimental control.

---

### Pseudorandomization

To avoid order effects, I implemented a pseudorandomization constraint:

> No more than two consecutive items may belong to the same condition.

This was implemented in PsychoPy using custom Python logic:

- Items are shuffled dynamically at runtime.
- A validation function enforces constraints.
- The final order is applied before the experiment begins.

This reflects the application of **algorithmic thinking in experimental design**.

---

## Bilingual Language Profile (BLP)

A major extension of this project was the integration of a **multi-section bilingual questionnaire**, adapted for Spanish and Quechua speakers.

### Sections Implemented

1. **Biographical Information**
   - Age, gender, birthplace, education
   - Parents’ languages

2. **Language History**
   - Age of acquisition
   - Years of exposure
   - Formal education in each language

3. **Language Use**
   - Usage percentages across contexts:
     - Family
     - Work
     - Thinking
     - Social environments

4. **Language Competence**
   - Self-rated proficiency:
     - Speaking
     - Understanding
     - Reading
     - Writing

5. **Language Attitudes**
   - Identity and cultural affiliation
   - Native language perception

---

## Project Breakdown

### 1. Preprocessing: Audio Durations, Counterbalanced Lists, and Master Stimuli Generation

<div style="text-align: justify; line-height: 1.7;">
<p>
  
The first stage of the project focused on preparing the materials needed to run the experiment in PsychoPy. This preprocessing step had three main goals:

</p>
</div>

1. Extract the exact duration of each audio segment in milliseconds.  
2. Generate four counterbalanced experimental lists.  
3. Create the Bilingual Language Profile (BLP) form structure.  

<div style="text-align: justify; line-height: 1.7;">
<p>
  
This stage was necessary because the experiment relies on segmented [.wav] files, and each segment must be presented with precise timing. By calculating the duration of each file ahead of time, I was able to control the flow of the stimuli more accurately and prepare the condition files that PsychoPy would later load during the experiment.

</p>
</div>

#### Purpose

The preprocessing code was designed to support several parts of the experiment at once. Specifically, it was used to:

- Control timing between stimuli.
- Create four lists for counterbalancing participants across conditions.
- Support later logging and timing analysis.
- Add the experiment condition label for each item:
  - **Diminutive (`dim`)**
  - **Plural (`plu`)**
- Create the Bilingual Language Profile (BLP) form input structure.
  

_Master Stimuli and ms Extraction snippet: This pipeline calculates the duration (in milliseconds) of each .wav audio segment in a folder.
After that it creates 4 lists, merge them as a master stimuli that can be uploaded to a PsychoPy Experiment._

```python
import os
from pydub import AudioSegment
import pandas as pd

audio_dir = r"MY_PATH"

def get_duration_ms(file_path):
    audio = AudioSegment.from_wav(file_path)
    return len(audio)  # duration in milliseconds

rows = []

for file in os.listdir(audio_dir):
    if file.endswith(".wav"):
        path = os.path.join(audio_dir, file)
        duration = get_duration_ms(path)

        rows.append({
            "audio_file": file,
            "duration_ms": duration,
            "segment_number": int(file.split("seg")[-1].replace(".wav", "")),
            "spl_exp": "dim" if "d_" in file else "plu"
        })

df = pd.DataFrame(rows)
df.to_csv("durations.csv", index=False, encoding="utf-8-sig")
```
---

### 2. Bilingual Language Profile (BLP) Implementation

<div style="text-align: justify; line-height: 1.7;">
<p>
  
The second major part of the project was the implementation of a <strong>Bilingual Language Profile (BLP)</strong> questionnaire directly inside PsychoPy. The purpose of this component was to gather participant background information relevant to bilingualism, language use, and self-reported proficiency.

<p>
</p>

The BLP section was designed to complement the self-paced listening task by providing a richer profile of each participant’s linguistic experience. This was especially important because the project involved bilingual participants and required more than simple demographic information.
</p>
</div>

#### Sections Included

The BLP implementation was divided into multiple sections:

- **Biographical information.**
- **Language history.**
- **Language use.**
- **Language competence.**
- **Language attitudes.**

The questionnaire included items such as:

- Age and place of birth.
- Current residence.
- Parents’ languages.
- Age of acquisition for each language.
- Years of formal education in each language.
- Self-reported speaking, reading, writing, and comprehension ability.
- Patterns of language use with family, friends, work, and internal thought.
- Identity and attitude toward the participant’s languages.

#### Design Decisions

<div style="text-align: justify; line-height: 1.7;">
<p>
  
At first, I explored PsychoPy’s <strong>Form</strong> component to build the questionnaire. However, in practice this created substantial lag and reduced the performance of the experiment, especially on less powerful computers. To solve this, I redesigned the BLP using a combination of:

</p>
</div>

- **TextBox2** for open-ended text fields
- **Sliders** for ratings and numeric scales
- **Custom “Siguiente” buttons** for navigation
- **Code components** to enforce that participants could only continue after answering all required questions

<div style="text-align: justify; line-height: 1.7;">
<p>
  
This redesign significantly improved usability and performance. It also gave me greater control over the visual layout, response validation, and multilingual interface design.

</p>
</div>

#### Why This Matters?

<div style="text-align: justify; line-height: 1.7;">
<p>
  
This part of the project showed me that building experimental tools often requires balancing theory and implementation. From an HLT perspective, the BLP section demonstrates the use of technical tools to collect structured linguistic data while maintaining an accessible participant experience.

</p>
</div>

---

### 3. Prueba Step: Practice Version of the Experiment

<div style="text-align: justify; line-height: 1.7;">
<p>
  
Before running the full experiment, I created a <strong>practice version</strong> (`prueba`) to test the full pipeline in a controlled way. This step served as a smaller-scale version of the experiment and was essential for debugging timing, audio playback, keyboard responses, and questionnaire flow.

</p>
</div>

The practice trials allowed me to verify that:

- Segmented audio played in the correct order.
- Participants could advance with the spacebar.
- Comprehension questions appeared correctly.
- Key responses (`f` and `j`) were recorded properly.
- Timing variables were stored as expected.
- PsychoPy loaded the correct CSV condition files.
- The BLP routines worked as intended inside the full experiment structure.

<div style="text-align: justify; line-height: 1.7;">
<p>
This stage was important because it exposed problems that would have been difficult to diagnose during real participant testing. For example, it helped identify issues related to routine transitions, lag caused by certain interface elements, and how PsychoPy stored response data in the output CSV files.
<p>
  
</p>
By separating a practice phase from the main experiment, I was able to test the experimental logic more safely and make iterative adjustments before final deployment.

</p>
</div>
---

### 4. Testing and Experimental Refinement

<div style="text-align: justify; line-height: 1.7;">
<p>
  
Once the preprocessing and practice stages were complete, I moved to a broader testing phase. This involved repeatedly running the experiment in PsychoPy and refining both the task structure and participant interface.
  
</p>
</div>

Several important implementation issues were resolved during this stage:

#### Audio Timing

<div style="text-align: justify; line-height: 1.7;">
<p>
  
One of the main testing goals was to confirm that each audio segment stopped at the correct point. Since the experiment depends on segmented listening, even small timing inconsistencies could affect the validity of the task. The preprocessing step with duration extraction was therefore critical for reliable playback.
<p>
  
</p>
I also examined the difference between PsychoPy log timings and CSV output timings. In particular, the reported value of `audio_stopped` in the CSV did not always exactly match the “Audio finished at” time in the PsychoPy log. This helped me better understand the difference between internal PsychoPy timing and data written to the output file, including small processing delays.

</p>
</div>

#### Fixation Cross and Routine Flow

<div style="text-align: justify; line-height: 1.7;">
<p>
At one point, the fixation cross routine caused the next audio segment to begin automatically before the participant was ready. After testing several configurations, I removed the fixation and instruction elements that were interfering with participant-controlled pacing. This restored the intended self-paced behavior of the task.

</p>
</div>

#### Performance and Lag

<div style="text-align: justify; line-height: 1.7;">
<p>
The most significant technical issue was lag. Through testing, I found that PsychoPy’s Form component was one of the main sources of slowdown. Splitting the questionnaire into smaller routines helped somewhat, but the strongest improvement came from replacing Forms with TextBox2 and Sliders.
  
</p>
</div>
---

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
