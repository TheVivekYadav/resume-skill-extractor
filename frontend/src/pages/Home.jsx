import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <h1 className="text-3xl font-bold mb-6 text-indigo-700">Home Page</h1>
            <div className="flex gap-4">
                <Link
                    to="/login"
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                >
                    Login
                </Link>
                <Link
                    to="/register"
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                    Register
                </Link>
            </div>
        </div>
    );
}
