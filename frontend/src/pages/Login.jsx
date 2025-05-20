import { Alert, Button, Card, Input } from "@mui/material";
import { Lock, LogIn, Mail, UserCheck, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    const [isLogin, setIsLogin] = useState(true);
    const [form, setForm] = useState({
        name: "",
        email: "",
        username: "",
        password: "",
    });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        const checkAuth = async () => {
            const response = await fetch(`${apiUrl}/api/me`, {
                credentials: "include",
            });
            if (response.ok) {
                navigate("/dashboard", { replace: true });
            }
        };
        checkAuth();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        try {
            if (isLogin) {
                // Login logic
                const response = await fetch(`${apiUrl}/api/login`, {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        username: form.username,
                        password: form.password,
                    }),
                });
                const data = await response.json();
                if (response.ok) {
                    setMessage("Login successful!");
                    setTimeout(() => {
                        navigate("/dashboard");
                    }, 1000);
                } else {
                    setMessage(data.message || "Login failed.");
                }
            } else {
                // Register logic
                const response = await fetch(`${apiUrl}/api/register`, {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        username: form.username,
                        email: form.email,
                        password: form.password,
                    }),
                });
                const data = await response.json();
                if (response.ok) {
                    setMessage("Registration successful! You can now log in.");
                    setTimeout(() => {
                        setIsLogin(true);
                        setMessage("");
                    }, 1500);
                } else {
                    setMessage(data.message || "Registration failed.");
                }
            }
        } catch (err) {
            setMessage("Network error.");
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                padding: "1rem",
            }}
        >
            <Card
                sx={{
                    maxWidth: 400,
                    width: "100%",
                    padding: "2rem",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.25)",
                }}
            >
                <div style={{ display: "flex", marginBottom: "1rem" }}>
                    <Button
                        startIcon={<LogIn />}
                        variant={isLogin ? "contained" : "outlined"}
                        onClick={() => setIsLogin(true)}
                        sx={{ flex: 1, marginRight: "0.25rem" }}
                    >
                        Login
                    </Button>
                    <Button
                        startIcon={<UserPlus />}
                        variant={!isLogin ? "contained" : "outlined"}
                        onClick={() => setIsLogin(false)}
                        sx={{ flex: 1, marginLeft: "0.25rem" }}
                    >
                        Register
                    </Button>
                </div>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {!isLogin && (
                        <>
                            <InputLabelWithIcon label="Email" icon={<Mail />} htmlFor="email" />
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                placeholder="you@example.com"
                                sx={{
                                    paddingLeft: 3,
                                    "& input": { paddingLeft: "1.5rem" },
                                }}
                                startAdornment={<Mail size={16} style={{ marginRight: 8, color: "#666" }} />}
                            />
                        </>
                    )}

                    <InputLabelWithIcon label="Username" icon={<UserCheck />} htmlFor="username" />
                    <Input
                        id="username"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        required
                        placeholder="Username"
                        sx={{
                            paddingLeft: 3,
                            "& input": { paddingLeft: "1.5rem" },
                        }}
                        startAdornment={<UserCheck size={16} style={{ marginRight: 8, color: "#666" }} />}
                    />
                    <InputLabelWithIcon label="Password" icon={<Lock />} htmlFor="password" />
                    <Input
                        id="password"
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        placeholder="Password"
                        sx={{
                            paddingLeft: 3,
                            "& input": { paddingLeft: "1.5rem" },
                        }}
                        startAdornment={<Lock size={16} style={{ marginRight: 8, color: "#666" }} />}
                    />
                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                        {isLogin ? "Login" : "Register"}
                    </Button>
                </form>
                {message && (
                    <Alert severity={message.includes("successful") ? "success" : "error"} sx={{ mt: 2 }}>
                        {message}
                    </Alert>
                )}
            </Card>
        </div>
    );
}

// Helper component for input labels with icons
function InputLabelWithIcon({ label, icon, htmlFor }) {
    return (
        <label
            htmlFor={htmlFor}
            style={{
                display: "flex",
                alignItems: "center",
                fontWeight: 600,
                marginBottom: 4,
                color: "#333",
            }}
        >
            {icon}
            <span style={{ marginLeft: 6 }}>{label}</span>
        </label>
    );
}

