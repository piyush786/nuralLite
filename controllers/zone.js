const express = require("express");
const { useMock } = require("../config/config.json");
const { error, success } = require("../utils/jsend");
const { mongoClient, url } = require("../config/database");

async function getZone(req, res) {
  const client = await mongoClient.connect(url);
  const db = client.db("nuralLiteDb");
  const zones = db.collection("zones");
  const zoneList = await zones.find().toArray();
  res.status(200).send(success(zoneList, "Successfully fetched"));
}

async function addZone(req, res) {
  const { displayOrder, countryId, zoneName, remarks } = req.body;

  if (!displayOrder) {
    return res.json(error("Display order not found"));
  }

  if (!countryId) {
    return res.json(error("Country id not found"));
  }

  if (!zoneName) {
    return res.json(error("Zone name not found"));
  }

  const client = await mongoClient.connect(url);
  const db = client.db("nuralLiteDb");
  const counteries = db.collection("counteries");
  const zones = db.collection("zones");

  const country = await counteries.findOne({ id: countryId });
  if (!country) {
    return res.json(error("Country not found"));
  }

  const cid = Math.floor(Math.random() * 10000000);

  console.log(cid);

  try {
    const result = await zones.insertOne({
      displayOrder,
      countryId: Number(countryId),
      zoneName,
      remarks,
      id: cid,
    });
    res.status(200).send(success(result, "Successfully Created"));
  } catch (e) {
    console.log(e);
  }
}

async function updateZone(req, res) {
  const { id, displayOrder, countryId, zoneName, remarks } = req.body;

  if (!id) {
    return res.json(error("Zone Id not found"));
  }

  if (!displayOrder) {
    return res.json(error("Display order not found"));
  }

  if (!countryId) {
    return res.json(error("Country id not found"));
  }

  if (!zoneName) {
    return res.json(error("Zone name not found"));
  }

  const client = await mongoClient.connect(url);
  const db = client.db("nuralLiteDb");
  const counteries = db.collection("counteries");
  const zones = db.collection("zones");

  const country = await counteries.findOne({ id: countryId });
  if (country) {
    return res.json(error("Country not found"));
  }

  try {
    const result = await zones.findOneAndUpdate(
      { id: Number(id) },
      {
        $set: {
          displayOrder,
          countryId,
          zoneName,
          remarks,
        },
      }
    );
    res.status(200).send(success(result, "Successfully Created"));
  } catch (e) {
    console.log(e);
  }
}
async function deleteZone(req, res) {
  const { id } = req.body;
  if (!id) {
    return res.json(error("Zone Id not found"));
  }
  const client = await mongoClient.connect(url);
  const db = client.db("nuralLiteDb");
  const zones = db.collection("zones");

  try {
    const result = await zones.findOneAndDelete(
      { id: Number(id) }
    );
    res.status(200).send(success(result, "Successfully Deleted"));
  } catch (e) {
    console.log(e);
  }

  res.json({ status: "server working" });
}

exports.get = getZone;
exports.add = addZone;
exports.update = updateZone;
exports.delete = deleteZone;
