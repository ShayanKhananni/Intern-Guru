import Enrollment from "../models/enrollment_model.js";
import InternshipCat from "../models/internship_cat_model.js";
import Internship from "../models/internships_model.js";
import { customError } from "../utils/utils.js";


export const getAllInternshipCateg = async (req, res, next) => {
  try {
    const internships = await InternshipCat.find({});
    if (internships.lenght === 0) {
      return next(customError(404, "Internships not found"));
    }
    return res.status(200).json(internships);
  }
  catch (err) {
    next(err);
  }
}



export const getAllInternship = async (req, res, next) => {
  try {
    const internships = await Internship.find({});
    if (internships.lenght === 0) {
      return next(customError(404, "Internships not found"));
    }
    return res.status(200).json(internships);
  }
  catch (err) {
    next(err);
  }
}

export const getInternshipByCateg = async (req, res, next) => {
  try {
    const { id } = req.params;

    const internships = await Internship.find({ cat_id: id });

    if (internships.length === 0) {
      return next(customError(404, 'No Internships in this categories exists'));
    }
    res.status(200).json(internships);
  } catch (err) {
    next(err);
  }
};

export const getInternshipDuration = async (req, res, next) => {
  try {
    const data = await Enrollment.findOne({ intern_id: req.params.id })
      .select('start_date')
      .populate({
        path: 'internship_id',
        select: 'duration',
      });

    if (!data) {
      return next(customError(404, 'Enrollment Not Found'));
    }

    const response = {
      start_date: data.start_date,  // Corrected here to use `data`
      duration: data.internship_id.duration,  // Corrected here to use `data`
    };

    return res.status(200).json(response);
  } catch (err) {
    return next(err);
  }
};



export const getUserName = async (req, res, next) => {
  try {
    const { id } = req.params;

    const enrollment = await Enrollment.find({ intern_id: id }).populate('intern_id');

    if (!enrollment || enrollment.length === 0) {
      return next(customError(404, 'User Not Found'));
    }

    const userData = enrollment[0].intern_id;

    res.status(200).json(userData);
  } catch (err) {
    next(err);
  }
};
