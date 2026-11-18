
import { useEffect, useState } from "react";
import axios from "axios";
import "./Customers.css";

const API = "http://localhost:8080/client";
const INSURANCE_API = "http://localhost:8080/insurance";

// Sample suggested plans
const POLICY_PLANS = {
  Health_Insurance: [
    { coverageAmount: 500000, premium: 8000 },
    { coverageAmount: 1000000, premium: 15000 },
  ],
  Vehicle_Insurance: [
    { coverageAmount: 200000, premium: 4000 },
    { coverageAmount: 500000, premium: 8000 },
  ],
  Home_Insurance: [
    { coverageAmount: 2500000, premium: 5000 },
    { coverageAmount: 5000000, premium: 9000 },
  ],
  Term_Life_Insurance: [
    { coverageAmount: 5000000, premium: 8000 },
    { coverageAmount: 10000000, premium: 14000 },
  ],
};

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Customer form
  const [editingId, setEditingId] = useState(null);
  const [customer, setCustomer] = useState({
    name: "",
    dateOfBirth: "",
    address: "",
    contact: "",
  });

  // Insurance policy form
  const [policyMode, setPolicyMode] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState("");

  const [policy, setPolicy] = useState({
    policyNumber: "",
    insuranceType: "",
    coverageAmount: "",
    premium: "",
    startDate: "",
    endDate: "",
  });

  // Date conversion: yyyy-MM-dd to dd/MM/yyyy
  const formatDate = (date) => {
    if (!date) return "";
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };

  // Date conversion: dd/MM/yyyy to yyyy-MM-dd
  const toInputDate = (date) => {
    if (!date) return "";

    if (date.includes("-")) return date;

    const [day, month, year] = date.split("/");
    return `${year}-${month}-${day}`;
  };

  // Get all customers
  const fetchCustomers = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${API}/getAll`, {
        withCredentials: true,
      });

      setCustomers(response.data);
    } catch (error) {
      console.error("Fetch customers error:", error);
      alert(
        error.response?.data?.message ||
        "Unable to fetch customers. Check login and ADMIN role."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Customer input changes
  const handleChange = (e) => {
    setCustomer({
      ...customer,
      [e.target.name]: e.target.value,
    });
  };

  // Reset customer form
  const resetForm = () => {
    setCustomer({
      name: "",
      dateOfBirth: "",
      address: "",
      contact: "",
    });

    setEditingId(null);
  };

  // Add or update customer
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId !== null) {
        const updateData = {
          address: customer.address,
          contact: customer.contact,
        };

        const response = await axios.put(
          `${API}/edit/${editingId}`,
          updateData,
          { withCredentials: true }
        );

        alert(response.data || "Customer updated successfully!");
      } else {
        const customerData = {
          name: customer.name,
          dateOfBirth: formatDate(customer.dateOfBirth),
          address: customer.address,
          contact: customer.contact,
        };

        const response = await axios.post(
          `${API}/add`,
          customerData,
          { withCredentials: true }
        );

        alert(response.data || "Customer added successfully!");
      }

      resetForm();
      await fetchCustomers();
    } catch (error) {
      console.error("Customer operation error:", error);
      alert(
        error.response?.data?.message ||
        error.response?.data ||
        "Customer operation failed."
      );
    }
  };

  // Edit customer
  const handleEdit = (c) => {
    setEditingId(c.id);

    setCustomer({
      name: c.name || "",
      dateOfBirth: c.dateOfBirth || "",
      address: c.address || "",
      contact: c.contact || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete customer
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) {
      return;
    }

    try {
      const response = await axios.delete(`${API}/delete/${id}`, {
        withCredentials: true,
      });

      alert(response.data || "Customer deleted successfully!");

      if (editingId === id) resetForm();

      await fetchCustomers();
    } catch (error) {
      console.error("Delete customer error:", error);
      alert(
        error.response?.data?.message ||
        error.response?.data ||
        "Unable to delete customer."
      );
    }
  };

  // Open Add Policy form
  const startAddPolicy = (c) => {
    setSelectedCustomer(c);
    setPolicyMode("add");

    setPolicy({
      policyNumber: "",
      insuranceType: "Health_Insurance",
      coverageAmount: 500000,
      premium: 8000,
      startDate: "",
      endDate: "",
    });

    setSelectedPlan("0");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Open Edit Policy form
  const startEditPolicy = (c) => {
    const p = c.insurancePolicy;

    if (!p) return;

    setSelectedCustomer(c);
    setPolicyMode("edit");

    setPolicy({
      policyNumber: p.number || p.policyNumber || "",
      insuranceType: p.insuranceType || "",
      coverageAmount: p.coverageAmount ?? "",
      premium: p.premium ?? "",
      startDate: toInputDate(p.startDate),
      endDate: toInputDate(p.endDate),
    });

    // Preserve existing values without selecting a sample plan
    setSelectedPlan("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Change insurance type and automatically select first plan
  const handleInsuranceTypeChange = (e) => {
    const insuranceType = e.target.value;
    const firstPlan = POLICY_PLANS[insuranceType]?.[0];

    setPolicy({
      ...policy,
      insuranceType,
      coverageAmount: firstPlan ? firstPlan.coverageAmount : "",
      premium: firstPlan ? firstPlan.premium : "",
    });

    setSelectedPlan(firstPlan ? "0" : "");
  };

  // Select suggested plan
  const handleSuggestedPlan = (index) => {
    const plan = POLICY_PLANS[policy.insuranceType][index];

    setPolicy({
      ...policy,
      coverageAmount: plan.coverageAmount,
      premium: plan.premium,
    });

    setSelectedPlan(String(index));
  };

  // Policy form input changes
  const handlePolicyChange = (e) => {
    const { name, value } = e.target;

    setPolicy({
      ...policy,
      [name]: value,
    });

    if (name === "coverageAmount" || name === "premium") {
      setSelectedPlan("custom");
    }
  };

  // Close policy form
  const cancelPolicyForm = () => {
    setPolicyMode(null);
    setSelectedCustomer(null);
    setSelectedPlan("");
  };

  // Add or update insurance policy
  const handlePolicySubmit = async (e) => {
    e.preventDefault();

    try {
      if (policyMode === "add") {
        const policyData = {
          clientName: selectedCustomer.name,
          policyNumber: policy.policyNumber,
          insuranceType: policy.insuranceType,
          coverageAmount: Number(policy.coverageAmount),
          premium: Number(policy.premium),
          startDate: formatDate(policy.startDate),
          endDate: formatDate(policy.endDate),
        };

        const response = await axios.post(
          `${INSURANCE_API}/add`,
          policyData,
          { withCredentials: true }
        );

        alert(response.data || "Insurance policy added successfully!");
      } else {
        const policyId = selectedCustomer.insurancePolicy.id;

        const updateData = {
          insuranceType: policy.insuranceType,
          coverageAmount: Number(policy.coverageAmount),
          premium: Number(policy.premium),
          endDate: formatDate(policy.endDate),
        };

        const response = await axios.put(
          `${INSURANCE_API}/edit/${policyId}`,
          updateData,
          { withCredentials: true }
        );

        alert(response.data || "Insurance policy updated successfully!");
      }

      cancelPolicyForm();
      await fetchCustomers();
    } catch (error) {
      console.error("Policy operation error:", error);

      alert(
        error.response?.data?.message ||
        error.response?.data ||
        "Unable to save insurance policy."
      );
    }
  };

  // Delete insurance policy
  const handleDeletePolicy = async (policyId) => {
    if (!window.confirm("Are you sure you want to delete this policy?")) {
      return;
    }

    try {
      const response = await axios.delete(
        `${INSURANCE_API}/delete/${policyId}`,
        { withCredentials: true }
      );

      alert(response.data || "Policy deleted successfully!");

      await fetchCustomers();
    } catch (error) {
      console.error("Delete policy error:", error);

      alert(
        error.response?.data?.message ||
        error.response?.data ||
        "Unable to delete policy."
      );
    }
  };

  // Search customers
  const filteredCustomers = customers.filter((c) =>
    `${c.name || ""} ${c.contact || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="customers-page">

      {/* Header */}
      <div className="customers-header">
        <div>
          <h1>Customer Management</h1>
          <p>Manage your insurance customers</p>
        </div>

        <button
          className="refresh-btn"
          type="button"
          onClick={fetchCustomers}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Customer Form */}
      <div className="customer-card">
        <h2>
          {editingId !== null ? "Update Customer" : "Add New Customer"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="customer-form-grid">

            <div className="form-group">
              <label>Customer Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter customer name"
                value={customer.name}
                onChange={handleChange}
                required
                disabled={editingId !== null}
              />
            </div>

            <div className="form-group">
              <label>Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={customer.dateOfBirth}
                onChange={handleChange}
                required
                disabled={editingId !== null}
              />
            </div>

            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                name="address"
                placeholder="Enter address"
                value={customer.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Contact Number</label>
              <input
                type="tel"
                name="contact"
                placeholder="Enter contact number"
                value={customer.contact}
                onChange={handleChange}
                required
              />
            </div>

          </div>

          <div className="form-buttons">
            <button type="submit" className="add-btn">
              {editingId !== null ? "Update Customer" : "Add Customer"}
            </button>

            {editingId !== null && (
              <button
                type="button"
                className="cancel-btn"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Insurance Policy Form */}
      {policyMode && (
        <div className="customer-card policy-form">
          <h2>
            {policyMode === "add"
              ? `Add Insurance Policy - ${selectedCustomer?.name}`
              : `Edit Insurance Policy - ${selectedCustomer?.name}`}
          </h2>

          <form onSubmit={handlePolicySubmit}>

            <div className="form-group">
              <label>Policy Number</label>
              <input
                type="text"
                name="policyNumber"
                placeholder="Enter policy number"
                value={policy.policyNumber}
                onChange={handlePolicyChange}
                disabled={policyMode === "edit"}
                required
              />
            </div>

            <div className="form-group">
              <label>Insurance Type</label>
              <select
                name="insuranceType"
                value={policy.insuranceType}
                onChange={handleInsuranceTypeChange}
                required
              >
                <option value="">Select Insurance Type</option>
                <option value="Vehicle_Insurance">Vehicle Insurance</option>
                <option value="Health_Insurance">Health Insurance</option>
                <option value="Home_Insurance">Home Insurance</option>
                <option value="Term_Life_Insurance">Term Life Insurance</option>
              </select>
            </div>

            {/* Suggested Plans */}
            <h3>Suggested Plans</h3>

            <div className="suggested-plans">
              {(POLICY_PLANS[policy.insuranceType] || []).map(
                (plan, index) => (
                  <label className="plan-option" key={index}>
                    <input
                      type="radio"
                      name="suggestedPlan"
                      checked={selectedPlan === String(index)}
                      onChange={() => handleSuggestedPlan(index)}
                    />

                    <span>
                      <strong>Plan {index + 1}</strong>
                      <br />
                      ₹{plan.coverageAmount.toLocaleString("en-IN")} coverage
                      <br />
                      ₹{plan.premium.toLocaleString("en-IN")} annual premium
                    </span>
                  </label>
                )
              )}
            </div>

            <div className="form-group">
              <label>Coverage Amount (₹)</label>
              <input
                type="number"
                name="coverageAmount"
                min="1"
                value={policy.coverageAmount}
                onChange={handlePolicyChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Annual Premium (₹)</label>
              <input
                type="number"
                name="premium"
                min="1"
                value={policy.premium}
                onChange={handlePolicyChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                name="startDate"
                value={policy.startDate}
                onChange={handlePolicyChange}
                disabled={policyMode === "edit"}
                required
              />
            </div>

            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                name="endDate"
                value={policy.endDate}
                onChange={handlePolicyChange}
                required
              />
            </div>

            <p className="plan-note">
              These are sample suggested amounts, not actual insurer quotes.
              You can manually change the coverage and annual premium.
            </p>

            <div className="form-buttons">
              <button type="submit" className="add-btn">
                {policyMode === "add" ? "Add Policy" : "Update Policy"}
              </button>

              <button
                type="button"
                className="cancel-btn"
                onClick={cancelPolicyForm}
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      )}

      {/* Customer List */}
      <div className="customer-card">

        <div className="list-header">
          <div>
            <h2>Customer List</h2>
            <p>Total Customers: {customers.length}</p>
          </div>

          <input
            type="text"
            className="search-input"
            placeholder="Search by name or contact"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <p>Loading customers...</p>
        ) : (
          <div className="table-container">
            <table className="customers-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Date of Birth</th>
                  <th>Address</th>
                  <th>Contact</th>
                  <th>Insurance Policy</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredCustomers.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.name}</td>
                    <td>{c.dateOfBirth}</td>
                    <td>{c.address}</td>
                    <td>{c.contact}</td>

                    <td>
                      {c.insurancePolicy ? (
                        <>
                          <strong>
                            {c.insurancePolicy.number ||
                              c.insurancePolicy.policyNumber}
                          </strong>
                          <br />
                          {String(c.insurancePolicy.insuranceType || "")
                            .replaceAll("_", " ")}
                          <br />
                          Coverage: ₹
                          {Number(
                            c.insurancePolicy.coverageAmount
                          ).toLocaleString("en-IN")}
                          <br />
                          Premium: ₹
                          {Number(
                            c.insurancePolicy.premium
                          ).toLocaleString("en-IN")}
                        </>
                      ) : (
                        "No Policy"
                      )}
                    </td>

                    <td className="action-buttons">
                      <button
                        type="button"
                        className="edit-btn"
                        onClick={() => handleEdit(c)}
                      >
                        Edit Customer
                      </button>

                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() => handleDelete(c.id)}
                      >
                        Delete Customer
                      </button>

                      {c.insurancePolicy ? (
                        <>
                          <button
                            type="button"
                            className="edit-btn"
                            onClick={() => startEditPolicy(c)}
                          >
                            Edit Policy
                          </button>

                          <button
                            type="button"
                            className="delete-btn"
                            onClick={() =>
                              handleDeletePolicy(c.insurancePolicy.id)
                            }
                          >
                            Delete Policy
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          className="add-btn"
                          onClick={() => startAddPolicy(c)}
                        >
                          Add Policy
                        </button>
                      )}
                    </td>
                  </tr>
                ))}

                {filteredCustomers.length === 0 && (
                  <tr>
                    <td colSpan="7" className="empty-message">
                      No customers found.
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>
        )}
      </div>

    </div>
  );
}

export default Customers;
