
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./ClientAuth.css";

function ClientRegister() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        dateOfBirth: "",
        address: "",
        contact: "",
        email: "",
        password: ""
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // HANDLE INPUT CHANGES
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // CLIENT REGISTRATION
    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        setLoading(true);

        const data = {
            ...form,
            dateOfBirth: form.dateOfBirth.split("-").reverse().join("/")
        };

        try {
            const response = await fetch(
                "http://localhost:8080/client/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                }
            );

            const result = await response.text();

            if (response.ok) {
                setMessage(result);

                setTimeout(() => {
                    navigate("/client-login");
                }, 1500);

            } else {
                setError(result);
            }

        } catch (err) {
            setError("Unable to connect to server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="client-auth-container">

            <div className="client-auth-box">

                <h1>Client Registration</h1>

                <p>Create your insurance account</p>

                <form
                    className="client-auth-form"
                    onSubmit={handleRegister}
                >

                    <div>
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your full name"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label>Date of Birth</label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={form.dateOfBirth}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label>Address</label>
                        <input
                            type="text"
                            name="address"
                            placeholder="Enter your address"
                            value={form.address}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label>Phone Number</label>
                        <input
                            type="tel"
                            name="contact"
                            placeholder="Enter your phone number"
                            value={form.contact}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Create your password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {message && (
                        <p className="success-message">{message}</p>
                    )}

                    {error && (
                        <p className="error-message">{error}</p>
                    )}

                    <button type="submit" disabled={loading}>
                        {loading ? "Registering..." : "Register"}
                    </button>

                </form>

                <div className="client-auth-link">
                    Already registered?{" "}
                    <Link to="/client-login">Login here</Link>
                </div>

            </div>

        </div>
    );
}

export default ClientRegister;
