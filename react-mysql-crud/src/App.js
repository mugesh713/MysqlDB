import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
    const [users, setUsers] = useState([]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [editingUser, setEditingUser] = useState(null);

    const API_URL = "http://localhost:3000/users";

    // Fetch Users
    const fetchUsers = async () => {
        const res = await axios.get(API_URL);
        setUsers(res.data);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Add User
    const addUser = async () => {
        await axios.post(API_URL, { name, email });
        setName("");
        setEmail("");
        fetchUsers();
    };

    // Update User
    const updateUser = async () => {
        await axios.put(`${API_URL}/${editingUser.id}`, { name, email });
        setName("");
        setEmail("");
        setEditingUser(null);
        fetchUsers();
    };

    // Delete User
    const deleteUser = async (id) => {
        await axios.delete(`${API_URL}/${id}`);
        fetchUsers();
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h2>CRUD App with React & MySQL</h2>

            <input
                type="text"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            {editingUser ? (
                <button onClick={updateUser}>Update User</button>
            ) : (
                <button onClick={addUser}>Add User</button>
            )}

            <h3>User List</h3>
            <table border="1" width="50%" style={{ margin: "auto" }}>
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
                                <button onClick={() => {
                                    setEditingUser(user);
                                    setName(user.name);
                                    setEmail(user.email);
                                }}>Edit</button>
                                <button onClick={() => deleteUser(user.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default App;
