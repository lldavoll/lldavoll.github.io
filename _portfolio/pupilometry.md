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

- **Eye-tracking data** (`.edf`): Pupil size, gaze, timestamps.  
- **Behavioral data** (`.dat`): Reaction times, responses.  

_These datasets are later combined for **statistical analysis**._

---
## Project Breakdown

### 1. Stimulus Dataset and Experimental Structure in Experiment Builder

<div style="text-align: justify; line-height: 1.7;">
<p>
The first stage of the project focuses on preparing the <strong>DataSource file</strong> used by Experiment Builder. This dataset is currently being developed to control the flow of the experiment and ensure that each trial is systematically linked to its corresponding linguistic condition.
</p>
</div>

The dataset is designed to include:

- **Trial identifiers**: item_id, condition, list.  
- **Linguistic variables**:
  - Mood: *subjunctive vs indicative*.  
  - Grammaticality: *grammatical vs ungrammatical*.  
  - Verb type: *volitional vs epistemic*.  
- **Audio file paths**.  
- **Timing-related variables**.  

<div style="text-align: justify; line-height: 1.7;">
<p>
This dataset functions as the <strong>core control system of the experiment</strong>. By structuring the experiment in this way, I am separating <em>experimental logic</em> from <em>presentation logic</em>, which facilitates ongoing debugging and refinement.
</p>
</div>

---

### 2. Experiment Builder Structure: Routines, Timeline, and Trial Flow

<div style="text-align: justify; line-height: 1.7;">
<p>
The experiment is being constructed inside <strong>Experiment Builder</strong> using a sequence of routines organized in the timeline. Each routine corresponds to a specific stage in the participant experience and is triggered dynamically based on the DataSource variables.
</p>
</div>

The current structure includes:

- **Calibration and validation (EyeLink setup)**.  
- **Instruction screens**.  
- **Trial loop (core experiment)**.  
- **Response collection**.  
- **End screen**.  

#### Trial Structure

Each trial is designed to follow this sequence:

1. **Fixation cross**.  
2. **Audio playback (sentence stimulus)**.  
3. **Pupil recording during playback**.  
4. **Acceptability judgment (button/key response)**.  

<div style="text-align: justify; line-height: 1.7;">
<p>
This structure is implemented using a loop connected to the DataSource file, where each row corresponds to one trial. The system is currently being refined to ensure proper randomization and condition balancing.
</p>
</div>

---

### 3. Audio Integration and Timing Control

<div style="text-align: justify; line-height: 1.7;">
<p>
A central component of the experiment involves integrating <strong>auditory stimuli</strong> with precise timing. Each sentence is presented as an audio file, and its playback must be tightly synchronized with eye-tracking recording.
</p>
</div>

Key implementation features include:

- Dynamic loading of audio files from the DataSource.  
- Playback control within dedicated routines.  
- Alignment between stimulus onset and recording events.  

<div style="text-align: justify; line-height: 1.7;">
<p>
This part of the system is currently being tested and adjusted to minimize latency. Particular attention is being given to audio configuration (e.g., <strong>ASIO drivers</strong>) to ensure accurate temporal alignment.
</p>
</div>

---

### 4. EyeLink Integration and Data Recording

<div style="text-align: justify; line-height: 1.7;">
<p>
The experiment is being integrated with the <strong>EyeLink 1000 Plus</strong> system to record pupil size and gaze data. This requires coordinating the experiment flow with EyeLink-specific commands and ensuring reliable communication between the Display PC and the Host PC.
</p>
</div>

The current setup includes:

- Calibration and validation procedures prior to trials.  
- Trial-level control of recording start/stop.  
- Logging of events aligned with stimulus presentation.  

<div style="text-align: justify; line-height: 1.7;">
<p>
The system generates <code>.edf</code> files containing raw physiological data, which will later be synchronized with behavioral data for analysis.
</p>
</div>

### 5. Response Collection and Behavioral Data

<div style="text-align: justify; line-height: 1.7;">
<p>
Following each stimulus, participants provide an <strong>acceptability judgment</strong> using predefined keys. This component is currently implemented to capture:
</p>
</div>

- **Key response**.  
- **Reaction time**.  
- **Trial condition**.  

<div style="text-align: justify; line-height: 1.7;">
<p>
These behavioral measures are designed to complement the pupil data, enabling comparisons between <em>explicit responses</em> and <em>implicit processing effort</em>.
</p>
</div>

---

## Outcomes / Data Output

<div style="text-align: justify; line-height: 1.7;">
<p>
The experiment is designed to produce two complementary datasets:
</p>
</div>

- **Behavioral data (`.dat`)** from Experiment Builder.  
- **Eye-tracking data (`.edf`)** from EyeLink.  

<div style="text-align: justify; line-height: 1.7;">
<p>
The <code>.dat</code> file contains trial-level variables such as condition, response, and timing, while the <code>.edf</code> file contains high-resolution physiological data. These datasets will be combined in later stages of the project.
</p>
</div>

---

### Why This Implementation Matters

<div style="text-align: justify; line-height: 1.7;">
<p>
This component of the project demonstrates the ongoing process of translating a <strong>theoretical experimental design into a working eye-tracking experiment</strong>. The current implementation highlights the complexity of coordinating multiple systems while maintaining precise timing and experimental control.
</p>
</div>

<div style="text-align: justify; line-height: 1.7;">
<p>
From an HLT perspective, this work reflects the integration of:
</p>
</div>

- **Linguistic theory to experimental variables**.  
- **Structured datasets to experimental control**.  
- **Hardware systems to real-time data collection**.  

<div style="text-align: justify; line-height: 1.7;">
<p>
As the project continues, further refinements will focus on improving stability, optimizing timing, and preparing the experiment for full-scale data collection and analysis.
</p>
</div>

---

_For more detailed information about the project please check the following repository: [Official COBIVA Repository](https://github.com/lldavoll/Eyelink-Pupillometry-Spanish-Subjunctive-Using-EB)._
