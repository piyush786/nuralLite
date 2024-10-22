const express = require("express");
const { useMock } = require("../config/config.json");
const { error, success } = require("../utils/jsend");
const { mongoClient, url } = require("../config/database");

async function getRegion(req, res) {
  
  const client = await mongoClient.connect(url);
  const db = client.db("nuralLiteDb");
  const districts = db.collection("districts");
  const districtList = await districts.find().toArray();
  res.status(200).send(success(districtList, "Successfully fetched"));
}

async function addRegion(req, res) {
  const { displayOrder, regionId, districtName, remarks } = req.body;

  if (!displayOrder) {
    return res.json(error("Display order not found"));
  }

  if (!regionId) {
    return res.json(error("Region id not found"));
  }

  if (!districtName) {
    return res.json(error("District name not found"));
  }

  const client = await mongoClient.connect(url);
  const db = client.db("nuralLiteDb");
  const regions = db.collection("regions");
  const districts = db.collection("districts");

  const region = await regions.findOne({ id: regionId });
  if (region) {
    return res.json(error("Region not found"));
  }

  const cid = Math.floor(Math.random() * 10000000);


  try {
    const result = await districts.insertOne({
      displayOrder,
      regionId: Number(regionId),
      districtName,
      remarks,
      id: cid,
    });
    res.status(200).send(success(result, "Successfully Created"));
  } catch (e) {
    console.log(e);
  }
}

async function updateRegion(req, res) {
  const { id, displayOrder, regionId, districtName, remarks } = req.body;

  if (!id) {
    return res.json(error("Region Id not found"));
  }

  if (!displayOrder) {
    return res.json(error("Display order not found"));
  }

  if (!regionId) {
    return res.json(error("Region id not found"));
  }

  if (!districtName) {
    return res.json(error("District name not found"));
  }

  const client = await mongoClient.connect(url);
  const db = client.db("nuralLiteDb");
  const regions = db.collection("regions");
  const districts = db.collection("districts");

  const region = await regions.findOne({ id: regionId });
  if (region) {
    return res.json(error("Region not found"));
  }

  try {
    const result = await districts.findOneAndUpdate(
      { id: Number(id) },
      {
        $set: {
          displayOrder,
          regionId,
          districtName,
          remarks,
        },
      }
    );
    res.status(200).send(success(result, "Successfully Created"));
  } catch (e) {
    console.log(e);
  }
}
async function deleteRegion(req, res) {
  const { id } = req.body;
  if (!id) {
    return res.json(error("Region Id not found"));
  }
  const client = await mongoClient.connect(url);
  const db = client.db("nuralLiteDb");
  const regions = db.collection("regions");
  const districts = db.collection("districts");

  const region = await regions.findOne({ id: Number(id) });
  if (region) {
    return res.json(error("Region not found"));
  }

  try {
    const result = await districts.findOneAndDelete(
      { id: Number(id) }
    );
    res.status(200).send(success(result, "Successfully Deleted"));
  } catch (e) {
    console.log(e);
  }

  res.json({ status: "server working" });
}

exports.get = getRegion;
exports.add = addRegion;
exports.update = updateRegion;
exports.delete = deleteRegion;
