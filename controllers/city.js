const express = require("express");
const { useMock } = require("../config/config.json");
const { error, success } = require("../utils/jsend");
const { mongoClient, url } = require("../config/database");

async function getCity(req, res) {
  
  const client = await mongoClient.connect(url);
  const db = client.db("nuralLiteDb");
  const cities = db.collection("cities");
  const cityList = await cities.find().toArray();
  res.status(200).send(success(cityList, "Successfully fetched"));
}

async function addCity(req, res) {
  const { stateId, cityName, remarks } = req.body;

  if (!stateId) {
    return res.json(error("State id not found"));
  }

  if (!cityName) {
    return res.json(error("City name not found"));
  }

  const client = await mongoClient.connect(url);
  const db = client.db("nuralLiteDb");
  const states = db.collection("states");
  const cities = db.collection("cities");

  const state = await states.findOne({ id: stateId });
  if (state) {
    return res.json(error("State not found"));
  }

  const cid = Math.floor(Math.random() * 10000000);


  try {
    const result = await cities.insertOne({
      stateId: Number(stateId),
      cityName,
      id: cid,
    });
    res.status(200).send(success(result, "Successfully Created"));
  } catch (e) {
    console.log(e);
  }
}

async function updateCity(req, res) {
  const { id, stateId, cityName } = req.body;

  if (!id) {
    return res.json(error("City Id not found"));
  }


  if (!stateId) {
    return res.json(error("State id not found"));
  }

  if (!cityName) {
    return res.json(error("City name not found"));
  }

  const client = await mongoClient.connect(url);
  const db = client.db("nuralLiteDb");
  const states = db.collection("states");
  const cities = db.collection("cities");

  const state = await states.findOne({ id: stateId });
  if (state) {
    return res.json(error("State not found"));
  }

  try {
    const result = await cities.findOneAndUpdate(
      { id: Number(id) },
      {
        $set: {
          stateId,
          cityName,
        },
      }
    );
    res.status(200).send(success(result, "Successfully Created"));
  } catch (e) {
    console.log(e);
  }
}
async function deleteCity(req, res) {
  const { id } = req.body;
  if (!id) {
    return res.json(error("City Id not found"));
  }
  const client = await mongoClient.connect(url);
  const db = client.db("nuralLiteDb");
  const cities = db.collection("cities");

  try {
    const result = await cities.findOneAndDelete(
      { id: Number(id) }
    );
    res.status(200).send(success(result, "Successfully Deleted"));
  } catch (e) {
    console.log(e);
  }

  res.json({ status: "server working" });
}

exports.get = getCity;
exports.add = addCity;
exports.update = updateCity;
exports.delete = deleteCity;
