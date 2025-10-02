import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card } from "@mui/material";
import UserFormPopup from "./UserFormPopUp";
import ConfirmDialog from "./ConfirmPopup";
import "./UserListPage.css";

const UserListPage = () => {
    const [users, setUsers] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [popupOpen, setPopupOpen] = useState(false);

    // Fetch color data from the correct API endpoint
    const fetchUsers = async (page = 1) => {
        try {
            const res = await axios.get(`https://reqres.in/api/unknown?page=${page}`);
            const colorData = res.data.data;

            // Transform color data to match your user structure
            const transformedUsers = colorData.map(item => ({
                id: item.id,
                name: item.name,
                year: item.year,
                color: item.color,
                pantone_value: item.pantone_value,
                // Add placeholder fields for your table structure
                email: `${item.name.replace(/\s+/g, '').toLowerCase()}@example.com`,
                first_name: item.name.split(' ')[0] || item.name,
                last_name: item.name.split(' ')[1] || '',
                avatar: `https://via.placeholder.com/40/${item.color.replace('#', '')}/ffffff?text=${item.name.charAt(0)}`
            }));

            setUsers(transformedUsers);
        } catch (err) {
            console.log("Error fetching data:", err);
        }
    };

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage]);

    const handleOpenDialog = (id) => {
        setSelectedUser(id);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedUser(null);
    };

    const handleOpenPopup = (user = null) => {
        setSelectedUser(user);
        setPopupOpen(true);
    };

    const handleClosePopup = () => {
        setSelectedUser(null);
        setPopupOpen(false);
    };

    const handleSave = (formData) => {
        if (selectedUser) {
            // Update user
            const updatedUsers = users.map((u) =>
                u.id === selectedUser.id ? { ...u, ...formData } : u
            );
            setUsers(updatedUsers);
        } else {
            // Create new user
            const newUser = {
                id: Date.now(),
                ...formData,
                // Add default color properties for new users
                color: "#000000",
                pantone_value: "00-0000",
                year: new Date().getFullYear()
            };
            setUsers([...users, newUser]);
        }
        handleClosePopup();
    };

    const handleConfirmDelete = () => {
        if (selectedUser) {
            const filteredUsers = users.filter((u) => u.id !== selectedUser);
            setUsers(filteredUsers);
            handleCloseDialog();
        }
    };

    // Filter users based on search
    const filteredUsers = users.filter((user) =>
        `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination
    const usersPerPage = 5;
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    return (
        <div className="p-8">
            <div className="whole-card">
                <Card>
                    <div className="title-bar flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                fontSize: "24px",
                                fontWeight: "bold",
                                justifyContent: "space-between",
                                width: "100%",
                            }}
                        >
                            <div>Users</div>
                            <div className="flex1" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                <input
                                    type="text"
                                    placeholder="Input search text"
                                    className="border px-4 py-2 rounded w-full md:w-64 inputfield"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Button variant="contained" size="small" onClick={() => handleOpenPopup()}>
                                    Create User
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto table-container">
                        <table className="min-w-full bg-white border border-gray-300 text-center border-collapse table-data">
                            <thead>
                                <tr className="bg-gray-100 table-headers border-b border-gray-300">
                                    <th className="py-2 px-4 border border-gray-300">Avatar</th>
                                    <th className="py-2 px-4 border border-gray-300">Email</th>
                                    <th className="py-2 px-4 border border-gray-300">First Name</th>
                                    <th className="py-2 px-4 border border-gray-300">Last Name</th>
                                    <th className="py-2 px-4 border border-gray-300">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentUsers.map((user) => (
                                    <tr key={user.id} className="table-row-style">
                                        <td className="py-2 px-4 border border-gray-300">
                                            <img
                                                src={user.avatar}
                                                alt={user.name}
                                                className="w-10 h-10 rounded-full object-cover mx-auto image"
                                                style={{ backgroundColor: user.color }}
                                            />
                                        </td>
                                        <td className="py-2 px-4 border border-gray-300">{user.email}</td>
                                        <td className="py-2 px-4 border border-gray-300">{user.first_name}</td>
                                        <td className="py-2 px-4 border border-gray-300">{user.last_name}</td>
                                        <td className="py-2 px-4 border border-gray-300">
                                            <div
                                                style={{ display: "flex", gap: "10px", justifyContent: "left" }}
                                            >
                                                <Button variant="contained" size="small" onClick={() => handleOpenPopup(user)}>
                                                    Edit
                                                </Button>
                                                <Button variant="contained" color="error" size="small" onClick={() => handleOpenDialog(user.id)}>
                                                    Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            {/* Pagination */}
            <div className="pagination" style={{ display: "flex", justifyContent: "center", gap: "5px", marginTop: "20px" }}>
                {currentPage > 1 && (
                    <button onClick={() => setCurrentPage((prev) => prev - 1)} className="px-3 py-1 border rounded bg-white">
                        ←
                    </button>
                )}
                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className="px-3 py-1 border rounded"
                        style={{
                            backgroundColor: currentPage === i + 1 ? "blue" : "white",
                            color: currentPage === i + 1 ? "white" : "black",
                        }}
                    >
                        {i + 1}
                    </button>
                ))}
                {currentPage < totalPages && (
                    <button onClick={() => setCurrentPage((prev) => prev + 1)} className="px-3 py-1 border rounded bg-white">
                        →
                    </button>
                )}
            </div>

            <UserFormPopup open={popupOpen} onClose={handleClosePopup} user={selectedUser} onSave={handleSave} />
            <ConfirmDialog open={openDialog} onClose={handleCloseDialog} onConfirm={handleConfirmDelete} />
        </div>
    );
};

export default UserListPage;