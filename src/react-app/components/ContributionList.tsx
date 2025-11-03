import { Contribution } from "../types";
import "./ContributionList.css";

type ContributionListProps = {
  contributions: Contribution[];
  loading: boolean;
};

export function ContributionList({ contributions, loading }: ContributionListProps) {
  if (loading) {
    return (
      <div className="contribution-list">
        <p className="contribution-list__loading">Loading contributions...</p>
      </div>
    );
  }

  if (contributions.length === 0) {
    return (
      <div className="contribution-list">
        <p className="contribution-list__empty">
          No contributions yet. Be the first to add one!
        </p>
      </div>
    );
  }

  return (
    <div className="contribution-list">
      {contributions.map((contribution) => (
        <article key={contribution.id} className="contribution-item">
          <div className="contribution-item__header">
            <span className="contribution-item__author">
              {contribution.authorDisplayName}
            </span>
            <time className="contribution-item__timestamp">
              {contribution.createdAt.toDate().toLocaleString()}
            </time>
          </div>
          <p className="contribution-item__content">{contribution.content}</p>
          {contribution.tone && (
            <span className={`contribution-item__tone contribution-item__tone--${contribution.tone}`}>
              {contribution.tone}
            </span>
          )}
        </article>
      ))}
    </div>
  );
}
