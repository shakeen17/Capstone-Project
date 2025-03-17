import React, { createContext, useState, useEffect } from 'react';

const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem('user')); // Get user from localStorage
        if (loggedInUser) {
            setUser(loggedInUser);
        }
    }, []);

    const login = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData)); // Save user in localStorage
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('user'); // Remove user from localStorage
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}> 
            {children} 
        </UserContext.Provider>
    ); // Makes user state available to all child components
};

export { UserProvider, UserContext };
