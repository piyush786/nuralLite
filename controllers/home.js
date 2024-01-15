const express = require('express');
const UserMdl = require('../models/users');


async function showWorking(req,res) {
    res.json({'status':'server working'})
}

exports.showWorking = showWorking ;