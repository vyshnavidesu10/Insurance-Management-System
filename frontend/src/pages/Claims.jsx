
import { useEffect, useState } from "react";
import axios from "axios";
import "./Claims.css";

const API = "http://localhost:8080/claim";
const POLICY_API = "http://localhost:8080/insurance";

function Claims() {
  const [claims, setClaims] = useState([]);
  const [policies, setPolicies] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editingClaim, setEditingClaim] = useState(null);

  const [form, setForm] = useState({
    policyNumber: "",
    number: "",
    description: "",
    claimDate: "",
    claimStatus: "Under_Process"
  });

  // Fetch all claims
  const fetchClaims = async () => {
    try {
      const response = await axios.get(`${API}/getAll`, {
        withCredentials: true
      });
      setClaims(response.data);
    } catch (error) {
      console.error("Error fetching claims:", error);
      alert("Unable to load claims");
    }
  };

  // Fetch insurance policies
  const fetchPolicies = async () => {
    try {
      const response = await axios.get(`${POLICY_API}/getAll`, {
        withCredentials: true
      });
      setPolicies(response.data);
    } catch (error) {
      console.error("Error fetching policies:", error);
      alert("Unable to load insurance policies");
    }
  };

  useEffect(() => {
    fetchClaims();
    fetchPolicies();
  }, []);

  // Convert date to dd/MM/yyyy
  const formatDate = (date) => {
    if (!date) return "";

    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };

  // Handle form changes
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Open Add Claim form
  const handleAdd = () => {
    setEditingClaim(null);

    setForm({
      policyNumber: "",
      number: "",
      description: "",
      claimDate: "",
      claimStatus: "Under_Process"
    });

    setShowForm(true);
  };

  // Add new claim
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const claimData = {
        policyNumber: form.policyNumber,
        number: form.number,
        description: form.description,
        claimDate: formatDate(form.claimDate),
        claimStatus: form.claimStatus
      };

      await axios.post(`${API}/add`, claimData, {
        withCredentials: true
      });

      alert("Claim added successfully!");

      setShowForm(false);

      setForm({
        policyNumber: "",
        number: "",
        description: "",
        claimDate: "",
        claimStatus: "Under_Process"
      });

      fetchClaims();

    } catch (error) {
      console.error("Add claim error:", error);
      alert("Unable to add claim. Check the policy number and details.");
    }
  };

  // Edit claim
  const handleEdit = (claim) => {
    setEditingClaim(claim);

    const [day, month, year] = claim.claimDate.split("/");

    setForm({
      policyNumber: "",
      number: claim.number,
      description: claim.description,
      claimDate: `${year}-${month}-${day}`,
      claimStatus: claim.claimStatus
    });

    setShowForm(true);
  };

  // Update claim
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const updatedData = {
        description: form.description,
        claimDate: formatDate(form.claimDate),
        claimStatus: form.claimStatus
      };

      await axios.put(
        `${API}/edit/${editingClaim.id}`,
        updatedData,
        { withCredentials: true }
      );

      alert("Claim updated successfully!");

      setShowForm(false);
      setEditingClaim(null);
      fetchClaims();

    } catch (error) {
      console.error("Update error:", error);
      alert("Unable to update claim");
    }
  };

  // Delete claim
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this claim?")) {
      return;
    }

    try {
      await axios.delete(`${API}/delete/${id}`, {
        withCredentials: true
      });

      alert("Claim deleted successfully!");
      fetchClaims();

    } catch (error) {
      console.error("Delete error:", error);
      alert("Unable to delete claim");
    }
  };

  return (
    <div className="page-container">

      <h1>Insurance Claims</h1>

      <button className="add-claim-btn" onClick={handleAdd}>
        + Add Claim
      </button>

      {/* Add / Edit Claim Form */}
      {showForm && (
        <form
          className="claim-edit-form"
          onSubmit={editingClaim ? handleUpdate : handleSubmit}
        >
          <h2>{editingClaim ? "Edit Claim" : "Add New Claim"}</h2>

          {!editingClaim && (
            <>
              <label>Insurance Policy Number</label>

              <select
                name="policyNumber"
                value={form.policyNumber}
                onChange={handleChange}
                required
              >
                <option value="">Select Policy</option>

                {policies.map((policy) => (
                  <option key={policy.id} value={policy.policyNumber}>
                    {policy.policyNumber} - {policy.client?.name}
                  </option>
                ))}
              </select>

              <label>Claim Number</label>

              <input
                type="text"
                name="number"
                value={form.number}
                onChange={handleChange}
                placeholder="Enter claim number"
                required
              />
            </>
          )}

          <label>Description</label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter claim description"
            required
          />

          <label>Claim Date</label>

          <input
            type="date"
            name="claimDate"
            value={form.claimDate}
            onChange={handleChange}
            required
          />

          <label>Claim Status</label>

          <select
            name="claimStatus"
            value={form.claimStatus}
            onChange={handleChange}
            required
          >
            <option value="Under_Process">Under Process</option>
            <option value="Successful">Successful</option>
            <option value="Rejected">Rejected</option>
          </select>

          <button type="submit">
            {editingClaim ? "Update Claim" : "Add Claim"}
          </button>

          <button
            type="button"
            onClick={() => {
              setShowForm(false);
              setEditingClaim(null);
            }}
          >
            Cancel
          </button>
        </form>
      )}

      {/* Claims Table */}
      <div className="claims-table">
        <table>
          <thead>
            <tr>
              <th>Claim ID</th>
              <th>Claim Number</th>
              <th>Customer</th>
              <th>Insurance Type</th>
              <th>Description</th>
              <th>Claim Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {claims.length > 0 ? (
              claims.map((claim) => (
                <tr key={claim.id}>
                  <td>{claim.id}</td>
                  <td>{claim.number}</td>
                  <td>{claim.customerName}</td>

                  <td>
                    {claim.insuranceResponseForClaimDto
                      ?.insuranceType?.replaceAll("_", " ")}
                  </td>

                  <td>{claim.description}</td>
                  <td>{claim.claimDate}</td>

                  <td>
                    {claim.claimStatus.replaceAll("_", " ")}
                  </td>

                  <td>
                    <button onClick={() => handleEdit(claim)}>
                      Edit
                    </button>

                    <button onClick={() => handleDelete(claim.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">No claims found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default Claims;