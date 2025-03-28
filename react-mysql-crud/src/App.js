import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
    const [users, setUsers] = useState([]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");  // Error message state
    const [editingUser, setEditingUser] = useState(null);

    const API_URL = "https://mysqldb-3.onrender.com/users";

    // Fetch Users
    const fetchUsers = async () => {
        try {
            const res = await axios.get(API_URL);
            setUsers(res.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Gmail Validation Function
    const isValidGmail = (email) => {
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        return gmailRegex.test(email);
    };

    // Handle Email Input Change
    const handleEmailChange = (e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);

        if (!isValidGmail(newEmail)) {
            setError("Please enter a valid Gmail address (e.g., example@gmail.com)");
        } else {
            setError("");
        }
    };

    // Add User
    const addUser = async () => {
        if (!isValidGmail(email)) {
            setError("Invalid Gmail address!");
            return;
        }

        try {
            await axios.post(API_URL, { name, email });
            setName("");
            setEmail("");
            fetchUsers();
        } catch (error) {
            console.error("Error adding user:", error);
        }
    };

    // Update User
    const updateUser = async () => {
        if (!isValidGmail(email)) {
            setError("Invalid Gmail address!");
            return;
        }

        try {
            await axios.put(`${API_URL}/${editingUser.id}`, { name, email });
            setName("");
            setEmail("");
            setEditingUser(null);
            fetchUsers();
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    // Delete User
    const deleteUser = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            fetchUsers();
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    return (
        <div className="container">
            <h2>CRUD Operation - MySQL</h2>

            <div className="input-container">
                <input
                    type="text"
                    placeholder="Enter Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Enter Email (Gmail only)"
                    value={email}
                    onChange={handleEmailChange}
                />
                {error && <p className="error">{error}</p>} {/* Display error message */}
                
                {editingUser ? (
                    <button className="update-btn" onClick={updateUser} disabled={!!error}>Update User</button>
                ) : (
                    <button className="add-btn" onClick={addUser} disabled={!!error}>Add User</button>
                )}
            </div>

            <h3>User List</h3>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                                <button className="edit-btn" onClick={() => {
                                    setEditingUser(user);
                                    setName(user.name);
                                    setEmail(user.email);
                                }}>Edit</button>
                                <button className="delete-btn" onClick={() => deleteUser(user.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default App;
