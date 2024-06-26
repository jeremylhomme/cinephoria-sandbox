import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import { useLoginMutation } from "../../redux/api/userApiSlice";
import Loader from "../../components/Loader";

import icon from "../../assets/images/icon-cinephoria.webp";

const Login = () => {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  const { userInfo } = useSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      if (userInfo.mustChangePassword) {
        navigate("/user/first-login");
      } else {
        navigate(redirect);
      }
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const user = await login({ userEmail, userPassword }).unwrap();
      dispatch(setCredentials(user));
      if (user.mustChangePassword) {
        navigate("/user/first-login");
      } else {
        navigate(redirect);
        toast.success("Connexion réussie !");
      }
    } catch (error) {
      toast.error(error.data?.message || "Erreur de connexion");
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img className="mx-auto h-12 w-auto" src={icon} alt="Cinéphoria" />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Connexion
        </h2>
      </div>

      <div className="bg-white p-8 rounded-md mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={submitHandler}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6"
            >
              Adresse e-mail
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
                value={userEmail}
                placeholder="Entrez votre adresse e-mail"
                onChange={(e) => setUserEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6"
              >
                Mot de passe
              </label>
              <div className="text-sm">
                <a href="#" className="text-gray-500 hover:text-gray-400">
                  Mot de passe oublié ?
                </a>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
                value={userPassword}
                placeholder="Entrez votre mot de passe"
                onChange={(e) => setUserPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="!mt-10">
            <button
              disabled={isLoading}
              type="submit"
              className="flex w-full justify-center rounded-md bg-green-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
            >
              {isLoading ? <Loader /> : "Connexion"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm">
          Pas encore de compte ?{" "}
          <Link
            to="/register"
            className="font-semibold leading-6 text-yellow-600"
          >
            Inscrivez-vous
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
