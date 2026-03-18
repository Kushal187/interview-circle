import { createContext, useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import {
  loginUser,
  registerUser,
  logoutUser,
  checkSession,
} from "../services/authService";

const UserContext = createContext(null);

function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const data = await checkSession();
        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadSession();
  }, []);

  const login = useCallback(async (username, password) => {
    const data = await loginUser(username, password);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (username, email, password) => {
    const data = await registerUser(username, email, password);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    await logoutUser();
    setUser(null);
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </UserContext.Provider>
  );
}

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { UserContext, UserProvider };
