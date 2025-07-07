import React, { createContext, useState, useEffect } from "react";
import axios from "../utils/axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("access");
      if (!token) {
        // No token, not logged in
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("/user/profile/");
        const data = response.data;

        let role = "";
        if (data.is_superuser) {
          role = "admin";
        } else if (data.groups?.some((g) => g.toLowerCase() === "manager")) {
          role = "manager";
        } else if (data.groups?.some((g) => g.toLowerCase() === "viewer")) {
          role = "viewer";
        }

        setUser({ ...data, role });
      } catch (error) {
        console.error("Failed to fetch user", error);
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};
