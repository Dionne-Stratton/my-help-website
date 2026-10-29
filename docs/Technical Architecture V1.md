> Historical design proposal. For implemented accounts, whole-bundle saving, and current scope, see [Current implementation](Current%20Implementation.md). Individual-resource saving, a permanent guest library, and independent resource browsing described below are not implemented.

Technical Architecture V1
Version 1 will be built as a web-first product with a shared backend architecture that can later support a mobile app.
The system should prioritize simplicity, maintainability, and low operating cost while leaving room for future expansion.
Architecture Goals
keep the first version lightweight and fast to build
reuse as much infrastructure as possible across future web and mobile clients
keep AI narrowly scoped to message interpretation
use curated content as the main source of truth
allow future expansion into admin tools, mobile app support, and richer personalization

Frontend (Version 1)
Version 1 will launch as a responsive web application.
The site should be designed mobile-first so it works well on phones and tablets, but it does not need full PWA support in the initial release.
Goals for the web frontend:
simple and calm interface
mobile-friendly layout
easy access to the main help flow
clear display of returned resources
account access for saved items
Potential frontend stack:
React
Vite
TypeScript
standard CSS solution already familiar to the project
The frontend will communicate with backend APIs for:
AI theme interpretation
resource retrieval
account-based saved resources

Mobile App (Future)
A mobile app is planned for a later phase, but not required for Version 1.
The mobile app should reuse the same backend services and content system as the web version.
Potential future stack:
React Native
Expo
TypeScript
This approach allows the web app to validate the product before investing in app-store distribution.

Backend
The backend should remain in the Cloudflare ecosystem as much as practical.
Recommended backend responsibilities:
receive user help requests
send user message to AI interpretation service
receive returned themes
query the content database for matching resources
assemble and return the help bundle
manage saved resources for signed-in users
expose APIs for frontend clients
Potential backend stack:
Cloudflare Workers for API/backend logic
This avoids the need for a traditional always-on server and keeps deployment lightweight.

Database and Storage
The project should use a hybrid content model.
Database
Use a structured database for:
resource metadata
tags
relationships between resources and tags
saved user resources
account-related records if needed
Likely database choice:
Cloudflare D1
Object/File Storage
Use file/object storage for:
audio files
longer content files if needed
artwork/images
Likely storage choice:
Cloudflare R2
This allows metadata to stay searchable while keeping media and longer-form assets in storage.

Content Source of Truth
The source of truth should be hybrid:
metadata, tags, summaries, and lookup fields live in the database
long-form text and media files may live in object storage when appropriate
Short content such as brief prayers or short reflections may be stored directly in the database for simplicity.
Longer resources may be stored externally and linked by URL.

AI Layer
AI is used only for theme interpretation, not as the main source of spiritual content.
Responsibilities of the AI layer:
analyze the user’s natural language message
identify emotional and spiritual themes
return structured theme output for resource lookup
Examples of themes:
anxiety
grief
discouragement
helplessness
shame
temptation
uncertainty
The system should be designed in a provider-agnostic way so the model provider can be changed later without major frontend changes.
In practice, the frontend should never call the model directly. The backend should own all AI requests.

Authentication
Authentication is optional for using the main help flow.
Users should be able to request help without logging in.
Authentication is primarily used for:
saving resources
accessing saved items across devices
future personalization features
Recommended v1 behavior:
guest users can ask for help immediately
when a guest clicks Save, they are prom…646 tokens truncated…below are not implemented.

User Flows V1

Flow 1 — Guest User Requests Help

This is the most important flow in the entire product.

User visits the website.

The home screen presents a simple prompt such as:

“What are you going through?”

The user enters a message describing their situation.

Examples:

“I feel anxious.”

“I’m discouraged.”

“I feel stuck and frustrated.”

“I’m struggling with temptation.”

The message is sent to the backend.

AI interprets the message and identifies relevant emotional or spiritual themes.

Example output:

Themes identified:

anxiety

fear

uncertainty

The backend queries the resource database using those themes.

The system assembles a help bundle containing curated resources such as:

Scripture passage

Prayer

Worship song

Short devotional reflection

The results page displays the bundle in a clear structure:

Scripture
Relevant passage

Prayer
Short prayer

Worship
Suggested song with play link

Reflection
Devotional excerpt

The user can interact with each resource:

read

listen

expand

save

Flow 2 — Guest User Saves a Resource

The user selects Save on a resource.

If the user is not logged in, the system presents options:

Option A — Save to this device
The resource is stored locally on the device.

Option B — Create an account
The resource will be saved across devices.

If the user chooses local save, the resource is added to a local saved list.

The user can later access saved items through Saved Resources.

Flow 3 — User Creates an Account

Accounts are optional and primarily used for cross-device saving.

User selects Sign Up / Sign In.

User chooses authentication method (example):

email

passwordless link

social login (optional future option)

After authentication:

local saved items can optionally sync to the account

user gains persistent saved library across devices.

Flow 4 — Returning User Accesses Saved Resources

User visits the site again.

If signed in:

saved resources load from the account.

If using device storage:

saved resources load from local storage.

User opens Saved Resources.

The library shows previously saved items such as:

prayers

scriptures

devotionals

songs

User can revisit or remove saved resources.

Flow 5 — New Visitor Exploring the Site

Some users may want to explore before asking for help.

User visits the homepage.

In addition to the main prompt, optional navigation allows browsing resources such as:

popular prayers

devotionals

scripture collections

worship songs

The user can read or listen to content without submitting a request.

Optional Future Flow (Not Version 1)

These are not required for MVP but may be added later.

• sharing resource bundles
• church integrations
• personalized recommendations
• deeper AI-guided conversations
