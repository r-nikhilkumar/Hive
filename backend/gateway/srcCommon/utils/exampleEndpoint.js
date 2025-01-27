const express = require('express');
const ApiResponse = require('./utils/ApiResponse');
const ApiError = require('./utils/ApiError');

const router = express.Router();

router.get('/example', (req, res) => {
    try {
        // ...existing code...
        const data = { /* your data */ };
        res.json(ApiResponse.success(data));
    } catch (error) {
        res.status(500).json(ApiError.error('Failed to fetch data', error.message));
    }
});

module.exports = router;
