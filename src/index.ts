import express from "express"
import { UserModel, WorkoutModel } from "./db";
import cors from 'cors';
import jwt from "jsonwebtoken"
import { userMiddleware } from "./middleware";
import dotenv from "dotenv";
dotenv.config();


const app = express();
app.use(express.json())
app.use(cors());


app.post("/v1/signup", async (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    try{
        await UserModel.create({
            username,
            password
        })

        res.json({
            message: "User signed up"
        })
    }catch(e){
        res.status(411).json({
            message:"User already exist"
        })
    }
})


app.post("/v1/signin", async (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    const existingUser = await UserModel.findOne({
        username,
        password
    })
    if(existingUser){
        const token = jwt.sign({
            ID: existingUser._id
        }, process.env.JWTPASS as string)
        console.log("Sign-In: Generated token for userId:", existingUser._id);

        res.json({
            token
        })
    } else {
        res.status(403).json({
            message: "Incorrect credentials"
        })
    }

})


app.post("/v1/workout", userMiddleware, async (req, res) => {
    const date = req.body.date;
    const workout = req.body.workout;
    const set = req.body.set;
    const reps = req.body.reps;

    await WorkoutModel.create({
        date,
        workout,
        set,
        reps
    })

    res.json({
        message: "Workoout added"
    })
})


app.get("/v1/workout", userMiddleware, async (req, res) => {
    const userId = req.body.userId;
    const date = req.body.date;

    const filter: any = {userId: userId};
    
    const content = await WorkoutModel.find(filter).populate( "userId");

    res.json({
        content,
    });
})


app.delete("/v1/workout", userMiddleware, async (req, res) =>{
    const workoutId = req.body.workoutId;

    try{
        await await WorkoutModel.deleteMany({
            _id: workoutId,
            userId: req.userId
        })

        res.json({msg: "Workout successfully deleted" })
    }catch (error){
        res.status(500).json({error: "Failed to delete workout"})
    }
})


app.listen(3000, () => {
    console.log("Server listening on 3000");
 });