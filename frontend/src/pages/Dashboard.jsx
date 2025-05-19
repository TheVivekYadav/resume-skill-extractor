import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Upload from '../pages/Upload';

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch("http://localhost:3001/api/me", {
                    credentials: "include", // Important for cookie-based auth
                });
                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                } else {
                    navigate("/login", { replace: true });
                }
            } catch (error) {
                navigate("/login", { replace: true });
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [navigate]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <span className="text-gray-600 text-lg">Loading dashboard...</span>
            </div>
        );
    }

    if (!user) {
        return null; // Or a fallback UI
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
                <h1 className="text-2xl font-bold mb-6 text-indigo-700">Dashboard</h1>
                <div className="mb-4">
                    <span className="font-semibold text-gray-700">User ID:</span>
                    <span className="ml-2 text-gray-900">{user.id}</span>
                </div>
                <div className="mb-4">
                    <span className="font-semibold text-gray-700">Username:</span>
                    <span className="ml-2 text-gray-900">{user.username}</span>
                </div>
                <div className="mb-4">
                    <span className="font-semibold text-gray-700">Email:</span>
                    <span className="ml-2 text-gray-900">{user.email}</span>
                </div>
                <Upload/>
            </div>
        </div>
    );
}
