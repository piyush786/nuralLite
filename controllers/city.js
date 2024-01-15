const express = require('express');
const UserMdl = require('../models/users');


async function getCity(req,res) {
    res.json({'status':'server working'})
}

async function addCity(req,res) {
    res.json({'status':'server working'})
}
async function updateCity(req,res) {
    res.json({'status':'server working'})
}
async function deleteCity(req,res) {
    res.json({'status':'server working'})
}




exports.get = getCity ;
exports.add = addCity ;
exports.update = updateCity ;
exports.delete = deleteCity ;
