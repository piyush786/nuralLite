const express = require('express');


async function showWorking(req,res) {
    res.json({'status':'server working'})
}

exports.showWorking = showWorking ;