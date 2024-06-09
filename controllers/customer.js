const express = require("express");
const { mongoClient, url } = require("../config/database");
const { error, success } = require("../utils/jsend");
const { ObjectId } = require("mongodb");

async function addCustomer(req, res) {
  const {
    customerName,
    customerCompanyName,
    mobileNumber,
    email,
    address,
    city,
    state,
    country,
    pincode,
    landmark,
    gstNumber,
  } = req.body;

  const token = req.headers.authorization;
  if (!token) {
    return res.status(400).json(error("token not found"));
  }

  if (
    !customerName ||
    !customerCompanyName ||
    !mobileNumber ||
    !address ||
    !city ||
    !state ||
    !country ||
    !pincode
  ) {
    return res.status(400).json(error("All fields are required"));
  }

  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json(error("Invalid email format"));
    }
  }

  const client = await mongoClient.connect(url);
  const db = client.db("nuralLiteDb");
  const users = db.collection("users");
  const customers = db.collection("customers");

  let checkExist = await customers.findOne({
    mobileNumber,
  });
  if (checkExist) {
    return res.status(400).json(error("Customer already exist"));
  }

  const orgDetails = await users.findOne({
    token: token,
    $or: [{ role: "organization" }, { role: "admin" }],
  });

  if (orgDetails._id) {
    const customer = {
      customerName,
      customerCompanyName,
      organizationId: orgDetails._id,
      mobileNumber,
      address,
      city,
      state,
      country,
      pincode,
      email: email ? email : null,
      landmark: landmark ? landmark : null,
      gstNumber: gstNumber ? gstNumber : null,
      role: "customer",
    };
    const result = await customers.insertOne(customer);
    client.close();

    return res
      .status(201)
      .json(
        success({ customer: result.insertedId }, "Customer added successfully")
      );
  } else {
    return res.status(400).json(error("login details invalid"));
  }
}

async function listCustomers(req, res) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(400).json(error("token not found"));
  }

  const client = await mongoClient.connect(url, { useUnifiedTopology: true });
  const db = client.db("nuralLiteDb");
  const users = db.collection("users");
  const customers = db.collection("customers");

  const orgDetails = await users.findOne({
    token: token,
    $or: [{ role: "organization" }, { role: "admin" }],
  });

  if (orgDetails._id) {
    try {
      const customerList = await customers
        .find({ organizationId: orgDetails._id })
        .toArray();
      res
        .status(200)
        .json(success({ customerList }, "Customers retrieved successfully"));
    } catch (errorEx) {
      console.log(errorEx)
      res.status(500).json(error("Failed to fetch customers"));
    } finally {
      client.close();
    }
  } else {
    return res.status(400).json(error("login details invalid"));
  }
}

async function deleteCustomer(req, res) {
  const token = req.headers.authorization;
  const customerId = req.params.id;

  if (!token) {
    return res.status(400).json(error("token not found"));
  }

  if (!customerId) {
    return res.status(400).json(error("Customer ID is required"));
  }

  const client = await mongoClient.connect(url);
  const db = client.db("nuralLiteDb");
  const users = db.collection("users");
  const customers = db.collection("customers");

  const orgDetails = await users.findOne({
    token: token,
    $or: [{ role: "organization" }, { role: "admin" }],
  });

  if (orgDetails && orgDetails?._id) {
    try {
      const deletedCustomer = await customers.findOneAndDelete({
        _id: ObjectId.createFromHexString(customerId),
        organizationId: orgDetails._id,
      });

      if (deletedCustomer?._id) {
        res
          .status(200)
          .json(
            success(
              { customer: deletedCustomer.value },
              "Customer deleted successfully"
            )
          );
      } else {
        res.status(500).json(error("Customer not found"));
      }
    } catch (errorEx) {
      console.log(errorEx);
      res.status(500).json(error("Failed to delete customer"));
    } finally {
      client.close();
    }
  } else {
    return res.status(400).json(error("login details invalid"));
  }
}

async function editCustomer(req, res) {
  const customerId = req.params.id;
  const updatedFields = req.body;
  const token = req.headers.authorization;
  if (!token) {
    return res.status(400).json(error("token not found"));
  }

  if (!customerId) {
    return res.status(400).json(error("Customer ID is required"));
  }

  if (Object.keys(updatedFields).length === 0) {
    return res.status(400).json(error("No update fields provided"));
  }

  const client = await mongoClient.connect(url);
  const db = client.db("nuralLiteDb");
  const users = db.collection("users");

  const orgDetails = await users.findOne({
    token: token,
    $or: [{ role: "organization" }, { role: "admin" }],
  });

  if (orgDetails?._id) {
    const customers = db.collection("customers");
    try {
      const updatedCustomer = await customers.findOneAndUpdate(
        {
          _id: ObjectId.createFromHexString(customerId),
          organizationId: orgDetails._id
        },
        { $set: updatedFields },
        { returnOriginal: false }
      );

      if (!updatedCustomer?._id) {
        return res.status(404).json(error("Customer not found"));
      }

      res
        .status(200)
        .json(
          success(
            { customer: updatedCustomer?._id },
            "Customer updated successfully"
          )
        );
    } catch (errorEx) {
      console.log(errorEx)
      res.status(500).json(error("Failed to update customer"));
    } finally {
      client.close();
    }
  } else {
    return res.status(400).json(error("login details invalid"));
  }
}

async function getCustomer(req, res) {
  const customerId = req.params.id;
  const token = req.headers.authorization;
  if (!token) {
    return res.status(400).json(error("token not found"));
  }

  if (!customerId) {
    return res.status(400).json(error("Customer ID is required"));
  }

  const client = await mongoClient.connect(url);
  const db = client.db("nuralLiteDb");
  const users = db.collection("users");
  const customers = db.collection("customers");

  const orgDetails = await users.findOne({
    token: token,
    $or: [{ role: "organization" }, { role: "admin" }],
  });

  if (orgDetails && orgDetails?._id) {
    try {
      const customerObj = await customers.findOne({
        _id: ObjectId.createFromHexString(customerId),
        organizationId: orgDetails._id,
      });

      if (!customerObj) {
        return res.status(404).json(error("Customer not found"));
      }

      res
        .status(200)
        .json(
          success({ customerObj }, "Customer details retrieved successfully")
        );
    } catch (errorEx) {
      console.log(errorEx);
      res.status(500).json(error("Failed to fetch customer details"));
    } finally {
      client.close();
    }
  } else {
    return res.status(400).json(error("login details invalid"));
  }
}

module.exports = {
  addCustomer,
  listCustomers,
  deleteCustomer,
  editCustomer,
  getCustomer,
};
