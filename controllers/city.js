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
  const { displayOrder, districtId, cityName, remarks } = req.body;

  if (!displayOrder) {
    return res.json(error("Display order not found"));
  }

  if (!districtId) {
    return res.json(error("Disctrict id not found"));
  }

  if (!cityName) {
    return res.json(error("City name not found"));
  }

  const client = await mongoClient.connect(url);
  const db = client.db("nuralLiteDb");
  const districts = db.collection("districts");
  const cities = db.collection("cities");

  const district = await districts.findOne({ id: districtId });
  if (district) {
    return res.json(error("City not found"));
  }

  const cid = Math.floor(Math.random() * 10000000);


  try {
    const result = await cities.insertOne({
      displayOrder,
      districtId: Number(districtId),
      cityName,
      remarks,
      id: cid,
    });
    res.status(200).send(success(result, "Successfully Created"));
  } catch (e) {
    console.log(e);
  }
}

async function updateCity(req, res) {
  const { id, displayOrder, districtId, cityName, remarks } = req.body;

  if (!id) {
    return res.json(error("City Id not found"));
  }

  if (!displayOrder) {
    return res.json(error("Display order not found"));
  }

  if (!districtId) {
    return res.json(error("Disctrict id not found"));
  }

  if (!cityName) {
    return res.json(error("City name not found"));
  }

  const client = await mongoClient.connect(url);
  const db = client.db("nuralLiteDb");
  const districts = db.collection("districts");
  const cities = db.collection("cities");

  const district = await districts.findOne({ id: districtId });
  if (district) {
    return res.json(error("Disctrict not found"));
  }

  try {
    const result = await cities.findOneAndUpdate(
      { id: Number(id) },
      {
        $set: {
          displayOrder,
          districtId,
          cityName,
          remarks,
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
    return res.json(error("Disctrict Id not found"));
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
