const express = require('express');
const router = express.Router();

const Users = require('../models/users')

router.get('/', async (req, res) => {
    try {
        const arrayUsers = await Users.find();
        console.log(arrayUsers)
        return arrayUsers
    } catch (error) {
        console.log(error)
    }
})

module.exports = router;