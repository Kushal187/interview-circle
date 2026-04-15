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
import "./OutdatedFlag.css";

function OutdatedFlag({ experienceId, signalData, onSignalChange }) {
  const { user } = useContext(UserContext);
  const location = useLocation();
  const loginTo = `/login?returnTo=${encodeURIComponent(location.pathname + location.search)}`;
  const [outdatedCount, setOutdatedCount] = useState(0);
  const [isOutdated, setIsOutdated] = useState(false);
  const [hasSignal, setHasSignal] = useState(false);
  const [currentHelpful, setCurrentHelpful] = useState(false);

  useEffect(() => {
    if (!signalData) return;
    setOutdatedCount(signalData.outdatedCount);
    if (signalData.userSignal) {
      setIsOutdated(signalData.userSignal.outdated);
      setCurrentHelpful(signalData.userSignal.helpful);
      setHasSignal(true);
    } else {
      setIsOutdated(false);
      setCurrentHelpful(false);
      setHasSignal(false);
    }
  }, [signalData]);

  const handleToggle = async () => {
    if (!user) return;

    try {
      if (!hasSignal) {
        await createSignal(experienceId, false, true);
      } else if (isOutdated) {
        if (!currentHelpful) {
          await deleteSignal(experienceId);
        } else {
          await updateSignal(experienceId, { outdated: false });
        }
      } else {
        await updateSignal(experienceId, { outdated: true });
      }
      onSignalChange();
    } catch {
      // silently handle toggle failure
    }
  };

  if (!signalData) return null;

  return (
    <div className="ic-outdated-flag">
      {user ? (
        <Button
          size="sm"
          variant={isOutdated ? "warning" : "outline-secondary"}
          onClick={handleToggle}
          className="ic-outdated-btn"
          title="Flag as outdated"
        >
          &#9888; Outdated
        </Button>
      ) : (
        <Button
          as={Link}
          to={loginTo}
          size="sm"
          variant="outline-secondary"
          className="ic-outdated-btn ic-outdated-btn-locked"
        >
          &#128274; Outdated &mdash; Log in to flag
        </Button>
      )}
      <span className="ic-outdated-count">{outdatedCount}</span>
    </div>
  );
}

OutdatedFlag.propTypes = {
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

export default OutdatedFlag;
