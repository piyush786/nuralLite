const express = require('express');
const UserMdl = require('../models/users');


async function getLocality(req,res) {
    res.json({'status':'server working'})
}

async function addLocality(req,res) {
    res.json({'status':'server working'})
}
async function updateLocality(req,res) {
    res.json({'status':'server working'})
}
async function deleteLocality(req,res) {
    res.json({'status':'server working'})
}




exports.get = getLocality ;
exports.add = addLocality ;
exports.update = updateLocality ;
exports.delete = deleteLocality ;
