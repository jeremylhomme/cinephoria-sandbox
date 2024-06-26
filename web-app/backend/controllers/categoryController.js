import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";

const prisma = new PrismaClient();

const createCategory = asyncHandler(async (req, res) => {
  const { categoryName } = req.body;
  const existingCategory = await prisma.category.findUnique({
    where: { categoryName },
  });

  if (existingCategory) {
    return res.status(400).json({ message: "Category already exists." });
  }

  const category = await prisma.category.create({ data: { categoryName } });
  res.status(201).json(category);
});

const getCategories = asyncHandler(async (req, res) => {
  const categories = await prisma.category.findMany({
    include: { movies: true },
  });
  res.status(200).json(categories);
});

const getCategory = asyncHandler(async (req, res) => {
  const { id } = req.params; // Get the id from request parameters

  // Convert id to number and check if it's a valid number
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    // If the id is not a valid number, return a 400 Bad Request response
    return res.status(400).json({ message: "Invalid category ID provided." });
  }

  try {
    const category = await prisma.category.findUnique({
      where: { id: numericId }, // Use the numeric ID here
      include: { movies: true },
    });

    if (!category) {
      // If no category found, return a 404 Not Found response
      return res.status(404).json({ message: "Category not found" });
    }

    // If category is found, return it with a 200 OK response
    res.status(200).json(category);
  } catch (error) {
    // If there's any other error, return a 500 Internal Server Error response
    res
      .status(500)
      .json({ message: "Error retrieving category", error: error.message });
  }
});

const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { categoryName } = req.body;
  const category = await prisma.category.findUnique({
    where: { id: Number(id) },
  });

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  const updatedCategory = await prisma.category.update({
    where: { id: Number(id) },
    data: { categoryName },
  });
  res.status(200).json(updatedCategory);
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await prisma.category.delete({ where: { id: Number(id) } });
  res.status(200).json({ message: "Category deleted successfully" });
});

export {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
