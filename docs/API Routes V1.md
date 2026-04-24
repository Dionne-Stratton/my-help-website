API Routes V1
Design goals
The API should stay small and focused in v1.
It mainly needs to support:
submitting a help request
retrieving curated resources
saving resources for logged-in users
loading saved resources
retrieving individual resources if needed
light auth-related user syncing
The frontend should never call the AI provider directly. All AI interaction should go through the backend.

1. Submit Help Request
   POST /api/help
   This is the main route of the entire app.
   The user submits a natural-language description of what they are going through. The backend interprets it, finds matching resources, stores the request, and returns a help bundle.
   Auth required
   No
   Request body
   interface SubmitHelpRequestBody {
   input: string;
   sessionId?: string;
   }

Example request
{
"input": "I feel frustrated and helpless and don't know what to do",
"sessionId": "guest-session-123"
}

Backend responsibilities
validate input
send input to AI interpretation service
receive returned themes
create a help_requests row
create help_request_tags rows
find matching published resources
choose resources by slot:
scripture
prayer
reflection
song
create help_request_resources rows
return assembled help bundle
Response
interface SubmitHelpResponse {
helpRequestId: string;
bundle: HelpBundle;
}

2. Get Saved Resources
   GET /api/saved-resources
   Returns all resources the logged-in user has saved.
   Auth required
   Yes
   Request body
   None
   Backend responsibilities
   verify user auth
   find local user record by Auth0 ID
   fetch saved resources
   join to resource metadata and tags
   return saved library
   Response
   interface GetSavedResourcesResponse {
   items: SavedResource[];
   }

3. Save a Resource
   POST /api/saved-resources
   Saves a resource to the logged-in user’s library.
   Auth required
   Yes
   Request body
   interface SaveResourceRequestBody {
   resourceId: string;
   }

Example request
{
"resourceId": "res_song_my_help"
}

Backend responsibilities
verify user auth
resolve or create local user record
validate that resource exists and is published
create saved resource row
ignore duplicates safely
Response
interface SaveResourceResponse {
success: true;
savedResourceId: string;
}

Notes
If the user is not logged in, the frontend should not call this route. It should first prompt sign-in.

4. Remove a Saved Resource
   DELETE /api/saved-resources/:resourceId
   Removes a saved resource from the user’s library.
   Auth required
   Yes
   Route params
   resourceId
   Backend responsibilities
   verify user auth
   delete matching saved resource row for that user
   Response
   interface RemoveSavedResourceResponse {
   success: true;
   }

5. Get a Single Resource
   GET /api/resources/:slug
   Returns the full details for one resource.
   This is useful when a user clicks into a devotional, prayer, or scripture resource page.
   Auth required
   No
   Route params
   slug
   Backend responsibilities
   find published resource by slug
   fetch associated tags
   return normalized resource
   Response
   interface GetResourceResponse {
   resource: Resource;
   }

6. Browse Resources
   GET /api/resources
   Returns a list of published resources, optionally filtered.
   This supports browse/explore pages and may also help later with search.
   Auth required
   No
   Query params (optional)
   type
   tag
   limit
   offset
   Example
   GET /api/resources?type=reflection&tag=anxiety&limit=10
   Backend responsibilities
   validate filters
   query published resources
   optionally join tags
   return paginated list
   Suggested response
   interface GetResourcesResponse {
   items: Resource[];
   total: number;
   limit: number;
   offset: number;
   }

7. Get Tags
   GET /api/tags
   Returns available tags.
   This is mainly useful for development, browse UI, and future admin tooling.
   Auth required
   No
   Response
   interface GetTagsResponse {
   tags: Tag[];
   }

8. Sync Authenticated User
   POST /api/me/sync
   This route creates or updates the local users table entry for an authenticated user.
   This is helpful because Auth0 is the identity provider, but your app still wants a local user record.
   Auth required
   Yes
   Request body
   Could be empty, or optionally allow lightweight profile fields like:
   interface SyncUserRequestBody {
   displayName?: string;
   faithStatus?: FaithStatus;
   }

Backend responsibilities
verify Auth0 user
upsert local user row using:
Auth0 subject
email
display name
optionally store faith status if you decide to collect it later
Response
interface SyncUserResponse {
user: CurrentUser;
}

9. Get Current User
   GET /api/me
   Returns the authenticated user’s app profile.
   Auth required
   Yes
   Response
   interface GetCurrentUserResponse {
   user: CurrentUser;
   }

Optional v1.5 Routes
These are not necessary for the first build, but worth keeping in mind.
POST /api/share
Create a shareable bundle or share token.
GET /api/shared/:token
Load a shared bundle in browser without login.
POST /api/analytics/event
Custom event tracking for possible later internal event logging in addition to Google Analytics.

Route Summary
For v1 minimum set is:
POST /api/help
GET /api/saved-resources
POST /api/saved-resources
DELETE /api/saved-resources/:resourceId
GET /api/resources/:slug
GET /api/resources
POST /api/me/sync
GET /api/me

Suggested backend folder structure
Since you’re likely using Cloudflare Workers, I’d organize backend code roughly like this:
src/
routes/
help.ts
resources.ts
savedResources.ts
me.ts
health.ts
services/
aiInterpreter.ts
resourceMatcher.ts
userService.ts
savedResourceService.ts
db/
client.ts
queries/
resources.ts
tags.ts
users.ts
helpRequests.ts
savedResources.ts
types/
api.ts
db.ts

The main thing is to keep route handlers thin and put real logic into services.

Recommended behavior for /api/help
This route is important enough that I’d define its internal steps explicitly:
validate input length and required fields
normalize or trim input
send message to AI interpreter
map returned theme names to existing tag rows
create help_requests record
create help_request_tags rows
fetch candidate resources by tags
rank and choose resources per slot
create help_request_resources rows
return help bundle
