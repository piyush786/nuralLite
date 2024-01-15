const express = require('express');
const UserMdl = require('../models/users');


async function getRegion(req,res) {
    res.json({'status':'server working'})
}

async function addRegion(req,res) {
    res.json({'status':'server working'})
}
async function updateRegion(req,res) {
    res.json({'status':'server working'})
}
async function deleteRegion(req,res) {
    res.json({'status':'server working'})
}




exports.get = getRegion ;
exports.add = addRegion ;
exports.update = updateRegion ;
exports.delete = deleteRegion ;
