import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Spinner } from "react-bootstrap";
import ExperienceForm from "../components/ExperienceForm";
import {
  fetchExperienceById,
  updateExperience,
} from "../services/experienceService";
import "./EditExperiencePage.css";

function EditExperiencePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadExperience = async () => {
      try {
        const data = await fetchExperienceById(id);
        setExperience(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadExperience();
  }, [id]);

  const handleSubmit = async (data) => {
    await updateExperience(id, data);
    navigate("/my-submissions");
  };

  if (loading) {
    return (
      <Container className="ic-edit-page text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="ic-edit-page">
        <div className="alert alert-danger">{error}</div>
      </Container>
    );
  }

  return (
    <Container className="ic-edit-page">
      <h2 className="ic-page-title">Edit Experience</h2>
      <ExperienceForm
        initialData={experience}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
      />
    </Container>
  );
}

export default EditExperiencePage;
