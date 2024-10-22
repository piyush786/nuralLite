const express = require("express");
const { mongoClient, url } = require("../config/database");
const { error, success } = require("../utils/jsend");

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


    const result1 = await counteries.insertOne({
      countryCode,
      countryName,
      currency,
      active: true,
      id: cid,
    });

    const result2 = await zones.insertOne({
      countryId: Number(cid),
      zoneName,
      id: zid,
    });

    const result3 = await states.insertOne({
      zoneId: Number(zid),
      stateName,
      id: sid,
    });

    const result4 = await cities.insertOne({
      stateId: Number(sid),
      cityName,
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
