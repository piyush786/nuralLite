const express = require("express");
const { error, success } = require("../utils/jsend");
const { mongoClient, url } = require("../config/database");

async function getState(req, res) {
  const { search = "", page, limit } = req.query;

  const client = await mongoClient.connect(url);
  const db = client.db("nuralLiteDb");
  const states = db.collection("states");

  const searchFilter = search
    ? { stateName: { $regex: search, $options: "i" } } // Case-insensitive search on stateName
    : {};

  try {
    let stateList;
    let totalStates;

    if (page && limit) {
      const options = {
        skip: (page - 1) * parseInt(limit),
        limit: parseInt(limit),
      };
      stateList = await states.find(searchFilter, options).toArray();
      totalStates = await states.countDocuments(searchFilter);
    } else {
      stateList = await states.find(searchFilter).toArray();
      totalStates = stateList.length;
    }

    res.status(200).send(
      success(
        { states: stateList, totalStates },
        "Successfully fetched"
      )
    );
  } catch (e) {
    console.log(e);
    res.status(500).send(error(null, "Internal Server Error"));
  }
}

async function addState(req, res) {
  const { countryId, zoneId, stateName, active = true } = req.body;

  if (!countryId) {
    return res.json(error("Country id not found"));
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

  const zone = await zones.findOne({ id: Number(zoneId), countryId: Number(countryId) });
  if (!zone) {
    return res.json(error("Zone not found for the specified country"));
  }

  const sid = Math.floor(Math.random() * 10000000);

  try {
    const result = await states.insertOne({
      countryId: Number(countryId),
      zoneId: Number(zoneId),
      stateName,
      active,
      id: sid,
    });
    res.status(200).send(success(result, "Successfully Created"));
  } catch (e) {
    console.log(e);
    res.status(500).send(error(null, "Internal Server Error"));
  }
}

async function updateState(req, res) {
  const { id, countryId, zoneId, stateName, active } = req.body;

  if (!id) {
    return res.json(error("State Id not found"));
  }

  if (!countryId) {
    return res.json(error("Country id not found"));
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

  const zone = await zones.findOne({ id: Number(zoneId), countryId: Number(countryId) });
  if (!zone) {
    return res.json(error("Zone not found for the specified country"));
  }

  try {
    const result = await states.findOneAndUpdate(
      { id: Number(id) },
      {
        $set: {
          countryId: Number(countryId),
          zoneId: Number(zoneId),
          stateName,
          active
        },
      },
      { returnDocument: "after" }
    );

    if (result.value) {
      res.status(200).send(success(result.value, "Successfully Updated"));
    } else {
      res.status(404).send(error(null, "State not found"));
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(error(null, "Internal Server Error"));
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
    const result = await states.findOneAndDelete({ id: Number(id) });

    if (result.value) {
      res.status(200).send(success(result.value, "Successfully Deleted"));
    } else {
      res.status(404).send(error(null, "State not found"));
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(error(null, "Internal Server Error"));
  }
}

async function toggleStateStatus(req, res) {
  const { id } = req.body;

  if (!id) {
    return res.json(error("State Id not found"));
  }

  const client = await mongoClient.connect(url);
  const db = client.db("nuralLiteDb");
  const states = db.collection("states");

  try {
    const state = await states.findOne({ id: Number(id) });

    if (!state) {
      return res.status(404).send(error(null, "State not found"));
    }

    const updatedStatus = !state.active;

    const result = await states.findOneAndUpdate(
      { id: Number(id) },
      { $set: { active: updatedStatus } },
      { returnDocument: "after" }
    );

    if (result.value) {
      return res
        .status(200)
        .send(success(result.value, "Successfully Toggled Status"));
    } else {
      return res.status(404).send(error(null, "State not found"));
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(error(null, "Internal Server Error"));
  }
}

exports.get = getState;
exports.add = addState;
exports.update = updateState;
exports.delete = deleteState;
exports.toggleStatus = toggleStateStatus;
