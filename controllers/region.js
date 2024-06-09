const express = require("express");
const { useMock } = require("../config/config.json");
const { error, success } = require("../utils/jsend");
const { mongoClient, url } = require("../config/database");

async function getState(req, res) {
  
  const client = await mongoClient.connect(url);
  const db = client.db("nuralLiteDb");
  const regions = db.collection("regions");
  const regionList = await regions.find().toArray();
  res.status(200).send(success(regionList, "Successfully fetched"));
}

async function addState(req, res) {
  const { displayOrder, stateId, regionName, remarks } = req.body;

  if (!displayOrder) {
    return res.json(error("Display order not found"));
  }

  if (!stateId) {
    return res.json(error("State id not found"));
  }

  if (!regionName) {
    return res.json(error("Region name not found"));
  }

  const client = await mongoClient.connect(url);
  const db = client.db("nuralLiteDb");
  const states = db.collection("states");
  const regions = db.collection("regions");

  const state = await states.findOne({ id: stateId });
  if (state) {
    return res.json(error("State not found"));
  }

  const cid = Math.floor(Math.random() * 10000000);


  try {
    const result = await regions.insertOne({
      displayOrder,
      stateId: Number(stateId),
      regionName,
      remarks,
      id: cid,
    });
    res.status(200).send(success(result, "Successfully Created"));
  } catch (e) {
    console.log(e);
  }
}

async function updateState(req, res) {
  const { id, displayOrder, stateId, regionName, remarks } = req.body;

  if (!id) {
    return res.json(error("State Id not found"));
  }

  if (!displayOrder) {
    return res.json(error("Display order not found"));
  }

  if (!stateId) {
    return res.json(error("State id not found"));
  }

  if (!regionName) {
    return res.json(error("Region name not found"));
  }

  const client = await mongoClient.connect(url);
  const db = client.db("nuralLiteDb");
  const states = db.collection("states");
  const regions = db.collection("regions");

  const state = await states.findOne({ id: stateId });
  if (state) {
    return res.json(error("State not found"));
  }

  try {
    const result = await regions.findOneAndUpdate(
      { id: Number(id) },
      {
        $set: {
          displayOrder,
          stateId,
          regionName,
          remarks,
        },
      }
    );
    res.status(200).send(success(result, "Successfully Created"));
  } catch (e) {
    console.log(e);
  }
}
async function deleteState(req, res) {
  const { id } = req.body;
  if (!id) {
    return res.json(error("State Id not found"));
  }
  const client = await mongoClient.connect(url);
  const db = client.db("nuralLiteDb");
  const regions = db.collection("regions");

  try {
    const result = await regions.findOneAndDelete(
      { id: Number(id) }
    );
    res.status(200).send(success(result, "Successfully Deleted"));
  } catch (e) {
    console.log(e);
  }

  res.json({ status: "server working" });
}

exports.get = getState;
exports.add = addState;
exports.update = updateState;
exports.delete = deleteState;
