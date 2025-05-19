import { FileText, Folder, Home, LogOut, Settings, User } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Upload from "../pages/Upload"

export default function Dashboard() {
    const apiUrl = import.meta.env.VITE_API_URL
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/me`, {
                    credentials: "include", // Important for cookie-based auth
                })
                if (response.ok) {
                    const data = await response.json()
                    setUser(data)
                } else {
                    navigate("/login", { replace: true })
                }
            } catch (error) {
                navigate("/login", { replace: true })
            } finally {
                setLoading(false)
            }
        }
        fetchUser()
    }, [navigate, apiUrl])

    const handleLogout = () => {
        // Add your logout logic here
        navigate("/login", { replace: true })
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-t-blue-600 border-b-blue-600 border-l-gray-200 border-r-gray-200 rounded-full animate-spin"></div>
                    <p className="mt-4 text-lg font-medium text-gray-700">Loading dashboard...</p>
                </div>
            </div>
        )
    }

    if (!user) {
        return null // Or a fallback UI
    }

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div className={`${sidebarOpen ? "w-64" : "w-20"} bg-white shadow-lg transition-all duration-300 flex flex-col`}>
                <div className="p-4 border-b flex items-center justify-between">
                    <h1 className={`font-bold text-blue-600 ${sidebarOpen ? "text-xl" : "hidden"}`}>FileManager</h1>
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-md hover:bg-gray-100">
                        {sidebarOpen ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                    fillRule="evenodd"
                                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                    fillRule="evenodd"
                                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        )}
                    </button>
                </div>

                <nav className="flex-1 pt-4">
                    <SidebarItem icon={<Home size={20} />} text="Dashboard" active={true} collapsed={!sidebarOpen} />
                    <SidebarItem
                        icon={<FileText size={20} />}
                        text="Files"
                        onClick={() => navigate("/files")}
                        collapsed={!sidebarOpen}
                    />
                    <SidebarItem icon={<Folder size={20} />} text="Upload" collapsed={!sidebarOpen} />
                    <SidebarItem icon={<User size={20} />} text="Profile" collapsed={!sidebarOpen} />
                    <SidebarItem icon={<Settings size={20} />} text="Settings" collapsed={!sidebarOpen} />
                </nav>

                <div className="border-t p-4">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-gray-600 rounded-md hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                        <LogOut size={20} />
                        {sidebarOpen && <span className="ml-3">Logout</span>}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <header className="bg-white shadow-sm">
                    <div className="px-6 py-4">
                        <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
                    </div>
                </header>

                <main className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        {/* User Profile Card */}
                        <div className="bg-white rounded-lg shadow-md p-6 col-span-1">
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="bg-blue-100 rounded-full p-3">
                                    <User size={24} className="text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">{user.username}</h3>
                                    <p className="text-gray-500 text-sm">{user.email}</p>
                                </div>
                            </div>
                            <div className="border-t pt-4 mt-2">
                                <div className="flex justify-between py-2">
                                    <span className="text-gray-600">User ID:</span>
                                    <span className="font-medium">{user.id}</span>
                                </div>
                                <button className="mt-4 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md transition">
                                    Edit Profile
                                </button>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-white rounded-lg shadow-md p-6 col-span-2">
                            <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-blue-50 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-500">Total Files</p>
                                            <p className="text-2xl font-bold text-blue-600">24</p>
                                        </div>
                                        <FileText size={24} className="text-blue-500" />
                                    </div>
                                </div>
                                <div className="bg-green-50 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-500">Storage Used</p>
                                            <p className="text-2xl font-bold text-green-600">45 MB</p>
                                        </div>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 text-green-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Upload Component */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h3 className="text-lg font-semibold mb-4">Upload Files</h3>
                        <Upload />
                    </div>

                    {/* View Files Button */}
                    <div className="flex justify-end">
                        <button
                            onClick={() => navigate("/files")}
                            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition shadow-md"
                        >
                            <Folder size={18} className="mr-2" />
                            View All Files
                        </button>
                    </div>
                </main>
            </div>
        </div>
    )
}

function SidebarItem({ icon, text, active = false, collapsed = false, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center w-full px-4 py-3 ${active ? "text-blue-600 bg-blue-50 border-r-4 border-blue-600" : "text-gray-600 hover:bg-gray-100"
                } transition-colors ${collapsed ? "justify-center" : ""}`}
        >
            <span>{icon}</span>
            {!collapsed && <span className="ml-3">{text}</span>}
        </button>
    )
}
