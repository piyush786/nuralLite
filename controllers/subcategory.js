const express = require("express");
const { error, success } = require("../utils/jsend");
const { mongoClient, url } = require("../config/database");

async function getSubcategory(req, res) {
  const { search = "", page, limit } = req.query;

  const client = await mongoClient.connect(url);
  const db = client.db("nuralLiteDb");
  const subcategories = db.collection("subcategories");

  const searchFilter = search
    ? { subcategoryName: { $regex: search, $options: "i" } } // Case-insensitive search on subcategoryName
    : {};

  try {
    let subcategoryList;
    let totalSubcategories;

    if (page && limit) {
      const options = {
        skip: (page - 1) * parseInt(limit),
        limit: parseInt(limit),
      };
      subcategoryList = await subcategories.find(searchFilter, options).toArray();
      totalSubcategories = await subcategories.countDocuments(searchFilter);
    } else {
      subcategoryList = await subcategories.find(searchFilter).toArray();
      totalSubcategories = subcategoryList.length;
    }

    res.status(200).send(
      success(
        { subcategories: subcategoryList, totalSubcategories },
        "Successfully fetched"
      )
    );
  } catch (e) {
    console.log(e);
    res.status(500).send(error(null, "Internal Server Error"));
  }
}

async function addSubcategory(req, res) {
  const { categoryId, subcategoryName, active = true } = req.body;

  if (!categoryId) {
    return res.json(error("Category ID not found"));
  }

  if (!subcategoryName) {
    return res.json(error("Subcategory name not found"));
  }

  const client = await mongoClient.connect(url);
  const db = client.db("nuralLiteDb");
  const categories = db.collection("categories");
  const subcategories = db.collection("subcategories");

  // Verify if the category exists
  const category = await categories.findOne({ categoryId: Number(categoryId) });
  if (!category) {
    return res.json(error("Category not found"));
  }

  const subcategoryId = Math.floor(Math.random() * 10000000);

  try {
    const result = await subcategories.insertOne({
      categoryId: Number(categoryId),
      subcategoryId,
      subcategoryName,
      active
    });
    res.status(200).send(success(result, "Subcategory successfully created"));
  } catch (e) {
    console.log(e);
    res.status(500).send(error(null, "Internal Server Error"));
  }
}

async function updateSubcategory(req, res) {
  const { subcategoryId, categoryId, subcategoryName, active } = req.body;

  if (!subcategoryId) {
    return res.json(error("Subcategory ID not found"));
  }

  if (!categoryId) {
    return res.json(error("Category ID not found"));
  }

  if (!subcategoryName) {
    return res.json(error("Subcategory name not found"));
  }

  const client = await mongoClient.connect(url);
  const db = client.db("nuralLiteDb");
  const categories = db.collection("categories");
  const subcategories = db.collection("subcategories");

  // Verify if the category exists
  const category = await categories.findOne({ categoryId: Number(categoryId) });
  if (!category) {
    return res.json(error("Category not found"));
  }

  try {
    const result = await subcategories.findOneAndUpdate(
      { subcategoryId: Number(subcategoryId) },
      {
        $set: {
          categoryId: Number(categoryId),
          subcategoryName,
          active
        },
      },
      { returnDocument: "after" }
    );

    if (result.value) {
      res.status(200).send(success(result.value, "Subcategory successfully updated"));
    } else {
      res.status(404).send(error(null, "Subcategory not found"));
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(error(null, "Internal Server Error"));
  }
}

async function deleteSubcategory(req, res) {
  const { subcategoryId } = req.body;
  if (!subcategoryId) {
    return res.json(error("Subcategory ID not found"));
  }

  const client = await mongoClient.connect(url);
  const db = client.db("nuralLiteDb");
  const subcategories = db.collection("subcategories");

  try {
    const result = await subcategories.findOneAndDelete({ subcategoryId: Number(subcategoryId) });

    if (result.value) {
      res.status(200).send(success(result.value, "Subcategory successfully deleted"));
    } else {
      res.status(404).send(error(null, "Subcategory not found"));
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(error(null, "Internal Server Error"));
  }
}

async function toggleSubcategoryStatus(req, res) {
  const { subcategoryId } = req.body;

  if (!subcategoryId) {
    return res.json(error("Subcategory ID not found"));
  }

  const client = await mongoClient.connect(url);
  const db = client.db("nuralLiteDb");
  const subcategories = db.collection("subcategories");

  try {
    const subcategory = await subcategories.findOne({ subcategoryId: Number(subcategoryId) });

    if (!subcategory) {
      return res.status(404).send(error(null, "Subcategory not found"));
    }

    const updatedStatus = !subcategory.active;

    const result = await subcategories.findOneAndUpdate(
      { subcategoryId: Number(subcategoryId) },
      { $set: { active: updatedStatus } },
      { returnDocument: "after" }
    );

    if (result.value) {
      return res
        .status(200)
        .send(success(result.value, "Subcategory status successfully toggled"));
    } else {
      return res.status(404).send(error(null, "Subcategory not found"));
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(error(null, "Internal Server Error"));
  }
}

exports.get = getSubcategory;
exports.add = addSubcategory;
exports.update = updateSubcategory;
exports.delete = deleteSubcategory;
exports.toggleStatus = toggleSubcategoryStatus;
