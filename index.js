// modules
import path from "node:path";
import os from "node:os"; 
import express from "express";
import exphbs from "express-handlebars";
import session from "express-session"; 
import FileStoreModule from "session-file-store";
import flash from "express-flash"; 
import conn from "./db/conn.js";
import { ThoughtController } from "./controllers/ThoughtController.js";
import thoughtRouter from "./routes/thoughtRoutes.js"; 
import authRouter from "./routes/authRoutes.js" 
import profileRouter from "./routes/profileRoutes.js"; 

//file store
const FileStore = FileStoreModule(session); 
const store = new FileStore({
    logFn(){},
    path: path.join(os.tmpdir(), "sessions")
})


// express
const app = express();
const port = 3000; 


// handlebars
const hbs = exphbs.create({
    partialsDir: ["views/partials"]
});
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars"); 


// body data
app.use(express.urlencoded({extended: true}));
app.use(express.json()); 


// session middleware
app.use(session({
    name: "session",
    secret: "our_secret",
    resave: false, 
    saveUninitialized: false, 
    store: store,
    cookie: {
        secure: false,
        maxAge: 360000,
        expires: new Date(Date.now() + 360000),
        httpOnly: true,
    }
})); 


//flash messages
app.use(flash());


// set session to res
app.use((req, res, next) => {
    if(req.session.userid) {
        res.locals.session = req.session; 
    }
    next();
})


// assets
app.use(express.static("public"));



// routes
app.use("/", authRouter);
app.use("/thoughts", thoughtRouter); 
app.use("/profile", profileRouter);

// index
app.get("/", ThoughtController.showThoughts);

// not found
app.use((req, res, next) => {
    res.render("not-found");
    // next();
});


// connect and crete tables
conn.sync()
    .then(resp => {
        console.log("Successfully connected.");
        // listen port
        app.listen(port, () => {
            console.log(`App is listening on http://localhost:${port}`);
        }); 

    })
    .catch(e => {
        console.log("Connection failure.");
        console.log(e);
    });




