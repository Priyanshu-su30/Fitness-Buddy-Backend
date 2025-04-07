import mongoose, { model, Schema, Document  } from "mongoose";

mongoose.connect(`mongodb+srv://buzzerbreaker909:7LJeCU35DbCdUhb6@cluster0.rchr8i3.mongodb.net/`)

interface IUser extends Document {
    name: string;
    birthDate: Date;
  }

const userSchema = new Schema({
    username: {type: String, unique: true},
    password: String
})

export const UserModel = model("User", userSchema)

const workoutSchema = new Schema({
    date: {
        // type: Date,
        // get: (date: Date) => date.toISOString().split('T')[0], // Retrieves "YYYY-MM-DD"
        // set: (dateString: number) => new Date(dateString)
        type: Date,
        get: (date: Date) => {
          console.log(date); // Check if this logs correctly
          return date.toISOString().split('T')[0];}
    } ,
    workout: String,
    sets: Number,
    reps: Number,
    userId: {type:mongoose.Types.ObjectId, ref:"User", required: false}
})

workoutSchema.set('toJSON', { getters: true });

export const WorkoutModel = model<IUser>("Workout", workoutSchema)

