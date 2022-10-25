exports.authCheck = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        next();
    } else {
        res
            .status(401)
            .send('<h1>UnAuthorized</h1>');
    }
}

exports.adminCheck = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        if (req.session.user.role == 'ADMIN') {
            next();
        } else {
            res
                .status(401)
                .send('<h1>Access Restricted ! Action allowed only by admin !</h1>');
        }
    } else {
        res
            .status(401)
            .send('<h1>Unauthorized</h1>');
    }
}
