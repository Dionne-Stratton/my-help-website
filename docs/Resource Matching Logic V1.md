Resource Matching Logic V1
Version 1 uses a simple, controllable matching system to connect user needs with curated resources.
The system should prioritize relevance, clarity, and pastoral usefulness over complexity.
AI is used only to interpret the user’s message into themes. The backend is responsible for selecting the final resources.
Goal of Matching
When a user submits a message, the app should return a focused help bundle that feels relevant and supportive.
The target response structure for Version 1 is:
2 to 3 Scripture passages
1 prayer
1 reflection
1 song
Scripture is the highest-priority resource type and should always be returned if possible.
Prayer and reflection should normally be returned.
Song should be returned when there is a reasonably strong match.

Step 1: AI Theme Interpretation
The AI analyzes the user’s input and returns a small set of normalized tags.
The ideal output is:
1 primary tag
1 to 3 secondary tags
Example:
User input:
“I feel frustrated and helpless and don’t know what to do.”
AI interpretation:
primary: helplessness
secondary: frustration, discouragement, uncertainty
The AI does not choose final resources.

Step 2: Candidate Resource Lookup
The backend retrieves published resources that match one or more of the interpreted tags.
Resources are considered separately by slot:
Scripture
prayer
reflection
song
Only published resources are eligible.

Step 3: Resource Scoring
Each candidate resource receives a score based on how well it matches the interpreted tags.
Suggested scoring principles:
base score for each matched tag
bonus if the resource matches multiple returned tags
bonus if the resource matches the primary tag
optional small bonus for manually prioritized resources
small penalty if the resource was shown very recently to the same user/session
This makes the system deterministic and easy to improve.

Step 4: Slot Prioritization
Each slot should be matched slightly differently.
Scripture
Scripture should prioritize theological and emotional precision.
It should strongly reflect the core need and point the user toward God’s truth.
Scripture is required whenever possible.
The app should return 2 to 3 Scripture passages.
Prayer
Prayer should prioritize emotional fit and immediate usefulness.
The selected prayer should feel natural for the user to pray in their current situation.
The app should return 1 prayer.
Reflection
Reflection should prioritize practical encouragement and pastoral clarity.
It should be short, readable, and directly relevant.
The app should return 1 reflection.
Song
Song should prioritize emotional resonance and spiritual direction.
It should help the user turn toward God in worship, trust, surrender, or comfort.
The app should return 1 song when a strong enough match exists.

Step 5: Repetition Control
The system should avoid repeating the same resources too frequently for the same user.
Version 1 uses a light repetition penalty rather than hard blocking.
Logged-in users
For logged-in users, the backend may look at the most recent help bundles or recently shown resources and apply a small penalty to resources that appeared very recently.
Suggested v1 behavior:
small penalty if shown within the user’s last 3 help bundles
slightly larger penalty if shown in the immediately previous bundle
Guest users
For guest users, repetition control may use the current session ID if available.
If no session history is available, repetition control may be skipped.
A strong match may still be returned again if it is clearly the best resource.
The goal is freshness, not forced variety.

Step 6: Final Bundle Selection
After scoring candidates, the backend selects the top resource(s) for each slot:
top 2 to 3 Scripture passages
top prayer
top reflection
top song
The selected resources are stored in help_request_resources for traceability and future analytics.

Matching Principles
Version 1 should follow these principles:
curated content over generated content
Scripture first
focused results over too many options
deterministic and explainable matching
light freshness control without overcomplication
pastoral usefulness over algorithmic cleverness

Fallback Behavior
If a strong slot-specific match is not found, the system should fall back to broadly relevant published resources.
Fallbacks should exist especially for common needs such as:
anxiety
discouragement
helplessness
uncertainty
grief
This helps ensure the app always returns something useful.

Content Tagging Guidance
Matching quality depends on good tagging.
For Version 1:
keep tag vocabulary fairly tight
prefer clear emotional and situational tags
avoid over-tagging resources
aim for 3 to 6 meaningful tags per resource
A smaller, cleaner tag system is better than a large, messy one.
