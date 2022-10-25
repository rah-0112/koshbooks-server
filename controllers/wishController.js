const Wishes = require('../models/Wishlist');

const getAll = (req, res, next) => {
    Wishes.findOne({ user: req.session.user._id })
        .populate("wishlist")
        .then((wishes) => {
            if (wishes != null) {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(wishes);
            } else {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.send({ message: "No wishes found" });
            }
        },
            (err) => next(err))
        .catch((err) => next(err));
}

const addWish = (req, res, next) => {
    Wishes.findOne({ user: req.session.user._id })
        .then((wish) => {
            if (wish != null) {
                if (wish.wishlist.indexOf(req.params.id) === -1) {
                    wish.wishlist.unshift(req.params.id);
                } else {
                    var err = new Error("Wish already present in the wishes !");
                    err.status = 403;
                    res.send(err);
                }
                wish.save().then(
                    (wish) => {
                        Wishes.findById(wish.id)
                            .populate("user")
                            .populate("wishlist")
                            .then(
                                (wish) => {
                                    res.statusCode = 200;
                                    res.setHeader("Content-Type", "application/json");
                                    res.json(wish);
                                },
                                (err) => next(err))
                            .catch((err) => next(err));
                    },
                    (err) => next(err)
                );
            } else {
                Wishes.create({ user: req.session.user._id, wishlist: [ req.params.id ] })
                    .then(
                        (wish) => {
                            Wishes.findById(wish.id)
                                .populate("user")
                                .populate("wishlist")
                                .then((wish) => {
                                    res.statusCode = 200;
                                    res.setHeader("Content-Type", "application/json");
                                    res.json(wish);
                                },
                                    (err) => next(err))
                                .catch((err) => next(err));
                        },
                        (err) => next(err))
                    .catch((err) => next(err));
            }
        })
        .catch((err) => next(err));
}

const addWishes = (req, res, next) => {
    Wishes.findOne({ user: req.session.user._id })
        .then((wish) => {
            if (wish != null) {
                for (var i = 0; i < req.body.wishes.length; i++) {
                    if (wish.wishlist.indexOf(req.body.wishes[ i ]) === -1) {
                        wish.wishlist.unshift(req.body.wishes[ i ]);
                    }
                }
                wish.save()
                    .then(
                        (wish) => {
                            Wishes.findOne(wish._id)
                                .populate("user")
                                .populate("wishlist")
                                .then((wish) => {
                                    res.statusCode = 200;
                                    res.setHeader("Content-Type", "application/json");
                                    res.json(wish);
                                },
                                    (err) => next(err))
                                .catch((err) => next(err));
                        },
                        (err) => next(err))
                    .catch((err) => next(err));
            }
            else {
                Wishes.create({ user: req.session.user._id, wishlist: req.body.wishes })
                    .then(
                        (wish) => {
                            Wishes.findById(wish.id)
                                .populate("user")
                                .populate("wishlist")
                                .then((wish) => {
                                    res.statusCode = 200;
                                    res.setHeader("Content-Type", "application/json");
                                    res.json(wish);
                                },
                                    (err) => next(err))
                                .catch((err) => next(err));
                        },
                        (err) => next(err))
                    .catch((err) => next(err));
            }
        })
        .catch((err) => next(err));
}

const deleteWish = (req, res, next) => {
    Wishes.findOne({ user: req.session.user._id })
        .then(
            (wish) => {
                if (wish.wishlist.indexOf(req.params.id) !== -1)
                    wish.wishlist.splice(wish.wishlist.indexOf(req.params.id), 1);
                else if (wish.wishlist.indexOf(req.params.id) === -1) {
                    var err = new Error("Wish is not present in the wishes !");
                    err.status = 403;
                    return next(err);
                }
                wish.save()
                    .then(
                        (wish) => {
                            Wishes.findOne(wish._id)
                                .populate("user")
                                .populate("wishlist")
                                .then((wish) => {
                                    res.statusCode = 200;
                                    res.setHeader("Content-Type", "application/json");
                                    res.json(wish);
                                }, (err) => next(err))
                        },
                        (err) => next(err))
                    .catch((err) => next(err));
            },
            (err) => next(err))
        .catch((err) => next(err));
}

const deleteAll = (req, res, next) => {
    Wishes.findOneAndDelete({ user: req.session.user._id })
        .then(
            (wish) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(wish);
            })
        .catch((err) => next(err))
}

module.exports = {
    addWish,
    getAll,
    addWishes,
    deleteWish,
    deleteAll
}