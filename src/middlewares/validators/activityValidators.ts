import { body, param } from "express-validator";

export const validateCreateActivity = [
  body("category").isString().withMessage("Category must be a string"),
  body("description").optional().isString(),
  body("emission").isFloat({ gt: 0 }).withMessage("Emission must be a number > 0"),
  body("date").isISO8601().withMessage("Date must be in ISO 8601 format"),
];

export const validateActivityIdParam = [
  param("id").isInt().withMessage("Activity ID must be an integer"),
];
