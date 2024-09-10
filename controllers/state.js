const express = require("express");
const { useMock } = require("../config/config.json");
const { error, success } = require("../utils/jsend");
const { mongoClient, url } = require("../config/database");

async function getState(req, res) {
  
  const client = await mongoClient.connect(url);
  const db = client.db("nuralLiteDb");
  const states = db.collection("states");
  const stateList = await states.find().toArray();
  res.status(200).send(success(stateList, "Successfully fetched"));
}

async function addState(req, res) {
  const { displayOrder, zoneId, stateName, remarks } = req.body;

  if (!displayOrder) {
    return res.json(error("Display order not found"));
  }

  if (!zoneId) {
    return res.json(error("Zone id not found"));
  }

  if (!stateName) {
    return res.json(error("State name not found"));
  }

  const client = await mongoClient.connect(url);
  const db = client.db("nuralLiteDb");
  const zones = db.collection("zones");
  const states = db.collection("states");

  const zone = await zones.findOne({ id: zoneId });
  if (zone) {
    return res.json(error("Zone not found"));
  }

  const cid = Math.floor(Math.random() * 10000000);


  try {
    const result = await states.insertOne({
      displayOrder,
      zoneId: Number(zoneId),
      stateName,
      remarks,
      id: cid,
    });
    res.status(200).send(success(result, "Successfully Created"));
  } catch (e) {
    console.log(e);
  }
}

async function updateState(req, res) {
  const { id, displayOrder, zoneId, stateName, remarks } = req.body;

  if (!id) {
    return res.json(error("State Id not found"));
  }

  if (!displayOrder) {
    return res.json(error("Display order not found"));
  }

  if (!zoneId) {
    return res.json(error("Zone id not found"));
  }

  if (!stateName) {
    return res.json(error("State name not found"));
  }

  const client = await mongoClient.connect(url);
  const db = client.db("nuralLiteDb");
  const zones = db.collection("zones");
  const states = db.collection("states");

  const zone = await zones.findOne({ id: zoneId });
  if (zone) {
    return res.json(error("Zone not found"));
  }

  try {
    const result = await states.findOneAndUpdate(
      { id: Number(id) },
      {
        $set: {
          displayOrder,
          zoneId,
          stateName,
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
  const states = db.collection("states");

  try {
    const result = await states.findOneAndDelete(
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
