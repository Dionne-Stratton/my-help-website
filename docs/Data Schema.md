Data Schema
Recommended storage split
Use D1 for:
users
resources
scripture passages
tags
resource-to-tag joins
saved resources
optional analytics/event rows if you want lightweight internal tracking later
Use R2 for:
MP3 files
artwork images
long-form markdown or JSON files if you decide not to store full text in D1
Use Auth0 for auth, since it supports both web and native app flows, which keeps your later app path open. (Auth0)
Core schema

1. users
   You may not need a full user profile at first if Auth0 is the source of truth, but I still recommend a local users table.
   CREATE TABLE users (
   id TEXT PRIMARY KEY, -- internal UUID
   auth0_user_id TEXT UNIQUE NOT NULL, -- Auth0 subject
   email TEXT,
   display_name TEXT,
   faith_status TEXT, -- optional: believer, seeker, unknown
   created_at TEXT NOT NULL,
   updated_at TEXT NOT NULL
   );

Why keep this table:
easier joins for saved resources
room for light profile data later
you avoid coupling everything directly to Auth0 IDs 2) resources
This is the main table.
CREATE TABLE resources (
id TEXT PRIMARY KEY,
type TEXT NOT NULL, -- scripture, prayer, reflection, song
slug TEXT UNIQUE NOT NULL,
title TEXT NOT NULL,
short_summary TEXT,
body_text TEXT, -- for shorter prayers/reflections/scripture text
content_url TEXT, -- for longer external content or web page
media_url TEXT, -- MP3/audio URL, usually R2 or your existing site
image_url TEXT, -- artwork/thumbnail
scripture_reference TEXT, -- quick access, optional
scripture_translation TEXT, -- e.g. WEB
status TEXT NOT NULL DEFAULT 'draft', -- draft, published, archived
source_kind TEXT NOT NULL DEFAULT 'internal', -- internal, external
created_at TEXT NOT NULL,
updated_at TEXT NOT NULL
);

Notes:
body_text is for short content you want to return immediately.
content_url is for longer pages or full resources.
media_url handles songs and later audio scripture if you want it.
type should stay constrained in app logic. 3) tags
Single unified tag table, with category.
CREATE TABLE tags (
id TEXT PRIMARY KEY,
name TEXT NOT NULL UNIQUE, -- anxiety, hope, temptation
category TEXT NOT NULL, -- emotion, theme, situation
created_at TEXT NOT NULL
);

This gives you the clean organization you wanted without overcomplicating the schema. 4) resource_tags
Join table for many-to-many.
CREATE TABLE resource_tags (
resource_id TEXT NOT NULL,
tag_id TEXT NOT NULL,
PRIMARY KEY (resource_id, tag_id),
FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE,
FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

This is the heart of retrieval. 5) saved_resources
Since you decided save should prompt login, this can stay simple.
CREATE TABLE saved_resources (
id TEXT PRIMARY KEY,
user_id TEXT NOT NULL,
resource_id TEXT NOT NULL,
created_at TEXT NOT NULL,
UNIQUE (user_id, resource_id),
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE
);

6. help_requests
   I strongly recommend storing lightweight request history, even in v1, if only for debugging and learning.
   CREATE TABLE help_requests (
   id TEXT PRIMARY KEY,
   user_id TEXT, -- nullable for guests
   session_id TEXT, -- guest/session tracking
   raw_input TEXT NOT NULL,
   normalized_summary TEXT, -- optional short backend summary
   created_at TEXT NOT NULL,
   FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
   );

You do not need to store everything forever, but having this table helps you understand usage and improve matching. 7) help_request_tags
Store what the AI returned.
CREATE TABLE help_request_tags (
help_request_id TEXT NOT NULL,
tag_id TEXT NOT NULL,
confidence REAL, -- optional
PRIMARY KEY (help_request_id, tag_id),
FOREIGN KEY (help_request_id) REFERENCES help_requests(id) ON DELETE CASCADE,
FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

This is very useful later for analytics like “what themes show up most?” 8) help_request_resources
Store what was actually shown to the user.
CREATE TABLE help_request_resources (
help_request_id TEXT NOT NULL,
resource_id TEXT NOT NULL,
slot TEXT NOT NULL, -- scripture, prayer, reflection, song
rank_order INTEGER NOT NULL DEFAULT 0,
PRIMARY KEY (help_request_id, resource_id, slot),
FOREIGN KEY (help_request_id) REFERENCES help_requests(id) ON DELETE CASCADE,
FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE
);

This lets you answer:
what resources are shown most
what gets saved after being shown
what matching logic seems to work
Scripture handling recommendation
I recommend that Scripture be stored as normal resources rows with type = 'scripture', not as a separate complicated schema at first.
That means one row might be:
title: Psalm 121:1–2
body_text: WEB passage text
scripture_reference: Psalm 121:1-2
scripture_translation: WEB
tags: helplessness, trust, help, discouragement
That is the simplest path and gives you the control you wanted.
If later you decide to build a broader Bible subsystem, then you can add a dedicated table such as:
CREATE TABLE scripture_passages (
id TEXT PRIMARY KEY,
book TEXT NOT NULL,
chapter_start INTEGER NOT NULL,
verse_start INTEGER NOT NULL,
chapter_end INTEGER,
verse_end INTEGER,
translation TEXT NOT NULL,
text TEXT NOT NULL,
created_at TEXT NOT NULL
);

But for v1, I would skip that. Simpler is better.
Minimal indexes
You’ll want a few indexes early.
CREATE INDEX idx_resources_type ON resources(type);
CREATE INDEX idx_resources_status ON resources(status);
CREATE INDEX idx_tags_category ON tags(category);
CREATE INDEX idx_saved_resources_user_id ON saved_resources(user_id);
CREATE INDEX idx_help_requests_user_id ON help_requests(user_id);
CREATE INDEX idx_help_requests_session_id ON help_requests(session_id);

And if you expect lots of tag-based lookups:
CREATE INDEX idx_resource_tags_tag_id ON resource_tags(tag_id);
CREATE INDEX idx_resource_tags_resource_id ON resource_tags(resource_id);

Example retrieval pattern
The AI returns tags like:
frustration
helplessness
discouragement
Then your backend:
looks up those tag IDs
finds matching resources through resource_tags
filters to status = 'published'
groups by type
picks one or more per slot
That’s exactly the kind of structured query D1 is meant to support through Workers. (Cloudflare Docs)
What to keep out of v1
I would not add these tables yet:
contributor submissions
church organizations
church-specific resource prioritization
subscriptions/payments
share bundles
moderation queues
detailed personalization profiles
Those are all reasonable later, but they would just bloat your first schema.
When MongoDB would make sense later
If you still want MongoDB in the picture, I’d reserve it for a future use case like:
flexible admin drafts with changing shapes
large imported church sermon metadata from many sources
experimental AI prompt/result archives
document-heavy contributor workflows
But for the actual app core, D1 is the cleaner choice.
My recommended v1 schema set
Build these first:
users
resources
tags
resource_tags
saved_resources
help_requests
help_request_tags
help_request_resources
That gives you enough for:
login
content library
AI-assisted matching
save feature
basic analytics and debugging
If you want, next I can turn this into a copy-paste D1 SQL migration file with all tables, indexes, and a little sample seed data.
