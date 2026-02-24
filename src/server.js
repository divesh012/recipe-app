import express from "express"
import {ENV} from "./config/env.js"
import db from "./config/db.js"
import { favoritesTable } from "./db/schema.js";

const app = express()
const PORT = ENV.PORT ||5001;

app.use(express.json())

app.get("/api/health",(req,res) => {
    res.status(200).json({success:true})
});

app.post("/api/favorites",async (req,res) =>{
    try{
        const{userId,recipeId,title,image,cookTime,servings} = req.body;

        if(!userId || !recipeId || !title){
            return res.status(400).json({error:"All fields are required"})
        }
        const newFev =  await db.insert(favoritesTable).values({
            userId,
            recipeId,
            title,
            image,
            cookTime,
            servings
        }).returning();
        res.status(201).json(newFev[0])
        
    }catch(error){
        console.log("Error adding favorite",error);
    res.status(500).json({error:"Internal Server Error"})
    }
})

app.delete("/api/favorites/:userId/:recipeId",async (req,res) => {
    try{
        const {userId,recipeId} = req.params;
        await db
        .delete(favoritesTable)
        .where(
            and(eq(favoritesTable.userId,userId),eq(favoritesTable.recipeId,parseInt(recipeId)))
        );
        res.status(200).json({message:"Favorite deleted successfully"});
    }catch(error){
        console.log("Error deleting favorite",error);
        res.status(500).json({error:"Internal Server Error"})
    }
})
//41:00:00
app.listen(PORT,() => {
    console.log("server is running on port", PORT)
});