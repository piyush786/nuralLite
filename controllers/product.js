const express = require("express");
const { mongoClient, url } = require("../config/database");
const { error, success } = require("../utils/jsend");
const { ObjectId } = require("mongodb");

async function addProduct(req, res) {
  const {
    customerId,
    brand,
    category,
    subCategory,
    sku,
    invoiceDate,
    invoiceNo,
    SerialNo,
    purchasedFrom,
  } = req.body;

  const token = req.headers.authorization;
  if (!token) {
    return res.status(400).json(error("token not found"));
  }

  if (
    !customerId ||
    !brand ||
    !category ||
    !subCategory ||
    !sku ||
    !invoiceDate ||
    !invoiceNo ||
    !SerialNo ||
    !purchasedFrom
  ) {
    return res.status(400).json(error("All fields are required"));
  }

  const client = await mongoClient.connect(url);
  const db = client.db("nuralLiteDb");
  const users = db.collection("users");
  const products = db.collection("products");

  const orgDetails = await users.findOne({
    token: token,
    $or: [{ role: "organization" }, { role: "admin" }],
  });

  if (orgDetails._id) {
    const product = {
      customerName,
      organizationId: orgDetails._id,
      customerId,
      brand,
      category,
      subCategory,
      sku,
      invoiceDate,
      invoiceNo,
      SerialNo,
      purchasedFrom,
    };
    const result = await products.insertOne(product);
    client.close();

    return res
      .status(201)
      .json(
        success({ product: result.insertedId }, "Product added successfully")
      );
  } else {
    return res.status(400).json(error("login details invalid"));
  }
}

async function listProducts(req, res) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(400).json(error("token not found"));
  }

  const client = await mongoClient.connect(url, { useUnifiedTopology: true });
  const db = client.db("nuralLiteDb");
  const users = db.collection("users");
  const products = db.collection("products");

  const orgDetails = await users.findOne({
    token: token,
    $or: [{ role: "organization" }, { role: "admin" }],
  });

  if (orgDetails._id) {
    try {
      const customerList = await products
        .find({ organizationId: orgDetails._id })
        .toArray();
      res
        .status(200)
        .json(success({ customerList }, "Products retrieved successfully"));
    } catch (errorEx) {
      console.log(errorEx);
      res.status(500).json(error("Failed to fetch products"));
    } finally {
      client.close();
    }
  } else {
    return res.status(400).json(error("login details invalid"));
  }
}

async function deleteProduct(req, res) {
  const token = req.headers.authorization;
  const productId = req.params.id;

  if (!token) {
    return res.status(400).json(error("token not found"));
  }

  if (!productId) {
    return res.status(400).json(error("Product ID is required"));
  }

  const client = await mongoClient.connect(url);
  const db = client.db("nuralLiteDb");
  const users = db.collection("users");
  const products = db.collection("products");

  const orgDetails = await users.findOne({
    token: token,
    $or: [{ role: "organization" }, { role: "admin" }],
  });

  if (orgDetails && orgDetails?._id) {
    try {
      const deletedProduct = await products.findOneAndDelete({
        _id: ObjectId.createFromHexString(productId),
        organizationId: orgDetails._id,
      });

      if (deletedProduct?._id) {
        res
          .status(200)
          .json(
            success(
              { customer: deletedProduct.value },
              "Product deleted successfully"
            )
          );
      } else {
        res.status(500).json(error("Product not found"));
      }
    } catch (errorEx) {
      console.log(errorEx);
      res.status(500).json(error("Failed to delete product"));
    } finally {
      client.close();
    }
  } else {
    return res.status(400).json(error("login details invalid"));
  }
}

async function editProduct(req, res) {
  const productId = req.params.id;
  const updatedFields = req.body;
  const token = req.headers.authorization;
  if (!token) {
    return res.status(400).json(error("token not found"));
  }

  if (!productId) {
    return res.status(400).json(error("Product ID is required"));
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
    const products = db.collection("products");
    try {
      const updatedCustomer = await products.findOneAndUpdate(
        {
          _id: ObjectId.createFromHexString(customerId),
          organizationId: orgDetails._id,
        },
        { $set: updatedFields },
        { returnOriginal: false }
      );

      if (!updatedCustomer?._id) {
        return res.status(404).json(error("Product not found"));
      }

      res
        .status(200)
        .json(
          success(
            { customer: updatedCustomer?._id },
            "Product updated successfully"
          )
        );
    } catch (errorEx) {
      console.log(errorEx);
      res.status(500).json(error("Failed to update product"));
    } finally {
      client.close();
    }
  } else {
    return res.status(400).json(error("login details invalid"));
  }
}

async function listProductByCustomer(req, res) {
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
  const products = db.collection("products");

  const orgDetails = await users.findOne({
    token: token,
    $or: [{ role: "organization" }, { role: "admin" }],
  });

  if (orgDetails._id) {
    try {
      const customerList = await products
        .find({ organizationId: orgDetails._id, customerId: customerId  })
        .toArray();
      res
        .status(200)
        .json(success({ customerList }, "Products retrieved successfully"));
    } catch (errorEx) {
      console.log(errorEx);
      res.status(500).json(error("Failed to fetch products"));
    } finally {
      client.close();
    }
  } else {
    return res.status(400).json(error("login details invalid"));
  }
}

module.exports = {
  addProduct,
  listProducts,
  deleteProduct,
  editProduct,
  listProductByCustomer,
};
