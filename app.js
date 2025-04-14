const express = require("express")
const dotenv = require("dotenv")
const path = require("path")
const cookieParser = require("cookie-parser")
const userModel = require("./models/user.model")
const bcrypt = require("bcrypt")

dotenv.config()
const PORT = process.env.PORT

const app = express()

app.set("view engine", "ejs")
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, "public")))
app.use(cookieParser())

app.get("/", (req,res) => {
    res.render("index")
})

app.post("/register", async (req,res) => {
    let {name, username, email, age, password} = req.body  // destructring
    // check user is already present or not
    let user = await userModel.findOne({email: req.body.email})
    if(user) return res.status(500).send("User already registered")

    bcrypt.genSalt(10, (err,salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            let user = await userModel.create({
                username,
                name,
                email,
                age,
                password: hash
            }) 
            res.send(user)          
        })
    })
    
})


app.listen(PORT, () => {
    console.log(`app is runnung at ${PORT} port...`);
})