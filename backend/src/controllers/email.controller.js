import { Email } from "../models/email.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//store emails
const storeEmail = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const {
    emailId,
    type,
    from,
    subject,
    text,
    date,
  } = req.body;

  if (!emailId || !type || !from || !date) {
    throw new Error("Missing required email fields");
  }

  const email = await Email.create({
    userId,
    emailId,
    type,
    from,
    subject,
    text,
    date: new Date(date),
  });

  return res.status(201).json({
    success: true,
    message: "Email stored successfully",
    email,
  });
});

//list emails
const listEmails = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { type } = req.query;

  const filter = { userId };
  if (type) {
    filter.type = type;
  }

  const emails = await Email.find(filter)
    .sort({ date: -1 })
    .limit(5);

  return res.status(200).json({
    success: true,
    count: emails.length,
    emails,
  });
});

//delete email
const deleteEmail = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;

  const deletedEmail = await Email.findOneAndDelete({
    _id: id,
    userId, //ensure user can delete only their own email
  });

  if (!deletedEmail) {
    return res.status(404).json({
      success: false,
      message: "Email not found or unauthorized",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Email deleted successfully",
  });
});

export {
  storeEmail,
  listEmails,
  deleteEmail,
};
