import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, FormControl, InputLabel, Input, FormHelperText } from "@mui/material";
import UserFormPopup from "./UserFormPopUp";
import "./UserListPage.css";
import ConfirmDialog from "./ConfirmPopup";
const UserListPage = () => {
    const [users, setUsers] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [popupOpen, setPopupOpen] = useState(false);

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage]);

    const fetchUsers = (page = 1) => {
        axios
            .get(`https://reqres.in/api/users?page=${page}`)
            .then((res) => setUsers(res.data.data))
            .catch((err) => console.log("Error fetching users:", err));
    };

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
            axios
                .put(`https://reqres.in/api/users/${selectedUser.id}`, formData, {
                    headers: {
                        "x-api-key": "reqres-free-v1",
                    },
                })
                .then(() => {
                    setUsers(
                        users.map((u) =>
                            u.id === selectedUser.id ? { ...u, ...formData } : u
                        )
                    );
                })
                .catch((err) => console.log("Error updating user:", err));
        } else {
            console.log(formData,"formdata")
            
            axios
                .post("https://reqres.in/api/users", formData, {
                    headers: {
                        "x-api-key": "reqres-free-v1",
                    },
                })
                .then((res) => {
                    console.log(res,"res")
                    const newUser = { id: Date.now(), ...formData };
                    setUsers([...users, newUser]);
                })
                .catch((err) => console.log("Error creating user:", err));
        }

        handleClosePopup();
    };

    const handleConfirmDelete = () => {
        if (selectedUser) {
            axios
                .delete(`https://reqres.in/api/users/${selectedUser}`, {
                    headers: {
                        "x-api-key": "reqres-free-v1",
                    },
                })
                .then(() => {
                    setUsers(users.filter((u) => u.id !== selectedUser));
                    handleCloseDialog();
                })
                .catch((err) => console.log("Error deleting user:", err));
        }
    };

    const filteredUsers = users.filter((user) =>
        `${user.first_name} ${user.last_name}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );


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
                            <div className="flex1">
                                <input
                                    type="text"
                                    placeholder="Input search text"
                                    className="border px-4 py-2 rounded w-full md:w-64 inputfield"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />

                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() => handleOpenPopup()}
                                >
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
                                    <th className="py-2 px-4 border border-gray-300">
                                        First Name
                                    </th>
                                    <th className="py-2 px-4 border border-gray-300">
                                        Last Name
                                    </th>
                                    <th className="py-2 px-4 border border-gray-300">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentUsers.map((user) => (
                                    <tr key={user.id} className="table-row-style">
                                        <td className="py-2 px-4 border border-gray-300">
                                            <img
                                                src={user.avatar || "https://via.placeholder.com/40"}
                                                alt={user.first_name}
                                                className="w-10 h-10 rounded-full object-cover mx-auto image"
                                            />
                                        </td>
                                        <td className="py-2 px-4 border border-gray-300">
                                            {user.email}
                                        </td>
                                        <td className="py-2 px-4 border border-gray-300">
                                            {user.first_name}
                                        </td>
                                        <td className="py-2 px-4 border border-gray-300">
                                            {user.last_name}
                                        </td>
                                        <td className="py-2 px-4 border border-gray-300">
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    gap: "10px",
                                                }}
                                            >
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    onClick={() => handleOpenPopup(user)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    size="small"
                                                    onClick={() => handleOpenDialog(user.id)}
                                                >
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

            {/* 🔹 Pagination */}
            <div className="pagination">
                {currentPage > 1 && (
                    <button
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                        className="px-3 py-1 border rounded bg-white"
                    >
                        ←
                    </button>
                )}
                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        style={{
                            backgroundColor: currentPage === i + 1 ? "blue" : "white",
                            color: currentPage === i + 1 ? "white" : "black",
                            border: "1px solid gray",
                        }}
                    >
                        {i + 1}
                    </button>
                ))}
                {currentPage < totalPages && (
                    <button
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                        className="px-3 py-1 border rounded bg-white"
                    >
                        →
                    </button>
                )}
            </div>

            <UserFormPopup
                open={popupOpen}
                onClose={handleClosePopup}
                user={selectedUser}
                onSave={handleSave}
            />
            <ConfirmDialog
                open={openDialog}
                onClose={handleCloseDialog}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
};

export default UserListPage;
