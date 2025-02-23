import axios from "axios";
import { format } from "date-fns";
import React, { useState } from "react";
import Swal from "sweetalert2";
import ButtonLoading from "./ButtonLoading";
import toast from "react-hot-toast";
import { Clock, CheckCircle2, AlertCircle, Pencil, Trash2, ChevronRight } from 'lucide-react';

const ViewAllTaskCard = ({ task, refetch }) => {
  const { _id, title, description, category, date } = task;
  const [isOpen, setIsOpen] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [selectCategory, setSelectCategory] = useState("");
  const [loading, setLoading] = useState(false);

  // Open modal and set task details
  const openModal = () => {
    setIsOpen(true);
    setSelectCategory(category);
    setEditTitle(title);
    setEditDescription(description);
  };

  // Handle delete task
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { data } = await axios.delete(
          `${import.meta.env.VITE_API_URL}/task/${id}`
        );
        if (data.deletedCount > 0) {
          Swal.fire({
            title: "Deleted!",
            text: "Your task has been deleted.",
            icon: "success",
          });
          refetch();
        }
      }
    });
  };

  // Handle edit task
  const handleEdit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!selectCategory) {
      toast.error("Please select a category.");
      setLoading(false);
      return;
    }

    const editedTask = {
      title: editTitle,
      description: editDescription,
      category: selectCategory,
    };

    try {
      const { data } = await axios.patch(
        `${import.meta.env.VITE_API_URL}/task/${_id}`,
        editedTask
      );

      if (data.modifiedCount > 0) {
        Swal.fire({
          title: "Updated!",
          text: "Your task has been updated.",
          icon: "success",
        });
        refetch();
        setIsOpen(false);
      }
    } catch (error) {
      toast.error("An error occurred while updating the task.");
    }
    setLoading(false);
  };

  // Function to truncate description text
  const truncateDescription = (desc = "", length) => {
    if (desc.length <= length) return desc;
    return desc.slice(0, length) + "...";
  };

  // Function to get category styles
  const getCategoryStyles = () => {
    switch (category) {
      case "To-Do":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          text: "text-red-700",
          icon: <AlertCircle className="w-5 h-5 text-red-500" />,
        };
      case "In Progress":
        return {
          bg: "bg-yellow-50",
          border: "border-yellow-200",
          text: "text-yellow-700",
          icon: <Clock className="w-5 h-5 text-yellow-500" />,
        };
      case "Done":
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          text: "text-green-700",
          icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
        };
      default:
        return {
          bg: "bg-gray-50",
          border: "border-gray-200",
          text: "text-gray-700",
          icon: null,
        };
    }
  };

  const categoryStyles = getCategoryStyles();

  return (
    <>
      {/* Task Card */}
      <div className={`rounded-xl border ${categoryStyles.border} shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1`}>
        <div className={`${categoryStyles.bg} p-6`}>
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              {categoryStyles.icon}
              <span className={`text-sm font-medium ${categoryStyles.text} px-3 py-1 rounded-full bg-white bg-opacity-50`}>
                {category}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              {format(new Date(date), "MMM dd, yyyy")}
            </span>
          </div>

          {/* Content */}
          <h2 className="mb-3 text-xl font-bold text-gray-800">{title}</h2>
          <div className="mb-4 text-gray-600">
            {showFullDescription ? (
              description || "No description available"
            ) : (
              truncateDescription(description || "", 100)
            )}
            {description && description.length > 100 && (
              <button
                className="inline-flex items-center ml-2 font-medium text-purple-600 hover:text-purple-700"
                onClick={() => setShowFullDescription((prev) => !prev)}
              >
                {showFullDescription ? "Show less" : "Show more"}
                <ChevronRight className={`w-4 h-4 ml-1 transform transition-transform ${showFullDescription ? 'rotate-90' : ''}`} />
              </button>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end mt-4 space-x-2">
            <button
              onClick={openModal}
              className="inline-flex items-center px-4 py-2 text-white transition-colors duration-200 bg-purple-600 rounded-lg hover:bg-purple-700"
            >
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </button>
            <button
              onClick={() => handleDelete(_id)}
              className="inline-flex items-center px-4 py-2 text-white transition-colors duration-200 bg-red-500 rounded-lg hover:bg-red-600"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-[32rem] max-w-[90vw] transform transition-all">
            <div className="p-6">
              <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
                Edit Task
              </h2>

              {/* Edit Form */}
              <form onSubmit={handleEdit} className="space-y-4">
                {/* Title Input */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    className="w-full px-4 py-2 transition-all duration-200 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring focus:ring-purple-200"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    required
                  />
                </div>

                {/* Description Textarea */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:ring focus:ring-purple-200 transition-all duration-200 min-h-[120px]"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    required
                  ></textarea>
                </div>

                {/* Category Dropdown */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    name="category"
                    className="w-full px-4 py-2 transition-all duration-200 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring focus:ring-purple-200"
                    value={selectCategory}
                    onChange={(e) => setSelectCategory(e.target.value)}
                    required
                  >
                    <option value="" disabled>Select a category</option>
                    <option value="To-Do">To-Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                </div>

                {/* Buttons */}
                <div className="flex justify-end mt-6 space-x-3">
                  <button
                    type="button"
                    className="px-6 py-2 text-gray-700 transition-colors duration-200 bg-gray-100 rounded-lg hover:bg-gray-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </button>
                  {loading ? (
                    <ButtonLoading />
                  ) : (
                    <button
                      type="submit"
                      className="px-6 py-2 text-white transition-colors duration-200 bg-purple-600 rounded-lg hover:bg-purple-700"
                    >
                      Save Changes
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewAllTaskCard;