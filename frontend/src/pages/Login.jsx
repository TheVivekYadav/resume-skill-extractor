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
        // Example: Replace this with your real auth check (API call, context, etc.)
        const checkAuth = async () => {
            // For cookie-based auth, you might call /api/me or similar
            const response = await fetch(`${apiUrl}/api/me`, {
                credentials: "include",
            });
            console.log(response)
            if (response.ok) {
                // User is authenticated
                navigate("/dashboard", { replace: true });
            }
            // else, stay on login page
        };
        checkAuth();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        // LOGIN: POST to /api/login with username and password
        try {
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
                console.log(data)
                setTimeout(() => {
                    navigate("/dashboard");
                }, 1000);
                // You can store token or redirect here
            } else {
                setMessage(data.message || "Login failed.");
            }
        } catch (err) {
            setMessage("Network error.");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-200">
            <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-8">
                <div className="flex justify-center mb-6">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`px-4 py-2 rounded-l-lg font-semibold transition ${isLogin ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"
                            }`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`px-4 py-2 rounded-r-lg font-semibold transition ${!isLogin ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"
                            }`}
                    >
                        Register
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                    {!isLogin && (
                        <>
                            <div>
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                />
                            </div>
                        </>
                    )}
                    <div>
                        <label className="block text-sm font-medium mb-1">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 bg-indigo-600 text-white rounded font-semibold hover:bg-indigo-700 transition"
                    >
                        {isLogin ? "Login" : "Register"}
                    </button>
                </form>
                {message && (
                    <div className="mt-4 text-center text-sm text-red-500">{message}</div>
                )}
            </div>
        </div>
    );
};
