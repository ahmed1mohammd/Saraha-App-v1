import { UserModel } from "../DB/models/user.model.js";

export const findOne = async ({model, filter = {}, select ="" , populate=[]}={})=>{
    return await model.findOne(filter).select(select).populate(populate)
}

export const findById = async ({model, id , select ="" , populate=[]}={})=>{
    return await model.findById(id).select(select).populate(populate)
}

export const create = async ({ model, data, options = {} }) => {
    return await model.create(data, options);
}

export const updateOne = async ({ model, filter = {}, data = {} } = {}) => {
  return await model.updateOne(filter, data)
}

export const updateUserPasswordById = async (userId, hashedPassword) => {
  return await UserModel.findByIdAndUpdate(
    userId,
    { password: hashedPassword },
    { new: true }
  );
};

export const findOneAndUpdate = async ({
  model,
  filter = {},
  data = {},
  select = "",
  Options = { validateBeforeSave: true, new: true },
  populate = []
} = {}) => {
  return await model.findOneAndUpdate(
    filter,
    { ...data, $inc: { __v: 1 } },
    Options
  ).select(select).populate(populate);
}

export const deleteOne = async ({ model, filter = {}, } = {}) => {

  return await model.deleteOne(filter)
}