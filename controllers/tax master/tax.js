const express = require("express");
const { mongoClient, url } = require("../../config/database");
const { error, success } = require("../../utils/jsend");
const { ObjectId } = require("mongodb");

const createTax = async (req, res) => {
  const { hsnCode, description, cgst, sgst, igst, ugst, status } = req.body;
  const token = req.header.authorization;
  if (!token) {
    res.status(401).json(error("Unauthorized"));
  }
  if (
    hsnCode == null ||
    description == null ||
    cgst == null ||
    sgst == null ||
    igst == null ||
    ugst == null
  ) {
    return res.status(400).json(error("All fields are required"));
  }

  const client = await mongoClient.connect(url);
  const db = client.db("nuralLiteDb");
  const user = db.collection("users");
  const tax = db.collection("taxes");

  try {
    let existingTax = await tax.findOne({ hsnCode });

    if (existingTax) {
      return res
        .status(400)
        .json(error("Tax entry with this HSN Code already exists"));
    }

    const newTax = { hsnCode, description, cgst, sgst, igst, ugst, status };
    const result = await tax.insertOne(newTax);

    return res
      .status(201)
      .json(success({ taxId: result.insertedId }, "Tax added successfully"));
  } catch (err) {
    return res.status(500).json(error("Failed to add tax"));
  } finally {
    client.close();
  }
};

// add pagination in this list
const getTaxes = async (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    res.status(401).json(error("Unauthorized"));
  }
  let client;

  try {
    client = await mongoClient.connect(url);
    const db = client.db("nuralLiteDb");
    const tax = db.collection("taxes");

    const taxList = await tax.find().toArray();
    const totalRecords = await tax.countDocuments();
    // return res.status(200).json(success(taxes, "Taxes retrieved successfully"));
    res.status(200).json({
      statusCode: 200,
      statusMessage: "Tax list retrieved successfully.",
      totalRecords,
      taxList,
    });
  } catch (err) {
    return res.status(500).json(error("Failed to retrieve taxes"));
  } finally {
    if (client) client.close();
  }
};

const filterTaxes = async (req, res) => {
  const token = req.headers.authorization;

  // Authentication check
  if (!token) {
    return res.status(401).json(error("Unauthorized"));
  }

  const { hsnCode, pageSize = 10, pageIndex = 0 } = req.body; // Extracting from request body
  let client;

  try {
    client = await mongoClient.connect(url, { useUnifiedTopology: true });
    const db = client.db("nuralLiteDb");
    const taxCollection = db.collection("taxes");

    // Build filter query based on hsnCode (optional)
    const filter = hsnCode ? { hsnCode } : {};

    // Get total count for pagination metadata
    const totalCount = await taxCollection.countDocuments(filter);

    // Fetch paginated data
    const taxes = await taxCollection
      .find(filter)
      .skip(pageIndex * pageSize) // Skip items for previous pages
      .limit(parseInt(pageSize)) // Limit to page size
      .toArray(); // Convert cursor to array

    // Pagination metadata
    const pagination = {
      totalItems: totalCount,
      pageSize: parseInt(pageSize),
      currentPage: parseInt(pageIndex),
      totalPages: Math.ceil(totalCount / pageSize),
    };

    return res
      .status(200)
      .json(success({ taxes, pagination }, "Taxes retrieved successfully"));
  } catch (err) {
    console.error(err);
    return res.status(500).json(error("Failed to retrieve taxes"));
  } finally {
    if (client) client.close(); // Ensure client is closed
  }
};

const toggleStatus = async (req, res) => {
  const { hsnCode, status } = req.body;

  try {
    const client = await mongoClient.connect(url);
    const taxCollection = db.collection("taxes");

    const result = await taxCollection.updateOne(
      { hsnCode: hsnCode },
      { $set: { status: status } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "HSN Code not found" });
    }

    res.status(201).json({
      statusCode: 201,
      statusMessage: "Status updated successfully",
      status: status,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to toggle status" });
  }
};

const updateTax = async (req, res) => {
  const { taxId, description, cgst, sgst, igst, ugst, status } = req.body; // Removed hsnCode
  const token = req.headers.authorization;

  // Authorization check
  if (!token) {
    return res.status(401).json(error("Unauthorized"));
  }

  // Validate taxId
  if (!taxId) {
    return res.status(400).json(error("Tax ID is required for updating"));
  }

  let client;
  try {
    client = await mongoClient.connect(url);
    const db = client.db("nuralLiteDb");
    const taxCollection = db.collection("taxes");

    // Prepare data to update (excluding undefined fields)
    const updateData = { description, cgst, sgst, igst, ugst, status };
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    // Perform the update (without modifying the hsnCode)
    const result = await taxCollection.updateOne(
      { _id: new ObjectId(taxId) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json(error("Tax entry not found"));
    }

    res.status(200).json(success({ taxId }, "Tax updated successfully"));
  } catch (err) {
    console.error(err);
    res.status(500).json(error("Failed to update tax"));
  } finally {
    if (client) client.close();
  }
};

// hsn code dropdown
const hsnCodeDropdown = async (req, res) => {
  const token = req.headers.authorization;
  console.log(req.headers);
  console.log("token is ", token);

  if (!token === null) {
    return res.status(401).json({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  let client;
  try {
    client = await mongoClient.connect(url);
    const db = client.db("nuralLiteDb");
    const taxCollection = db.collection("taxes");

    // Fetch all HSN codes with only `hsnCode` field
    const hsnCodes = await taxCollection
      .find({}, { projection: { hsnCode: 1 } })
      .toArray();

    // Get total record count
    const totalRecords = await taxCollection.countDocuments();

    res.status(200).json({
      statusCode: 200,
      statusMessage: "HSN codes retrieved successfully",
      totalRecords,

      hsnCodes,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      statusCode: 500,
      statusMessage: "Failed to retrieve HSN codes",
    });
  } finally {
    if (client) client.close();
  }
};

module.exports = {
  createTax,
  getTaxes,
  filterTaxes,
  toggleStatus,
  updateTax,
  hsnCodeDropdown,
};
