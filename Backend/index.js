const express = require('express');
const cors = require('cors')
require('./db/config');
const User = require('./db/User');
const Product = require('./db/Product');

const Jwt = require('jsonwebtoken');
const jwtKey = 'lh-king';

const app = express();
app.use(express.json());
app.use(cors());

app.post("/register", async (req, res) => {
    let user = new User(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password;
    Jwt.sign({ result }, jwtKey, { expiresIn: "2h" }, (err, token) => {
        if (err) {
            res.send({ Result: "404 ! Token was Expired...Please ReGenrate Token!!" })
        }
        res.send({ result, auth: token })
    })
})

app.post("/login", async (req, res) => {
    console.log(req.body)
    if (req.body.password && req.body.email) {
        let user = await User.findOne(req.body).select("-password");
        if (user) {
            Jwt.sign({ user }, jwtKey, { expiresIn: "2h" }, (err, token) => {
                if (err) {
                    res.send({ Result: "404 ! Something Wrong, Please try after sometime..." })
                }
                res.send({ user, auth: token })
            })
        } else {
            res.send({ Result: "No User Found !!" });
        }
    } else {
        res.send({ Result: "No User Found !!" });
    }
})

app.post("/add-product", verifyToken, async (req, res) => {
    let product = new Product(req.body);
    let result = await product.save();
    res.send(result);
})

app.get("/products", async (req, res) => {
    let products = await Product.find();
    if (products.length > 0) {
        res.send(products)
    } else {
        res.send({ result: "No Products Found !!" })
    }
})

app.delete("/products/:id", async (req, res) => {
    const result = await Product.deleteOne({ _id: req.params.id });
    res.send(result);
})

app.get("/products/:id", verifyToken, async (req, res) => {
    let result = await Product.findOne({ _id: req.params.id });
    if (result) {
        res.send(result);
    } else {
        res.send({ Result: "No Record Found.!" })
    }
})

app.put("/products/:id", verifyToken, async (req, res) => {
    let result = await Product.updateOne(
        { _id: req.params.id },
        {
            $set: req.body
        }
    )
    res.send(result);
});

app.get("/search/:key", async (req, res) => {
    let result = await Product.find({
        "$or": [
            { name: { $regex: req.params.key } },
            { company: { $regex: req.params.key } },
            { category: { $regex: req.params.key } },
        ]
    });
    res.send(result);
});

function verifyToken(req, res, next) {
    let token = req.headers['authorization'];
    if (token) {
        token = token.split(' ')[1];
        console.log("Middleware Callled...", token);
        Jwt.verify(token, jwtKey, (err, valid) => {
            if (err) {
                res.status(404).send({ Error: "Please Provide Valid Token!!" })
            } else {
                next();
            }
        })
    } else {
        res.status(401).send({ Error: "Please Add Token With Header!!" })
    }
}

app.listen(8080);