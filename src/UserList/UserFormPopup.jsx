import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
import { MdClose } from "react-icons/md";
const UserFormPopup = ({ open, onClose, user, onSave }) => {
    const [formData, setFormData] = useState({ first_name: "", last_name: "", email: "", avatar: "" });
    const [errors, setErrors] = useState({
        first_name: "",
        last_name: "",
        email: "",
        avatar: "",
    });
    const validate = () => {
        let tempErrors = { first_name: "", last_name: "", email: "", avatar: "" };
        let isValid = true;

        if (!formData.first_name) {
            tempErrors.first_name = "First name is required";
            isValid = false;
        }

        if (!formData.last_name) {
            tempErrors.last_name = "Last name is required";
            isValid = false;
        }

        if (!formData.email) {
            tempErrors.email = "Email is required";
            isValid = false;
        }
        if (!formData.avatar) {
            tempErrors.avatar = "avatar is required";
            isValid = false;
        }
        else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            tempErrors.email = "Email is not valid";
            isValid = false;
        }

        setErrors(tempErrors);
        return isValid;
    };

    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name || "",
                last_name: user.last_name || "",
                email: user.email || "",
                avatar: user.avatar || "",
            });
        } else {
            setFormData({ first_name: "", last_name: "", email: "", avatar: "" });
            setErrors({ first_name: "", last_name: "", email: "", avatar: "" }); 
        }
    }, [user, open]);


    const handleSave = () => {
        if (validate()) {
            onSave(formData);
            onClose();
            setFormData({ first_name: "", last_name: "", email: "", avatar: "" });
            setErrors({ first_name: "", last_name: "", email: "", avatar: "" });
        }
    };


    return (
        <Dialog open={open} onClose={onClose}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 25px 0px 0px" }}>
                <DialogTitle style={{ fontWeight: 'bold' }}>{user ? "Edit User" : "Create User"}</DialogTitle>
                <MdClose size={24} onClick={onClose} style={{ cursor: "pointer" }} />
            </div>
            <DialogContent className="space-y-2">
                <TextField
                    label="First Name"
                    fullWidth
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    sx={{ mb: 2 }}
                    error={!!errors.first_name}
                    helperText={errors.first_name}
                />
                <TextField
                    label="Last Name"
                    fullWidth
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    sx={{ mb: 2 }}
                    error={!!errors.last_name}
                    helperText={errors.last_name}
                />
                <TextField
                    label="Email"
                    fullWidth
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    sx={{ mb: 2 }}
                    error={!!errors.email}
                    helperText={errors.email}
                />
                <TextField
                    label="Profile Image URL"
                    fullWidth
                    value={formData.avatar}
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                    sx={{ mb: 2 }}
                    error={!!errors.avatar}
                    helperText={errors.avatar}
                />
            </DialogContent>
            <DialogActions style={{ padding: "0px 25px 20px 20px" }}>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={handleSave}>
                    {user ? "Save Changes" : "Create"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UserFormPopup;
