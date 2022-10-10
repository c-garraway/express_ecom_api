

// timestamp
let ts = Date.now()
let date_ob = new Date(ts)
let date = date_ob.getDate()
let month = date_ob.getMonth() + 1
let year = date_ob.getFullYear()
let hours = date_ob.getHours()
let minutes = date_ob.getMinutes()
let seconds = date_ob.getSeconds()
let milliseconds = date_ob.getMilliseconds()
const timestamp = year + "-" + month + "-" + date + "T" + hours + ":" + minutes + ":" + seconds/*  + ":" + milliseconds */

const ensureAuthentication = (req, res, next) => {
    if (req.session.authenticated) {
        return next();
    } else {
        res.status(403).json({ msg: "You're not authorized to view this page" });
    }
}

module.exports = {
    timestamp,
    ensureAuthentication
}