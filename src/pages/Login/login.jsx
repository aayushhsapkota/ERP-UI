import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MyGif from "../../assets/auth.gif"; // replace with the actual path to your GIF file
import { login } from "../../stateManagement/slice/authSlice";
import {toast} from 'react-toastify';

const LoginForm = () => {
  const dispatch = useDispatch();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you might want to send a request to your backend.
    // If the request is successful, call onLogin
    dispatch(login({ userName, password }));
  };

  const status = useSelector((state) => state.auth.status);
  const errorMessage=useSelector((state) => state.auth.error);

  useEffect(() => {
    if (status === 'failed') {
      toast.error(errorMessage,{
        position: "bottom-center",
    autoClose: 1000,
      });
    }
  }, [status])

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8 flex-col sm:flex-row">
      <div className="sm:w-1/2 flex justify-center items-center">
        <form className="mt-0 space-y-6 w-full sm:w-96" onSubmit={handleSubmit}>
          <h2 className="mt-0 text-center text-2xl sm:text-3xl font-bold text-gray-900">
            Sign in to your account
          </h2>
          <input
          maxLength="50"
            id="username"
            name="username"
            type="text"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <input
            id="password"
            name="password"
            type="password"
            maxLength="50"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 align-items: center"
          >
            {status === "loading" ? <div className="spinner"></div> : "Sign in"}
          </button>
        </form>
      </div>
      <div className="w-full pt-4 sm:w-1/2 flex justify-center items-center">
        <img
          className="h-full w-full object-cover max-w-sm lg:max-w-lg rounded-full"
          src={MyGif}
          alt="Gif"
        />
      </div>
    </div>
  );
};

export default LoginForm;
