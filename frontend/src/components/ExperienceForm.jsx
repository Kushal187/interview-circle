import { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";
import "./ExperienceForm.css";

const ROUNDS = [
  "Phone Screen",
  "Online Assessment",
  "Onsite",
  "Take Home",
  "Final Round",
  "Other",
];
const FORMATS = [
  "Technical",
  "Behavioral",
  "System Design",
  "Live Coding",
  "Mixed",
  "Other",
];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const OUTCOMES = ["Accepted", "Rejected", "Ghosted", "Pending"];

function ExperienceForm({ initialData, onSubmit, submitLabel }) {
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [role, setRole] = useState("");
  const [interviewRound, setInterviewRound] = useState("");
  const [interviewFormat, setInterviewFormat] = useState("");
  const [questionThemes, setQuestionThemes] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState("");
  const [formatNotes, setFormatNotes] = useState("");
  const [caughtOffGuardNotes, setCaughtOffGuardNotes] = useState("");
  const [outcomeTag, setOutcomeTag] = useState("Pending");
  const [experienceDate, setExperienceDate] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setCompany(initialData.company || "");
      setLocation(initialData.location || "");
      setRole(initialData.role || "");
      setInterviewRound(initialData.interviewRound || "");
      setInterviewFormat(initialData.interviewFormat || "");
      setQuestionThemes(
        Array.isArray(initialData.questionThemes)
          ? initialData.questionThemes.join(", ")
          : "",
      );
      setDifficultyLevel(initialData.difficultyLevel || "");
      setFormatNotes(initialData.formatNotes || "");
      setCaughtOffGuardNotes(initialData.caughtOffGuardNotes || "");
      setOutcomeTag(initialData.outcomeTag || "Pending");
      setIsAnonymous(initialData.isAnonymous || false);
      if (initialData.experienceDate) {
        const d = new Date(initialData.experienceDate);
        setExperienceDate(d.toISOString().split("T")[0]);
      }
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !company.trim() ||
      !role.trim() ||
      !interviewRound ||
      !difficultyLevel
    ) {
      setError("Company, role, round, and difficulty are required.");
      return;
    }

    const themes = questionThemes
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    setSubmitting(true);
    try {
      await onSubmit({
        company: company.trim(),
        location: location.trim() || undefined,
        role: role.trim(),
        interviewRound,
        interviewFormat,
        questionThemes: themes,
        difficultyLevel,
        formatNotes,
        caughtOffGuardNotes,
        outcomeTag,
        experienceDate: experienceDate || undefined,
        isAnonymous,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="ic-experience-form">
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Company *</Form.Label>
            <Form.Control
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Google"
              required
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group className="mb-3">
            <Form.Label>Role *</Form.Label>
            <Form.Control
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Software Engineer"
              required
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group className="mb-3">
            <Form.Label>Location</Form.Label>
            <Form.Control
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. San Francisco, CA"
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Interview Round *</Form.Label>
            <Form.Select
              value={interviewRound}
              onChange={(e) => setInterviewRound(e.target.value)}
              required
            >
              <option value="">Select round</option>
              {ROUNDS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Format</Form.Label>
            <Form.Select
              value={interviewFormat}
              onChange={(e) => setInterviewFormat(e.target.value)}
            >
              <option value="">Select format</option>
              {FORMATS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Difficulty *</Form.Label>
            <Form.Select
              value={difficultyLevel}
              onChange={(e) => setDifficultyLevel(e.target.value)}
              required
            >
              <option value="">Select difficulty</option>
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      <Form.Group className="mb-3">
        <Form.Label>Question Themes</Form.Label>
        <Form.Control
          value={questionThemes}
          onChange={(e) => setQuestionThemes(e.target.value)}
          placeholder="e.g. arrays, dynamic programming, graphs"
        />
        <Form.Text className="text-muted">Comma-separated list</Form.Text>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Format Notes</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={formatNotes}
          onChange={(e) => setFormatNotes(e.target.value)}
          placeholder="Describe the interview format..."
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>What Surprised Me</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          value={caughtOffGuardNotes}
          onChange={(e) => setCaughtOffGuardNotes(e.target.value)}
          placeholder="Anything unexpected during the interview?"
        />
      </Form.Group>
      <Row>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Outcome</Form.Label>
            <Form.Select
              value={outcomeTag}
              onChange={(e) => setOutcomeTag(e.target.value)}
            >
              {OUTCOMES.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Interview Date</Form.Label>
            <Form.Control
              type="date"
              value={experienceDate}
              onChange={(e) => setExperienceDate(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={4} className="d-flex align-items-center pt-3">
          <Form.Check
            type="checkbox"
            label="Post anonymously"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
          />
        </Col>
      </Row>
      <Button
        type="submit"
        className="ic-form-submit-btn"
        disabled={submitting}
      >
        {submitting ? "Saving..." : submitLabel || "Submit"}
      </Button>
    </Form>
  );
}

ExperienceForm.propTypes = {
  initialData: PropTypes.shape({
    company: PropTypes.string,
    location: PropTypes.string,
    role: PropTypes.string,
    interviewRound: PropTypes.string,
    interviewFormat: PropTypes.string,
    questionThemes: PropTypes.arrayOf(PropTypes.string),
    difficultyLevel: PropTypes.string,
    formatNotes: PropTypes.string,
    caughtOffGuardNotes: PropTypes.string,
    outcomeTag: PropTypes.string,
    experienceDate: PropTypes.string,
    isAnonymous: PropTypes.bool,
  }),
  onSubmit: PropTypes.func.isRequired,
  submitLabel: PropTypes.string,
};

export default ExperienceForm;
