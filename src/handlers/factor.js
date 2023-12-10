import { asyncHandler } from "../utils/errorHandling.js";
import slugify from "slugify";
import { apiFeatures } from "../utils/ApiFeatures.js";
import { AppError } from "../utils/AppError.js";

export const deleteOne = (model, name) => {
  return asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await model.findByIdAndDelete(id);
    !document && next(new AppError(`${name} not found`, 404));
    let response = {};
    response[name] = document;
    document && res.status(201).json({ message: "success", ...response });
  });
};


export const addOne = (model, name) => {
  return asyncHandler(async (req, res, next) => {
    if(req.body.image) req.file.filename = req.body.image
    req.body.slug = slugify(req.body.name);
    const document = new model(req.body);
    await document.save();
    let response = {};
    response[name] = document;
    res.status(201).json({ message: "success", ...response });
  });
};

export const changeUserPassword = (model, name) => {
  return asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await model.findByIdAndUpdate(id,{ password:req.body.password,passwordChangedAt:req.body.passwordChangedAt =Date.now()}, { new: true });
    !document && !document && next(new AppError(`${name} not found`, 404));
    let response = {};
    response[name] = document;
    document && res.status(201).json({ message: "success", ...response });
  });
};


export const addProduct = (model, name) => {
  return asyncHandler(async (req, res, next) => {
    if (req.body.title) req.body.slug = slugify(req.body.title);
    if (req.files.imgCover[0].filename) req.body.imgCover = req.files.imgCover[0].filename;
    if (req.files.images.map(elm=>elm.filename)) req.body.images = req.files.images.map(elm=>elm.filename);
    const document = new model(req.body);
    await document.save();
    let response = {};
    response[name] = document;
    res.status(201).json({ message: "success", ...response });
  });
};

export const getOne = (model, name) => {
  return asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await model.findById(id);
    !document && next(new AppError(`${name} not found`, 404));
    let response = {};
    response[name] = document;
    document && res.status(201).json({ message: "success", ...response });
  });
};

export const getAll = (model, name) => {
  return asyncHandler(async (req, res, next) => {
    let ApiFeatures = new apiFeatures(model.find(), req.query)
      .paginate()
      .fields()
      .filter()
      .search()
      .sort();
    const documents = await ApiFeatures.mongooseQuery;
    let response = {};
    response[name] = documents;
    res.status(201).json({ page: apiFeatures.PAGE_NUMBER, message: "success", ...response });
  });
};
export const getAllSubCategories = (model, name) => {
  return asyncHandler(async (req, res, next) => {
    let filterObj = {};
    if (req.params.category) {
      filterObj = req.params;
    }
    const documents = await model.find(filterObj);
    let response = {};
    response[name] = documents;
    res.status(201).json({ message: "success", ...response });
  });
};

export const updateOne = (model, name) => {
  return asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (req.files.imgCover[0].filename) req.body.imgCover = req.files.imgCover[0].filename;
    if (req.files.images.map(elm=>elm.filename)) req.body.images = req.files.images.map(elm=>elm.filename);
    if (req.body.name) req.body.slug = slugify(req.body.name);
    if (req.body.title) req.body.slug = slugify(req.body.title);
    const document = await model.findByIdAndUpdate(id, req.body, { new: true });
    !document && !document && next(new AppError(`${name} not found`, 404));
    let response = {};
    response[name] = document;
    document && res.status(201).json({ message: "success", ...response });
  });
};

