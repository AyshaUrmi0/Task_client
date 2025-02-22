import axios from "axios";
import { format } from "date-fns";
import React, { useState } from "react";
import Swal from "sweetalert2";
import ButtonLoading from "./ButtonLoading";
import toast from "react-hot-toast";

const ViewAllTaskCard = ({ task, refetch }) => {
  const [selectCategory, setSelectCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const { _id, title, description, category, date } = task;
  const [isOpen, setIsOpen] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Open modal and reset fields for the selected task
  const openModal = () => {
    setIsOpen(true);
  };

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

  const handleEdit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const formData = new FormData(e.target);
    const title = formData.get("title");
    const description = formData.get("description");
    const editedTask = { title, description, selectCategory };
    if (category === selectCategory) {
      toast.error(`The category is already set to ${selectCategory}.`);
      setLoading(false);
      return;
    }
    const { data } = await axios.patch(
      `${import.meta.env.VITE_API_URL}/task/${_id}`,
      editedTask
    );
    console.log(data);
    if (data.modifiedCount > 0) {
      Swal.fire({
        title: "Updated!",
        text: "Your task has been updated.",
        icon: "success",
      });
      refetch();
      setIsOpen(false);
      setLoading(false);
      setSelectCategory("");
    }
  };

  // Function to truncate the description
  const truncateDescription = (desc, length) => {
    if (desc.length <= length) return desc;
    return desc.slice(0, length) + "...";
  };

  return (
    <>
      {/* Task Card */}
      <div
        className={`card ${category === "To-Do" && "bg-red-50"} ${
          category === "In Progress" && "bg-yellow-50"
        } ${
          category === "Done" && "bg-green-50"
        } bg-base-100 shadow-xl flex flex-col h-[300px]`}
      >
        <div className="card-body flex flex-col flex-grow">
          <h2 className="card-title">{title}</h2>
          {/* Show truncated or full description based on state */}
          <p>
            {showFullDescription
              ? description
              : truncateDescription(description, 50)}
            {/* Toggle the text */}
            {description.length > 50 && (
              <button
                className="text-blue-500 ml-2"
                onClick={() => setShowFullDescription((prev) => !prev)}
              >
                {showFullDescription ? "See less" : "See more"}
              </button>
            )}
          </p>
          <p>{category}</p>
          <p>{format(new Date(date), "dd MMM yyyy")}</p>

          {/* This div will push the buttons to the bottom */}
          <div className="flex-grow"></div>

          <div className="card-actions justify-end">
            <button
              className="btn font-semibold text-base bg-purple-600 hover:bg-purple-700 text-white"
              onClick={openModal}
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(_id)}
              className="btn font-semibold text-base bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Modal (placed outside the card to avoid overlap issues) */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4 text-center text-purple-700">
              Edit Task
            </h2>

            {/* Form Starts Here */}
            <form onSubmit={handleEdit}>
              {/* Title Input */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  type="text"
                  name="title"
                  className="w-full p-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2"
                  value={title}
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
                  className="textarea textarea-bordered w-full p-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2 "
                  value={description}
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
                  className="select select-bordered w-full p-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2"
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
                  <ButtonLoading></ButtonLoading>
                ) : (
                  <button
                    type="submit"
                    className="btn font-semibold text-base bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Save
                  </button>
                )}
                <button
                  type="button"
                  className="btn font-semibold text-base bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => {
                    setIsOpen(false);
                    setSelectCategory("");
                  }}
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
