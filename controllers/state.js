const express = require('express');
const UserMdl = require('../models/users');


async function getState(req,res) {
    res.json({'status':'server working'})
}

async function addState(req,res) {
    res.json({'status':'server working'})
}
async function updateState(req,res) {
    res.json({'status':'server working'})
}
async function deleteState(req,res) {
    res.json({'status':'server working'})
}




exports.get = getState ;
exports.add = addState ;
exports.update = updateState ;
exports.delete = deleteState ;
