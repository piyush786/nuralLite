const express = require("express");
const { error, success } = require("../utils/jsend");
const { mongoClient, url } = require("../config/database");

async function getZone(req, res) {
  const { search = "", page, limit } = req.query;

  const client = await mongoClient.connect(url);
  const db = client.db("nuralLiteDb");
  const zones = db.collection("zones");

  // Search filter
  const searchFilter = search
    ? { zoneName: { $regex: search, $options: "i" } } // Case-insensitive search on zoneName
    : {};

  try {
    let zoneList;
    let totalZones;

    if (page && limit) {
      const options = {
        skip: (page - 1) * parseInt(limit),
        limit: parseInt(limit),
      };
      zoneList = await zones.find(searchFilter, options).toArray();
      totalZones = await zones.countDocuments(searchFilter);
    } else {
      zoneList = await zones.find(searchFilter).toArray();
      totalZones = zoneList.length;
    }

    res.status(200).send(
      success(
        { zones: zoneList, totalZones },
        "Successfully fetched"
      )
    );
  } catch (e) {
    console.log(e);
    res.status(500).send(error(null, "Internal Server Error"));
  }
}

async function addZone(req, res) {
  const { countryId, zoneName, active = true } = req.body;

  if (!countryId) {
    return res.json(error("Country id not found"));
  }

  if (!zoneName) {
    return res.json(error("Zone name not found"));
  }

  const client = await mongoClient.connect(url);
  const db = client.db("nuralLiteDb");
  const counteries = db.collection("counteries");
  const zones = db.collection("zones");

  const country = await counteries.findOne({ id: Number(countryId) });
  if (!country) {
    return res.json(error("Country not found"));
  }

  const zid = Math.floor(Math.random() * 10000000);

  try {
    const result = await zones.insertOne({ 
      countryId: Number(countryId),
      zoneName,
      active,
      id: zid,
    });
    res.status(200).send(success(result, "Successfully Created"));
  } catch (e) {
    console.log(e);
    res.status(500).send(error(null, "Internal Server Error"));
  }
}

async function updateZone(req, res) {
  const { id, countryId, zoneName, active } = req.body;

  if (!id) {
    return res.json(error("Zone Id not found"));
  }

  if (!countryId) {
    return res.json(error("Country id not found"));
  }

  if (!zoneName) {
    return res.json(error("Zone name not found"));
  }

  const client = await mongoClient.connect(url);
  const db = client.db("nuralLiteDb");
  const counteries = db.collection("counteries");
  const zones = db.collection("zones");

  const country = await counteries.findOne({ id: Number(countryId) });
  if (!country) {
    return res.json(error("Country not found"));
  }

  try {
    const result = await zones.findOneAndUpdate(
      { id: Number(id) },
      {
        $set: {
          countryId: Number(countryId),
          zoneName,
          active
        },
      },
      { returnDocument: "after" }
    );

    if (result.value) {
      res.status(200).send(success(result.value, "Successfully Updated"));
    } else {
      res.status(404).send(error(null, "Zone not found"));
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(error(null, "Internal Server Error"));
  }
}

async function deleteZone(req, res) {
  const { id } = req.body;

  if (!id) {
    return res.json(error("Zone Id not found"));
  }

  const client = await mongoClient.connect(url);
  const db = client.db("nuralLiteDb");
  const zones = db.collection("zones");

  try {
    const result = await zones.findOneAndDelete(
      { id: Number(id) }
    );

    if (result.value) {
      res.status(200).send(success(result.value, "Successfully Deleted"));
    } else {
      res.status(404).send(error(null, "Zone not found"));
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(error(null, "Internal Server Error"));
  }
}

async function toggleZoneStatus(req, res) {
  const { id } = req.body;

  if (!id) {
    return res.json(error("Zone Id not found"));
  }

  const client = await mongoClient.connect(url);
  const db = client.db("nuralLiteDb");
  const zones = db.collection("zones");

  try {
    // Find the zone document
    const zone = await zones.findOne({ id: Number(id) });

    if (!zone) {
      return res.status(404).send(error(null, "Zone not found"));
    }

    // Toggle the active status
    const updatedStatus = !zone.active;

    // Update the document with the new status
    const result = await zones.findOneAndUpdate(
      { id: Number(id) },
      { $set: { active: updatedStatus } },
      { returnDocument: "after" }
    );

    if (result.value) {
      return res
        .status(200)
        .send(success(result.value, "Successfully Toggled Status"));
    } else {
      return res.status(404).send(error(null, "Zone not found"));
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(error(null, "Internal Server Error"));
  }
}

exports.get = getZone;
exports.add = addZone;
exports.update = updateZone;
exports.delete = deleteZone;
exports.toggleStatus = toggleZoneStatus;
