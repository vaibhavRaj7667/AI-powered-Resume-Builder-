import { motion } from "framer-motion"
import "../Css/step-card.css"

export default function StepCard({ number, title, description, index, color }) {
  return (
    <motion.div
      className={`step-card step-${color}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className={`step-number number-${color}`}>{number}</div>
      <h3 className="step-title">{title}</h3>
      <p className="step-description">{description}</p>

      {index < 3 && (
        <div className="step-arrow">
          <svg width="40" height="12" viewBox="0 0 40 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 6H38M38 6L33 1M38 6L33 11"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </motion.div>
  )
}
