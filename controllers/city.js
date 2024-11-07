const express = require("express");
const { error, success } = require("../utils/jsend");
const { mongoClient, url } = require("../config/database");

async function getCity(req, res) {
  const { search = "", page, limit } = req.query;

  const client = await mongoClient.connect(url);
  const db = client.db("nuralLiteDb");
  const cities = db.collection("cities");

  const searchFilter = search
    ? { cityName: { $regex: search, $options: "i" } } // Case-insensitive search on cityName
    : {};

  try {
    let cityList;
    let totalCities;

    if (page && limit) {
      const options = {
        skip: (page - 1) * parseInt(limit),
        limit: parseInt(limit),
      };
      cityList = await cities.find(searchFilter, options).toArray();
      totalCities = await cities.countDocuments(searchFilter);
    } else {
      cityList = await cities.find(searchFilter).toArray();
      totalCities = cityList.length;
    }

    res.status(200).send(
      success(
        { cities: cityList, totalCities },
        "Successfully fetched"
      )
    );
  } catch (e) {
    console.log(e);
    res.status(500).send(error(null, "Internal Server Error"));
  }
}

async function addCity(req, res) {
  const { countryId, zoneId, stateId, cityName, active = true, remarks } = req.body;

  if (!countryId) {
    return res.json(error("Country id not found"));
  }

  if (!zoneId) {
    return res.json(error("Zone id not found"));
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

  const state = await states.findOne({ id: Number(stateId), zoneId: Number(zoneId), countryId: Number(countryId) });
  if (!state) {
    return res.json(error("State not found for the specified zone and country"));
  }

  const cid = Math.floor(Math.random() * 10000000);

  try {
    const result = await cities.insertOne({
      countryId: Number(countryId),
      zoneId: Number(zoneId),
      stateId: Number(stateId),
      cityName,
      active,
      remarks,
      id: cid,
    });
    res.status(200).send(success(result, "Successfully Created"));
  } catch (e) {
    console.log(e);
    res.status(500).send(error(null, "Internal Server Error"));
  }
}

async function updateCity(req, res) {
  const { id, countryId, zoneId, stateId, cityName, active, remarks } = req.body;

  if (!id) {
    return res.json(error("City Id not found"));
  }

  if (!countryId) {
    return res.json(error("Country id not found"));
  }

  if (!zoneId) {
    return res.json(error("Zone id not found"));
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

  const state = await states.findOne({ id: Number(stateId), zoneId: Number(zoneId), countryId: Number(countryId) });
  if (!state) {
    return res.json(error("State not found for the specified zone and country"));
  }

  try {
    const result = await cities.findOneAndUpdate(
      { id: Number(id) },
      {
        $set: {
          countryId: Number(countryId),
          zoneId: Number(zoneId),
          stateId: Number(stateId),
          cityName,
          active,
          remarks
        },
      },
      { returnDocument: "after" }
    );

    if (result.value) {
      res.status(200).send(success(result.value, "Successfully Updated"));
    } else {
      res.status(404).send(error(null, "City not found"));
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(error(null, "Internal Server Error"));
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
    const result = await cities.findOneAndDelete({ id: Number(id) });

    if (result.value) {
      res.status(200).send(success(result.value, "Successfully Deleted"));
    } else {
      res.status(404).send(error(null, "City not found"));
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(error(null, "Internal Server Error"));
  }
}

async function toggleCityStatus(req, res) {
  const { id } = req.body;

  if (!id) {
    return res.json(error("City Id not found"));
  }

  const client = await mongoClient.connect(url);
  const db = client.db("nuralLiteDb");
  const cities = db.collection("cities");

  try {
    const city = await cities.findOne({ id: Number(id) });

    if (!city) {
      return res.status(404).send(error(null, "City not found"));
    }

    const updatedStatus = !city.active;

    const result = await cities.findOneAndUpdate(
      { id: Number(id) },
      { $set: { active: updatedStatus } },
      { returnDocument: "after" }
    );

    if (result.value) {
      return res
        .status(200)
        .send(success(result.value, "Successfully Toggled Status"));
    } else {
      return res.status(404).send(error(null, "City not found"));
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(error(null, "Internal Server Error"));
  }
}

exports.get = getCity;
exports.add = addCity;
exports.update = updateCity;
exports.delete = deleteCity;
exports.toggleStatus = toggleCityStatus;
