---
title: "Building a Reproducible Transcript Cleaning Pipeline in R [Ongoing Project]"
excerpt: "Designed and refactored an R-based pipeline to clean, normalize, and restructure WebVTT transcripts for the digitalization and preprocessing of a large-scale sociolinguistic corpus of bilingual speech in the U.S.–Mexico border, focusing on transcript normalization and timestamp reconstruction using R."
collection: portfolio
---
<p align="center">
  <img src="/images/cobiva.png" style="width: 100%; max-width: 700px; height: auto; border-radius: 12px;">
</p>

# Overview

<div style="text-align: justify; line-height: 1.7;">
<p> 
As part of an ongoing collaboration with researchers in Hispanic linguistics at the University of Arizona and The University of Texas Rio Grande Valley, I contribute to the preprocessing of sociolinguistic corpora documenting bilingual speech in the U.S.–Mexico border region. This work is connected to broader projects such as <a href="https://www.utrgv.edu/cobiva/" target="_blank"> CoVIBA (Corpus de la Frontera)</a> and CESA, which aim to build a large-scale, publicly accessible archive of bilingual interviews from regions including Texas and Arizona, with future expansion to New Mexico and California.
<p>
</p>
These corpora consist of recorded sociolinguistic interviews designed to elicit natural, informal speech (Labov, 1972). The data captures oral narratives, language attitudes, and patterns of bilingualism in the Rio Grande Valley and surrounding regions. The ultimate goal is to support research on bilingualism, promote dialect awareness, and provide a resource for both academic and community-oriented work.
<p> 
</p>
My role focuses on the <strong>computational processing and normalization of transcript data</strong>, which is a critical step in transforming raw interview materials into a structured, analyzable corpus.
</p>
</div>

## Project Goals

The primary objective of my contribution is to design a **reproducible and scalable preprocessing pipeline** for transcript data. Specifically, this involves:

- Cleaning and standardizing WebVTT transcript files.  
- Normalizing speaker annotations and formatting conventions.  
- Repairing and reconstructing timestamp intervals.  
- Removing transcription artifacts and metadata noise.  
- Ensuring consistency across interviews with varying quality.  
- Preparing the corpus for downstream linguistic and computational analysis.  

This work supports the broader effort of building a high-quality sociolinguistic dataset suitable for both qualitative and quantitative research.

---

## Technologies and Tools

The pipeline is implemented in **R**, using a combination of packages commonly applied in text processing and NLP workflows:

- `stringr` for regex-based text normalization.  
- `readr` for file input/output.
- `chron` for time manipulation and interpolation.  
- `magrittr` for pipeline-style transformations.  
- R Markdown for reproducible and well-documented workflows. 

This project reflects applied experience in **text preprocessing, pattern matching, and structured data transformation**, all of which are central to Natural Language Processing.

---
## Pipeline Design

The preprocessing workflow is organized into modular stages to ensure clarity, reproducibility, and extensibility.

### 1. Initial Cleaning

The first stage removes non-linguistic content and artifacts, including:

- Metadata blocks (e.g., `NOTE` sections).  
- Random identifiers and formatting noise. 
- Empty or irrelevant lines.  

This reduces the transcripts to their essential linguistic content.

_Remove NOTE blocks and UUID artifacts snippet: This step removes non-linguistic metadata (NOTE blocks and system-generated UUID strings) from each transcript._

```r
transcribe_1 <- function (x) {
  x %>%
    str_remove_all("\r\n\r\nNOTE .*") %>%
    str_remove_all("\\w{8}-\\w{4}-\\w{4}-\\w{4}-\\w{12}(-\\w{1})?\\r\\n")
}
```
---

### 2. Structural Normalization

This stage standardizes the internal structure of transcripts by:

- Converting speaker labels into a consistent format (e.g., `INV:` to `<v INV>`).  
- Normalizing timestamp syntax.  
- Correcting misplaced speaker tags.  
- Fixing spacing and line break inconsistencies.  

Given that interviewers vary in experience, transcripts exhibit significant variability; this step ensures uniformity across the dataset.

_Normalization of Transcripts snippet: This step performs structural normalization of the cleaned transcripts. While Step 1 removed non-linguistic metadata, this stage standardizes speaker labels, timestamps, spacing, and formatting inconsistencies introduced during transcription or export._

```r
transcribe_2 <- function(x) {

  # Regex fragments
  TS  <- "(\\d{1,2}:\\d{2}:\\d{2}\\.\\d{3})"
  TSP <- paste0(TS, " --> ", TS)
  SPK <- "(INV|PAR|INT)" #INT OR INV??????

  x %>%
    # 1) Normalize speaker tags / IDs
    str_replace_all("<\\.?\\s*(INV|PAR|INV)>", "<v \\1>") %>% # original kept "INV|PAR|INV" 
    str_replace_all(paste0("(", "<v (INV|PAR|INV)>", ")\\s?(", TSP, ")\\r\\n(.*)"),
                    "\\3\r\n\\1 \\4") %>% # speaker before timestamp
    str_replace_all(paste0("(", SPK, "):"), "<v \\1>") %>% # INV: -> <v INV>
    str_replace_all(paste0("/\\s+<v ", SPK, ">"), "/") %>% # remove speaker IDs after /text/

    # 2) Timestamp
    str_replace_all("—->", "-->") %>%
    str_replace_all("-—>", "-->") %>%
    str_replace_all(paste0("(\\d{1,2}:\\d{2}:\\d{2}\\.)(\\d{2,3})"), "\\1000") %>%  # force .000
    str_replace_all("0{3,}:", "00:") %>%

    # 3) Line break / spacing fixes around timestamps
    str_replace_all(paste0("\\n\\n", TS), "\r\n\r\n\\1") %>%
    str_replace_all(paste0("\\s{1,}(", TS, ") -->"), "\r\n\r\n\\1 -->") %>%
    str_replace_all("(\\r\\n\\r\\n)\\s{1}(\\d{1,2})", "\\1\\2") %>%
    str_replace_all("(\\d{3}\\r\\n)\\s{1}", "\\1") %>%
    str_replace_all(".000\\s*\\n<v (INV|PAR|INT)>", ".000\r\n<v \\1>") %>%
```
---

### 3. Timestamp Reconstruction

One of the most technically complex aspects of the pipeline involves reconstructing timestamps:

- Extracting start times from existing segments.  
- Assigning end times based on subsequent segments.  
- Interpolating missing timestamps when intervals are incomplete.  
- Adjusting zero-duration segments using small offsets (e.g., `.250`, `.750`).  

This process ensures that each segment has a valid temporal interval, which is essential for alignment with audio and time-based analyses.

_Timestamp reconstruction and reassignment snippet: This stage reconstructs and standardizes timestamp intervals across the entire transcript to ensure that temporal segmentation is internally consistent and computationally valid._

```r
assign_timestamps <- function(name, txt, endTime) {

  cat("Assigning new timestamps to ", name, "...\n", sep = "")

  # 1) Extract start times as character
  starts_raw <- str_extract_all(txt, "(\\d{1,2}:\\d{2}:\\d{2}\\.\\d{3}) -->", simplify = TRUE)
  starts_raw <- starts_raw[starts_raw != ""]
  ts <- data.frame(start = str_replace_all(starts_raw, " -->", ""), stringsAsFactors = FALSE)

  # 2) Attach dialogue text segments
  split <- t(str_split(
    txt,
    "(\\d{1,2}:\\d{2}:\\d{2}\\.\\d{3}) --> (\\d{1,2}:\\d{2}:\\d{2}\\.\\d{3})",
    simplify = TRUE
  ))
  split <- split[-1, ]

  if (nrow(ts) == length(split)) {
    ts$text <- split
  } else {
    cat("ERROR! There is likely a major formatting issue in the following transcript:", name, "\n")
    # Keep going with best effort (matches original “print error but continue” behavior)
    ts$text <- split
  }

  # 3) Remove milliseconds temporarily and convert to chron
  ts$start <- str_replace_all(ts$start, "(\\d{1,2}:\\d{2}:\\d{2})\\.\\d{3}", "\\1")
  ts$end   <- str_replace_all(ts$end,   "(\\d{1,2}:\\d{2}:\\d{2})\\.\\d{3}", "\\1")

  ts$start <- chron(times = ts$start)
  ts$end   <- chron(times = ts$end)
}
```
---

### 4. Output Generation

The cleaned transcripts are:

- Reformatted into valid WebVTT structure.  
- Saved into a structured output directory.  
- Renamed systematically for traceability.  

This produces a consistent set of files ready for integration into the corpus.

_Export Cleaned Transcripts snippet: This final stage writes the processed transcripts to disk. Instead of changing the working directory, now its explicitly define an output directory and construct full file paths when saving._

```r
# Define output directory explicitly
output_dir <- file.path(your_wd, "Post R Cleanup")

# Create directory if it does not exist
dir.create(output_dir, showWarnings = FALSE, recursive = TRUE)

# Write each cleaned transcript
for (i in seq_len(nrow(files))) {
  write_file(
    files$Text[i],
    file.path(output_dir, files$Name[i])
  )
}

cat("Cleanup script complete!\n")
```
---

## Reproducibility and Refactoring

The idea wass refactoring an existing script into a **reproducible R Markdown pipeline**. This included:

- Modularizing code into clearly defined steps.  
- Adding documentation for each transformation stage.  
- Eliminating hard-coded dependencies.  
- Improving readability and maintainability.  

---

## Validation and Analytical Considerations

To evaluate the refactored pipeline, I conducted a comparison between the original and revised outputs.

Findings include:

- Both versions produce structurally valid WebVTT files.  
- Speaker labels and timestamps are consistently normalized.  
- However, differences emerge in segmentation:
  - Some intervals are merged.  
  - Others are split.  
  - Minor formatting differences are introduced.  

<div style="text-align: justify; line-height: 1.7;">
These results highlight an important methodological distinction between <strong>data normalization** and **data transformation</strong>. While normalization improves consistency, it may alter segmentation boundaries, which can impact certain types of analysis (e.g., turn-taking or pause duration studies).
</div>
---

## Outcomes

This ongoing work has contributed to:

- The development of a scalable transcript preprocessing pipeline. 
- Standardized data suitable for sociolinguistic and computational analysis. 
- Improved reproducibility in corpus preparation workflows.  
- Identification of trade-offs in preprocessing decisions.  

---

_For more detailed information about the project's following repositories: [Official COBIVA Repository](https://github.com/COBIVA), [Webvtt Transcript Normalization Using R](https://github.com/lldavoll/Webvtt-Transcript-Normalization-Using-R)_
