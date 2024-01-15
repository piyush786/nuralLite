const express = require("express");
const { useMock } = require("../config/config.json");
const UserMdl = require("../models/users");
const { mockCounteries } = require("../config/mocks/counteries");
const { error, success } = require("../utils/jsend");

async function getCountry(req, res) {
  if (useMock) {
    res.status(200).send(mockCounteries);
  }
}

async function addCountry(req, res) {
  const { displayOrder, countryCode, counterName, remarks, currency } =
    req.body;

  if (!displayOrder) {
    return res.json(error("Display order not found"));
  }

  if (!countryCode) {
    return res.json(error("Country code not found"));
  }

  if (!counterName) {
    return res.json(error("Country name not found"));
  }

  if (!currency) {
    return res.json(error("Currency not found"));
  }

  if (useMock) {
    res.status(200).send(success({}, "Successfully Created"));
  }
}
async function updateCountry(req, res) {
  const { displayOrder, countryCode, counterName, remarks, currency } =
    req.body;

  if (!displayOrder) {
    return res.json(error("Display order not found"));
  }

  if (!countryCode) {
    return res.json(error("Country code not found"));
  }

  if (!counterName) {
    return res.json(error("Country name not found"));
  }

  if (!currency) {
    return res.json(error("Currency not found"));
  }

  if (useMock) {
    res.status(200).send(success({}, "Successfully Updated"));
  }
}
async function deleteCountry(req, res) {
  const { id } = req.body;

  if (useMock) {
    res.status(200).send(success({}, "Successfully Deleted"));
  }

  res.json({ status: "server working" });
}

exports.get = getCountry;
exports.add = addCountry;
exports.update = updateCountry;
exports.delete = deleteCountry;
