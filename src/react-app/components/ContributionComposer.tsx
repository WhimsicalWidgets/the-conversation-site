import { useState } from "react";
import { ToneType } from "../types";
import { contributionSchema, TONE_VALUES } from "../schemas";
import "./ContributionComposer.css";

type ContributionComposerProps = {
  onSubmit: (content: string, tone: ToneType | null) => Promise<void>;
  disabled?: boolean;
};

export function ContributionComposer({ onSubmit, disabled = false }: ContributionComposerProps) {
  const [content, setContent] = useState("");
  const [tone, setTone] = useState<ToneType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validation = contributionSchema.safeParse({ content, tone });
    
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(content, tone);
      setContent("");
      setTone(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit contribution");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToneClick = (selectedTone: ToneType) => {
    setTone(tone === selectedTone ? null : selectedTone);
  };

  if (disabled) {
    return (
      <div className="contribution-composer contribution-composer--disabled">
        <p className="contribution-composer__disabled-message">
          Please sign in to add contributions
        </p>
      </div>
    );
  }

  return (
    <form className="contribution-composer" onSubmit={handleSubmit}>
      <div className="contribution-composer__input-group">
        <label htmlFor="contribution-content" className="contribution-composer__label">
          Add your contribution
        </label>
        <textarea
          id="contribution-content"
          className="contribution-composer__textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your thoughts..."
          rows={4}
          disabled={isSubmitting}
        />
      </div>

      <div className="contribution-composer__tone-group">
        <span className="contribution-composer__tone-label">Tone (optional):</span>
        <div className="contribution-composer__tone-chips">
          {TONE_VALUES.map((toneValue) => (
            <button
              key={toneValue}
              type="button"
              className={`contribution-composer__tone-chip ${
                tone === toneValue ? "contribution-composer__tone-chip--active" : ""
              } contribution-composer__tone-chip--${toneValue}`}
              onClick={() => handleToneClick(toneValue)}
              disabled={isSubmitting}
            >
              {toneValue}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="contribution-composer__error">{error}</p>}

      <button
        type="submit"
        className="contribution-composer__submit"
        disabled={isSubmitting || !content.trim()}
      >
        {isSubmitting ? "Submitting..." : "Add Contribution"}
      </button>
    </form>
  );
}
