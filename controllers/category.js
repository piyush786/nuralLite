const express = require("express");
const { error, success } = require("../utils/jsend");
const { mongoClient, url } = require("../config/database");

async function getCategory(req, res) {
  const { search = "", page, limit } = req.query;

  const client = await mongoClient.connect(url);
  const db = client.db("nuralLiteDb");
  const categories = db.collection("categories");

  const searchFilter = search
    ? { categoryName: { $regex: search, $options: "i" } } // Case-insensitive search on categoryName
    : {};

  try {
    let categoryList;
    let totalCategories;

    if (page && limit) {
      const options = {
        skip: (page - 1) * parseInt(limit),
        limit: parseInt(limit),
      };
      categoryList = await categories.find(searchFilter, options).toArray();
      totalCategories = await categories.countDocuments(searchFilter);
    } else {
      categoryList = await categories.find(searchFilter).toArray();
      totalCategories = categoryList.length;
    }

    res.status(200).send(
      success(
        { categories: categoryList, totalCategories },
        "Successfully fetched"
      )
    );
  } catch (e) {
    console.log(e);
    res.status(500).send(error(null, "Internal Server Error"));
  }
}

async function addCategory(req, res) {
  const { categoryName, active = true } = req.body;

  if (!categoryName) {
    return res.json(error("Category name not found"));
  }

  const client = await mongoClient.connect(url);
  const db = client.db("nuralLiteDb");
  const categories = db.collection("categories");

  const categoryId = Math.floor(Math.random() * 10000000);

  try {
    const result = await categories.insertOne({
      categoryId,
      categoryName,
      active
    });
    res.status(200).send(success(result, "Category successfully created"));
  } catch (e) {
    console.log(e);
    res.status(500).send(error(null, "Internal Server Error"));
  }
}

async function updateCategory(req, res) {
  const { categoryId, categoryName, active } = req.body;

  if (!categoryId) {
    return res.json(error("Category ID not found"));
  }

  if (!categoryName) {
    return res.json(error("Category name not found"));
  }

  const client = await mongoClient.connect(url);
  const db = client.db("nuralLiteDb");
  const categories = db.collection("categories");

  try {
    const result = await categories.findOneAndUpdate(
      { categoryId: Number(categoryId) },
      {
        $set: {
          categoryName,
          active
        },
      },
      { returnDocument: "after" }
    );

    if (result.value) {
      res.status(200).send(success(result.value, "Category successfully updated"));
    } else {
      res.status(404).send(error(null, "Category not found"));
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(error(null, "Internal Server Error"));
  }
}

async function deleteCategory(req, res) {
  const { categoryId } = req.body;
  if (!categoryId) {
    return res.json(error("Category ID not found"));
  }

  const client = await mongoClient.connect(url);
  const db = client.db("nuralLiteDb");
  const categories = db.collection("categories");

  try {
    const result = await categories.findOneAndDelete({ categoryId: Number(categoryId) });

    if (result.value) {
      res.status(200).send(success(result.value, "Category successfully deleted"));
    } else {
      res.status(404).send(error(null, "Category not found"));
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(error(null, "Internal Server Error"));
  }
}

async function toggleCategoryStatus(req, res) {
  const { categoryId } = req.body;

  if (!categoryId) {
    return res.json(error("Category ID not found"));
  }

  const client = await mongoClient.connect(url);
  const db = client.db("nuralLiteDb");
  const categories = db.collection("categories");

  try {
    const category = await categories.findOne({ categoryId: Number(categoryId) });

    if (!category) {
      return res.status(404).send(error(null, "Category not found"));
    }

    const updatedStatus = !category.active;

    const result = await categories.findOneAndUpdate(
      { categoryId: Number(categoryId) },
      { $set: { active: updatedStatus } },
      { returnDocument: "after" }
    );

    if (result.value) {
      return res
        .status(200)
        .send(success(result.value, "Category status successfully toggled"));
    } else {
      return res.status(404).send(error(null, "Category not found"));
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(error(null, "Internal Server Error"));
  }
}

exports.get = getCategory;
exports.add = addCategory;
exports.update = updateCategory;
exports.delete = deleteCategory;
exports.toggleStatus = toggleCategoryStatus;
