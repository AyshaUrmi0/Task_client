import Lottie from "lottie-react";
import login from "../../public/login.json";
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import axios from "axios";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, Key } from "lucide-react";

const LoginPage = () => {
  const { signInUser, googleLogin, setLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    signInUser(email, password)
      .then((result) => {
        console.log(result.user);
        navigate(location?.state ? location.state : "/");
        toast.success("Signed up successfully");
      })
      .catch((error) => console.log(error.message));
  };

  const handleGoogleSignUP = () => {
    googleLogin()
      .then((result) => {
        const userInfo = {
          name: result?.user?.displayName,
          email: result?.user?.email,
          userId: result?.user?.uid,
        };
        axios.post(`${import.meta.env.VITE_API_URL}/user-info`, userInfo);
        navigate(location?.state ? location.state : "/");
        toast.success("Signed up successfully");
        setLoading(false);
      })
      .catch((error) => console.log(error.message));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      <div className="flex flex-col h-screen md:flex-row">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative items-center justify-center hidden p-12 md:flex md:w-1/2"
        >
          {/* Decorative Elements */}
          <div className="absolute inset-0 opacity-50 bg-gradient-to-br from-purple-100 to-indigo-100" />
          <div className="absolute -translate-x-1/2 -translate-y-1/2 bg-purple-200 rounded-full top-1/2 left-1/2 w-96 h-96 blur-3xl opacity-20" />
          <div className="relative w-full max-w-lg">
            <Lottie animationData={login} loop={true} />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 text-center"
            >
              <h2 className="mb-4 text-3xl font-bold text-gray-800">Welcome Back!</h2>
              <p className="text-gray-600">We're excited to see you again</p>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center w-full p-8 md:w-1/2"
        >
          <div className="w-full max-w-md">
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
              <div className="mb-8 text-center">
                <motion.div
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl"
                >
                  <LogIn className="w-6 h-6 text-white" />
                </motion.div>
                <h1 className="text-2xl font-bold text-gray-900">Sign in to your account</h1>
                <p className="mt-2 text-gray-500">Enter your details below</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="flex items-center block mb-2 text-sm font-medium text-gray-700">
                    <Mail className="w-4 h-4 mr-2 text-purple-600" />
                    Email address
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="w-full px-4 py-3 transition-all duration-200 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center block mb-2 text-sm font-medium text-gray-700">
                    <Lock className="w-4 h-4 mr-2 text-purple-600" />
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    className="w-full px-4 py-3 transition-all duration-200 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                  </label>
                  <button type="button" className="flex items-center text-sm text-purple-600 hover:text-purple-500">
                    <Key className="w-4 h-4 mr-1" />
                    Forgot password?
                  </button>
                </div>

                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <button
                    type="submit"
                    className="w-full px-4 py-3 font-medium text-white transition-all duration-200 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  >
                    Sign in
                  </button>
                </motion.div>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 text-gray-500 bg-white">Or continue with</span>
                  </div>
                </div>

                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <button
                    type="button"
                    onClick={handleGoogleSignUP}
                    className="flex items-center justify-center w-full px-4 py-3 transition-all duration-200 border border-gray-200 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    <FcGoogle className="w-5 h-5 mr-2" />
                    <span>Sign in with Google</span>
                  </button>
                </motion.div>
              </form>

              <p className="mt-6 text-sm text-center text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/sign-up"
                  className="font-medium text-purple-600 transition-colors duration-200 hover:text-purple-500"
                >
                  Sign up for free
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;