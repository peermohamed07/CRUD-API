import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card } from "@mui/material";
import UserFormPopup from "./UserFormPopUp";
import ConfirmDialog from "./ConfirmPopup";
import "./UserListPage.css";
import { MdEdit, MdDelete } from "react-icons/md";

const UserListPage = () => {
    const [users, setUsers] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [popupOpen, setPopupOpen] = useState(false);
    const [viewMode, setViewMode] = useState("table");
    const fetchUsers = async (page = 1) => {
        try {
            const res = await axios.get(`https://reqres.in/api/unknown?page=${page}`);
            const colorData = res.data.data;

            const transformedUsers = colorData.map(item => ({
                id: item.id,
                name: item.name,
                year: item.year,
                color: item.color,
                pantone_value: item.pantone_value,
                email: `${item.name.replace(/\s+/g, '').toLowerCase()}@example.com`,
                first_name: item.name.split(' ')[0] || item.name,
                last_name: item.name.split(' ')[1] || '',
                avatar: `https://via.placeholder.com/40/${item.color.replace('#', '')}/ffffff?text=${item.name.charAt(0)}`
            }));

            const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
            setUsers([...transformedUsers, ...storedUsers]);
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
    const handleEdit = (user) => {
        console.log("Editing user:", user);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            setUsers(users.filter((u) => u.id !== id));
        }
    };

    const handleSave = (formData) => {
        if (selectedUser) {
            const updatedUsers = users.map((u) =>
                u.id === selectedUser.id ? { ...u, ...formData } : u
            );
            setUsers(updatedUsers);
            localStorage.setItem("users", JSON.stringify(updatedUsers.filter(u => u.id > 1000))); // keep only custom users
        } else {
            const newUser = {
                id: Date.now(),
                ...formData,
                color: "#000000",
                pantone_value: "00-0000",
                year: new Date().getFullYear(),
            };
            const updatedUsers = [...users, newUser];
            setUsers(updatedUsers);
            localStorage.setItem("users", JSON.stringify([...JSON.parse(localStorage.getItem("users")) || [], newUser]));
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

    const filteredUsers = users.filter((user) => {
        const fullName = `${user.first_name || ""} ${user.last_name || ""}`.toLowerCase();
        const name = (user.name || "").toLowerCase();
        return (
            fullName.includes(searchTerm.toLowerCase()) ||
            name.includes(searchTerm.toLowerCase())
        );
    });


    const usersPerPage = 5;
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    useEffect(() => {
        const storedUsers = localStorage.getItem("users");
        if (storedUsers) {
            setUsers(JSON.parse(storedUsers));
        } else {
            fetchUsers(currentPage); 
        }
    }, [currentPage]);

    useEffect(() => {
        if (users.length > 0) {
            localStorage.setItem("users", JSON.stringify(users));
        }
    }, [users]);

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

                        {/* Toggle View */}

                    </div>
                    <div style={{ display: "flex", gap: "10px", paddingLeft: "20px", marginBottom: "10px" }}>
                        <Button
                            variant={viewMode === "table" ? "contained" : "outlined"}
                            onClick={() => setViewMode("table")}
                        >
                            Table
                        </Button>
                        <Button
                            variant={viewMode === "card" ? "contained" : "outlined"}
                            onClick={() => setViewMode("card")}
                        >
                            Card
                        </Button>
                    </div>
                    {viewMode === "table" ? (
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
                                                <div style={{ display: "flex", gap: "10px", justifyContent: "left" }}>
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
                    ) : (
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(250px, auto))",
                            gap: "20px",
                            padding: "20px",
                            justifyContent: "start" 
                        }}>
                            {currentUsers.map((user) => (
                                <Card
                                    key={user.id}
                                    component="div"
                                    className="p-6 flex flex-col items-center justify-center shadow-md rounded-lg relative"
                                >
                                    <div style={{ position: "relative", width: "100%", display: "flex", justifyContent: "center", marginTop: "10px" }}>
                                        <img
                                            src={user.avatar}
                                            alt={`${user.first_name} ${user.last_name}`}
                                            style={{
                                                borderRadius: "50%",
                                                width: "60px",
                                                height: "60px",
                                                objectFit: "cover",
                                            }}
                                        />

                                        <div
                                            style={{
                                                position: "absolute",
                                                right: "10px",
                                                top: "50%",
                                                transform: "translateY(-50%)",
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: "8px",
                                            }}
                                        >
                                            <div
                                                style={{ cursor: "pointer", color: "grey", fontSize: "20px" }}
                                                onClick={() => handleOpenPopup(user)}
                                            >
                                                <MdEdit />
                                            </div>
                                            <div
                                                style={{ cursor: "pointer", color: "grey", fontSize: "20px" }}
                                                onClick={() => handleOpenDialog(user.id)}
                                            >
                                                <MdDelete />
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        style={{
                                            color: user.color,
                                            padding: "5px 10px",
                                            borderRadius: "5px",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            fontWeight: "bold",
                                            marginBottom: "10px",
                                            fontSize: "18px",
                                            marginTop: "10px",
                                        }}
                                    >
                                        {user.first_name} {user.last_name}
                                    </div>

                                    <div
                                        style={{
                                            fontSize: "14px",
                                            color: "#555",
                                            textAlign: "center",
                                            marginBottom: "10px",
                                        }}
                                    >
                                        {user.email}
                                    </div>
                                </Card>


                            ))}
                        </div>
                    )}
                </Card>
            </div>

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
                            border: "1px solid black",
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