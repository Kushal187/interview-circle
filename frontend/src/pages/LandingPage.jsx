import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "./LandingPage.css";

function LandingPage() {
  const { user } = useContext(UserContext);

  return (
    <div className="lp">
      <section className="lp-hero">
        <div className="lp-section-inner">
          <div className="lp-hero-copy">
            <h1 className="lp-headline">
              Read how the interview actually went before you walk in.
            </h1>
            <p className="lp-sub">
              Real candidates sharing real stories — what they were asked,
              how long it took, and whether it was worth it. Filtered by
              company, role, and round so you only see what matters.
            </p>
            <div className="lp-hero-actions">
              <Link to="/browse" className="lp-btn-primary">
                Browse experiences
              </Link>
              {!user && (
                <Link to="/register" className="lp-text-link">
                  Create an account to contribute
                </Link>
              )}
              {user && (
                <Link to="/submit" className="lp-text-link">
                  Share your recent interview loop
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="lp-pitch">
        <div className="lp-section-inner">
          <div className="lp-pitch-grid">
            <div className="lp-pitch-block">
              <h3 className="lp-pitch-title">Specific, not generic</h3>
              <p className="lp-pitch-text">
                Most interview advice is the same recycled tips. Here you
                get accounts tied to a real company and a real role —
                what the recruiter said on the phone, what the onsite
                panel focused on, how long between rounds.
              </p>
            </div>
            <div className="lp-pitch-block">
              <h3 className="lp-pitch-title">Written by people who were just there</h3>
              <p className="lp-pitch-text">
                Every post comes from someone who recently sat through
                the process. No outdated Glassdoor reviews from 2018,
                no secondhand rumors — just what actually happened.
              </p>
            </div>
            <div className="lp-pitch-block">
              <h3 className="lp-pitch-title">Context you can trust</h3>
              <p className="lp-pitch-text">
                Each experience includes difficulty rating, outcome,
                interview round, and timeline. Other users vote on
                helpfulness and flag outdated info so the best stories
                rise to the top.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-how">
        <div className="lp-section-inner">
          <h2 className="lp-section-heading">How people use this</h2>
          <div className="lp-how-list">
            <div className="lp-how-item">
              <span className="lp-how-num">1</span>
              <div>
                <h4 className="lp-how-title">Find your target company</h4>
                <p className="lp-how-desc">
                  Search or filter by company name. If someone interviewed
                  there recently, you'll find their write-up.
                </p>
              </div>
            </div>
            <div className="lp-how-item">
              <span className="lp-how-num">2</span>
              <div>
                <h4 className="lp-how-title">Read what the process looked like</h4>
                <p className="lp-how-desc">
                  How many rounds, what topics came up, how the interviewers
                  behaved, whether the timeline dragged. The stuff job
                  postings never tell you.
                </p>
              </div>
            </div>
            <div className="lp-how-item">
              <span className="lp-how-num">3</span>
              <div>
                <h4 className="lp-how-title">Come back and share yours</h4>
                <p className="lp-how-desc">
                  After your own interview, write it up. Takes five minutes.
                  The next person prepping for that company will thank you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-example">
        <div className="lp-section-inner">
          <h2 className="lp-section-heading">The kind of detail that helps</h2>
          <p className="lp-section-sub">
            Here's what a typical experience post covers — the stuff
            you actually want to know before your interview.
          </p>
          <div className="lp-example-card">
            <div className="lp-example-meta">
              <span className="lp-example-tag">SWE &middot; Onsite</span>
              <span className="lp-example-tag">Medium difficulty</span>
              <span className="lp-example-tag lp-tag-outcome">Got the offer</span>
            </div>
            <p className="lp-example-body">
              "Phone screen was 45 min, mostly behavioral with one easy
              coding question. Onsite was four rounds back to back —
              two system design, one coding, one hiring manager chat.
              The system design rounds were conversational, not
              whiteboard-heavy. Got the offer call six days later.
              Total process took about three weeks from first recruiter
              email to offer."
            </p>
            <p className="lp-example-note">
              This is a sample. Real posts include the company name,
              role title, and are written by verified users.
            </p>
          </div>
        </div>
      </section>

      <section className="lp-why">
        <div className="lp-section-inner">
          <div className="lp-why-layout">
            <div className="lp-why-left">
              <h2 className="lp-section-heading">
                Why another interview site?
              </h2>
            </div>
            <div className="lp-why-right">
              <p>
                Glassdoor reviews are old and vague. Blind is noisy
                and mostly compensation gossip. Reddit threads get buried.
                None of them are structured around helping you prepare
                for a specific company's process.
              </p>
              <p>
                InterviewCircle is just interview experiences — filtered,
                searchable, and written in enough detail to actually be
                useful. No salary negotiation advice, no company ratings,
                no distractions. One thing, done well.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-cta">
        <div className="lp-section-inner">
          <h2 className="lp-cta-heading">
            {user
              ? "You've been through an interview recently. Write it up."
              : "Your next interview doesn't have to be a black box."}
          </h2>
          <div className="lp-hero-actions">
            {user ? (
              <Link to="/submit" className="lp-btn-primary">
                Share your experience
              </Link>
            ) : (
              <>
                <Link to="/browse" className="lp-btn-primary">
                  Start browsing
                </Link>
                <Link to="/register" className="lp-text-link">
                  or create an account
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <footer className="lp-footer">
        <div className="lp-section-inner">
          <span>
            &copy; {new Date().getFullYear()} InterviewCircle
          </span>
          <span className="lp-footer-sep">&middot;</span>
          <span>Built for candidates, by candidates</span>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
