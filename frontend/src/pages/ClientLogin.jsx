
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./ClientAuth.css";

function ClientLogin() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const formData = new URLSearchParams();

            formData.append("username", email);
            formData.append("password", password);

            const response = await fetch(
                "http://localhost:8080/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: formData.toString(),
                    credentials: "include"
                }
            );

            if (response.ok) {
                navigate("/client-dashboard");
            } else {
                setError("Invalid email or password");
            }

        } catch (err) {
            setError("Unable to connect to server. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="client-auth-container">

            <div className="client-auth-box">

                <h1>Client Login</h1>
                <p>Login to access your insurance account</p>

                <form className="client-auth-form" onSubmit={handleLogin}>

                    <div>
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <p className="error-message">{error}</p>
                    )}

                    <button type="submit" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>

                <div className="client-auth-link">
                    Don't have an account?{" "}
                    <Link to="/client-register">Register here</Link>
                </div>

            </div>

        </div>
    );
}

export default ClientLogin;
