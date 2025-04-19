import { memo } from "react";
import "../Css/feature-card.css";

const FeatureCard = memo(({ title, description, icon, color = "purple" }) => {
  return (
    <div className="feature-card">
      <div className="feature-card__inner">
        <div className={`feature-card__icon icon-${color}`}>{icon}</div>
        <h3 className="feature-card__title">{title}</h3>
        <p className="feature-card__description">{description}</p>
      </div>
    </div>
  );
});

FeatureCard.displayName = "FeatureCard";

export default FeatureCard;