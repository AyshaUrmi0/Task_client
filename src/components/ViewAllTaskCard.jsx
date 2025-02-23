import axios from "axios";
import { format } from "date-fns";
import React, { useState } from "react";
import Swal from "sweetalert2";
import ButtonLoading from "./ButtonLoading";
import toast from "react-hot-toast";

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

  return (
    <>
      {/* Task Card */}
      <div
        className={`card ${category === "To-Do" && "bg-red-50"} ${
          category === "In Progress" && "bg-yellow-50"
        } ${category === "Done" && "bg-green-50"} bg-base-100 shadow-xl flex flex-col h-[300px]`}
      >
        <div className="flex flex-col flex-grow card-body">
          <h2 className="card-title">{title}</h2>
          {/* Show truncated or full description based on state */}
          <p>
  {showFullDescription
    ? description || "No description available"
    : truncateDescription(description || "", 50)}
  {description && description.length > 50 && (
    <button
      className="ml-2 text-blue-500"
      onClick={() => setShowFullDescription((prev) => !prev)}
    >
      {showFullDescription ? "See less" : "See more"}
    </button>
  )}
</p>
          <p>{category}</p>
          <p>{format(new Date(date), "dd MMM yyyy")}</p>

          {/* Push buttons to bottom */}
          <div className="flex-grow"></div>

          <div className="justify-end card-actions">
            <button
              className="text-base font-semibold text-white bg-purple-600 btn hover:bg-purple-700"
              onClick={openModal}
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(_id)}
              className="text-base font-semibold text-white bg-red-500 btn hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded-lg shadow-lg w-96">
            <h2 className="mb-4 text-xl font-bold text-center text-purple-700">
              Edit Task
            </h2>

            {/* Edit Form */}
            <form onSubmit={handleEdit}>
              {/* Title Input */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  type="text"
                  name="title"
                  className="w-full p-3 mb-2 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                />
              </div>

              {/* Description Textarea */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  name="description"
                  className="w-full p-3 mb-2 border-2 border-purple-200 rounded-lg textarea textarea-bordered focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  required
                ></textarea>
              </div>

              {/* Category Dropdown */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Category</span>
                </label>
                <select
                  name="category"
                  className="w-full p-3 mb-2 border-2 border-purple-200 rounded-lg select select-bordered focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={selectCategory}
                  onChange={(e) => setSelectCategory(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  <option value="To-Do">To-Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2 mt-4">
                {loading ? (
                  <ButtonLoading />
                ) : (
                  <button
                    type="submit"
                    className="text-base font-semibold text-white bg-purple-600 btn hover:bg-purple-700"
                  >
                    Save
                  </button>
                )}
                <button
                  type="button"
                  className="text-base font-semibold text-white bg-red-500 btn hover:bg-red-600"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewAllTaskCard;
