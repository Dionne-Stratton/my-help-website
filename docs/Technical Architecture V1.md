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
when a guest clicks Save, they are prompted to sign up or sign in
Potential auth provider:
Auth0
Auth0 is a reasonable choice because it can support both the web version and a future mobile app.

Saving Model
In Version 1:
help requests do not require an account
saving resources does require an account
This keeps the core experience frictionless while simplifying saved-resource persistence.
Saved data may include:
saved scriptures
saved prayers
saved songs
saved reflections

Analytics
Version 1 should include basic analytics to understand product usage.
Recommended analytics tool:
Google Analytics
Important events to track:
help request submitted
interpreted themes returned
resource opened
resource saved
sign-up flow started
sign-up completed
Analytics should help answer questions such as:
which needs are most common
which resource types are used most
how many users are guests vs signed-in users
how often people save resources

Admin and Content Management
Version 1 does not require a full admin dashboard.
Content can initially be managed manually through the database and storage layer.
However, the architecture should be designed so an admin interface can be added later without major restructuring.
Future admin capabilities may include:
creating and editing resources
managing tags
publishing/unpublishing content
reviewing content quality
managing contributor content in later versions

High-Level Request Flow
User opens web app
User submits a message describing what they are going through
Frontend sends request to backend
Backend sends user message to AI interpretation service
AI returns relevant themes
Backend queries database for tagged resources matching those themes
Backend assembles a help bundle
Frontend displays scripture, prayer, song, and reflection
If user clicks save, frontend prompts login if not authenticated
Backend stores saved resource in the user account

Design Principles
web first, mobile later
Cloudflare-first infrastructure where practical
AI for interpretation, not primary content generation
curated content over improvised output
immediate guest access to help
account required only for persistent saving
architecture should stay simple enough to ship quickly

