const express = require("express")
const dotenv = require("dotenv")
const path = require("path")
const cookieParser = require("cookie-parser")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

// model part
const userModel = require("./models/user.model")
const postModel = require("./models/post.model")

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

    //password encrypt and create user
    bcrypt.genSalt(10, (err,salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            let user = await userModel.create({
                username,
                name,
                email,
                age,
                password: hash
            }) 
            // res.send(user)  
            
            // signing part
            let token = jwt.sign({email: email, userid: user._id}, process.env.SIGN_PRIVATE_KEY)
            res.cookie("token", token)
            res.send("user is registered")
        })
    })
    
})


// login page
app.get("/login", (req, res) => {
    res.render("login")
})

app.post("/login", async (req,res) => {
    let {email,password} = req.body  // destructring
    // check user is already present or not
    let user = await userModel.findOne({email})
    if(!user) return res.status(500).send("Something went wrong")

    bcrypt.compare(password, user.password, (err, result) => {
        if(result) {
            let token = jwt.sign({email: email, userid: user._id}, process.env.SIGN_PRIVATE_KEY)
            res.cookie("token", token)
            res.status(200).send("You can login")
        }

        else res.redirect("/login")
    })
    
})


// profile page
app.get("/profile", isLoggedIn, (req, res) => {
    console.log(req.user) // for getting the user detail
    res.send(req.user)
    // res.render("login")
})


// logout section
app.get("/logout", (req, res) => {
    res.cookie("token", "")
    res.redirect("/login")
})

// protected route for login section (middleware)
function isLoggedIn (req, res, next) {
    if(req.cookies.token === "") res.send("You must be logged in")
    else {
        let data = jwt.verify(req.cookies.token, process.env.SIGN_PRIVATE_KEY)
        req.user = data
    }

    next()
}


app.listen(PORT, () => {
    console.log(`app is runnung at ${PORT} port...`);
})