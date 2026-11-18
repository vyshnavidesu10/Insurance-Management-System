
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {

      const params = new URLSearchParams();

      params.append("username", username);
      params.append("password", password);

      const response = await axios.post(
        "http://localhost:8080/login",
        params,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }
      );

      alert("Login Successful!");

      navigate("/dashboard");

    } catch (error) {

      console.error("Login Error:", error);

      if (error.response) {
        alert(
          error.response.data?.message ||
          "Invalid username or password"
        );
      } else {
        alert("Cannot connect to Spring Boot. Check whether backend is running.");
      }

    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="login-container">

      <div className="login-box">

        <h1>Insurance Management</h1>

        <p>Welcome Back! Login to continue.</p>

        <form onSubmit={handleLogin}>

          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p>Secure Insurance Management System</p>

      </div>

    </div>

  );
}

export default Login;
