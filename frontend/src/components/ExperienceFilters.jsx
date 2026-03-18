import { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";
import "./ExperienceFilters.css";

const ROUNDS = ["Phone Screen", "Onsite", "Online Assessment", "Take Home", "Other"];

function ExperienceFilters({ onFilter }) {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [round, setRound] = useState("");

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
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Filter by company"
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group className="mb-2">
            <Form.Label className="ic-filter-label">Role</Form.Label>
            <Form.Control
              size="sm"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Filter by role"
            />
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
                <option key={r} value={r}>{r}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={3} className="mb-2 d-flex gap-2">
          <Button type="submit" size="sm" className="ic-filter-btn">
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
