
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ClientAuth.css";

function ClientDashboard() {
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [insurance, setInsurance] = useState(null);
    const [claims, setClaims] = useState(null);

    // CLAIM SUBMISSION STATES
    const [showClaimForm, setShowClaimForm] = useState(false);
    const [eligiblePolicies, setEligiblePolicies] = useState([]);
    const [selectedPolicy, setSelectedPolicy] = useState("");
    const [claimDescription, setClaimDescription] = useState("");
    const [claimDate, setClaimDate] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    // GET CLIENT PROFILE
    const handleProfile = async () => {
        setLoading(true);
        setError("");
        setSuccess("");
        setInsurance(null);
        setClaims(null);
        setShowClaimForm(false);

        try {
            const response = await fetch(
                "http://localhost:8080/client/me",
                {
                    method: "GET",
                    credentials: "include"
                }
            );

            if (!response.ok) {
                throw new Error("Unable to load client profile");
            }

            const data = await response.json();
            setProfile(data);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // GET CLIENT INSURANCE
    const handleInsurance = async () => {
        setLoading(true);
        setError("");
        setSuccess("");
        setProfile(null);
        setClaims(null);
        setShowClaimForm(false);

        try {
            const response = await fetch(
                "http://localhost:8080/client/my-insurance",
                {
                    method: "GET",
                    credentials: "include"
                }
            );

            if (!response.ok) {
                throw new Error("Unable to load insurance details");
            }

            const data = await response.json();
            setInsurance(data);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // GET CLIENT CLAIMS
    const handleClaims = async () => {
        setLoading(true);
        setError("");
        setSuccess("");
        setProfile(null);
        setInsurance(null);
        setShowClaimForm(false);

        try {
            const response = await fetch(
                "http://localhost:8080/claim/my-claims",
                {
                    method: "GET",
                    credentials: "include"
                }
            );

            if (!response.ok) {
                throw new Error("Unable to load claim details");
            }

            const data = await response.json();
            setClaims(data);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // OPEN CLAIM FORM AND LOAD ALL CLIENT POLICIES
    const handleOpenClaimForm = async () => {
        setLoading(true);
        setError("");
        setSuccess("");

        setProfile(null);
        setInsurance(null);
        setClaims(null);

        try {
            const response = await fetch(
                "http://localhost:8080/client/my-insurance",
                {
                    method: "GET",
                    credentials: "include"
                }
            );

            if (!response.ok) {
                throw new Error("Unable to load your insurance policies");
            }

            const policies = await response.json();

            // IMPORTANT:
            // Do not filter policies based on existing claims.
            // A policy can have multiple claims.
            setEligiblePolicies(policies);

            setSelectedPolicy("");
            setClaimDescription("");
            setClaimDate("");
            setShowClaimForm(true);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // SUBMIT CLIENT CLAIM
    const handleSubmitClaim = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!selectedPolicy || !claimDescription.trim() || !claimDate) {
            setError("Please fill in all claim details.");
            return;
        }

        setLoading(true);

        try {
            // Convert yyyy-mm-dd to dd/MM/yyyy
            const formattedDate = claimDate
                .split("-")
                .reverse()
                .join("/");

            const response = await fetch(
                "http://localhost:8080/claim/client-submit",
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        policyNumber: selectedPolicy,
                        description: claimDescription.trim(),
                        claimDate: formattedDate
                    })
                }
            );

            const result = await response.text();

            if (!response.ok) {
                throw new Error(result || "Unable to submit claim");
            }

            setSuccess(result || "Claim submitted successfully!");

            setClaimDescription("");
            setClaimDate("");
            setSelectedPolicy("");
            setShowClaimForm(false);

            // Refresh claims after successful submission
            const claimsResponse = await fetch(
                "http://localhost:8080/claim/my-claims",
                {
                    method: "GET",
                    credentials: "include"
                }
            );

            if (claimsResponse.ok) {
                const updatedClaims = await claimsResponse.json();
                setClaims(updatedClaims);
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // LOGOUT
    const handleLogout = async () => {
        try {
            await fetch("http://localhost:8080/logout", {
                method: "POST",
                credentials: "include"
            });
        } catch (error) {
            console.error("Logout failed:", error);
        }

        setProfile(null);
        setInsurance(null);
        setClaims(null);
        setShowClaimForm(false);

        navigate("/client-login");
    };

    return (
        <div className="client-dashboard">

            <header className="client-header">
                <h2>Insurance Management System</h2>
                <button onClick={handleLogout}>Logout</button>
            </header>

            <main className="client-content">

                <h1>Welcome to Client Dashboard</h1>
                <p>Manage your insurance account here.</p>

                <div className="client-cards">

                    {/* MY PROFILE */}
                    <div className="client-card">
                        <h3>My Profile</h3>
                        <p>View your personal details.</p>

                        <button onClick={handleProfile}>
                            View Profile
                        </button>
                    </div>

                    {/* MY INSURANCE */}
                    <div className="client-card">
                        <h3>My Insurance</h3>
                        <p>View your insurance policy.</p>

                        <button onClick={handleInsurance}>
                            View Insurance
                        </button>
                    </div>

                    {/* MY CLAIMS */}
                    <div className="client-card">
                        <h3>My Claims</h3>
                        <p>View your insurance claims.</p>

                        <button onClick={handleClaims}>
                            View Claims
                        </button>
                    </div>

                    {/* SUBMIT CLAIM */}
                    <div className="client-card">
                        <h3>Submit a Claim</h3>
                        <p>Submit a new insurance claim.</p>

                        <button onClick={handleOpenClaimForm}>
                            Submit Claim
                        </button>
                    </div>

                </div>

                {loading && <p>Loading details...</p>}

                {error && (
                    <p className="error-message">{error}</p>
                )}

                {success && (
                    <p className="success-message">{success}</p>
                )}

                {/* CLAIM SUBMISSION FORM */}
                {showClaimForm && (
                    <div className="client-card profile-details">

                        <h2>Submit Insurance Claim</h2>

                        {eligiblePolicies.length === 0 ? (
                            <p>
                                No insurance policies found.
                                Please contact Admin to add a policy.
                            </p>
                        ) : (
                            <form onSubmit={handleSubmitClaim}>

                                <div className="form-group">
                                    <label>Select Insurance Policy</label>

                                    <select
                                        value={selectedPolicy}
                                        onChange={(e) =>
                                            setSelectedPolicy(e.target.value)
                                        }
                                        required
                                    >
                                        <option value="">
                                            -- Select Policy --
                                        </option>

                                        {eligiblePolicies.map((policy) => (
                                            <option
                                                key={policy.id}
                                                value={policy.policyNumber}
                                            >
                                                {policy.policyNumber} - {policy.insuranceType || policy.type}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Claim Description</label>

                                    <textarea
                                        value={claimDescription}
                                        onChange={(e) =>
                                            setClaimDescription(e.target.value)
                                        }
                                        placeholder="Enter your claim description"
                                        rows="4"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Claim Date</label>

                                    <input
                                        type="date"
                                        value={claimDate}
                                        onChange={(e) =>
                                            setClaimDate(e.target.value)
                                        }
                                        required
                                    />
                                </div>

                                <button type="submit" disabled={loading}>
                                    {loading ? "Submitting..." : "Submit Claim"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setShowClaimForm(false)}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>

                            </form>
                        )}
                    </div>
                )}

                {/* PROFILE DETAILS */}
                {profile && (
                    <div className="client-card profile-details">

                        <h2>My Profile Details</h2>

                        <p><strong>Client ID:</strong> {profile.id}</p>
                        <p><strong>Name:</strong> {profile.name}</p>
                        <p><strong>Date of Birth:</strong> {profile.dateOfBirth}</p>
                        <p><strong>Address:</strong> {profile.address}</p>
                        <p><strong>Contact:</strong> {profile.contact}</p>

                    </div>
                )}

                {/* INSURANCE DETAILS */}
                {insurance && (
                    <div className="client-card profile-details">

                        <h2>My Insurance Details</h2>

                        {insurance.length === 0 ? (
                            <p>No insurance policies found.</p>
                        ) : (
                            insurance.map((policy) => (
                                <div key={policy.id} className="policy-details">

                                    <h3>Policy #{policy.id}</h3>

                                    <p>
                                        <strong>Policy Number:</strong>
                                        {" "}{policy.policyNumber}
                                    </p>

                                    <p>
                                        <strong>Insurance Type:</strong>
                                        {" "}{policy.insuranceType || policy.type}
                                    </p>

                                    <p>
                                        <strong>Coverage Amount:</strong>
                                        {" "}₹{policy.coverageAmount?.toLocaleString("en-IN")}
                                    </p>

                                    <p>
                                        <strong>Premium:</strong>
                                        {" "}₹{policy.premium?.toLocaleString("en-IN")}
                                    </p>

                                    <p>
                                        <strong>Start Date:</strong>
                                        {" "}{policy.startDate}
                                    </p>

                                    <p>
                                        <strong>End Date:</strong>
                                        {" "}{policy.endDate}
                                    </p>

                                    <hr />

                                </div>
                            ))
                        )}

                    </div>
                )}

                {/* CLAIM DETAILS */}
                {claims && (
                    <div className="client-card profile-details">

                        <h2>My Claims</h2>

                        {claims.length === 0 ? (
                            <p>No claims found.</p>
                        ) : (
                            claims.map((claim) => (
                                <div key={claim.id} className="policy-details">

                                    <h3>Claim #{claim.id}</h3>

                                    <p>
                                        <strong>Claim Number:</strong>
                                        {" "}{claim.number}
                                    </p>

                                    <p>
                                        <strong>Customer Name:</strong>
                                        {" "}{claim.customerName}
                                    </p>

                                    <p>
                                        <strong>Description:</strong>
                                        {" "}{claim.description}
                                    </p>

                                    <p>
                                        <strong>Claim Date:</strong>
                                        {" "}{claim.claimDate}
                                    </p>

                                    <p>
                                        <strong>Claim Status:</strong>
                                        {" "}{claim.claimStatus}
                                    </p>

                                    <hr />

                                    <h4>Insurance Policy Details</h4>

                                    <p>
                                        <strong>Policy Number:</strong>
                                        {" "}{claim.insuranceResponseForClaimDto?.policyNumber}
                                    </p>

                                    <p>
                                        <strong>Insurance Type:</strong>
                                        {" "}{claim.insuranceResponseForClaimDto?.insuranceType}
                                    </p>

                                    <p>
                                        <strong>Coverage Amount:</strong>
                                        {" "}₹{claim.insuranceResponseForClaimDto?.coverageAmount?.toLocaleString("en-IN")}
                                    </p>

                                    <p>
                                        <strong>Premium:</strong>
                                        {" "}₹{claim.insuranceResponseForClaimDto?.premium?.toLocaleString("en-IN")}
                                    </p>

                                    <p>
                                        <strong>Start Date:</strong>
                                        {" "}{claim.insuranceResponseForClaimDto?.startDate}
                                    </p>

                                    <p>
                                        <strong>End Date:</strong>
                                        {" "}{claim.insuranceResponseForClaimDto?.endDate}
                                    </p>

                                    <hr />

                                </div>
                            ))
                        )}

                    </div>
                )}

            </main>
        </div>
    );
}

export default ClientDashboard;
