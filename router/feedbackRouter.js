const express = require('express')
const router = express.Router();
const Feedback = require('../models/Feedback')

router
    .route('/')
    .post((req, res, next) => {
        Feedback.create(req.body)
            .then((feedback) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.send(feedback);
            },
                (err) => next(err))
            .catch((err) => next(err));
    })

module.exports = router;