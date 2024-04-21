const express = require("express");
const { useMock } = require("../config/config.json");
const { error, success } = require("../utils/jsend");
const { mongoClient, url } = require("../config/database");
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

async function login(req, res) {
  const { accessKey, username, password, role } = req.body;

  if (!accessKey) {
    return res.json(error("Access Key not found"));
  }

  if (!role) {
    return res.json(error("Role not found"));
  }

  if (!username) {
    return res.json(error("username not found"));
  }

  if (!password) {
    return res.json(error("Password not found"));
  }

  const client = await mongoClient.connect(url);
  const db = client.db("nuraltechLite");
  const users = db.collection("users");


  const user = await users.findOne({ accessKey: accessKey, username: username, password: password, role: role  });
  if (!user) {
    return res.json(error("Invalid User name of password"));
  }

  const token = jwt.sign({ username: user.username, role: role }, "Nural@123", { expiresIn: '24h' });
  await users.updateOne({ username: username, accessKey: accessKey, }, { $set: { token: token } });
  return res.status(200).send(success({token}, "Successfully Created"));
  
}


async function changePassword(req, res) {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword) {
    return res.json(error("Old password is required"));
  }

  if (!newPassword) {
    return res.json(error("New password is required"));
  }

  
  // Check if the old password matches the user's current password in the database

  const client = await mongoClient.connect(url);
  const db = client.db("nuraltechLite");
  const users = db.collection("users");
  const user = await users.findOne({ token });
  if (!user) {
    return res.json(error("User not found"));
  }

  const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
  if (!isPasswordValid) {
    return res.json(error("Incorrect old password"));
  }

  // Hash the new password before updating it in the database
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update the user's password in the database
  await users.updateOne({ username: username }, { $set: { password: hashedPassword } });

  res.status(200).json(success({}, "Password changed successfully"));
}



async function forgetPassword(req, res) {
  const { accessKey, username } = req.body;

  // Validate input
  if (!accessKey) {
    return res.json(error("Access Key is required"));
  }

  if (!username) {
    return res.json(error("Username is required"));
  }


  // Check if the old password matches the user's current password in the database

  const client = await mongoClient.connect(url);
  const db = client.db("nuraltechLite");
  const users = db.collection("users");
  const user = await users.findOne({ username: username, accessKey: accessKey });
  if (!user) {
    return res.json(error("User not found"));
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  // Save the OTP and reference number in the database
  const referenceNumber = crypto.randomBytes(16).toString('hex');
  await users.updateOne({ _id: user._id }, { $set: { otp, referenceNumber } });
  return res.json(success({ referenceNumber }, 'OTP sent to your email'));

}





async function verifyOTP(req, res) {
  const { refNumber, otp } = req.body;

  if (!refNumber) {
    return res.json(error("Reference number is required"));
  }

  if (!otp) {
    return res.json(error("OTP is required"));
  }

  // Find the user based on the reference number and verify the OTP

  const client = await mongoClient.connect(url);
  const db = client.db("nuraltechLite");
  const users = db.collection("users");
  const user = await users.findOne({ referenceNumber: refNumber, otp: otp });

  if (!user) {
    return res.json(error("Invalid OTP"));
  }

  // Generate a verification token for resetting the password
  const verificationToken = crypto.randomBytes(32).toString('hex');

  // Save the verification token in the database
  await users.updateOne({ _id: user._id }, { $set: { verificationToken } });

  return res.json(success({ verificationToken }, 'Verification token generated successfully'));
}



async function resetPassword(req, res) {
  const { verificationToken, newPassword } = req.body;

  if (!verificationToken) {
    return res.json(error("Verification token is required"));
  }

  if (!newPassword) {
    return res.json(error("New password is required"));
  }

  // Find the user based on the verification token

  const client = await mongoClient.connect(url);
  const db = client.db("nuraltechLite");
  const users = db.collection("users");
  const user = await users.findOne({ verificationToken });

  if (!user) {
    return res.json(error("Invalid verification token"));
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update the user's password and remove the verification token
  await users.updateOne({ _id: user._id }, { $set: { password: hashedPassword }, $unset: { verificationToken: '' } });

  return res.json(success({}, 'Password reset successfully'));
}



module.exports = {
  login,
  changePassword,
  forgetPassword,
  forgetPasswordOtp : verifyOTP,
  forgetPasswordChange :resetPassword

};
