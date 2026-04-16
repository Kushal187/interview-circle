import { useState, useContext } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Form, Button, Container, Card } from "react-bootstrap";
import { UserContext } from "../context/UserContext";
import "./LoginPage.css";

function LoginPage() {
  const { login } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  const getReturnTo = () => {
    const params = new URLSearchParams(location.search);
    return params.get("returnTo") || location.state?.from || "/browse";
  };
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password) {
      setError("Both fields are required.");
      return;
    }

    setSubmitting(true);
    try {
      await login(username.trim(), password);
      navigate(getReturnTo(), { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="ic-login-page">
      <Card className="ic-auth-card">
        <Card.Body>
          <h1 className="ic-auth-title">Log In</h1>
          {error && <div className="alert alert-danger">{error}</div>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="login-username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="login-password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </Form.Group>
            <Button
              type="submit"
              className="ic-auth-btn w-100"
              disabled={submitting}
            >
              {submitting ? "Logging in..." : "Log In"}
            </Button>
          </Form>
          <p className="ic-auth-footer">
            Don&apos;t have an account?{" "}
            <Link to={`/register${location.search}`} state={location.state}>
              Register
            </Link>
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default LoginPage;
