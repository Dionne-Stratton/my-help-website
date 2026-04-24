AI Interpretation Contract V1
The AI layer is responsible only for interpreting a user’s natural-language message into a small set of approved tags.
It is not responsible for choosing final resources or generating spiritual guidance.
Purpose
The purpose of the AI interpretation step is to translate messy, human language into a small, structured output that the backend can use to retrieve curated resources.
Example:
User input:
“I feel frustrated and stuck and don’t know what to do.”
AI output:
primary: helplessness
secondary: frustration, discouragement, uncertainty
The backend then uses those tags to select Scripture, prayer, reflection, and song resources.

Approved Tag List Only
In Version 1, the AI may only return tags that already exist in the app’s approved tag list.
This prevents inconsistent outputs such as:
fear vs afraid
hopelessness vs despair
loneliness vs isolation
The backend should provide the model with the approved tag vocabulary and instruct it to choose only from that list.

Output Format
The AI should return strict JSON only.
Recommended output shape:
{
"primary": "helplessness",
"secondary": ["frustration", "discouragement"],
"normalizedSummary": "Feeling stuck, frustrated, and unable to move forward"
}

Field rules
primary must contain exactly one approved tag
secondary may contain 1 to 3 approved tags
normalizedSummary is optional but recommended
total returned tags should not exceed 4
tags should not be duplicated

Interpretation Principles
The AI should follow these principles:
prioritize clear emotional and situational tags
choose tags that reflect what the user is feeling or facing
avoid overly abstract theological categories unless clearly relevant
prefer the deeper issue over the surface wording when appropriate
keep output focused rather than broad
Example:
If a user says:
“I’m so frustrated because nothing is working and I feel stuck”
A good interpretation may be:
primary: helplessness
secondary: frustration, discouragement
rather than simply repeating surface-level wording only.

Tag Composition Guidance
The AI should usually return a mix such as:
one core emotional or situational tag as primary
one to three secondary tags that add context
Good examples:
primary: anxiety
secondary: fear, uncertainty
primary: grief
secondary: loss, loneliness
primary: shame
secondary: spiritual dryness, fear
The AI should avoid returning only broad spiritual themes like “hope” or “trust” unless the user’s message clearly centers on those.
Those kinds of tags are generally more useful for resource tagging than for user-need interpretation.

Confidence Scores
Version 1 does not require confidence scores in the AI output.
If needed later, they may be added, but they are not necessary for the initial matching system.

Normalized Summary
The AI should return a short normalized summary when possible.
This summary should:
briefly restate the user’s need in clearer language
remain neutral and compassionate
avoid adding interpretation beyond what is reasonably implied
The normalized summary may be used for:
help request logging
internal analytics
future UI display if desired

Failure Handling
If the AI output is invalid, missing required fields, or includes unapproved tags, the backend should reject the result and use a fallback strategy.
Fallback options may include:
retrying the interpretation request
defaulting to a limited broad-tag mapping
returning a small set of general encouragement resources
The system should never depend on malformed AI output.

Future Tag Suggestion Feature
In future versions, the system may support an internal AI-assisted tag suggestion workflow.
This should remain separate from live user-facing matching.
Possible future flow:
AI returns approved tags for matching
AI optionally suggests a possible missing tag
suggestion is stored for admin review only
admin decides whether to ignore, merge, or add the new tag
New tags should never be added automatically in live production without review.

And here’s the actual prompt recommendation for v1.
Suggested AI System Prompt
You are an interpretation layer for a Christian spiritual support app.
Your only task is to analyze a user’s message and map it to a small number of approved tags from the provided tag list.
Do not give advice.
Do not write a prayer.
Do not explain your reasoning.
Do not invent new tags.
Use only tags from the approved list.
Choose:
exactly 1 primary tag
1 to 3 secondary tags
an optional short normalized summary
Prioritize emotional and situational clarity.
Prefer the deeper core issue when appropriate, not just surface wording.
Keep the output focused and concise.
Return strict JSON only in this format:
{
"primary": "approved_tag_here",
"secondary": ["approved_tag_here"],
"normalizedSummary": "short summary here"
}
If the user message is vague, still choose the closest approved tags from the list.

Example runtime prompt structure
You can send something like:
Approved tags:
anxiety, fear, grief, shame, loneliness, discouragement, frustration, helplessness, overwhelm, confusion, temptation, uncertainty, waiting, conflict, suffering, spiritual dryness, directionless, doubt, pain, loss
User message:
"I feel frustrated and stuck and don't know what to do."
Return strict JSON only.
