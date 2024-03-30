import { Thought } from "../models/Thought.js";
import { User } from "../models/User.js";
import { Op } from "sequelize";

export class ThoughtController {
    static async showThoughts(req, res) {
        let search = ""; 

        // check if query exists
        if(req.query.search) {
            search = req.query.search; 
        }

        let order = "DESC"; 
        if(req.query.order == "old") {
            order = "ASC"; 
        }

        // get thought data
        const data = await Thought.findAll({
            include: User,
            where: { title: {[Op.like]: `%${search}%`}},
            order: [["createdAt", order]]
            }             
        ); 


        // check if it's empty
        if(data.length == 0) {
            res.render("thoughts/home", { empty: true, search});
            return ; 
        }

        // render
        const thoughts = data.map(result => result.get({plain: true})); 
        
        // check quantity 
        let thoughts_qtd = thoughts.length; 
        if(thoughts_qtd == 0) {
            thoughts_qtd = false; 
        }

        //render
        res.render("thoughts/home", { thoughts, search, thoughts_qtd }); 
    }

    static async dashboard(req, res) {
        const userId = req.session.userid; 
        const user = await User.findOne({ where: {id: userId}, include: Thought, plain: true});
        let empty = false; 

        if(!user) {
            res.redirect("/login");
            return ; 
        }

        const thoughts = user.Thoughts.map(result => result.dataValues); 
        if(thoughts.length == 0) {
            empty = true; 
            res.render("thoughts/dashboard", { empty }); 
            return ; 
        }

        res.render("thoughts/dashboard", { thoughts, empty }); 
    }

    static register(req, res) {
        res.render("thoughts/register"); 
    }

    static async registerThought(req, res) {
        const thought = { 
            title: req.body.title,
            UserId: req.session.userid
         }; 

        if(!thought.title) {
            req.flash("error", "Thought text is required"); 
            res.render("thoughts/register"); 
            return ; 
        }

        if(!thought.UserId) {
            req.flash("error", "Something went wrong. Try again later"); 
            res.redirect("/login"); 
            return ; 
        }

        try {
            await Thought.create(thought); 
            req.flash("success", "Thought successfully created"); 
            
            req.session.save(() => {
                res.redirect("/thoughts/dashboard"); 
            }); 
        } catch(e) {
            console.log(e);
        }

    }

    static async edit(req, res) {
        const { id } = req.params;  
        const UserId = req.session.userid; 

        if (!id ){
            res.redirect("/thoughts/dashboard"); 
            return ;
        }

        const thought = await Thought.findOne({raw: true, where: {id: id, UserId: UserId}});
        if(!thought) {
            res.redirect("/thoughts/dashboard"); 
            return ;
        }

        res.render("thoughts/edit", { thought }); 
    }

    static async editThought(req, res) {        
        const { id, UserId, title } = req.body; 
        
        if(!id || !UserId ) {
            res.redirect("/thoughts/dashboard");
            return ;
        }

        if(!title) {
            req.flash("error", "Thought text is required."); 
            res.redirect("/thoughts/dashboard"); 
            return ;
        }

        try {
            const thought = { title } ;
            await Thought.update(thought, { where: {id: id}}); 
            req.flash("success", "Thought successfully updated."); 
            req.session.save(() => {
                res.redirect("/thoughts/dashboard"); 
            }); 
        } catch (e) {
            console.log(e);
        }
    }

    static async deleteThought(req, res) {
        const { id, UserId } = req.body; 
        
        if(!id || !UserId) {
            res.redirect("/login"); 
            return ;
        }

        try {
            await Thought.destroy({ where: {id: id, UserId: UserId }}); 
            req.flash("success", "Thought successfully deleted."); 
            req.session.save(() => {
                res.redirect("/thoughts/dashboard"); 
            })
        } catch(e) {
            console.log(e);
        }
    }
}