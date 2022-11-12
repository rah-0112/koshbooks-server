const express = require('express');
const mongoose = require('mongoose')
const morgan = require('morgan');
const session = require('express-session')
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
const User = require('./models/User');
const bookRouter = require('./router/bookRouter');
const wishRouter = require('./router/wishRouter');
const feedbackRouter = require('./router/feedbackRouter');

dotenv.config();
app.use(morgan("dev"));
const corsOptions = {
    origin: [ "https://koshbooks.vercel.app" ],
    credentials: true,
    optionSuccessStatus: 200,
}
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json({ extended: false }));
app.set('trust proxy', 1)
app.use(
    session({
        key: 'user_sid',
        secret: "random1234567890",
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: 600000,
            // httpOnly: false,
            sameSite: "none",
            secure: true,
        },
    })
)

app.use("/payment", require("./router/payment"));

app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie("user_sid");
    }
    next();
});

const sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.status(200).send(req.session);
    } else {
        next();
    }
};

//route for landing page , shown even when not logged in
app.get("/", sessionChecker, (req, res) => {
    res.send("<h1>KoshBooks api</h1>");
});

app.use("/book", bookRouter);
app.use("/wish", wishRouter);
app.use("/feedback", feedbackRouter);
app.get("/user", (req, res) => {
    console.log(req.session.user);
    if (req.session.user != null) {
        res.status(200).send(req.session.user);
    } else {
        res.status(401).send({ message: 'Unauthorized' });
    }
});
app.delete("/user", (req, res) => {
    req.session.user = null;
    req.cookies.user_sid = null;
    res.send({ message: "Cookie cleared" });
});

// route for user logout
app.get("/logout", (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie("user_sid");
    } else {
        res.status(404).json({ message: "No user exists" });
    }
});

app
    .route("/login")
    .get((req, res, next) => {
        User.find()
            .then((books) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(books);
            },
                (err) => next(err))
            .catch((err) => next(err));
    })
    .post(async (req, res) => {
        var mail = req.body.mail, password = req.body.password;
        try {
            var user = await User.findOne({ mail }).exec();
            if (!user) {
                res.status(201).json({ message: "No such user exists" });
                console.log("Error");
            }
            if (user) {
                user.comparePassword(password, (error, match) => {
                    if (!match) {
                        res.status(201).json({ message: "Wrong credentials" });
                    }
                });
            }
            req.session.user = user;
            res.status(200).json({ user });
        } catch (error) {
            console.log(error)
        }
    });

app
    .route("/signup")
    .post(async (req, res) => {
        const mail = req.body.mail;
        var user = await User.findOne({ mail }).exec();
        if (user) {
            req.session.user = user;
            res.status(200).json({ user });
        }
        await User.create({
            username: req.body.username,
            phone: req.body.phone,
            password: req.body.password,
            birthdate: req.body.birthdate,
            mail: req.body.mail,
            role: req.body.phone === process.env.ADMIN_PHONE ? "ADMIN" : "USER",
        })
            .then((user) => {
                req.session.user = user;
                res.status(200).json({ user });
            })
            .catch((err) => console.log(err));
    });

// route for handling 404 requests(unavailable routes)
app.use(function (req, res, next) {
    res.status(404).send("<h1>Sorry page not found !!</h1>");
});

const CONNECTION_URL = process.env.URL;
const PORT = process.env.PORT;
mongoose
    .connect(CONNECTION_URL, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    })
    .then(() => {
        app.listen(PORT || 5000, () => {
            console.log(`Listening on port ${PORT}`);
        })
    })
    .catch((err) => {
        console.error('Error starting server and DB');
    })