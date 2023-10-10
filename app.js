const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const teacher = require('./data/teachers.json');
const users = require('./data/users.json');

const pwd = 'rahasia';

//body-parser untuk menghandel json request
app.use(bodyParser.json());

//middleware untuk generate token
function generateToken(username){
    return jwt.sign({username}, pwd);
}

//Login API
app.post('/Login', (req, res) => {
    const { username, password} = req.body;
    const user = users.find(user => user.username == username && user.password == password);

    if(user){
        const token = generateToken(username);
        res.status(200).json({
            message: "authorized",
            token
        })
     } else {
        res.status(401).json({
            message: "unauthorized"

        })
     }

})

//middleware untuk mengecek token
function verifyToken(req, res, next){
    const token = req.headers['authorization'];
    if(token) {
        jwt.verify(token, pwd,(err, user) => {
            if(err){
                res.status(401).json({
                    message: "unauthorized"
                })
            } req.user = user;
              next();
        });
    }
    else{
        res.status(401).json({
            message: "unauthorized"
        })
    }
}

//API untuk menampilkan data teacher
app.get('/getAllData', verifyToken, (req, res) => {
    res.status(200).json({
        message: "success",
        data: teacher
    })
})

app.listen(3000, () => {
    console.log('The app running on port 3000');
})
