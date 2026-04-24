// =========================
// Core enums / unions
// =========================

export type ResourceType = "scripture" | "prayer" | "reflection" | "song";

export type ResourceStatus = "draft" | "published" | "archived";

export type SourceKind = "internal" | "external";

export type TagCategory = "emotion" | "theme" | "situation";

export type FaithStatus = "believer" | "seeker" | "unknown";

export type HelpBundleSlot = "scripture" | "prayer" | "reflection" | "song";

// =========================
// Database row types
// =========================

export interface UserRow {
  id: string;
  auth0_user_id: string;
  email: string | null;
  display_name: string | null;
  faith_status: FaithStatus;
  created_at: string;
  updated_at: string;
}

export interface ResourceRow {
  id: string;
  type: ResourceType;
  slug: string;
  title: string;
  short_summary: string | null;
  body_text: string | null;
  content_url: string | null;
  media_url: string | null;
  image_url: string | null;
  scripture_reference: string | null;
  scripture_translation: string | null;
  status: ResourceStatus;
  source_kind: SourceKind;
  created_at: string;
  updated_at: string;
}

export interface TagRow {
  id: string;
  name: string;
  category: TagCategory;
  created_at: string;
}

export interface ResourceTagRow {
  resource_id: string;
  tag_id: string;
}

export interface SavedResourceRow {
  id: string;
  user_id: string;
  resource_id: string;
  created_at: string;
}

export interface HelpRequestRow {
  id: string;
  user_id: string | null;
  session_id: string | null;
  raw_input: string;
  normalized_summary: string | null;
  created_at: string;
}

export interface HelpRequestTagRow {
  help_request_id: string;
  tag_id: string;
  confidence: number | null;
}

export interface HelpRequestResourceRow {
  help_request_id: string;
  resource_id: string;
  slot: HelpBundleSlot;
  rank_order: number;
}

// =========================
// Rich app/domain models
// =========================

export interface Tag {
  id: string;
  name: string;
  category: TagCategory;
}

export interface Resource {
  id: string;
  type: ResourceType;
  slug: string;
  title: string;
  shortSummary: string | null;
  bodyText: string | null;
  contentUrl: string | null;
  mediaUrl: string | null;
  imageUrl: string | null;
  scriptureReference: string | null;
  scriptureTranslation: string | null;
  status: ResourceStatus;
  sourceKind: SourceKind;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}

export interface SavedResource {
  id: string;
  userId: string;
  resourceId: string;
  createdAt: string;
  resource?: Resource;
}

export interface HelpRequest {
  id: string;
  userId: string | null;
  sessionId: string | null;
  rawInput: string;
  normalizedSummary: string | null;
  createdAt: string;
  tags?: HelpRequestTag[];
  resources?: HelpRequestResource[];
}

export interface HelpRequestTag {
  helpRequestId: string;
  tagId: string;
  confidence: number | null;
  tag?: Tag;
}

export interface HelpRequestResource {
  helpRequestId: string;
  resourceId: string;
  slot: HelpBundleSlot;
  rankOrder: number;
  resource?: Resource;
}

// =========================
// AI interpretation types
// =========================

export interface InterpretedTheme {
  tagName: string;
  confidence?: number;
}

export interface AIInterpretationResult {
  themes: InterpretedTheme[];
  normalizedSummary?: string;
}

// =========================
// Help bundle types
// =========================

export interface HelpBundle {
  helpRequestId: string;
  summary: string | null;
  matchedThemes: Tag[];
  scripture: Resource[];
  prayer: Resource[];
  reflection: Resource[];
  song: Resource[];
}

export interface HelpBundleSlotMap {
  scripture: Resource[];
  prayer: Resource[];
  reflection: Resource[];
  song: Resource[];
}

// =========================
// API request / response types
// =========================

export interface SubmitHelpRequestBody {
  input: string;
  sessionId?: string;
}

export interface SubmitHelpResponse {
  helpRequestId: string;
  bundle: HelpBundle;
}

export interface SaveResourceRequestBody {
  resourceId: string;
}

export interface SaveResourceResponse {
  success: true;
  savedResourceId: string;
}

export interface RemoveSavedResourceResponse {
  success: true;
}

export interface GetSavedResourcesResponse {
  items: SavedResource[];
}

export interface GetResourceResponse {
  resource: Resource;
}

export interface GetTagsResponse {
  tags: Tag[];
}

// =========================
// Auth / session-adjacent types
// =========================

export interface CurrentUser {
  id: string;
  email: string | null;
  displayName: string | null;
  faithStatus: FaithStatus;
}

export interface AuthenticatedRequestContext {
  user: CurrentUser | null;
  sessionId: string | null;
}

// =========================
// Admin-friendly input types
// =========================

export interface CreateResourceInput {
  type: ResourceType;
  slug: string;
  title: string;
  shortSummary?: string | null;
  bodyText?: string | null;
  contentUrl?: string | null;
  mediaUrl?: string | null;
  imageUrl?: string | null;
  scriptureReference?: string | null;
  scriptureTranslation?: string | null;
  status?: ResourceStatus;
  sourceKind?: SourceKind;
  tagIds?: string[];
}

export interface UpdateResourceInput {
  title?: string;
  shortSummary?: string | null;
  bodyText?: string | null;
  contentUrl?: string | null;
  mediaUrl?: string | null;
  imageUrl?: string | null;
  scriptureReference?: string | null;
  scriptureTranslation?: string | null;
  status?: ResourceStatus;
  sourceKind?: SourceKind;
  tagIds?: string[];
}

export interface CreateTagInput {
  name: string;
  category: TagCategory;
}

// =========================
// Utility mapper helpers
// =========================

export function mapResourceRowToResource(
  row: ResourceRow,
  tags: Tag[] = [],
): Resource {
  return {
    id: row.id,
    type: row.type,
    slug: row.slug,
    title: row.title,
    shortSummary: row.short_summary,
    bodyText: row.body_text,
    contentUrl: row.content_url,
    mediaUrl: row.media_url,
    imageUrl: row.image_url,
    scriptureReference: row.scripture_reference,
    scriptureTranslation: row.scripture_translation,
    status: row.status,
    sourceKind: row.source_kind,
    tags,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapTagRowToTag(row: TagRow): Tag {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
  };
}

export function mapUserRowToCurrentUser(row: UserRow): CurrentUser {
  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    faithStatus: row.faith_status,
  };
}
