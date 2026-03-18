import { useState, useEffect, useCallback } from "react";
import { Container, Spinner, Row, Col } from "react-bootstrap";
import ExperienceCard from "../components/ExperienceCard";
import ExperienceFilters from "../components/ExperienceFilters";
import SortControls from "../components/SortControls";
import { fetchExperiences } from "../services/experienceService";
import "./ExperienceListPage.css";

function ExperienceListPage() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("newest");

  const loadExperiences = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchExperiences({ ...filters, sort, page });
      setExperiences(data.experiences);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters, sort, page]);

  useEffect(() => {
    loadExperiences();
  }, [loadExperiences]);

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleSortChange = (newSort) => {
    setSort(newSort);
    setPage(1);
  };

  return (
    <Container className="ic-list-page">
      <h2 className="ic-page-title">Interview Experiences</h2>
      <ExperienceFilters onFilter={handleFilter} />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="text-muted ic-result-count">
          {loading ? "" : `${total} results`}
        </span>
        <SortControls currentSort={sort} onSortChange={handleSortChange} />
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <div className="text-center py-4">
          <Spinner animation="border" />
        </div>
      ) : experiences.length === 0 ? (
        <p className="text-muted">No experiences found.</p>
      ) : (
        <>
          {experiences.map((exp) => (
            <ExperienceCard key={exp._id} experience={exp} />
          ))}
          {totalPages > 1 && (
            <Row className="mt-3">
              <Col className="d-flex justify-content-center gap-2">
                <button
                  className="btn btn-sm btn-outline-secondary"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </button>
                <span className="d-flex align-items-center ic-page-info">
                  Page {page} of {totalPages}
                </span>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </button>
              </Col>
            </Row>
          )}
        </>
      )}
    </Container>
  );
}

export default ExperienceListPage;
