import { User } from "../models/User.js";
import bcrypt from "bcryptjs"; 

export class ProfileController {
    static async getUser(req, res) {
        const UserId = req.session.userid; 

        if(!UserId) {
            req.flash("error", "Something went wrong. Try again later."); 
            res.redirect("/login");
            return ;
        }

        const user = await User.findOne({ raw: true, where: { id: UserId }});

        if(!user) {
            req.flash("error", "This user does not exist. Try again later."); 
            res.redirect("/thoughts/dashboard");
            return ;
        }

        res.render("profile/home", { user: user });
    }

    static async editUserForm(req, res) {
        const id = req.session.userid; 

        if(!id) {
            res.redirect("/login");
            return ;
        }

        const user = await User.findOne({raw: true, where: {id: id}}); 
        if(!user) {
            res.redirect('/login'); 
            return ;
        }

        res.render("profile/edit-user", {user}); 
    }

    static async editUser(req, res) {
        const { id, full_name, email } = req.body; 

        if(!id || !full_name || !email){
            req.flash("error", "Fill out all fields."); 
            res.redirect("/profile/edit"); 
            return ;
        }

        const user = { full_name, email }; 

        try {
            await User.update(user, { where: {id: id}});
            req.flash("success", "User successfully updated.");
            req.session.save(() => {
                res.redirect("/profile"); 
            }); 
        } catch (e) {
            console.log(e);
        }
    }

    static async editPasswordForm(req, res) {
        const id = req.session.userid; 

        if(!id) {
            res.redirect("/login");
            return ;
        }

        const user = await User.findOne({raw: true, where: {id: id}}); 
        if(!user) {
            res.redirect('/login'); 
            return ;
        }

        res.render("profile/edit-password", { user }); 
    }


    static async editPassword(req, res) {
        // get fields
        const { id, password, new_password } = req.body; 

        // check id
        if(!id) {
            res.redirect("/profile"); 
            return; 
        }

        // check fields
        if(!password || !new_password) {
            req.flash("error", "Fill out all fields."); 
            req.session.save(() => {
                res.redirect("/profile/edit-password"); 
            }); 
            return ;
        }

        // check user
        const user = await User.findOne({raw: true, where: { id: id }}); 
        if(!user){
            res.redirect("/profile"); 
            return ;
        }

        // compare passwords
        const passwordsMatch = bcrypt.compareSync(password, user.password); 
        if(!passwordsMatch) {
            req.flash("error", "Previous password is incorrect. Try again.");
            req.session.save(() => {
                res.redirect("/profile/edit-password"); 
            });
            return ;
        }

        // generate new hashed password 
        const salt = bcrypt.genSaltSync(10); 
        const hashedPassword = bcrypt.hashSync(new_password, salt); 
        const updatedUser = { password: hashedPassword }; 

        // update password
        try {
            await User.update(updatedUser, { where: { id: id }}); 
            req.flash("success", "User password successfully updated.");
            req.session.save(() => {
                res.redirect("/profile");
            }); 
        } catch(e) {
            console.log(e);
        }
    }


    static async deleteUser(req, res) {
        const id = req.session.userid; 
        if(!id) {
            res.redirect("/profile"); 
            return ;
        }

        const user = await User.findOne({raw: true, where: {id: id}});
        if(!user) {
            res.redirect("/profile");
            return ;
        }

        try {
            await User.destroy({where: { id: id }}); 
            req.flash("success", "User account successfully deleted.");
            res.redirect("/logout");         
        } catch (e) {
            console.log(e); 
        }
    }
}