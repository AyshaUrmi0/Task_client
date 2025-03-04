import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  User, Mail, Calendar, Edit, Camera, Shield, 
  CheckCircle, Clock, ListTodo, Package
} from "lucide-react";
import useAuth from "../hooks/useAuth";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Mock data - replace with actual data from your backend
  const taskStats = {
    total: 12,
    completed: 5,
    inProgress: 4,
    todo: 3
  };
  
  const recentTasks = [
    {
      id: "task-001",
      title: "Complete project proposal",
      date: "2024-05-15",
      status: "In Progress",
      priority: "High"
    },
    {
      id: "task-002",
      title: "Review team documentation",
      date: "2024-05-14",
      status: "To-Do",
      priority: "Medium"
    },
    {
      id: "task-003",
      title: "Submit quarterly report",
      date: "2024-05-10",
      status: "Done",
      priority: "High"
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case "Done": return "bg-green-100 text-green-800";
      case "In Progress": return "bg-yellow-100 text-yellow-800";
      case "To-Do": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-orange-100 text-orange-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen px-4 pt-24 pb-12 bg-gradient-to-br from-purple-50 to-indigo-50 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mb-8 overflow-hidden bg-white shadow-lg rounded-2xl"
        >
          <div className="absolute top-0 w-full h-32 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
          <div className="relative px-6 pt-16 pb-6">
            <div className="flex flex-col items-center -mt-12 sm:flex-row sm:items-end sm:space-x-6">
              <div className="relative group">
                <div className="absolute transition-all rounded-full -inset-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 blur group-hover:blur-md"></div>
                <div className="relative">
                  <img
                    src={user?.photoURL || "https://i.ibb.co.com/5jL18Qz/avater.webp"}
                    alt={user?.displayName || "User"}
                    className="object-cover w-24 h-24 border-4 border-white rounded-full"
                    referrerPolicy="no-referrer"
                  />
                  <button className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100 transition-colors">
                    <Camera className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
              <div className="flex-1 mt-6 text-center sm:mt-0 sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{user?.displayName || "User Name"}</h1>
                    <div className="flex flex-wrap gap-4 mt-2">
                      <div className="flex items-center text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        {user?.email || "user@example.com"}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        Joined {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : "Recently"}
                      </div>
                    </div>
                  </div>
                  <button 
                    className="flex items-center px-4 py-2 mt-4 space-x-2 text-purple-600 transition-colors bg-white border border-purple-200 rounded-lg sm:mt-0 hover:bg-purple-50"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Profile Tabs */}
          <div className="border-t border-gray-100">
            <div className="flex overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === "overview"
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("tasks")}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === "tasks"
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Tasks
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === "settings"
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Settings
              </button>
            </div>
          </div>
        </motion.div>

        {/* Profile Content */}
        <div className="space-y-6">
          {activeTab === "overview" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="flex items-center p-6 space-x-4 bg-white shadow-sm rounded-xl">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Completed Tasks</p>
                    <h3 className="text-2xl font-bold text-gray-900">{taskStats.completed}</h3>
                  </div>
                </div>
                
                <div className="flex items-center p-6 space-x-4 bg-white shadow-sm rounded-xl">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">In Progress</p>
                    <h3 className="text-2xl font-bold text-gray-900">{taskStats.inProgress}</h3>
                  </div>
                </div>
                
                <div className="flex items-center p-6 space-x-4 bg-white shadow-sm rounded-xl">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <ListTodo className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">To-Do</p>
                    <h3 className="text-2xl font-bold text-gray-900">{taskStats.todo}</h3>
                  </div>
                </div>
              </div>
              
              {/* Recent Tasks */}
              <div className="overflow-hidden bg-white shadow-sm rounded-xl">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">Recent Tasks</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {recentTasks.map((task) => (
                    <div key={task.id} className="p-6 transition-colors hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-lg bg-purple-50">
                            <Package className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{task.title}</h4>
                            <p className="text-sm text-gray-500">{task.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2.5 py-0.5 text-xs rounded-full ${getStatusColor(task.status)}`}>
                            {task.status}
                          </span>
                          <span className={`px-2.5 py-0.5 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                  <button 
                    onClick={() => navigate('/add-task')}
                    className="text-sm font-medium text-purple-600 hover:text-purple-700"
                  >
                    Add New Task
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "tasks" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="p-6 bg-white shadow-sm rounded-xl"
            >
              <h3 className="mb-4 text-lg font-semibold text-gray-900">All Tasks</h3>
              <p className="text-gray-500">
                View and manage all your tasks here. This section would display a complete list of your tasks with filtering and sorting options.
              </p>
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 mt-4 text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700"
              >
                Go to Task Board
              </button>
            </motion.div>
          )}

          {activeTab === "settings" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="p-6 bg-white shadow-sm rounded-xl"
            >
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Account Settings</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Display Name</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      defaultValue={user?.displayName || ""}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      value={user?.email || ""}
                      disabled
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Profile Picture URL</label>
                  <input 
                    type="url" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    defaultValue={user?.photoURL || ""}
                    placeholder="https://example.com/your-photo.jpg"
                  />
                </div>
                
                <div className="pt-4">
                  <button className="px-4 py-2 text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700">
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;