const express = require('express');
const userRoutes = require('./routes/user.routes');
const activityRoutes = require('./routes/activity.routes');

require('dotenv').config({path: './config/.env'});
require('./database')
const cookieParser = require('cookie-parser');
const {checkUser, requireAuth} = require('./config/jwt.config')
const app = express();

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// jwt 
app.get('*', checkUser);
app.get('/jwtid', requireAuth, (req, res) => {
    res.status(200).send(res.locals.user._id)
});
// routes
app.use('/api/user', userRoutes);
app.use('/api/activity', activityRoutes);


//server
app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`)
});