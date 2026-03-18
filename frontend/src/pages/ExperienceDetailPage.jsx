import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Container, Badge, Spinner, Button } from "react-bootstrap";
import { UserContext } from "../context/UserContext";
import HelpfulVote from "../components/HelpfulVote";
import OutdatedFlag from "../components/OutdatedFlag";
import {
  fetchExperienceById,
  deleteExperience,
} from "../services/experienceService";
import "./ExperienceDetailPage.css";

function ExperienceDetailPage() {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetchExperienceById(id)
      .then((data) => {
        if (!cancelled) setExperience(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this experience?")) {
      return;
    }
    try {
      await deleteExperience(id);
      navigate("/my-submissions");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <Container className="ic-detail-page text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="ic-detail-page">
        <div className="alert alert-danger">{error}</div>
      </Container>
    );
  }

  if (!experience) return null;

  const isOwner = user && experience.createdBy?.toString() === user._id;

  const formattedDate = experience.experienceDate
    ? new Date(experience.experienceDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Not specified";

  const difficultyClass =
    { Easy: "success", Medium: "warning", Hard: "danger" }[
      experience.difficultyLevel
    ] || "secondary";

  const outcomeClass =
    {
      Accepted: "success",
      Rejected: "danger",
      Ghosted: "secondary",
      Pending: "info",
    }[experience.outcomeTag] || "secondary";

  return (
    <Container className="ic-detail-page">
      <Link to="/" className="ic-back-link">
        &larr; Back to all experiences
      </Link>

      <div className="ic-detail-header">
        <div>
          <h1 className="ic-detail-company">{experience.company}</h1>
          <h2 className="ic-detail-role">{experience.role}</h2>
        </div>
        {isOwner && (
          <div className="ic-detail-actions">
            <Button
              as={Link}
              to={`/edit/${id}`}
              size="sm"
              variant="outline-primary"
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant="outline-danger"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        )}
      </div>

      <div className="ic-detail-meta">
        <Badge bg="primary">{experience.interviewRound}</Badge>
        <Badge bg="secondary">{experience.interviewFormat}</Badge>
        <Badge bg={difficultyClass}>{experience.difficultyLevel}</Badge>
        {experience.outcomeTag && (
          <Badge bg={outcomeClass}>{experience.outcomeTag}</Badge>
        )}
      </div>

      <div className="ic-detail-info">
        <p>
          <strong>Date:</strong> {formattedDate}
        </p>
        <p>
          <strong>Posted by:</strong>{" "}
          {experience.isAnonymous
            ? "Anonymous"
            : experience.username || "User"}
        </p>
      </div>

      {experience.questionThemes?.length > 0 && (
        <div className="ic-detail-section">
          <h3>Question Themes</h3>
          <div className="ic-theme-tags">
            {experience.questionThemes.map((theme) => (
              <Badge
                key={theme}
                bg="light"
                text="dark"
                className="ic-theme-tag"
              >
                {theme}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {experience.formatNotes && (
        <div className="ic-detail-section">
          <h3>Format Notes</h3>
          <p>{experience.formatNotes}</p>
        </div>
      )}

      {experience.caughtOffGuardNotes && (
        <div className="ic-detail-section">
          <h3>Caught Off Guard</h3>
          <p>{experience.caughtOffGuardNotes}</p>
        </div>
      )}

      <div className="ic-detail-signals">
        <HelpfulVote experienceId={id} />
        <OutdatedFlag experienceId={id} />
      </div>
    </Container>
  );
}

export default ExperienceDetailPage;
