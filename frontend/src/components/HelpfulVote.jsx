import { useState, useEffect, useContext } from "react";
import { Button } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { UserContext } from "../context/UserContext";
import {
  createSignal,
  updateSignal,
  deleteSignal,
} from "../services/signalService";
import "./HelpfulVote.css";

function HelpfulVote({ experienceId, signalData, onSignalChange }) {
  const { user } = useContext(UserContext);
  const location = useLocation();
  const loginTo = `/login?returnTo=${encodeURIComponent(location.pathname + location.search)}`;
  const [helpfulCount, setHelpfulCount] = useState(0);
  const [isHelpful, setIsHelpful] = useState(false);
  const [hasSignal, setHasSignal] = useState(false);
  const [currentOutdated, setCurrentOutdated] = useState(false);

  useEffect(() => {
    if (!signalData) return;
    setHelpfulCount(signalData.helpfulCount);
    if (signalData.userSignal) {
      setIsHelpful(signalData.userSignal.helpful);
      setCurrentOutdated(signalData.userSignal.outdated);
      setHasSignal(true);
    } else {
      setIsHelpful(false);
      setCurrentOutdated(false);
      setHasSignal(false);
    }
  }, [signalData]);

  const handleToggle = async () => {
    if (!user) return;

    try {
      if (!hasSignal) {
        await createSignal(experienceId, true, false);
      } else if (isHelpful) {
        if (!currentOutdated) {
          await deleteSignal(experienceId);
        } else {
          await updateSignal(experienceId, { helpful: false });
        }
      } else {
        await updateSignal(experienceId, { helpful: true });
      }
      onSignalChange();
    } catch {
      // silently handle toggle failure
    }
  };

  if (!signalData) return null;

  return (
    <div className="ic-helpful-vote">
      {user ? (
        <Button
          size="sm"
          variant={isHelpful ? "success" : "outline-secondary"}
          onClick={handleToggle}
          className="ic-helpful-btn"
          title="Mark as helpful"
        >
          &#9650; Helpful
        </Button>
      ) : (
        <Button
          as={Link}
          to={loginTo}
          size="sm"
          variant="outline-secondary"
          className="ic-helpful-btn ic-helpful-btn-locked"
          title="Log in to vote"
        >
          &#128274; Helpful
        </Button>
      )}
      <span className="ic-helpful-count">{helpfulCount}</span>
      {!user && (
        <Link to={loginTo} className="ic-helpful-login-link">
          Log in to vote
        </Link>
      )}
    </div>
  );
}

HelpfulVote.propTypes = {
  experienceId: PropTypes.string.isRequired,
  signalData: PropTypes.shape({
    helpfulCount: PropTypes.number,
    outdatedCount: PropTypes.number,
    userSignal: PropTypes.shape({
      helpful: PropTypes.bool,
      outdated: PropTypes.bool,
    }),
  }),
  onSignalChange: PropTypes.func.isRequired,
};

export default HelpfulVote;
