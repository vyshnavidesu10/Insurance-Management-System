
import { useEffect, useState } from "react";
import axios from "axios";
import "./Policies.css";

const API = "http://localhost:8080/insurance";

function Policies() {
  const [policies, setPolicies] = useState([]);
  const [editingPolicy, setEditingPolicy] = useState(null);

  const [form, setForm] = useState({
    insuranceType: "",
    coverageAmount: "",
    premium: "",
    endDate: ""
  });

  // Get all insurance policies
  const fetchPolicies = async () => {
    try {
      const response = await axios.get(`${API}/getAll`, {
        withCredentials: true
      });

      setPolicies(response.data);
    } catch (error) {
      console.error("Error fetching policies:", error);
      alert("Unable to load policies");
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  // Convert date to dd/MM/yyyy
  const formatDate = (date) => {
    if (!date) return "";

    if (date.includes("/")) return date;

    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };

  // Edit policy
  const handleEdit = (policy) => {
    setEditingPolicy(policy);

    setForm({
      insuranceType: policy.insuranceType || policy.type || "",
      coverageAmount: policy.coverageAmount || "",
      premium: policy.premium || "",
      endDate: policy.endDate || ""
    });
  };

  // Handle form changes
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Update policy
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const policyId = editingPolicy.id;

      const updatedData = {
        insuranceType: form.insuranceType,
        coverageAmount: Number(form.coverageAmount),
        premium: Number(form.premium),
        endDate: formatDate(form.endDate)
      };

      await axios.put(
        `${API}/edit/${policyId}`,
        updatedData,
        { withCredentials: true }
      );

      alert("Policy updated successfully!");
      setEditingPolicy(null);
      fetchPolicies();

    } catch (error) {
      console.error("Update error:", error);
      alert("Unable to update policy");
    }
  };

  // Delete policy
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this policy?")) {
      return;
    }

    try {
      await axios.delete(`${API}/delete/${id}`, {
        withCredentials: true
      });

      alert("Policy deleted successfully!");
      fetchPolicies();

    } catch (error) {
      console.error("Delete error:", error);
      alert("Unable to delete policy");
    }
  };

  return (
    <div className="policies-container">
      <h2>Insurance Policies</h2>

      {editingPolicy && (
        <form className="policy-edit-form" onSubmit={handleUpdate}>
          <h3>Edit Insurance Policy</h3>

          <label>Insurance Type</label>
          <select
            name="insuranceType"
            value={form.insuranceType}
            onChange={handleChange}
            required
          >
            <option value="">Select Type</option>
            <option value="Health_Insurance">Health Insurance</option>
            <option value="Vehicle_Insurance">Vehicle Insurance</option>
            <option value="Home_Insurance">Home Insurance</option>
            <option value="Term_Life_Insurance">Term Life Insurance</option>
          </select>

          <label>Coverage Amount</label>
          <input
            type="number"
            name="coverageAmount"
            value={form.coverageAmount}
            onChange={handleChange}
            required
          />

          <label>Premium</label>
          <input
            type="number"
            name="premium"
            value={form.premium}
            onChange={handleChange}
            required
          />

          <label>End Date</label>
          <input
            type="date"
            name="endDate"
            value={form.endDate.includes("/")
              ? ""
              : form.endDate}
            onChange={handleChange}
            required
          />

          <button type="submit">Update Policy</button>
          <button
            type="button"
            onClick={() => setEditingPolicy(null)}
          >
            Cancel
          </button>
        </form>
      )}

      <div className="policies-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Policy Number</th>
              <th>Customer</th>
              <th>Insurance Type</th>
              <th>Coverage Amount</th>
              <th>Premium</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {policies.length > 0 ? (
              policies.map((policy) => (
                <tr key={policy.id}>
                  <td>{policy.id}</td>
                  <td>{policy.policyNumber || policy.number}</td>
                  <td>
                    {policy.clientName ||
                      policy.client?.name ||
                      policy.client?.clientName ||
                      "-"}
                  </td>
                  <td>
                    {(policy.insuranceType || policy.type || "")
                      .replaceAll("_", " ")}
                  </td>
                  <td>₹{policy.coverageAmount}</td>
                  <td>₹{policy.premium}</td>
                  <td>{policy.startDate}</td>
                  <td>{policy.endDate}</td>
                  <td>
                    <button onClick={() => handleEdit(policy)}>
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(policy.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9">No policies found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Policies;
