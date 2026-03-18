import { useState, useEffect, useContext } from "react";
import { Button } from "react-bootstrap";
import PropTypes from "prop-types";
import { UserContext } from "../context/UserContext";
import {
  fetchSignals,
  createSignal,
  updateSignal,
  deleteSignal,
} from "../services/signalService";
import "./HelpfulVote.css";

function HelpfulVote({ experienceId }) {
  const { user } = useContext(UserContext);
  const [helpfulCount, setHelpfulCount] = useState(0);
  const [isHelpful, setIsHelpful] = useState(false);
  const [hasSignal, setHasSignal] = useState(false);
  const [currentOutdated, setCurrentOutdated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const loadSignals = async () => {
      try {
        const data = await fetchSignals(experienceId);
        if (cancelled) return;
        setHelpfulCount(data.helpfulCount);
        if (data.userSignal) {
          setIsHelpful(data.userSignal.helpful);
          setCurrentOutdated(data.userSignal.outdated);
          setHasSignal(true);
        }
      } catch {
        // ignore fetch errors
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadSignals();
    return () => {
      cancelled = true;
    };
  }, [experienceId]);

  const handleToggle = async () => {
    if (!user) return;

    try {
      if (!hasSignal) {
        await createSignal(experienceId, true, false);
        setIsHelpful(true);
        setHasSignal(true);
        setHelpfulCount((c) => c + 1);
      } else if (isHelpful) {
        if (!currentOutdated) {
          await deleteSignal(experienceId);
          setIsHelpful(false);
          setHasSignal(false);
          setCurrentOutdated(false);
        } else {
          await updateSignal(experienceId, { helpful: false });
          setIsHelpful(false);
        }
        setHelpfulCount((c) => c - 1);
      } else {
        await updateSignal(experienceId, { helpful: true });
        setIsHelpful(true);
        setHelpfulCount((c) => c + 1);
      }
    } catch {
      // silently handle toggle failure
    }
  };

  if (loading) return null;

  return (
    <div className="ic-helpful-vote">
      <Button
        size="sm"
        variant={isHelpful ? "success" : "outline-secondary"}
        onClick={handleToggle}
        disabled={!user}
        className="ic-helpful-btn"
        title={user ? "Mark as helpful" : "Log in to vote"}
      >
        &#9650; Helpful
      </Button>
      <span className="ic-helpful-count">{helpfulCount}</span>
    </div>
  );
}

HelpfulVote.propTypes = {
  experienceId: PropTypes.string.isRequired,
};

export default HelpfulVote;
