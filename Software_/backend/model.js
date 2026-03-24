import mongoose from "mongoose";

const DataSchema = new mongoose.Schema({
 pattern: [Number],
  message: String
},{collection:"Gesture"});

const DataModel = mongoose.model("Data", DataSchema);

export default DataModel;