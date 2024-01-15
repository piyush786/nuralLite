const express = require('express');
const UserMdl = require('../models/users');


async function getZone(req,res) {
    res.json({'status':'server working'})
}

async function addZone(req,res) {
    res.json({'status':'server working'})
}
async function updateZone(req,res) {
    res.json({'status':'server working'})
}
async function deleteZone(req,res) {
    res.json({'status':'server working'})
}




exports.get = getZone ;
exports.add = addZone ;
exports.update = updateZone ;
exports.delete = deleteZone ;
