import { Card, CircularProgress } from "@mui/material"; // Using MUI for styled components
import { LogOut } from "lucide-react"; // Importing the LogOut icon from Lucide React
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const apiUrl = import.meta.env.VITE_API_URL
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        await fetch(`${apiUrl}/api/logout`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
      } finally {
        localStorage.removeItem("accessToken");
        navigate("/login", { replace: true });
      }
    };

    logout();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="p-6 flex items-center justify-center shadow-lg">
        <CircularProgress size={24} className="mr-2" />
        <span className="text-gray-700 font-medium flex items-center">
          <LogOut size={20} className="mr-1" />
          Logging out...
        </span>
      </Card>
    </div>
  );
};

export default Logout;
