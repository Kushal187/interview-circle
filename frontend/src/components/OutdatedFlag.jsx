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
import "./OutdatedFlag.css";

function OutdatedFlag({ experienceId }) {
  const { user } = useContext(UserContext);
  const [outdatedCount, setOutdatedCount] = useState(0);
  const [isOutdated, setIsOutdated] = useState(false);
  const [hasSignal, setHasSignal] = useState(false);
  const [currentHelpful, setCurrentHelpful] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const loadSignals = async () => {
      try {
        const data = await fetchSignals(experienceId);
        if (cancelled) return;
        setOutdatedCount(data.outdatedCount);
        if (data.userSignal) {
          setIsOutdated(data.userSignal.outdated);
          setCurrentHelpful(data.userSignal.helpful);
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
        await createSignal(experienceId, false, true);
        setIsOutdated(true);
        setHasSignal(true);
        setOutdatedCount((c) => c + 1);
      } else if (isOutdated) {
        if (!currentHelpful) {
          await deleteSignal(experienceId);
          setIsOutdated(false);
          setHasSignal(false);
          setCurrentHelpful(false);
        } else {
          await updateSignal(experienceId, { outdated: false });
          setIsOutdated(false);
        }
        setOutdatedCount((c) => c - 1);
      } else {
        await updateSignal(experienceId, { outdated: true });
        setIsOutdated(true);
        setOutdatedCount((c) => c + 1);
      }
    } catch {
      // silently handle toggle failure
    }
  };

  if (loading) return null;

  return (
    <div className="ic-outdated-flag">
      <Button
        size="sm"
        variant={isOutdated ? "warning" : "outline-secondary"}
        onClick={handleToggle}
        disabled={!user}
        className="ic-outdated-btn"
        title={user ? "Flag as outdated" : "Log in to flag"}
      >
        &#9888; Outdated
      </Button>
      <span className="ic-outdated-count">{outdatedCount}</span>
    </div>
  );
}

OutdatedFlag.propTypes = {
  experienceId: PropTypes.string.isRequired,
};

export default OutdatedFlag;
