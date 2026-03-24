import DataModel from "./model.js";

export async function getAllData() {
  try {
    const data = await DataModel.find();
    return data;
  } catch (err) {
    throw err;
  }
}