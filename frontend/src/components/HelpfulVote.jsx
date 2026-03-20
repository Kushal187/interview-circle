import { useState, useEffect, useContext } from "react";
import { Button } from "react-bootstrap";
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
