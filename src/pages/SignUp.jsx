import React from "react";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import axios from "axios";
const SignUp = () => {
  const { signUpUser, googleLogin, updateUserProfile, setUser } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const userData = { name, email, password };
    console.log(userData);

    //signUp User
    signUpUser(email, password)
      .then((result) => {
        console.log(result.user);
        updateUserProfile(name);
        setUser({ ...result.user, displayName: name, photoURL: null });
        const userInfo = {
          name: name,
          email: result?.user?.email,
          userId: result?.user?.uid,
        };
        axios.post(`${import.meta.env.VITE_API_URL}/user-info`, userInfo);
        navigate("/");
        toast.success("sign up successfully");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  //google login
  const handleGoogleSignUP = () => {
    googleLogin()
      .then((result) => {
        console.log(result.user);
        const userInfo = {
          name: result?.user?.displayName,
          email: result?.user?.email,
          userId: result?.user?.uid,
        };
        axios.post(`${import.meta.env.VITE_API_URL}/user-info`, userInfo);
        // console.log(data);
        navigate("/");
        toast.success("sign up successfully");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  return (
    <div className="flex justify-center">
      <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit} className="card-body">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              className="input input-bordered"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              className="input input-bordered"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              name="password"
              placeholder="Your Password"
              className="input input-bordered"
              required
            />
          </div>
          <div className="form-control mt-6">
            <button className="btn btn-primary">SignUp</button>
          </div>
        </form>
        <div>
          <div className="divider -mt-1">or</div>
          <div className="flex justify-center my-4 font-semibold">
            <button
              onClick={handleGoogleSignUP}
              className="flex items-center gap-2 text-lg btn border border-black btn-ghost"
            >
              <span className="mt-1 text-2xl">
                <FcGoogle />
              </span>
              Sign Up With Google
            </button>
          </div>
        </div>
        <div className="text-center  my-6">
          <h2 className="text-lg">
            Already Have an Account?{" "}
            <span className="text-blue-500 font-semibold">
              <Link to="/login"> Login</Link>
            </span>
          </h2>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
