import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div className="dashboard">

      <aside className="sidebar">

        <h2>INSURE+</h2>

        <Link to="/dashboard">Dashboard</Link>
        <Link to="/customers">Customers</Link>
        <Link to="/policies">Policies</Link>
        <Link to="/claims">Claims</Link>
        <Link to="/">Logout</Link>

      </aside>

      <main className="main-content">

        <h1>Dashboard</h1>
        <p>Welcome to Insurance Management System</p>

        <div className="cards">

          <div className="card">
            <h3>Total Customers</h3>
            <h1>120</h1>
          </div>

          <div className="card">
            <h3>Active Policies</h3>
            <h1>85</h1>
          </div>

          <div className="card">
            <h3>Pending Claims</h3>
            <h1>12</h1>
          </div>

          <div className="card">
            <h3>Total Premium</h3>
            <h1>₹2,50,000</h1>
          </div>

        </div>

      </main>

    </div>
  );
}

export default Dashboard;