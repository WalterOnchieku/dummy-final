import React, { useState, useEffect } from "react";

const UserTable = () => {
    const [users, setUsers] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage]);

    const fetchUsers = (page = 1) => {
        fetch(`http://127.0.0.1:5000/users?page=${page}&per_page=5`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                return response.json();
            })
            .then((data) => {
                setUsers(data.users);
                setTotalPages(data.pages);
                setError(null); // Clear any previous error
            })
            .catch((error) => setError('Fetch error: ' + error.message));
    };

    const deleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) {
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:5000/users/${userId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setUsers(users.filter((user) => user.id !== userId));
                setMessage('User deleted successfully');
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Failed to delete user');
            }
        } catch (error) {
            setError('An error occurred while deleting the user');
        }
    };

    const handleCreateAdmin = (e) => {
        e.preventDefault();

        fetch('http://127.0.0.1:5000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                email,
                password,
                role: 'admin'
            }),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to create admin user');
            }
            return response.json();
        })
        .then(() => {
            setMessage('Admin user created successfully!');
            fetchUsers(currentPage); // Refresh user table
            setName('');
            setEmail('');
            setPassword('');
            setError(null); // Clear any previous error
        })
        .catch((error) => {
            setError('Error creating admin user: ' + error.message);
        });
    };

    return (
        <div>
            <h1>Create Admin User</h1>
            <form onSubmit={handleCreateAdmin}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Create Admin</button>
            </form>

            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <h1>User Table</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                <button onClick={() => deleteUser(user.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div>
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span> Page {currentPage} of {totalPages} </span>
                <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default UserTable;
