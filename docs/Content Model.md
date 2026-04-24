Content Model
Version 1 uses a curated content library to provide spiritually helpful resources based on what a user is experiencing.
The app does not rely primarily on AI to generate spiritual content from scratch. Instead, AI is used to interpret the user’s message and identify relevant themes. The system then retrieves matching resources from a structured, tagged library.
Resource Types in Version 1
The main resource types for Version 1 are:
Scripture passages

prayers

devotional reflections

songs

Mini-sermons are not a separate resource type in Version 1. If existing mini-sermons are used, they should be adapted into shorter devotional reflections or linked as optional deeper-reading resources.
Scripture Strategy
Scripture passages are stored as first-class resources in the content library rather than being chosen freely by AI at runtime.
This allows the app to:
keep Scripture selection curated and biblically intentional

reduce AI token usage and cost

maintain consistency across similar requests

avoid unnecessary copyright complications

Version 1 should use a public-domain Bible translation for quoted text, with the World English Bible as the preferred default.
Resource Structure
Each resource should include a small set of core fields.
Common fields across resource types:
id

title

resource type

short summary

content or content URL

tags

optional scripture references

optional media URL

published status

Resource Type Details
Scripture Passage
reference

translation

text

tags

short summary or note (optional)

Prayer
title

prayer text

tags

optional scripture references

short summary

Devotional Reflection
title

reflection text or excerpt

tags

optional scripture references

short summary

optional full resource URL for longer reading

Song
title

short summary

tags

streaming URL

optional lyrics excerpt

optional artwork thumbnail

Tagging Model
Resources should be tagged using a structured thematic system.
Suggested tag groupings:
Emotions
anxiety

fear

grief

shame

loneliness

discouragement

frustration

Themes
trust

hope

surrender

identity in Christ

God’s faithfulness

comfort

perseverance

Situations
temptation

uncertainty

waiting

conflict

suffering

spiritual dryness

These categories are mainly for organization and clarity. Under the hood, they may still be implemented as a unified tag system.
Response Model
When a user submits a message, the AI identifies likely themes. The backend then retrieves matching resources from the content library and assembles a help bundle.
A help bundle may include:
one or more Scripture passages

one prayer

one song

one short devotional reflection

Content Length Guidance
Version 1 should prioritize short, immediately helpful content.
prayers should be concise

devotional reflections should be brief and readable in one sitting

songs should be easy to access and play

longer sermons or teachings may be linked separately as optional deeper resources

The main in-app experience should focus on comfort, clarity, and encouragement rather than long-form reading.
If you want,
