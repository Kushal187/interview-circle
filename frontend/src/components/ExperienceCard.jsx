import { Link } from "react-router-dom";
import { Card, Badge } from "react-bootstrap";
import PropTypes from "prop-types";
import "./ExperienceCard.css";

const DIFFICULTY_COLORS = {
  Easy: "success",
  Medium: "warning",
  Hard: "danger",
};

const OUTCOME_COLORS = {
  Accepted: "success",
  Rejected: "danger",
  Ghosted: "secondary",
  Pending: "warning",
};

function ExperienceCard({ experience }) {
  const date = new Date(experience.experienceDate || experience.createdAt);
  const formatted = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Card className="ic-exp-card">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <Link
              to={`/experience/${experience._id}`}
              className="ic-exp-company"
            >
              {experience.company}
            </Link>
            <p className="ic-exp-role mb-0">{experience.role}</p>
            {experience.location && (
              <p className="ic-exp-location mb-0">{experience.location}</p>
            )}
          </div>
          <Badge
            bg={DIFFICULTY_COLORS[experience.difficultyLevel] || "secondary"}
          >
            {experience.difficultyLevel}
          </Badge>
        </div>
        <div className="ic-exp-meta">
          <span className="ic-exp-round">{experience.interviewRound}</span>
          {experience.interviewFormat && (
            <span className="ic-exp-format">{experience.interviewFormat}</span>
          )}
          <Badge
            bg={OUTCOME_COLORS[experience.outcomeTag] || "secondary"}
            className="ic-exp-outcome"
          >
            {experience.outcomeTag}
          </Badge>
        </div>
        {experience.questionThemes && experience.questionThemes.length > 0 && (
          <div className="ic-exp-themes">
            {experience.questionThemes.map((theme) => (
              <span key={theme} className="ic-exp-theme-tag">
                {theme}
              </span>
            ))}
          </div>
        )}
        <div className="ic-exp-footer">
          <span className="ic-exp-date">{formatted}</span>
          {experience.isAnonymous && (
            <span className="ic-exp-anon">Anonymous</span>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

ExperienceCard.propTypes = {
  experience: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    company: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    location: PropTypes.string,
    interviewRound: PropTypes.string.isRequired,
    interviewFormat: PropTypes.string,
    difficultyLevel: PropTypes.string.isRequired,
    outcomeTag: PropTypes.string,
    questionThemes: PropTypes.arrayOf(PropTypes.string),
    experienceDate: PropTypes.string,
    createdAt: PropTypes.string,
    isAnonymous: PropTypes.bool,
  }).isRequired,
};

export default ExperienceCard;
