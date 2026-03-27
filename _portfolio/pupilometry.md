---
title: "Pupillometry Experiment on Spanish Subjunctive Processing: EyeLink Implementation and Psycholinguistic Analysis [Ongoing Project]"
excerpt: "A pupillometry-based experiment using EyeLink to investigate real-time processing of Spanish subjunctive morphology in heritage speakers and L2 learners."
collection: portfolio
---
<p align="center">
  <img src="/images/experiment.png" style="width: 100%; max-width: 700px; height: auto; border-radius: 12px;">
</p>

# Overview

<div style="text-align: justify; line-height: 1.7;">
<p> 
This project consists of the design, implementation, and deployment of a <strong>pupillometry-based psycholinguistic experiment</strong> investigating how bilingual speakers process <strong>Spanish subjunctive morphology in real time</strong>. The experiment was built using Experiment Builder and run on an EyeLink 1000 Plus system, integrating <em>linguistic theory, experimental design, and technical implementation.</em>
</p>   
<p>
The project is part of my work in the <a href="https://uavip.arizona.edu/arizona-applied-psycholinguistics-lab" target="_blank"> Arizona Applied Psycholinguistics Lab (AAPL)</a> at the University of Arizona, which studies how <strong>pupil dilation reflects cognitive load during sentence processing</strong>, particularly when participants encounter <strong>ungrammatical structures</strong>. This study extends that paradigm by incorporating additional experimental controls, including <strong>indicative mood baselines, lexical frequency manipulation, and nonce verbs</strong>. 
</p>
</div>

## Project Goals
<div style="text-align: justify; line-height: 1.7;">
The primary goal of this project is to investigate how bilingual speakers process <strong>Spanish subjunctive morphology in real time, using pupillometry as an implicit measure of cognitive effort</strong>. This research aims to examinate whether speakers exhibit sensitivity to grammatical distinctions during online processing.
</div>
More specifically, this project pursues the following goals:

1. **Test the Bottleneck Hypothesis in real-time processing**
   <div style="text-align: justify; line-height: 1.7;">
      A main objective is to evaluate predictions from the <em>Bottleneck Hypothesis</em>, which claims that <strong>functional morphology is a primary source of difficulty in second language acquisition</strong>. By focusing on the subjunctive, this project examines whether bilingual speakers show <strong>increased processing effort when encountering morphological violations</strong>, even when they may perform well on explicit tasks.
   </div>

2. **Compare implicit and explicit knowledge of grammar**
   - **Explicit knowledge** (*offline tasks, such as forced-choice judgments*).
   - **Implicit processing** (*pupil dilation*).

3. **Examine differences across speaker populations**
   - Another goal is to compare how different bilingual groups process subjunctive morphology:
     - **Native speakers** (*baseline*).
     - **Heritage speakers**.
     - **L2 learners**.
     
4. **Measure cognitive load using pupillometry**
   <div style="text-align: justify; line-height: 1.7;">
     A methodological goal is to use <strong>pupil dilation as a continuous, real-time indicator of processing difficulty</strong>. The project tests whether ungrammatical sentences <em>SHOULD HAVE</em> greater pupil dilation which provides a more sensitive measure than traditional behavioral responses.
   </div>

---

## Technologies and Tools

<p align="center">
  <img src="/images/experiment1.png" style="width: 100%; max-width: 700px; height: auto; border-radius: 12px;">
</p>
### System Architecture

The experiment was deployed using a **dual-machine EyeLink setup and Experiment Builder**:

- **Host PC**  
  - Handles eye tracking.  
  - Stores raw data (`.edf`).  

- **Display PC**  
  - Runs the experiment.  
  - Presents stimuli (audio + fixation).  
  - Records behavioral data (`.dat`).  

---

### Stimulus Dataset

The dataset created includes the following sections:

- **Trial structure variables** (*condition, block, list*).  
- **Linguistic predictors** (*mood, grammaticality, verb type*).  
- **Timing variables** (*onsets, durations*).  

---

### Data Pipeline

The experiment produces two primary outputs:

- `.edf` → **eye-tracking data** (pupil size, gaze, timestamps).  
- `.dat` → **behavioral data** (reaction times, responses.  

These datasets are later combined for **statistical analysis**.

---

## Outcomes

This ongoing work has contributed to:

- The development of a scalable transcript preprocessing pipeline. 
- Standardized data suitable for sociolinguistic and computational analysis. 
- Improved reproducibility in corpus preparation workflows.  
- Identification of trade-offs in preprocessing decisions.  

---

_For more detailed information about the project please check the following repository: [Official COBIVA Repository](https://github.com/COBIVA).
