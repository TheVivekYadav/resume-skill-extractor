import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3001/api/logout", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .finally(() => {
        localStorage.removeItem("accessToken");
        navigate("/login", { replace: true });
      });
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded shadow">
        <span className="text-gray-700 font-medium">Logging out...</span>
      </div>
    </div>
  );
};

export default Logout;
