const express = require("express");
const { useMock } = require("../config/config.json");
const { mockCounteries } = require("../config/mocks/counteries");
const { error, success } = require("../utils/jsend");
const { mongoClient, url } = require("../config/database");

async function getCountry(req, res) {
  if (useMock) {
    res.status(200).send(mockCounteries);
    return;
  }

  const client = await mongoClient.connect(url);
  const db = client.db("nuralLite");
  const counteries = db.collection("counteries");
  const countryList = await counteries.find().toArray();
  res.status(200).send(success(countryList, "Successfully fetched"));
}

async function addCountry(req, res) {
  const { displayOrder, countryCode, countryName, remarks, currency } =
    req.body;

  if (!displayOrder) {
    return res.json(error("Display order not found"));
  }

  if (!countryCode) {
    return res.json(error("Country code not found"));
  }

  if (!countryName) {
    return res.json(error("Country name not found"));
  }

  if (!currency) {
    return res.json(error("Currency not found"));
  }

  if (useMock) {
    res.status(200).send(success({}, "Successfully Created"));
    return;
  }

  const client = await mongoClient.connect(url);
  const db = client.db("nuralLite");
  const counteries = db.collection("counteries");
  const cid = Math.floor(Math.random() * 10000000);

  console.log(cid);

  try {
    const result = await counteries.insertOne({
      displayOrder,
      countryCode,
      countryName,
      remarks,
      currency,
      id: cid,
    });
    res.status(200).send(success(result, "Successfully Created"));
  } catch (e) {
    console.log(e);
  }
}

async function updateCountry(req, res) {
  const { displayOrder, countryCode, countryName, remarks, currency, id } =
    req.body;

  if (!id) {
    return res.json(error("Country Id not found"));
  }

  if (!displayOrder) {
    return res.json(error("Display order not found"));
  }

  if (!countryCode) {
    return res.json(error("Country code not found"));
  }

  if (!countryName) {
    return res.json(error("Country name not found"));
  }

  if (!currency) {
    return res.json(error("Currency not found"));
  }

  if (useMock) {
    res.status(200).send(success({}, "Successfully Updated"));
    return;
  }

  const client = await mongoClient.connect(url);
  const db = client.db("nuralLite");
  const counteries = db.collection("counteries");

  try {
    const result = await counteries.findOneAndUpdate(
      { id: Number(id) },
      { $set: { displayOrder, countryCode, countryName, remarks, currency } }
    );

    if (result) {
      return res
        .status(200)
        .send(success(result.value, "Successfully Updated"));
    } else {
      return res.status(404).send(error(null, "Document not found"));
    }
  } catch (e) {
    console.log(e);
  }
}

async function deleteCountry(req, res) {
  const { id } = req.body;

  if (useMock) {
    res.status(200).send(success({}, "Successfully Deleted"));
    return;
  }

  const client = await mongoClient.connect(url);
  const db = client.db("nuralLite");
  const counteries = db.collection("counteries");

  try {
    const result = await counteries.findOneAndDelete(
      { id: Number(id) }
    );

    if (result) {
      return res
        .status(200)
        .send(success(result.value, "Successfully Deleted"));
    } else {
      return res.status(404).send(error(null, "Document not found"));
    }
  } catch (e) {
    console.log(e);
  }
}

exports.get = getCountry;
exports.add = addCountry;
exports.update = updateCountry;
exports.delete = deleteCountry;
