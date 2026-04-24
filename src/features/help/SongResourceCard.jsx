import { useRef, useState } from "react";

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${remainingSeconds}`;
}

function PlayIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 5h4v14H6zm8 0h4v14h-4z" />
    </svg>
  );
}

function CaretIcon({ isOpen }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 180ms ease",
      }}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export default function SongResourceCard({ song }) {
  const audioRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  if (!song) return null;

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      await audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = Number(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  return (
    <article>
      <div style={styles.songHeader}>
        {song.image_url && (
          <img src={song.image_url} alt="" style={styles.thumbnail} />
        )}

        <div>
          <h2 style={styles.resourceTitle}>{song.title}</h2>
          {song.short_summary && (
            <p style={styles.bodyText}>{song.short_summary}</p>
          )}
        </div>
      </div>

      {song.media_url && (
        <div style={styles.player}>
          <button
            type="button"
            onClick={togglePlay}
            style={styles.playButton}
            aria-label={isPlaying ? "Pause song" : "Play song"}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>

          <input
            className="song-progress"
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            aria-label="Song progress"
          />

          <span style={styles.timeText}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          <audio
            ref={audioRef}
            src={song.media_url}
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
            onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
            onEnded={() => setIsPlaying(false)}
          />
        </div>
      )}

      {song.lyrics_text && (
        <div style={styles.lyricsArea}>
          <button
            type="button"
            onClick={() => setShowLyrics((current) => !current)}
            style={styles.lyricsToggle}
            aria-expanded={showLyrics}
          >
            <span>Lyrics</span>
            <CaretIcon isOpen={showLyrics} />
          </button>

          {showLyrics && (
            <pre style={styles.lyricsText}>{song.lyrics_text}</pre>
          )}
        </div>
      )}
    </article>
  );
}

const styles = {
  songHeader: {
    display: "flex",
    gap: "16px",
    alignItems: "center",
    marginBottom: "18px",
  },
  thumbnail: {
    width: "72px",
    height: "72px",
    borderRadius: "16px",
    objectFit: "cover",
    flexShrink: 0,
  },
  resourceTitle: {
    margin: "0 0 10px",
    fontSize: "1.25rem",
    fontWeight: 600,
    color: "var(--text-main)",
  },
  bodyText: {
    margin: 0,
    fontSize: "1rem",
    lineHeight: 1.65,
    color: "var(--text-soft)",
  },
  player: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginTop: "12px",
  },
  playButton: {
    width: "35px",
    height: "35px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid rgba(175, 229, 249, 0.35)",
    borderRadius: "50%",
    background: "rgba(175, 229, 249, 0.16)",
    color: "var(--text-main)",
    cursor: "pointer",
    transition:
      "transform 160ms ease, filter 160ms ease, background 160ms ease",
    flexShrink: 0,
  },
  timeText: {
    fontSize: "0.85rem",
    color: "var(--text-muted)",
    whiteSpace: "nowrap",
  },
  lyricsArea: {
    marginTop: "18px",
  },
  lyricsToggle: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: 0,
    border: "none",
    background: "transparent",
    color: "var(--accent)",
    fontSize: "0.95rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "transform 160ms ease, filter 160ms ease",
  },
  lyricsText: {
    marginTop: "16px",
    whiteSpace: "pre-wrap",
    lineHeight: 1.7,
    color: "var(--text-soft)",
  },
};
