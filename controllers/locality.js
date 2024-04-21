const express = require("express");
const { useMock } = require("../config/config.json");
const { error, success } = require("../utils/jsend");
const { mongoClient, url } = require("../config/database");

async function getLocality(req, res) {
  
  const client = await mongoClient.connect(url);
  const db = client.db("nuraltechLite");
  const localities = db.collection("localities");
  const LocalityList = await localities.find().toArray();
  res.status(200).send(success(LocalityList, "Successfully fetched"));
}

async function addLocality(req, res) {
  const { displayOrder, cityId, localityName, remarks } = req.body;

  if (!displayOrder) {
    return res.json(error("Display order not found"));
  }

  if (!cityId) {
    return res.json(error("Locality id not found"));
  }

  if (!localityName) {
    return res.json(error("Locality name not found"));
  }

  const client = await mongoClient.connect(url);
  const db = client.db("nuraltechLite");
  const cities = db.collection("cities");
  const localities = db.collection("localities");

  const city = await cities.findOne({ id: cityId });
  if (city) {
    return res.json(error("City not found"));
  }

  const cid = Math.floor(Math.random() * 10000000);


  try {
    const result = await localities.insertOne({
      displayOrder,
      cityId: Number(cityId),
      localityName,
      remarks,
      id: cid,
    });
    res.status(200).send(success(result, "Successfully Created"));
  } catch (e) {
    console.log(e);
  }
}

async function updateLocality(req, res) {
  const { id, displayOrder, cityId, cityName, remarks } = req.body;

  if (!id) {
    return res.json(error("Locality Id not found"));
  }

  if (!displayOrder) {
    return res.json(error("Display order not found"));
  }

  if (!cityId) {
    return res.json(error("City id not found"));
  }

  if (!localityName) {
    return res.json(error("Locality name not found"));
  }

  const client = await mongoClient.connect(url);
  const db = client.db("nuraltechLite");
  const cities = db.collection("cities");
  const localities = db.collection("localities");

  const city = await cities.findOne({ id: cityId });
  if (city) {
    return res.json(error("City not found"));
  }

  try {
    const result = await localities.findOneAndUpdate(
      { id: Number(id) },
      {
        $set: {
          displayOrder,
          cityId,
          localityName,
          remarks,
        },
      }
    );
    res.status(200).send(success(result, "Successfully Created"));
  } catch (e) {
    console.log(e);
  }
}
async function deleteLocality(req, res) {
  const { id } = req.body;  
  if (!id) {
    return res.json(error("Locality Id not found"));
  }
  const client = await mongoClient.connect(url);
  const db = client.db("nuraltechLite");
  const localities = db.collection("localities");

  
  try {
    const result = await localities.findOneAndDelete(
      { id: Number(id) }
    );
    res.status(200).send(success(result, "Successfully Deleted"));
  } catch (e) {
    console.log(e);
  }

  res.json({ status: "server working" });
}

exports.get = getLocality;
exports.add = addLocality;
exports.update = updateLocality;
exports.delete = deleteLocality;
