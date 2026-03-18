import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Table, Button, Spinner } from "react-bootstrap";
import {
  fetchMyExperiences,
  deleteExperience,
} from "../services/experienceService";
import "./MySubmissionsPage.css";

function MySubmissionsPage() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadExperiences = async () => {
      try {
        const data = await fetchMyExperiences();
        setExperiences(data.experiences);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadExperiences();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this experience?")) {
      return;
    }
    try {
      await deleteExperience(id);
      setExperiences((prev) => prev.filter((exp) => exp._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <Container className="ic-my-subs text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="ic-my-subs">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="ic-page-title mb-0">My Submissions</h2>
        <Button as={Link} to="/submit" className="ic-new-btn" size="sm">
          + New Experience
        </Button>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      {experiences.length === 0 ? (
        <p className="text-muted">
          You haven&apos;t submitted any experiences yet.
        </p>
      ) : (
        <Table hover responsive className="ic-subs-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Role</th>
              <th>Round</th>
              <th>Difficulty</th>
              <th>Outcome</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {experiences.map((exp) => (
              <tr key={exp._id}>
                <td>{exp.company}</td>
                <td>{exp.role}</td>
                <td>{exp.interviewRound}</td>
                <td>{exp.difficultyLevel}</td>
                <td>
                  <span className={`ic-outcome ic-outcome-${exp.outcomeTag.toLowerCase()}`}>
                    {exp.outcomeTag}
                  </span>
                </td>
                <td>
                  <Link to={`/edit/${exp._id}`} className="btn btn-sm btn-outline-primary me-2">
                    Edit
                  </Link>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(exp._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}

export default MySubmissionsPage;
