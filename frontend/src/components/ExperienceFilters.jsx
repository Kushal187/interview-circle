import { useState, useEffect, useRef, useId } from "react";
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

function AutocompleteInput({ value, onChange, options, placeholder, id }) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef(null);
  const listboxId = `${id}-listbox`;

  const filtered = value.trim()
    ? options.filter((o) => o.toLowerCase().includes(value.toLowerCase()))
    : [];

  const isOpen = open && filtered.length > 0;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setActiveIndex(-1);
  }, [value]);

  const selectItem = (item) => {
    onChange(item);
    setOpen(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" && filtered.length > 0) {
        setOpen(true);
        setActiveIndex(0);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) =>
          prev < filtered.length - 1 ? prev + 1 : 0,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) =>
          prev > 0 ? prev - 1 : filtered.length - 1,
        );
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < filtered.length) {
          selectItem(filtered[activeIndex]);
        }
        break;
      case "Escape":
        setOpen(false);
        setActiveIndex(-1);
        break;
    }
  };

  const activeDescendant =
    isOpen && activeIndex >= 0 ? `${listboxId}-opt-${activeIndex}` : undefined;

  return (
    <div className="ic-autocomplete" ref={wrapperRef}>
      <Form.Control
        id={id}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => value.trim() && setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoComplete="off"
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-activedescendant={activeDescendant}
        aria-autocomplete="list"
      />
      {isOpen && (
        <ul
          className="ic-autocomplete-list"
          id={listboxId}
          role="listbox"
        >
          {filtered.map((item, i) => (
            <li
              key={item}
              id={`${listboxId}-opt-${i}`}
              role="option"
              aria-selected={i === activeIndex}
              className={`ic-autocomplete-item${i === activeIndex ? " ic-autocomplete-item-active" : ""}`}
              onMouseDown={() => selectItem(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

AutocompleteInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  placeholder: PropTypes.string,
  id: PropTypes.string.isRequired,
};

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
