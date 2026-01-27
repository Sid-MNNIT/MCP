import { Email } from "../models/email.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { emailService } from "../services/email.service.js";

//store emails
const storeEmail = asyncHandler(async (req, res) => {
  console.log("req.user in storeEmail:", req.user);

  const userId = req.user._id;

  const { emailId,threadId, type, from, subject, text, date } = req.body;

  if (!emailId || !type || !from || !date || !threadId) {
    throw new Error("Missing required email fields");
  }

  const email = await Email.findOneAndUpdate(
    { userId, emailId },
    {
      $set: {
        provider: "gmail",
        type,
        from,
        subject,
        threadId,
        text,
        date: new Date(date),
        isEmbedded: false,
      },
    },
    { upsert: true, new: true }
  );

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

const getUserEmail=asyncHandler(async (req,res)=>{
  const emails=await Email.find({userId:req.user._id})
  .sort({date:-1})
  .lean();

  res.status(200).json({
    success:true,
    emails
  })
})

const executeAgentTool=asyncHandler(async (req, res)=> {
  try {
    const { tool, args } = req.body;
    const userId = req.user._id;

    const jwt =
      req.headers.authorization?.replace("Bearer ", "") ||
      req.cookies?.accessToken;

    const result = await emailService.executeTool({
      tool,
      args,
      userId,
      jwt
    });

    return res.json(result);
  } catch (err) {
    console.error("❌ executeAgentTool failed:", err.message);
    return res.status(500).json({
      error: "Agent execution failed",
      details: err.message
    });
  }
}
)

const  emailReplyPreview=asyncHandler(async (req, res)=> {
  try {
    const { messageId, tone = "professional" } = req.body;
    const userId = req.user._id;

    const jwt =
      req.headers.authorization?.replace("Bearer ", "") ||
      req.cookies?.accessToken;

    const result = await emailService.previewEmailReply({
      messageId,
      tone,
      userId,
      jwt
    });

    return res.json(result);
  } catch (err) {
    console.error("❌ emailReplyPreview failed:", err.message);
    return res.status(500).json({
      error: "AI reply preview failed",
      details: err.message
    });
  }
}
)

const emailReplySend=asyncHandler(async (req, res)=> {
  try {
    const userId = req.user._id;

    const jwt =
      req.headers.authorization?.replace("Bearer ", "") ||
      req.cookies?.accessToken;

    const result = await emailService.sendEmailReply({
      draft: req.body,
      userId,
      jwt
    });

    return res.json(result);
  } catch (err) {
    console.error("❌ emailReplySend failed:", err.message);
    return res.status(500).json({
      error: "Failed to send email",
      details: err.message
    });
  }
}
)

const emailSync=asyncHandler(async (req, res)=> {
  try {
    const userId = req.user._id;

    const jwt =
      req.headers.authorization?.replace("Bearer ", "") ||
      req.cookies?.accessToken;

    const result = await emailService.syncEmails({
      userId,
      jwt
    });

    return res.json(result);
  } catch (err) {
    console.error("❌ emailSync failed:", err.message);
    return res.status(500).json({
      error: "Email sync failed",
      details: err.message
    });
  }
}
)

export {
  storeEmail,
  listEmails,
  deleteEmail,
  getUserEmail,
  emailReplyPreview,
  emailSync,
  emailReplySend,
  executeAgentTool
};
