const express = require("express");
const { error, success } = require("../utils/jsend");
const { mongoClient, url } = require("../config/database");

async function getCountry(req, res) {
  const { search = "", page, limit } = req.query;

  const client = await mongoClient.connect(url);
  const db = client.db("nuralLiteDb");
  const counteries = db.collection("counteries");

  // Search filter
  const searchFilter = search
    ? { countryName: { $regex: search, $options: "i" } } // Case-insensitive search on countryName
    : {};

  try {
    // If page and limit are provided, apply pagination, otherwise fetch all
    let countryList;
    let totalCountries;

    if (page && limit) {
      const options = {
        skip: (page - 1) * parseInt(limit),
        limit: parseInt(limit),
      };
      countryList = await counteries.find(searchFilter, options).toArray();
      totalCountries = await counteries.countDocuments(searchFilter);
    } else {
      countryList = await counteries.find(searchFilter).toArray();
      totalCountries = countryList.length;
    }

    res.status(200).send(
      success(
        { countries: countryList, totalCountries },
        "Successfully fetched"
      )
    );
  } catch (e) {
    console.log(e);
    res.status(500).send(error(null, "Internal Server Error"));
  }
}

async function addCountry(req, res) {
  const { countryCode, countryName, active } = req.body;

  if (!countryCode) {
    return res.json(error("Country code not found"));
  }

  if (!countryName) {
    return res.json(error("Country name not found"));
  }

  const client = await mongoClient.connect(url);
  const db = client.db("nuralLiteDb");
  const counteries = db.collection("counteries");
  const cid = Math.floor(Math.random() * 10000000);

  try {
    const result = await counteries.insertOne({
      countryCode,
      countryName,
      active,
      id: cid,
    });
    res.status(200).send(success(result, "Successfully Created"));
  } catch (e) {
    console.log(e);
    res.status(500).send(error(null, "Internal Server Error"));
  }
}

async function updateCountry(req, res) {
  const { countryCode, countryName, id } = req.body;

  if (!id) {
    return res.json(error("Country Id not found"));
  }

  if (!countryCode) {
    return res.json(error("Country code not found"));
  }

  if (!countryName) {
    return res.json(error("Country name not found"));
  }

  const client = await mongoClient.connect(url);
  const db = client.db("nuralLiteDb");
  const counteries = db.collection("counteries");

  try {
    const result = await counteries.findOneAndUpdate(
      { id: Number(id) },
      { $set: { countryCode, countryName } },
      { returnDocument: "after" }
    );

    if (result.value) {
      return res
        .status(200)
        .send(success(result.value, "Successfully Updated"));
    } else {
      return res.status(404).send(error(null, "Document not found"));
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(error(null, "Internal Server Error"));
  }
}

async function deleteCountry(req, res) {
  const { id } = req.body;

  const client = await mongoClient.connect(url);
  const db = client.db("nuralLiteDb");
  const counteries = db.collection("counteries");

  try {
    const result = await counteries.findOneAndDelete({ id: Number(id) });

    if (result.value) {
      return res
        .status(200)
        .send(success(result.value, "Successfully Deleted"));
    } else {
      return res.status(404).send(error(null, "Document not found"));
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(error(null, "Internal Server Error"));
  }
}

async function toggleCountryStatus(req, res) {
  const { id } = req.body;

  if (!id) {
    return res.json(error("Country Id not found"));
  }

  const client = await mongoClient.connect(url);
  const db = client.db("nuralLiteDb");
  const counteries = db.collection("counteries");

  try {
    // Find the country document
    const country = await counteries.findOne({ id: Number(id) });

    if (!country) {
      return res.status(404).send(error(null, "Document not found"));
    }

    // Toggle the active status
    const updatedStatus = !country.active;

    // Update the document with the new status
    const result = await counteries.findOneAndUpdate(
      { id: Number(id) },
      { $set: { active: updatedStatus } },
      { returnDocument: "after" }
    );

    if (result.value) {
      return res
        .status(200)
        .send(success(result.value, "Successfully Toggled Status"));
    } else {
      return res.status(404).send(error(null, "Document not found"));
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(error(null, "Internal Server Error"));
  }
}

exports.get = getCountry;
exports.add = addCountry;
exports.update = updateCountry;
exports.delete = deleteCountry;
exports.toggleStatus = toggleCountryStatus;
