import React from "react";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import { useRegisterMutation } from "../../redux/api/userApiSlice";
import Loader from "../../components/Loader";

import icon from "../../assets/images/icon-cinephoria.webp";

const Register = () => {
  const [userFirstName, setUserFirstName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [confirmUserPassword, setConfirmUserPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (userPassword !== confirmUserPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await register({
          userFirstName,
          userLastName,
          userEmail,
          userPassword,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
        toast.success("Inscription effectuée avec succès.");
      } catch (err) {
        console.log(err);
        toast.error(err.data.message);
      }
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img className="mx-auto h-12 w-auto" src={icon} alt="Cinéphoria" />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
          Inscription
        </h2>
      </div>

      <div className="bg-white p-8 rounded-md mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={submitHandler}>
          <div>
            <label
              htmlFor="userFirstName"
              className="block text-sm font-medium leading-6"
            >
              Prénom
            </label>
            <div className="mt-2">
              <input
                id="userFirstName"
                name="userFirstName"
                type="text"
                autoComplete="userFirstName"
                required
                className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
                value={userFirstName}
                placeholder="Entrez votre prénom"
                onChange={(e) => setUserFirstName(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="userLastName"
              className="block text-sm font-medium leading-6"
            >
              Nom
            </label>
            <div className="mt-2">
              <input
                id="userLastName"
                name="userLastName"
                type="text"
                autoComplete="userLastName"
                required
                className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
                value={userLastName}
                placeholder="Entrez votre nom"
                onChange={(e) => setUserLastName(e.target.value)}
              />
            </div>
          </div>
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

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="confirmUserPassword"
                className="block text-sm font-medium leading-6"
              >
                Confirmation du mot de passe
              </label>
            </div>
            <div className="mt-2">
              <input
                id="confirmUserPassword"
                name="confirmUserPassword"
                type="password"
                required
                className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
                value={confirmUserPassword}
                placeholder="Entrez votre mot de passe"
                onChange={(e) => setConfirmUserPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="!mt-10">
            <button
              disabled={isLoading}
              type="submit"
              className="flex w-full justify-center rounded-md bg-green-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
            >
              {isLoading ? <Loader /> : "Inscription"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm">
          Déjà un compte ?{" "}
          <Link to="/login" className="font-semibold leading-6 text-yellow-600">
            Connectez-vous
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
