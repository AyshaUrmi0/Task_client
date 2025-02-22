import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import axios from "axios";

const Login = () => {
  const { signInUser, googleLogin, setLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");
    const userData = { email, password };
    console.log(userData);

    //signIn User
    signInUser(email, password)
      .then((result) => console.log(result.user))
      .catch((error) => console.log(error.message));
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
        navigate(location?.state ? location.state : "/");
        toast.success("sign up successfully");
        setLoading(false);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  return (
    <div className="flex justify-center">
      <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className="card-body">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="email"
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
              placeholder="password"
              className="input input-bordered"
              required
            />
          </div>
          <div className="form-control mt-6">
            <button className="btn btn-primary">Login</button>
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
            Do not Have an Account?{" "}
            <span className="text-blue-500 font-semibold">
              <Link to="/sign-up"> Sign Up</Link>
            </span>
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Login;
