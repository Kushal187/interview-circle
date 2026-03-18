import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import ExperienceForm from "../components/ExperienceForm";
import { createExperience } from "../services/experienceService";
import "./CreateExperiencePage.css";

function CreateExperiencePage() {
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    await createExperience(data);
    navigate("/my-submissions");
  };

  return (
    <Container className="ic-create-page">
      <h2 className="ic-page-title">Share an Interview Experience</h2>
      <ExperienceForm onSubmit={handleSubmit} submitLabel="Submit Experience" />
    </Container>
  );
}

export default CreateExperiencePage;
