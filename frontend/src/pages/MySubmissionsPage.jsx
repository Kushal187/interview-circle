import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Table,
  Button,
  Spinner,
  Alert,
  Modal,
} from "react-bootstrap";
import {
  fetchMyExperiences,
  deleteExperience,
} from "../services/experienceService";
import "./MySubmissionsPage.css";

function truncate(text, max = 80) {
  if (!text) return null;
  return text.length > max ? text.slice(0, max) + "…" : text;
}

function MySubmissionsPage() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [flashMessage, setFlashMessage] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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

  useEffect(() => {
    if (location.state?.flash) {
      setFlashMessage(location.state.flash);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  useEffect(() => {
    if (!flashMessage) return;
    const timer = setTimeout(() => setFlashMessage(""), 4000);
    return () => clearTimeout(timer);
  }, [flashMessage]);

  const handleDeleteClick = (exp) => {
    setDeleteTarget(exp);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteExperience(deleteTarget._id);
      setExperiences((prev) =>
        prev.filter((exp) => exp._id !== deleteTarget._id),
      );
      setFlashMessage("Experience deleted.");
      setDeleteTarget(null);
    } catch (err) {
      setError(err.message);
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  const getPreview = (exp) => {
    if (exp.questionThemes?.length) {
      return truncate(exp.questionThemes.join(", "));
    }
    if (exp.formatNotes) return truncate(exp.formatNotes);
    return null;
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
      {flashMessage && (
        <Alert
          variant="success"
          dismissible
          onClose={() => setFlashMessage("")}
          className="ic-flash"
          role="status"
        >
          {flashMessage}
        </Alert>
      )}
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
              <th>Preview</th>
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
                <td className="ic-preview-cell">
                  {getPreview(exp) || (
                    <span className="text-muted fst-italic">
                      No details added
                    </span>
                  )}
                </td>
                <td>
                  <span
                    className={`ic-outcome ic-outcome-${exp.outcomeTag.toLowerCase()}`}
                  >
                    {exp.outcomeTag}
                  </span>
                </td>
                <td className="ic-actions-cell">
                  <Link
                    to={`/experience/${exp._id}`}
                    className="btn btn-sm btn-outline-secondary me-2"
                  >
                    View
                  </Link>
                  <Link
                    to={`/edit/${exp._id}`}
                    className="btn btn-sm btn-outline-primary me-2"
                  >
                    Edit
                  </Link>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDeleteClick(exp)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal
        show={!!deleteTarget}
        onHide={() => !deleting && setDeleteTarget(null)}
        centered
        backdrop={deleting ? "static" : true}
      >
        <Modal.Header closeButton={!deleting}>
          <Modal.Title>Delete experience?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {deleteTarget && (
            <p className="mb-0">
              Are you sure you want to delete your{" "}
              <strong>{deleteTarget.company}</strong> —{" "}
              <strong>{deleteTarget.role}</strong> experience? This cannot be
              undone.
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => setDeleteTarget(null)}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirmDelete}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default MySubmissionsPage;
