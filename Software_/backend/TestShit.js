import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongourl = process.env.MONGODB_KEY;

mongoose.connect(mongourl)
  .then(async () => {
    console.log("connected!");

    const testS = new mongoose.Schema({ name: String });
    const Test = mongoose.model("Test", testS);

    const data = await Test.create({ name: "test" });
    return data;
  })
  .then((data) => {
    console.log("Inserted:", data);
    return mongoose.connection.close();
  })
  .catch((err) => console.log("gm !",err));