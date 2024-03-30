import { User } from "../models/User.js"; 
import bcrypt from "bcryptjs";

export class AuthController {
    static login(req, res) {
        res.render("auth/login");
    }

    static register(req, res) {
        res.render("auth/register"); 
    }

    static async registerUser(req, res) {
        const { full_name, email, password, confirm_password } = req.body;

        //check if password match
        if(password != confirm_password) {
            req.flash("error", "Passwords don't match"); 
            res.render("auth/register"); 
            return ;
        }

        //check if user already exists
        const userExists = await User.findOne({raw: true, where: { email: email}}); 
        
        if(userExists) {
            req.flash("error", "This email is already registered.");
            res.render("auth/register");
            return ;
        }

        
        // create encrypted password
        const salt = bcrypt.genSaltSync(10); 
        const hashedPassword = bcrypt.hashSync(password, salt); 
        
        try{
            // insert user
            const userData = { full_name, email, password: hashedPassword };        
            const createdUser = await User.create(userData); 
            
            req.flash("success", "User successfully registered");             
            //login after register
            req.session.userid = createdUser.id; 
            req.session.save(() => {
                res.redirect("/thoughts/dashboard"); 
            })            
        } catch(e) {
            console.log(e); 
        }
    }

    static logout(req, res) {
        req.session.destroy();
        res.redirect("/login"); 
    }

    static async loginUser(req, res) {
        const { email, password } = req.body; 

        // check missing fields
        if(!email || !password) {
            req.flash("error", "Fill out all fields."); 
            res.render("auth/login"); 
            return ;
        }

        // check if user exists
        const userExists = await User.findOne({raw: true, where: {email: email}}); 
        if(!userExists) {
            req.flash("error", "User not found. Try again."); 
            res.render("auth/login"); 
            return ;
        } 

        // check if passwords match
        const passwordsMatch = bcrypt.compareSync(password, userExists.password); 
        if(!passwordsMatch) {
            req.flash("error", "Wrong password. Try again."); 
            res.render("auth/login"); 
            return ;
        } 

        // login 
        req.flash("success", `Welcome ${userExists.full_name}!`);
        req.session.userid = userExists.id; 
        req.session.save(()=> {
            res.redirect("/thoughts/dashboard"); 
        });        

    }
}