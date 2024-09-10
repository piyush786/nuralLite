const express = require("express");
const { mongoClient, url } = require("../config/database");
const { error, success } = require("../utils/jsend");

async function addOrganization(req, res) {
  const {
    organizationName,
    mobileNumber,
    email,
    alternativeMobNumber,
    subscriptionType,
    subscriptionStartDate,
    password
  } = req.body;

  if (!organizationName || !mobileNumber || !email || !subscriptionType || !subscriptionStartDate || !password) {
    return res.status(400).json(error("All fields are required"));
  }

  if (subscriptionType !== 'trial' && subscriptionType !== 'subscription') {
    return res.status(400).json(error("Invalid subscription type"));
  }

  // Optional validation for email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json(error("Invalid email format"));
  }

  const accessKey = Math.floor(100000 + Math.random() * 900000).toString();

  const client = await mongoClient.connect(url);
  const db = client.db("nuralLiteDb");
  const users = db.collection("users");

  let checkOrg = await users.find({
    email , role : "organization"
  })


  if(checkOrg?.length>0) {
    return res.status(400).json(error("Organization already exist"));
  }


  const organization = {
    organizationName,
    mobileNumber,
    email,
    username: email,
    alternativeMobNumber,
    subscriptionType,
    subscriptionStartDate,
    accessKey,
    password,
    role: "organization"
  };
  const result = await users.insertOne(organization);
  client.close();
  return  res.status(201).json(success({ organization: result.insertedId, accessKey }, 'Organization added successfully'));
}



async function listOrganizations(req, res) {
  const client = await mongoClient.connect(url, { useUnifiedTopology: true });
  const db = client.db("nuralLiteDb");
  const users = db.collection("users");

  try {
    const organizations = await users.find({ role: "organization" }).toArray();
    return  res.status(200).json(success({ organizations }, 'Organizations retrieved successfully'));
  } catch (errorEx) {
    return  res.status(500).json(error("Failed to fetch organizations"));
  } finally {
    client.close();
  }
}

async function deleteOrganization(req, res) {
    const organizationId = req.params.id;
  
    if (!organizationId) {
      return res.status(400).json(error("Organization ID is required"));
    }
  
    const client = await mongoClient.connect(url);
    const db = client.db("nuralLiteDb");
    const users = db.collection("users");
  
    try {
      const deletedOrganization = await users.findOneAndDelete({ _id: organizationId, role: "organization" });
      if (!deletedOrganization.value) {
        return res.status(404).json(error("Organization not found"));
      }
  
      return res.status(200).json(success({ organization: deletedOrganization.value }, "Organization deleted successfully"));
    } catch (errorEx) {
      return res.status(500).json(error("Failed to delete organization"));
    } finally {
      client.close();
    }
  }


  async function editOrganization(req, res) {
    const organizationId = req.params.id;
    const updatedFields = req.body;
  
    if (!organizationId) {
      return res.status(400).json(error("Organization ID is required"));
    }
  
    if (Object.keys(updatedFields).length === 0) {
      return res.status(400).json(error("No update fields provided"));
    }
  
    const client = await mongoClient.connect(url);
    const db = client.db("nuralLiteDb");
    const users = db.collection("users");
  
    try {
      const updatedOrganization = await users.findOneAndUpdate(
        { _id: organizationId, role: "organization" },
        { $set: updatedFields },
        { returnOriginal: false }
      );
  
      if (!updatedOrganization.value) {
        return res.status(404).json(error("Organization not found"));
      }
  
      return  res.status(200).json(success({ organization: updatedOrganization.value }, "Organization updated successfully"));
    } catch (errorEx) {
      return  res.status(500).json(error("Failed to update organization"));
    } finally {
      client.close();
    }
  }
  

  async function getOrganization(req, res) {
    const organizationId = req.params.id;
  
    if (!organizationId) {
      return res.status(400).json(error("Organization ID is required"));
    }
  
    const client = await mongoClient.connect(url);
    const db = client.db("nuralLiteDb");
    const users = db.collection("users");
  
    try {
      const organization = await users.findOne({ _id: organizationId, role: "organization" });
  
      if (!organization) {
        return res.status(404).json(error("Organization not found"));
      }
  
      return  res.status(200).json(success({ organization }, "Organization details retrieved successfully"));
    } catch (errorEx) {
      return  res.status(500).json(error("Failed to fetch organization details"));
    } finally {
      client.close();
    }
  }


module.exports = {
  addOrganization,
  listOrganizations,
  deleteOrganization,
  editOrganization,
  getOrganization
};
