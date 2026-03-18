import { Form } from "react-bootstrap";
import PropTypes from "prop-types";
import "./SortControls.css";

function SortControls({ currentSort, onSortChange }) {
  return (
    <div className="ic-sort-controls">
      <Form.Label className="ic-sort-label">Sort by</Form.Label>
      <Form.Select
        size="sm"
        value={currentSort}
        onChange={(e) => onSortChange(e.target.value)}
        className="ic-sort-select"
      >
        <option value="newest">Newest First</option>
        <option value="helpful">Most Helpful</option>
      </Form.Select>
    </div>
  );
}

SortControls.propTypes = {
  currentSort: PropTypes.string.isRequired,
  onSortChange: PropTypes.func.isRequired,
};

export default SortControls;
