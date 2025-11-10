import { useState, FormEvent } from "react";
import { conversationTitleSchema } from "../schemas";
import "./EditableTitle.css";

type EditableTitleProps = {
  title: string;
  conversationId: string;
  isOwner: boolean;
  onUpdate: (conversationId: string, newTitle: string) => Promise<void>;
};

export function EditableTitle({ title, conversationId, isOwner, onUpdate }: EditableTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(title);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStartEdit = () => {
    if (isOwner) {
      setIsEditing(true);
      setEditValue(title);
      setError(null);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(title);
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const validation = conversationTitleSchema.safeParse(editValue);
    if (!validation.success) {
      setError(validation.error.issues[0]?.message || "Invalid title");
      return;
    }

    const trimmedTitle = editValue.trim();
    if (trimmedTitle === title) {
      setIsEditing(false);
      return;
    }

    try {
      setIsSubmitting(true);
      await onUpdate(conversationId, trimmedTitle);
      setIsEditing(false);
    } catch (err) {
      setError((err as Error).message || "Failed to update title");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isEditing) {
    return (
      <div className="editable-title">
        <h1 className="editable-title__display" onClick={handleStartEdit}>
          {title}
          {isOwner && <span className="editable-title__hint"> (click to edit)</span>}
        </h1>
      </div>
    );
  }

  return (
    <div className="editable-title">
      <form className="editable-title__form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="editable-title__input"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          autoFocus
          disabled={isSubmitting}
        />
        <div className="editable-title__actions">
          <button 
            type="submit" 
            className="editable-title__button editable-title__button--save"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
          <button 
            type="button" 
            className="editable-title__button editable-title__button--cancel"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
        {error && <div className="editable-title__error">{error}</div>}
      </form>
    </div>
  );
}
