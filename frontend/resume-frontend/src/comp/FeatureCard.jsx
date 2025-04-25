import { memo } from "react";
import "../Css/feature-card.css";
import { motion } from "framer-motion";

const FeatureCard = memo(({ title, description, icon, color = "purple",index=0 }) => {
  return (
    <motion.div 
    className="feature-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      
    >
      <div className="feature-card__inner">
        <div className={`feature-card__icon icon-${color}`}>{icon}</div>
        <h3 className="feature-card__title">{title}</h3>
        <p className="feature-card__description">{description}</p>
      </div>
    </motion.div>
  );
});

FeatureCard.displayName = "FeatureCard";

export default FeatureCard;