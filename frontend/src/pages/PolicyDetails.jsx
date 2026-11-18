
import { useParams, useNavigate } from "react-router-dom";

function PolicyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const policies = {
    1: {
      name: "Life Insurance",
      description: "Financial protection for your family.",
      premium: "₹5,000 / Year",
      coverage: "Life coverage for your family",
      duration: "1 Year",
      benefits: [
        "Financial protection for family",
        "Life coverage",
        "Financial security for dependents"
      ]
    },

    2: {
      name: "Health Insurance",
      description: "Healthcare and medical expense coverage.",
      premium: "₹8,000 / Year",
      coverage: "Medical and hospitalization coverage",
      duration: "1 Year",
      benefits: [
        "Hospitalization coverage",
        "Medical expense coverage",
        "Healthcare financial protection"
      ]
    },

    3: {
      name: "Vehicle Insurance",
      description: "Protection for your vehicles.",
      premium: "₹3,000 / Year",
      coverage: "Vehicle damage and accident coverage",
      duration: "1 Year",
      benefits: [
        "Accident protection",
        "Vehicle damage coverage",
        "Financial protection for vehicles"
      ]
    }
  };

  const policy = policies[id];

  if (!policy) {
    return (
      <div className="policy-details">
        <h2>Policy Not Found</h2>
        <button onClick={() => navigate("/policies")}>
          Back to Policies
        </button>
      </div>
    );
  }

  return (
    <div className="policy-details">
      <h1>{policy.name}</h1>

      <p>{policy.description}</p>

      <h3>Policy Information</h3>

      <p>
        <strong>Premium:</strong> {policy.premium}
      </p>

      <p>
        <strong>Coverage:</strong> {policy.coverage}
      </p>

      <p>
        <strong>Duration:</strong> {policy.duration}
      </p>

      <h3>Benefits</h3>

      <ul>
        {policy.benefits.map((benefit, index) => (
          <li key={index}>{benefit}</li>
        ))}
      </ul>

      <button onClick={() => navigate("/policies")}>
        Back to Policies
      </button>
    </div>
  );
}

export default PolicyDetails;
