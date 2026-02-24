---
name: Feature Review Analysis
description: Process for systematically analyzing user feedback and extracting qualitative insights for specific app features from raw app store reviews.
---

# Feature Review Analysis
This skill outlines the process for systematically extracting and analyzing user feedback from raw review data (e.g., CSV exports from App Stores) to understand user sentiment, identify pain points, and discover feature requests.

Use this skill whenever the user asks to analyze feedback, discover how users feel about a feature, or extract common themes from product reviews.

## 1. Feature Definition and Keyword Mapping
Before analyzing the data, define the features being investigated and map them to comprehensive regular expression (regex) patterns. 

*   **Brainstorming**: Consider all the ways users might refer to the feature. Users rarely use exact internal terminology. For instance, "Virtual Room" might be called *room, house, home, furniture,* or *decorate*.
*   **Regex Creation**: Create a case-insensitive regex pattern for each feature. 
    *   *Example:* `r'(?i)\b(room(s)?|furniture|decorate|house|home)\b'`
*   **Refinement**: Be careful of overly broad terms (e.g., "game") that might inflate counts by catching unrelated features (like "trivia game") or general references to the app ("I love this game"). Use specific terms like "pixel" or "minigame".

## 2. Quantitative Counting (Popularity Ranking)
Run a script to iterate through the review dataset, applying the regex patterns to the review text.
*   Keep a simple count of how many reviews match each feature's pattern.
*   Sort the features by the total number of mentions to provide a quantitative baseline of how often features are discussed.
*   *Note: This highlights which features are top-of-mind for users, regardless of positive or negative sentiment.*

## 3. Qualitative Extraction
Select a specific feature to analyze deeply.
*   Filter the dataset to extract the full text of *only* the reviews that matched that specific feature's regex pattern.
*   Output these matching reviews to a temporary text file for easy reading and analysis.

## 4. Synthesis and Thematic Analysis
Read the filtered reviews and synthesize the feedback into structured, actionable categories. Do not just summarize; group the feedback logically.

*   **What Users Love (The "Why")**: Identify *why* the feature works. Does it foster connection? Is it relaxing? Does it solve a specific problem (e.g., long-distance communication, neurodivergence accessibility)?
*   **Common Improvement Requests (The "What's Missing")**: Identify recurring pain points and feature requests. Group them by theme (e.g., "Customization", "Cost/Paywall", "Usability Issues").
*   **Edge Cases & Bugs**: Note any specific technical issues or UI confusing points mentioned frequently regarding the feature.

## 5. Output Presentation
Present the analysis back to the user in a clear, highly readable format:
1.  **State the Data Pool**: Mention how many reviews were analyzed for this feature to provide context on the sample size.
2.  **Use Markdown**: Utilize headers (e.g., `### What Users Love`), bold points, and bulleted lists.
3.  **Be Specific**: Cite specific examples from the reviews (e.g., "Users specifically requested a Kitchen and a Bedroom").
