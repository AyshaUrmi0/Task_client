import React, { useState } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ButtonLoading from "./ButtonLoading";

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
      toast.success("Task dded successfully");
      navigate("/");
    }
    setLoading(false);
  };

  return (
    <>
      <h2 className="text-center text-3xl font-bold  text-purple-700">
        Add Task
      </h2>
      <div className="flex justify-center">
        <div className="card bg-base-100 w-full max-w-sm shrink-0 border border-purple-600">
          <form onSubmit={handleSubmitTask} className="card-body">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Title</span>
              </label>
              <input
                type="text"
                name="title"
                placeholder="title"
                className="w-full p-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Category</span>
              </label>
              <select
                className="select select-bordered w-full  border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2"
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
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                name="description"
                placeholder="Description"
                className="textarea textarea-bordered w-full p-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2"
                required
              ></textarea>
            </div>
            <div className="form-control mt-6">
              {loading ? (
                <ButtonLoading width="w-full"></ButtonLoading>
              ) : (
                <button className="btn font-semibold text-base bg-purple-600 hover:bg-purple-700 text-white">
                  Add Task
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddTask;
