import { useState, useEffect, useId } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";
import AutocompleteInput from "./AutocompleteInput";
import { fetchFacets } from "../services/experienceService";
import "./ExperienceFilters.css";

const ROUNDS = [
  "Phone Screen",
  "Online Assessment",
  "Onsite",
  "Take Home",
  "Final Round",
  "Other",
];

function ExperienceFilters({ onFilter }) {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [round, setRound] = useState("");
  const [companies, setCompanies] = useState([]);
  const [roles, setRoles] = useState([]);
  const uniqueId = useId();

  useEffect(() => {
    fetchFacets()
      .then((data) => {
        setCompanies(data.companies);
        setRoles(data.roles);
      })
      .catch(() => {});
  }, []);

  const handleApply = (e) => {
    e.preventDefault();
    onFilter({ company: company.trim(), role: role.trim(), round });
  };

  const handleClear = () => {
    setCompany("");
    setRole("");
    setRound("");
    onFilter({ company: "", role: "", round: "" });
  };

  return (
    <Form onSubmit={handleApply} className="ic-filters">
      <Row className="align-items-end gx-3">
        <Col md={3}>
          <Form.Group className="mb-2" controlId={`${uniqueId}-company`}>
            <Form.Label className="ic-filter-label">Company</Form.Label>
            <AutocompleteInput
              id={`${uniqueId}-company`}
              value={company}
              onChange={setCompany}
              options={companies}
              placeholder="Search companies"
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group className="mb-2" controlId={`${uniqueId}-role`}>
            <Form.Label className="ic-filter-label">Role</Form.Label>
            <AutocompleteInput
              id={`${uniqueId}-role`}
              value={role}
              onChange={setRole}
              options={roles}
              placeholder="Search roles"
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group className="mb-2" controlId={`${uniqueId}-round`}>
            <Form.Label className="ic-filter-label">Round</Form.Label>
            <Form.Select
              value={round}
              onChange={(e) => setRound(e.target.value)}
            >
              <option value="">All rounds</option>
              {ROUNDS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={3} className="mb-2 d-flex gap-2 align-items-end">
          <Button type="submit" className="ic-filter-btn">
            Apply Filters
          </Button>
          <Button
            type="button"
            variant="outline-secondary"
            onClick={handleClear}
          >
            Clear
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

ExperienceFilters.propTypes = {
  onFilter: PropTypes.func.isRequired,
};

export default ExperienceFilters;
