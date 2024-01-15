const express = require('express');
const UserMdl = require('../models/users');


async function getDistrict(req,res) {
    res.json({'status':'server working'})
}

async function addDistrict(req,res) {
    res.json({'status':'server working'})
}
async function updateDistrict(req,res) {
    res.json({'status':'server working'})
}
async function deleteDistrict(req,res) {
    res.json({'status':'server working'})
}




exports.get = getDistrict ;
exports.add = addDistrict ;
exports.update = updateDistrict ;
exports.delete = deleteDistrict ;
