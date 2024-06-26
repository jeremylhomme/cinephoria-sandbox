import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import LoaderFull from "../../components/LoaderFull";
import {
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import {
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetUsersQuery,
  useCreateUserMutation,
} from "../../redux/api/userApiSlice";

const UserList = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();

  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [createUser] = useCreateUserMutation();

  const [editableUserId, setEditableUserId] = useState(null);
  const [editableUserFirstName, setEditableUserFirstName] = useState("");
  const [editableUserLastName, setEditableUserLastName] = useState("");
  const [editableUserEmail, setEditableUserEmail] = useState("");
  const [editableUserRole, setEditableUserRole] = useState("");
  const [editableUserPassword, setEditableUserPassword] = useState("");

  const [newUserFirstName, setNewUserFirstName] = useState("");
  const [newUserLastName, setNewUserLastName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("");

  useEffect(() => {
    refetch();
  }, [refetch]);

  const toggleEdit = (id, userFirstName, userLastName, userEmail, userRole) => {
    setEditableUserId(id);
    setEditableUserFirstName(userFirstName);
    setEditableUserLastName(userLastName);
    setEditableUserEmail(userEmail);
    setEditableUserRole(userRole);
    setEditableUserPassword("");
  };

  const saveHandler = async () => {
    if (!newUserFirstName || !newUserLastName || !newEmail || !newRole) {
      toast.error("Veuillez remplir tous les champs.");
      return;
    }
    try {
      await createUser({
        userFirstName: newUserFirstName,
        userLastName: newUserLastName,
        userEmail: newEmail,
        userRole: newRole,
      }).unwrap();
      setNewUserFirstName("");
      setNewUserLastName("");
      setNewEmail("");
      setNewRole("");
      refetch();
      toast.success("Utilisateur ajouté avec succès !");
    } catch (err) {
      console.log(err);
      toast.error(`Failed to add user: ${err.data?.message || err.status}`);
    }
  };

  const updateHandler = async (id) => {
    try {
      const updatedUser = {
        id: id,
        userFirstName: editableUserFirstName,
        userLastName: editableUserLastName,
        userEmail: editableUserEmail,
        userRole: editableUserRole,
        userPassword: editableUserPassword, // if not empty, will be handled server-side
      };

      await updateUser(updatedUser).unwrap();
      setEditableUserId(null);
      refetch();
      toast.success("User updated successfully!");
    } catch (err) {
      toast.error(`Failed to update user: ${err.data?.message || err.error}`);
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur?")) {
      try {
        const userId = Number(id);
        if (isNaN(userId)) {
          toast.error("Invalid ID: Deletion not performed.");
          return;
        }
        await deleteUser(userId).unwrap();
        refetch();
        toast.success("Utilisateur supprimé avec succès !");
      } catch (err) {
        toast.error(
          "An error occurred while deleting the user. Please try again later."
        );
        console.error("Deletion error:", err);
      }
    }
  };

  const generateNewPasswordHandler = async (id) => {
    try {
      const response = await updateUser({
        id: id,
        generateNewPassword: true, // Flag to indicate password regeneration
      }).unwrap();

      toast.success(
        "New password generated and user will be prompted to change it on next login."
      );
      refetch();
    } catch (err) {
      toast.error(
        `Failed to generate new password: ${err.data?.message || err.error}`
      );
    }
  };

  if (isLoading) return <LoaderFull />;

  return (
    <>
      <div className="py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="mb-6 text-3xl font-bold leading-tight tracking-tight">
              Utilisateurs
            </h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                  <p className="text-sm">
                    Ajoutez, modifiez ou supprimez les utilisateurs de
                    l'application.
                  </p>
                </div>
              </div>
              <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="bg-white my-4 inline-block min-w-full py-4 align-middle box-border border border-solid rounded-md border-[#e5e7eb] sm:px-6 lg:px-8">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead>
                        <tr>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                          >
                            ID
                          </th>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                          >
                            Prénom
                          </th>
                          <th
                            scope="col"
                            className="pr-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Nom
                          </th>
                          <th
                            scope="col"
                            className="pr-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Email
                          </th>
                          <th
                            scope="col"
                            className="pr-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Mot de passe
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Rôle
                          </th>
                          <th
                            scope="col"
                            className="relative py-3.5 pl-3 pr-4 sm:pr-0"
                          >
                            <span className="sr-only">Modifier</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {users &&
                          users.map((user) => (
                            <tr key={user.id}>
                              <td className="whitespace-nowrap py-5 text-sm">
                                {user.id}
                              </td>
                              <td className="whitespace-nowrap pr-3 py-5 text-sm">
                                {editableUserId === user.id ? (
                                  <div className="flex items-center">
                                    <input
                                      type="text"
                                      value={editableUserFirstName}
                                      onChange={(e) =>
                                        setEditableUserFirstName(e.target.value)
                                      }
                                      placeholder="Prénom"
                                      className="w-full p-2 border rounded-lg text-sm text-gray-900"
                                    />
                                  </div>
                                ) : (
                                  <div className="flex items-center">
                                    <div className="font-medium">
                                      {user.userFirstName}{" "}
                                    </div>
                                  </div>
                                )}
                              </td>
                              <td className="whitespace-nowrap pr-3 py-5 text-sm">
                                {editableUserId === user.id ? (
                                  <div className="flex items-center">
                                    <input
                                      type="text"
                                      value={editableUserLastName}
                                      onChange={(e) =>
                                        setEditableUserLastName(e.target.value)
                                      }
                                      placeholder="Nom"
                                      className="w-full p-2 border rounded-lg text-sm text-gray-900"
                                    />
                                  </div>
                                ) : (
                                  <div className="flex items-center">
                                    <div className="font-medium">
                                      {user.userLastName}{" "}
                                    </div>
                                  </div>
                                )}
                              </td>
                              <td className="whitespace-nowrap pr-3 py-5 text-sm">
                                {editableUserId === user.id ? (
                                  <div className="flex items-center">
                                    <input
                                      type="text"
                                      value={editableUserEmail}
                                      onChange={(e) =>
                                        setEditableUserEmail(e.target.value)
                                      }
                                      placeholder="Email"
                                      className="w-full p-2 border rounded-lg text-sm text-gray-900"
                                    />
                                  </div>
                                ) : (
                                  <div className="flex items-center">
                                    <div className="font-medium">
                                      {user.userEmail}{" "}
                                    </div>
                                  </div>
                                )}
                              </td>
                              <td className="whitespace-nowrap pr-3 py-5 text-sm">
                                {editableUserId === user.id ? (
                                  <div className="flex items-center">
                                    <input
                                      type="password"
                                      value={editableUserPassword}
                                      onChange={(e) =>
                                        setEditableUserPassword(e.target.value)
                                      }
                                      placeholder="Mot de passe"
                                      className="w-full p-2 border rounded-lg text-sm text-gray-900"
                                    />
                                  </div>
                                ) : (
                                  <div className="flex items-center">
                                    <button
                                      onClick={() =>
                                        generateNewPasswordHandler(user.id)
                                      }
                                      className="text-blue-500 hover:underline"
                                    >
                                      Generate New Password
                                    </button>
                                  </div>
                                )}
                              </td>
                              <td className="whitespace-nowrap px-3 py-5 text-sm">
                                {editableUserId === user.id ? (
                                  <div className="flex items-center">
                                    <select
                                      value={editableUserRole}
                                      onChange={(e) =>
                                        setEditableUserRole(e.target.value)
                                      }
                                      className="w-full p-2 border rounded-lg text-sm"
                                    >
                                      <option
                                        value=""
                                        disabled
                                        className="text-gray-900"
                                      >
                                        Rôle
                                      </option>
                                      <option value="admin">
                                        Administrateur
                                      </option>
                                      <option value="employee">Employé</option>
                                      <option value="customer">Client</option>
                                    </select>
                                  </div>
                                ) : (
                                  <div className="flex items-center">
                                    <div className="font-medium">
                                      {user.userRole === "admin"
                                        ? "Administrateur"
                                        : user.userRole === "employee"
                                        ? "Employé"
                                        : user.userRole === "customer"
                                        ? "Client"
                                        : ""}
                                    </div>
                                  </div>
                                )}
                              </td>
                              <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                                {editableUserId === user.id ? (
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={() => updateHandler(user.id)}
                                      className="rounded-md bg-green-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-800"
                                    >
                                      Enregistrer
                                    </button>
                                    <button
                                      onClick={() => setEditableUserId(null)}
                                      className="rounded-md px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                                    >
                                      Annuler
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex items-center space-x-2">
                                    <NavLink
                                      to={`/admin/userdetails/${user.id}`}
                                      className="hover:text-gray-300"
                                    >
                                      <EyeIcon className="h-5 w-5" />
                                    </NavLink>
                                    <button
                                      onClick={() =>
                                        toggleEdit(
                                          user.id,
                                          user.userFirstName,
                                          user.userLastName,
                                          user.userEmail,
                                          user.userRole,
                                          user.userPassword
                                        )
                                      }
                                      className="hover:text-gray-300"
                                    >
                                      <PencilSquareIcon className="h-5 w-5" />
                                    </button>
                                    <button
                                      onClick={() => deleteHandler(user.id)}
                                      className="hover:text-gray-300"
                                    >
                                      <TrashIcon className="h-5 w-5" />
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        <tr>
                          <td className="whitespace-nowrap pr-3 py-5 text-sm text-gray-500">
                            <label
                              className="text-gray-700 font-medium"
                              htmlFor="id"
                            >
                              ID
                            </label>
                          </td>
                          <td className="whitespace-nowrap pr-3 py-5 text-sm text-gray-500">
                            <input
                              type="text"
                              value={newUserFirstName}
                              onChange={(e) =>
                                setNewUserFirstName(e.target.value)
                              }
                              placeholder="Prénom"
                              className="w-full p-2 border rounded-lg text-sm text-gray-900"
                            />
                          </td>
                          <td className="whitespace-nowrap pr-3 py-5 text-sm text-gray-500">
                            <input
                              type="text"
                              value={newUserLastName}
                              onChange={(e) =>
                                setNewUserLastName(e.target.value)
                              }
                              placeholder="Nom"
                              className="w-full p-2 border rounded-lg text-sm text-gray-900"
                            />
                          </td>
                          <td className="whitespace-nowrap pr-3 py-5 text-sm text-gray-500">
                            <input
                              type="text"
                              value={newEmail}
                              onChange={(e) => setNewEmail(e.target.value)}
                              placeholder="Email"
                              className="w-full p-2 border rounded-lg text-sm text-gray-900"
                            />
                          </td>
                          <td className="whitespace-nowrap pr-3 py-5 text-sm text-gray-500">
                            <div className="flex items-center">
                              <span className="text-gray-900">
                                Password will be generated automatically
                              </span>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                            <select
                              value={newRole}
                              onChange={(e) => setNewRole(e.target.value)}
                              className="w-full p-2 border rounded-lg text-sm text-gray-900"
                            >
                              <option value="" disabled>
                                Role
                              </option>
                              <option value="admin">Administrateur</option>
                              <option value="employee">Employé</option>
                              <option value="customer">Client</option>
                            </select>
                          </td>

                          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => saveHandler()}
                                className={`block rounded-md px-3 py-2 text-center text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                                  newUserFirstName &&
                                  newUserLastName &&
                                  newEmail &&
                                  newRole
                                    ? "bg-green-700 text-white hover:bg-green-800 focus-visible:outline-yellow-600"
                                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                                }`}
                                disabled={
                                  !newUserFirstName ||
                                  !newUserLastName ||
                                  !newEmail ||
                                  !newRole
                                }
                              >
                                Ajouter
                              </button>
                              <button
                                onClick={() => {
                                  setNewUserFirstName("");
                                  setNewUserLastName("");
                                  setNewEmail("");
                                  setNewRole("");
                                  setNewPassword("");
                                }}
                                className="rounded-md px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                              >
                                Annuler
                              </button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default UserList;
