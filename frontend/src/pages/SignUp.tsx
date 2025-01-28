import React, { useState } from "react";
import { APIUtility } from "../services/Api";
import { useNavigate } from "react-router-dom";

const SignUpPage: React.FC = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            name: formData.name,
            email: formData.email,
            password: formData.password
        }
        try {
            const response = await APIUtility.registerUser(payload)
            console.log(response,"Sign UP")
            alert("User Registered Successfully");
            navigate('/')
        } catch (error: any) {
            alert(error.response?.data?.message || "Sign-up failed!");
        }
    };

    const handleGoogleAuth = () => {
        window.location.href = "http://localhost:5000/api/auth/google"; // Redirect to your backend's Google OAuth endpoint
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
                <form onSubmit={handleSignUp}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                    >
                        Sign Up
                    </button>
                </form>
                <div className="mt-6">
                    <button
                        onClick={handleGoogleAuth}
                        className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
                    >
                        Sign Up with Google
                    </button>
                </div>
                <p className="text-sm text-gray-600 mt-4 text-center">
                    Already have an account?{" "}
                    <a href="/login" className="text-blue-600 hover:underline">
                        Sign In
                    </a>
                </p>
            </div>
        </div>
    );
};

export default SignUpPage;
