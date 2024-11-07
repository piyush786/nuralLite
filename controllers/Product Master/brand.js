const express = require("express");
const { mongoClient, url } = require("../../config/database");
const { error, success } = require("../../utils/jsend");
const { ObjectId } = require("mongodb");

const createBrand = async (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    res.status(401).json(err("User is not authorized."));
  }

  const { brandName, description } = req.body;
  if (brandName == null || description == null) {
    return res
      .status(400)
      .json(error("Brand name and description are required"));
  }

  try {
    const client = await mongoClient.connect(url);
    const db = client.db("nurallite");
    const brands = db.collection("brands");
    const brand = await brands.insertOne({ brandName, description });
    return res
      .status(201)
      .json(
        success(
          { _id: result.insertedId, brandName, description },
          "Brand created successfully"
        )
      );
  } catch (error) {
    console.error(error);
    return res.status(500);
  }
};

const brandList = async (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    res.status(401).json(error("Unauthorized"));
  }
  let client;

  try {
    client = await mongoClient.connect(url);
    const db = client.db("nuralLiteDb");
    const brand = db.collection("brands");

    const brandList = await brand.find().toArray();
    const totalRecords = await brand.countDocuments();
    // return res.status(200).json(success(taxes, "Taxes retrieved successfully"));
    res.status(200).json({
      statusCode: 200,
      statusMessage: "Brand list retrieved successfully.",
      totalRecords,
      brandList,
    });
  } catch (err) {
    return res.status(500).json(error("Failed to retrieve brands"));
  } finally {
    if (client) client.close();
  }
};

module.exports = {
  createBrand,
  brandList,
};
