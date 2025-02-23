import React, { useState } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ButtonLoading from "./ButtonLoading";
import { motion } from "framer-motion";

import { ClipboardList, ListTodo, FileText, Send } from "lucide-react";

const AddTask = () => {
  const { user } = useAuth();
  const [category, setCategory] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmitTask = async (e) => {
    setLoading(true);
    e.preventDefault();
    const formData = new FormData(e.target);
    const title = formData.get("title");
    const description = formData.get("description");
    const email = user?.email;
    const date = new Date();
    const taskInfo = { title, category, description, email, date };
    console.log(taskInfo);
    const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/task`, {
      taskInfo,
    });
    if (data.insertedId) {
      toast.success("Task added successfully");
      navigate("/");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen px-4 py-12 bg-gradient-to-br from-purple-50 to-indigo-50 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg mx-auto"
      >
        <div className="mb-8 text-center">
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-purple-600 rounded-xl"
          >
            <ClipboardList className="w-6 h-6 text-white" />
          </motion.div>
          <h2 className="mb-2 text-3xl font-bold text-gray-900">Add New Task</h2>
          <div className="w-20 h-1 mx-auto bg-purple-600 rounded-full" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-8"
        >
          <form onSubmit={handleSubmitTask} className="space-y-6">
            <div>
              <label className="flex items-center block mb-2 text-sm font-medium text-gray-700">
                <ListTodo className="w-4 h-4 mr-2 text-purple-600" />
                Title
              </label>
              <input
                type="text"
                name="title"
                placeholder="Enter task title"
                className="w-full px-4 py-3 transition-all duration-200 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Category
              </label>
              <div className="relative">
                <select
                  className="w-full px-4 py-3 transition-all duration-200 border border-gray-200 appearance-none rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                  name="category"
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="" disabled selected>
                    Select a category
                  </option>
                  <option value="To-Do">To-Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
                <div className="absolute transform -translate-y-1/2 pointer-events-none right-3 top-1/2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="flex items-center block mb-2 text-sm font-medium text-gray-700">
                <FileText className="w-4 h-4 mr-2 text-purple-600" />
                Description
              </label>
              <textarea
                name="description"
                placeholder="Enter task description"
                rows="4"
                className="w-full px-4 py-3 transition-all duration-200 border border-gray-200 resize-none rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                required
              ></textarea>
            </div>

            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {loading ? (
                <ButtonLoading width="w-full" />
              ) : (
                <button
                  type="submit"
                  className="flex items-center justify-center w-full px-4 py-3 space-x-2 font-medium text-white transition-all duration-200 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  <Send className="w-5 h-5" />
                  <span>Add Task</span>
                </button>
              )}
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AddTask;