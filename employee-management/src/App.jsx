
import { useState, useEffect } from "react";
import "./App.css";

const API_URL = "http://localhost:5129/api/employees";

function App() {
  const [employees, setEmployees] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const emptyForm = {
    name: "",
    age: "",
    phone: "",
    email: "",
    post: "",
    salary: ""
  };

  const [form, setForm] = useState(emptyForm);

  // Load Employees from Backend
  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to load employees");
      }

      const data = await response.json();
      setEmployees(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load data when page opens
  useEffect(() => {
    loadEmployees();
  }, []);

  // Handle Form Input
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Add or Update Employee
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");

      const employeeData = {
        name: form.name,
        age: Number(form.age),
        phone: form.phone,
        email: form.email,
        post: form.post,
        salary: Number(form.salary)
      };

      let response;

      if (editId !== null) {
        response = await fetch(`${API_URL}/${editId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(employeeData)
        });
      } else {
        response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(employeeData)
        });
      }

      if (!response.ok) {
        throw new Error("Failed to save employee");
      }

      await loadEmployees();

      setForm(emptyForm);
      setEditId(null);

      alert(
        editId !== null
          ? "Employee updated successfully!"
          : "Employee added successfully!"
      );

    } catch (err) {
      setError(err.message);
    }
  };

  // Edit Employee
  const handleEdit = (employee) => {
    setEditId(employee.id);

    setForm({
      name: employee.name,
      age: String(employee.age),
      phone: employee.phone,
      email: employee.email,
      post: employee.post,
      salary: String(employee.salary)
    });
  };

  // Delete Employee
  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this employee?"
      )
    ) {
      try {
        setError("");

        const response = await fetch(`${API_URL}/${id}`, {
          method: "DELETE"
        });

        if (!response.ok) {
          throw new Error("Failed to delete employee");
        }

        await loadEmployees();

        if (editId === id) {
          handleCancel();
        }

        alert("Employee deleted successfully!");

      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Cancel Edit
  const handleCancel = () => {
    setEditId(null);
    setForm(emptyForm);
  };

  return (
    <div className="container">

      <h1>Employee Management System</h1>

      {error && (
        <p style={{ color: "red" }}>{error}</p>
      )}

      <div className="form-container">

        <h2>
          {editId !== null ? "Edit Employee" : "Add Employee"}
        </h2>

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            <input
              type="text"
              name="name"
              placeholder="Employee Name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="age"
              placeholder="Age"
              value={form.age}
              onChange={handleChange}
              required
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              maxLength={10}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="post"
              placeholder="Post / Designation"
              value={form.post}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="salary"
              placeholder="Salary"
              value={form.salary}
              onChange={handleChange}
              required
            />

          </div>

          <div className="form-buttons">

            <button type="submit" className="add-btn">
              {editId !== null
                ? "Update Employee"
                : "Add Employee"}
            </button>

            {editId !== null && (
              <button
                type="button"
                className="cancel-btn"
                onClick={handleCancel}
              >
                Cancel
              </button>
            )}

          </div>

        </form>
      </div>

      <div className="table-container">

        <h2>Employee List</h2>

        <div className="table-wrapper">

          <table>

            <thead>
              <tr>
                <th>EID</th>
                <th>Employee Name</th>
                <th>Age</th>
                <th>Ph No</th>
                <th>Email</th>
                <th>Post</th>
                <th>Salary</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {loading ? (
                <tr>
                  <td colSpan="8" className="no-data">
                    Loading Employees...
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan="8" className="no-data">
                    No Employees Found
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp.id}>

                    <td>
                      <td>{emp.id}</td>
                    </td>

                    <td>{emp.name}</td>
                    <td>{emp.age}</td>
                    <td>{emp.phone}</td>
                    <td>{emp.email}</td>
                    <td>{emp.post}</td>
                    <td>{emp.salary}</td>

                    <td className="action-buttons">

                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(emp)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(emp.id)}
                      >
                        Delete
                      </button>

                    </td>

                  </tr>
                ))
              )}

            </tbody>

          </table>

        </div>
      </div>

    </div>
  );
}

export default App;
