import { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";
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
      <Row className="align-items-end">
        <Col md={3}>
          <Form.Group className="mb-2">
            <Form.Label className="ic-filter-label">Company</Form.Label>
            <Form.Control
              size="sm"
              list="ic-company-options"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Search companies"
            />
            <datalist id="ic-company-options">
              {companies.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group className="mb-2">
            <Form.Label className="ic-filter-label">Role</Form.Label>
            <Form.Control
              size="sm"
              list="ic-role-options"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Search roles"
            />
            <datalist id="ic-role-options">
              {roles.map((r) => (
                <option key={r} value={r} />
              ))}
            </datalist>
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group className="mb-2">
            <Form.Label className="ic-filter-label">Round</Form.Label>
            <Form.Select
              size="sm"
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
        <Col md={3} className="mb-2 d-flex gap-2">
          <Button type="submit" className="ic-filter-btn">
            Apply
          </Button>
          <Button
            type="button"
            variant="outline-secondary"
            size="sm"
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
