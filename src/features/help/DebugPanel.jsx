import { useState } from "react";

const RESOURCE_TYPE_LABELS = {
  scripture: "Scripture",
  prayer: "Prayers",
  reflection: "Reflections",
  song: "Songs",
};

const RESOURCE_TYPE_ORDER = ["scripture", "prayer", "reflection", "song"];

export default function DebugPanel({ debug }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!debug) return null;

  const rankedResourcesByType = RESOURCE_TYPE_ORDER.map((type) => ({
    type,
    label: RESOURCE_TYPE_LABELS[type],
    resources:
      debug.rankedResources?.filter((resource) => resource.type === type) || [],
  }));

  return (
    <section style={styles.wrapper}>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        style={styles.toggle}
      >
        {isOpen ? "Hide debug info" : "Show debug info"}
      </button>

      {isOpen && (
        <div style={styles.panel}>
          <DebugSection title="Input">
            <p style={styles.text}>{debug.input}</p>
          </DebugSection>

          <DebugSection title="AI interpretation">
            <pre style={styles.pre}>
              {JSON.stringify(debug.interpretation, null, 2)}
            </pre>
          </DebugSection>

          <DebugSection title="Problem tags">
            <TagList items={debug.problemTags} />
          </DebugSection>

          <DebugSection title="Solution tags">
            <div style={styles.tagGrid}>
              {debug.solutionTags?.map((tag) => (
                <span key={tag.name} style={styles.tag}>
                  {tag.name}: {tag.weight}
                </span>
              ))}
            </div>
          </DebugSection>

          <DebugSection title="Ranked resources by type">
            <div style={styles.typeGroups}>
              {rankedResourcesByType.map(({ type, label, resources }) => (
                <div key={type} style={styles.typeGroup}>
                  <h4 style={styles.typeTitle}>
                    {label}{" "}
                    <span style={styles.count}>({resources.length})</span>
                  </h4>

                  {resources.length > 0 ? (
                    <div style={styles.resourceList}>
                      {resources.map((resource, index) => (
                        <ResourceDebugCard
                          key={resource.id}
                          resource={resource}
                          index={index}
                        />
                      ))}
                    </div>
                  ) : (
                    <p style={styles.emptyText}>No ranked resources.</p>
                  )}
                </div>
              ))}
            </div>
          </DebugSection>
        </div>
      )}
    </section>
  );
}

function ResourceDebugCard({ resource, index }) {
  return (
    <article style={styles.resource}>
      <div style={styles.resourceHeader}>
        <strong>
          {index + 1}. {resource.title}
        </strong>
        <span style={styles.score}>score: {resource.score}</span>
      </div>

      {resource.scripture_reference && (
        <p style={styles.meta}>{resource.scripture_reference}</p>
      )}

      <p style={styles.meta}>
        Problem tags: {resource.problemTags?.join(", ") || "none"}
      </p>

      <p style={styles.meta}>
        Solution tags: {resource.solutionTags?.join(", ") || "none"}
      </p>
    </article>
  );
}

function DebugSection({ title, children }) {
  return (
    <div style={styles.section}>
      <h3 style={styles.sectionTitle}>{title}</h3>
      {children}
    </div>
  );
}

function TagList({ items = [] }) {
  return (
    <div style={styles.tagGrid}>
      {items.map((item) => (
        <span key={item} style={styles.tag}>
          {item}
        </span>
      ))}
    </div>
  );
}

const styles = {
  wrapper: {
    marginTop: "28px",
  },
  toggle: {
    border: "1px solid var(--border)",
    borderRadius: "999px",
    padding: "8px 14px",
    background: "transparent",
    color: "var(--text-muted)",
    cursor: "pointer",
  },
  panel: {
    marginTop: "14px",
    padding: "18px",
    borderRadius: "18px",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    background: "rgba(0, 0, 0, 0.18)",
  },
  section: {
    marginBottom: "20px",
  },
  sectionTitle: {
    margin: "0 0 8px",
    fontSize: "0.8rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "var(--accent)",
  },
  text: {
    margin: 0,
    color: "var(--text-soft)",
    lineHeight: 1.6,
  },
  pre: {
    margin: 0,
    padding: "12px",
    borderRadius: "12px",
    background: "rgba(0, 0, 0, 0.2)",
    color: "var(--text-soft)",
    overflowX: "auto",
  },
  tagGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  tag: {
    padding: "5px 9px",
    borderRadius: "999px",
    background: "rgba(175, 229, 249, 0.1)",
    color: "var(--text-soft)",
    fontSize: "0.85rem",
  },
  typeGroups: {
    display: "grid",
    gap: "18px",
  },
  typeGroup: {
    padding: "14px",
    borderRadius: "16px",
    background: "rgba(255, 255, 255, 0.035)",
  },
  typeTitle: {
    margin: "0 0 12px",
    color: "var(--text-main)",
    fontSize: "1rem",
    fontWeight: 700,
  },
  count: {
    color: "var(--text-muted)",
    fontWeight: 400,
  },
  resourceList: {
    display: "grid",
    gap: "10px",
  },
  resource: {
    padding: "12px",
    borderRadius: "14px",
    background: "rgba(255, 255, 255, 0.05)",
  },
  resourceHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    color: "var(--text-main)",
  },
  score: {
    color: "var(--accent)",
    fontSize: "0.85rem",
    whiteSpace: "nowrap",
  },
  meta: {
    margin: "6px 0 0",
    color: "var(--text-muted)",
    fontSize: "0.85rem",
    lineHeight: 1.45,
  },
  emptyText: {
    margin: 0,
    color: "var(--text-muted)",
    fontSize: "0.9rem",
    fontStyle: "italic",
  },
};
