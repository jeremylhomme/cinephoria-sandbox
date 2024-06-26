import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import LoaderFull from "../../components/LoaderFull";
import {} from "@heroicons/react/24/outline";

import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "../../redux/api/categoryApiSlice";

const CategoryList = () => {
  const {
    data: categories,
    refetch,
    isLoading,
    error,
  } = useGetCategoriesQuery();

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const [editableCategoryId, setEditableCategoryId] = useState(null);
  const [editableCategoryName, setEditableCategoryName] = useState("");

  const [newCategoryName, setNewCategoryName] = useState("");

  useEffect(() => {
    refetch();
  }, [refetch]);

  const toggleEdit = (id, categoryName) => {
    setEditableCategoryId(id);
    setEditableCategoryName(categoryName);
  };

  const saveHandler = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Category name cannot be empty.");
      return;
    }
    try {
      const newCategory = {
        categoryName: newCategoryName,
      };
      await createCategory(newCategory).unwrap();
      setNewCategoryName("");
      refetch();
      toast.success("La catégorie a été ajoutée avec succès !");
    } catch (err) {
      toast.error(`Failed to add category: ${err.data?.message || err.error}`);
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(id).unwrap();
        refetch();
        toast.success("Category deleted successfully!");
      } catch (err) {
        toast.error(
          `Failed to delete category: ${err.data?.message || err.error}`
        );
      }
    }
  };

  const updateHandler = async (id) => {
    if (!editableCategoryName.trim()) {
      toast.error("Category name cannot be empty.");
      return;
    }
    try {
      const updatedCategory = {
        categoryName: editableCategoryName,
      };
      await updateCategory({ categoryId: id, updatedCategory }).unwrap();
      setEditableCategoryId(null); // Reset editable ID
      setEditableCategoryName(""); // Clear editable name after updating
      refetch();
      toast.success("Category updated successfully!");
    } catch (err) {
      toast.error(
        `Failed to update category: ${err.data?.message || err.error}`
      );
    }
  };

  if (isLoading) return <LoaderFull />;

  const sortedCategories = categories
    ? [...categories].sort((a, b) => a.id - b.id)
    : [];

  return (
    <>
      <div className="py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="mb-6 text-3xl font-bold leading-tight tracking-tight">
              Catégories
            </h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                  <p className="mt-2 text-sm">
                    Ajoutez, modifiez ou supprimez les catégories des films de
                    l'application.
                  </p>
                </div>
              </div>
              <div className="mt-8 flow-root">
                <div className="w-full mx-auto -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 lg:w-3/5">
                  <div className="mb-6 mt-4 bg-white inline-block min-w-full py-4 align-middle box-border border border-solid rounded-md border-[#e5e7eb] sm:px-6 lg:px-8">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead>
                        <tr>
                          <th
                            scope="col"
                            className="py-3.5 pr-3 text-left text-sm font-semibold sm:pl-0"
                          >
                            ID
                          </th>
                          <th
                            scope="col"
                            className="pr-3 py-3.5 text-left text-sm font-semibold"
                          >
                            Catégorie
                          </th>
                          <th
                            scope="col"
                            className="relative py-3.5 pl-3 pr-4 sm:pr-0"
                          >
                            <span className="sr-only">Edit</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {sortedCategories.map((category) => (
                          <tr key={category.id}>
                            <td className="whitespace-nowrap py-5 text-sm">
                              {category.id}
                            </td>
                            <td className="whitespace-nowrap pr-3 py-5 text-sm">
                              {editableCategoryId === category.id ? (
                                <div className="flex items-center">
                                  <input
                                    type="text"
                                    value={editableCategoryName}
                                    onChange={(e) =>
                                      setEditableCategoryName(e.target.value)
                                    }
                                    placeholder="Nom de la catégorie"
                                    className="w-full p-2 border rounded-lg text-sm bg-transparent"
                                  />
                                </div>
                              ) : (
                                <div className="flex items-center">
                                  <div className="font-medium">
                                    {category.categoryName}{" "}
                                  </div>
                                </div>
                              )}
                            </td>
                            <td className="whitespace-nowrap px-3 py-5 text-sm">
                              {editableCategoryId === category.id ? (
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => updateHandler(category.id)}
                                    className="text-white rounded-md bg-green-700 px-3 py-2 text-sm font-semibold shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditableCategoryId(null)}
                                    className="rounded-md px-3 py-2 text-sm shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() =>
                                      toggleEdit(
                                        category.id,
                                        category.categoryName
                                      )
                                    }
                                    className="text-gray-500"
                                  >
                                    <PencilSquareIcon className="h-5 w-5" />
                                  </button>
                                  <button
                                    onClick={() => deleteHandler(category.id)}
                                    className="text-gray-500"
                                  >
                                    <TrashIcon className="h-5 w-5" />
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <td className="whitespace-nowrap pr-3 py-5 text-sm">
                            <label
                              className="font-medium"
                              htmlFor="new-category-id"
                            >
                              ID
                            </label>
                          </td>
                          <td className="whitespace-nowrap pr-3 py-5 text-sm text-gray-500">
                            <input
                              type="text"
                              value={newCategoryName}
                              onChange={(e) =>
                                setNewCategoryName(e.target.value)
                              }
                              placeholder="Nom de la catégorie"
                              className="w-full p-2 border rounded-lg text-sm bg-transparent"
                            />
                          </td>
                          <td className="whitespace-nowrap px-6 py-5 text-sm text-gray-500">
                            <button
                              onClick={saveHandler}
                              className={`block rounded-md px-3 py-2 text-center text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                                newCategoryName.trim()
                                  ? "bg-green-700 text-white hover:bg-green-800 focus-visible:outline-green-600"
                                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
                              }`}
                              disabled={!newCategoryName.trim()}
                            >
                              Ajouter
                            </button>
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

export default CategoryList;
