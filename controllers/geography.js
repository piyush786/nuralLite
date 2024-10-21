const express = require("express");
const { mongoClient, url } = require("../config/database");
const { error, success } = require("../utils/jsend");
const { ObjectId } = require("mongodb");

async function addGeography(req, res) {
  const {
    countryCode, 
    countryName, 
    currency, 
    zoneName,
    stateName,
    cityName,
  } = req.body;

  const token = req.headers.authorization;
  if (!token) {
    return res.status(400).json(error("token not found"));
  }

  const client = await mongoClient.connect(url);
  const db = client.db("nuralLiteDb");
  const counteries = db.collection("counteries");
  const states = db.collection("states");
  const zones = db.collection("zones");
  const cities = db.collection("cities");

  const cid = Math.floor(Math.random() * 10000000);
  const zid = Math.floor(Math.random() * 10000000);
  const sid = Math.floor(Math.random() * 10000000);
  const ctid = Math.floor(Math.random() * 10000000);

  try {

   let countryMaxOrder = await counteries.findOne({}, { sort: { displayOrder: -1 } });
   let zoneMaxOrder = await zones.findOne({}, { sort: { displayOrder: -1 } });
   let stateMaxOrder = await states.findOne({}, { sort: { displayOrder: -1 } });
   let cityMaxOrder = await cities.findOne({}, { sort: { displayOrder: -1 } });

    const result1 = await counteries.insertOne({
      displayOrder : countryMaxOrder.displayOrder+1,
      countryCode,
      countryName,
      currency,
      active: true,
      id: cid,
    });

    const result2 = await zones.insertOne({
      displayOrder : zoneMaxOrder.displayOrder+1,
      countryId: Number(cid),
      zoneName,
      remarks,
      id: zid,
    });

    const result3 = await states.insertOne({
      displayOrder : stateMaxOrder.displayOrder+1,
      zoneId: Number(zid),
      stateName,
      remarks,
      id: sid,
    });

    const result4 = await cities.insertOne({
      displayOrder : cityMaxOrder.displayOrder+1,
      stateId: Number(sid),
      cityName,
      remarks,
      id: ctid,
    });

    return res
    .status(201)
    .json(
      success({}, "Geography added successfully")
    );

  } catch(e) {
    console.log(e);
  }
}

module.exports = {
  addGeography
};
