const DEFAULT_VARIANT = {
  kicker: "Still searching for hope?",
  buttonText: "Explore the hope of Jesus",
  title: "God has come near in Jesus.",
  intro:
    "The deepest help God gives us is not only comfort for a hard moment, but Himself. God created us to know Him, love Him, and live with Him. But sin has separated us from Him, and we cannot heal that separation on our own.",
};

const VARIANTS = {
  love: {
    kicker: "Still longing to be loved?",
    buttonText: "Explore God’s love",
    title: "God has come near in love.",
    intro:
      "The deepest love God gives us is not distant, vague, or temporary. He gives us Himself. God created us to know Him, love Him, and live with Him. But sin has separated us from Him, and we cannot heal that separation on our own.",
  },

  peace: {
    kicker: "Still longing for peace?",
    buttonText: "Find peace in Christ",
    title: "God has come near with peace.",
    intro:
      "The deepest peace God gives us is not only relief from fear or a calmer moment, but peace with Himself. God created us to know Him, love Him, and live with Him. But sin has separated us from Him, and we cannot heal that separation on our own.",
  },

  forgiveness: {
    kicker: "Still carrying guilt?",
    buttonText: "Receive God’s forgiveness",
    title: "God has come near with mercy.",
    intro:
      "The deepest mercy God gives us is not only comfort for guilt or regret, but forgiveness and restored fellowship with Himself. God created us to know Him, love Him, and live with Him. But sin has separated us from Him, and we cannot heal that separation on our own.",
  },
};

const TAG_TO_VARIANT = {
  love: "love",
  acceptance: "love",
  identity: "love",
  presence: "love",

  peace: "peace",
  rest: "peace",
  comfort: "peace",
  trust: "peace",

  forgiveness: "forgiveness",
  grace: "forgiveness",
  cleansing: "forgiveness",
};

function normalizeTagName(tag) {
  if (!tag) return "";

  if (typeof tag === "string") return tag.toLowerCase();

  return (
    tag.name ||
    tag.tagName ||
    tag.tag_name ||
    tag.id ||
    ""
  ).toLowerCase();
}

function collectBundleTags(bundle) {
  const tags = [];

  if (Array.isArray(bundle?.matchedThemes)) {
    tags.push(...bundle.matchedThemes);
  }

  if (Array.isArray(bundle?.matchedSolutionTags)) {
    tags.push(...bundle.matchedSolutionTags);
  }

  if (Array.isArray(bundle?.solutionTags)) {
    tags.push(...bundle.solutionTags);
  }

  if (bundle?.solutions && typeof bundle.solutions === "object") {
    tags.push(...Object.keys(bundle.solutions));
  }

  const resources = [
    ...(bundle?.scripture || []),
    ...(bundle?.reflection || []),
    ...(bundle?.prayer || []),
    ...(bundle?.song || []),
  ];

  resources.forEach((resource) => {
    if (Array.isArray(resource.tags)) {
      tags.push(...resource.tags);
    }
  });

  return tags.map(normalizeTagName).filter(Boolean);
}

export function getGospelVariant(bundle) {
  const tags = collectBundleTags(bundle);

  for (const tag of tags) {
    const variantKey = TAG_TO_VARIANT[tag];

    if (variantKey && VARIANTS[variantKey]) {
      return VARIANTS[variantKey];
    }
  }

  return DEFAULT_VARIANT;
}
