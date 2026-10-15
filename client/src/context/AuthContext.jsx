/* eslint-disable react-refresh/only-export-components */

import {  useEffect, useState } from "react";
import { createContext } from 'react';

import { getCurrentUser } from "@/api/AuthApi";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    /* 1 check user logged in hai ya nahi -> app load hote hii */
    useEffect(() => {
        const checkLoggedInUser = async () => {

            const token = localStorage.getItem("token");

            if(!token) {
                setLoading(false);
                return;
            }

            try {

                /* interceptor automatic add header in it  */
                const response = await getCurrentUser();

                if (response.user) {
                    setUser(response.user);

                    localStorage.setItem("user", JSON.stringify(response.user))
                }

            } catch (error) {

                console.error(
                    "Session verification failed:", 
                    error.response?.data?.message
                );

                // Invalid/expired token
                localStorage.removeItem("token");
                localStorage.removeItem("user");

                setUser(null);

            }  finally {
                setLoading(false);
            }

        }

        checkLoggedInUser();
    }, []);


    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            
            {!loading && children}

        </AuthContext.Provider>
    )

} 