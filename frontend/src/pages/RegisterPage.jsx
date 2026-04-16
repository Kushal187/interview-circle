import { useState, useContext } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Form, Button, Container, Card } from "react-bootstrap";
import { UserContext } from "../context/UserContext";
import "./RegisterPage.css";

function RegisterPage() {
  const { register } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  const getReturnTo = () => {
    const params = new URLSearchParams(location.search);
    return params.get("returnTo") || location.state?.from || "/browse";
  };
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await register(username.trim(), email.trim(), password);
      navigate(getReturnTo(), { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="ic-register-page">
      <Card className="ic-auth-card">
        <Card.Body>
          <h1 className="ic-auth-title">Create an Account</h1>
          {error && <div className="alert alert-danger">{error}</div>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="register-username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="register-email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="register-password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="register-confirm-password">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                required
              />
            </Form.Group>
            <Button
              type="submit"
              className="ic-auth-btn w-100"
              disabled={submitting}
            >
              {submitting ? "Creating account..." : "Register"}
            </Button>
          </Form>
          <p className="ic-auth-footer">
            Already have an account?{" "}
            <Link to={`/login${location.search}`} state={location.state}>
              Log In
            </Link>
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default RegisterPage;
