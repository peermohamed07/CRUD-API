import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import TextField from "@mui/material/TextField";
import "./LoginPage.css";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        if (email !== "eve.holt@reqres.in" || password !== "cityslicka") {
            setError("Invalid email or password!");
            return; 
        }

        try {
            const res = await axios.post(
                "https://reqres.in/api/login",
                { email, password }, {
                headers: {
                    "x-api-key": "reqres-free-v1",
                },
            }
            );

            if (res.data.token) {
                if (remember) {
                    localStorage.setItem("token", res.data.token);
                } else {
                    sessionStorage.setItem("token", res.data.token);
                }
                navigate("/users");
            }
        } catch (err) {
            setError("Something went wrong. Please try again!");
        }
    };


    return (
        <div className="login-container">
            <div className="login-card">
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <FaUser className="input-icon" />
                        <TextField
                            fullWidth
                            label="Email"
                            variant="outlined"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            InputLabelProps={{
                                style: { marginLeft: "20px" },
                            }}
                            InputProps={{
                                style: { paddingLeft: "25px" },
                            }}
                        />
                    </div>

                    <div className="input-group">
                        <FaLock className="input-icon" />
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            variant="outlined"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            InputLabelProps={{
                                style: { marginLeft: "20px" },
                            }}
                            InputProps={{
                                style: { paddingLeft: "35px" },
                            }}
                        />
                    </div>

                    <div className="remember-section">
                        <input
                            type="checkbox"
                            checked={remember}
                            onChange={() => setRemember(!remember)}
                        />
                        <label>Remember me</label>
                    </div>

                    {error && <p className="error-text">{error}</p>}

                    <button type="submit" className="login-button">
                        Log in
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
