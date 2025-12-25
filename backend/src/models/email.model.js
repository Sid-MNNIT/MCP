import mongoose from "mongoose";

const emailSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    emailId: {
      type: String,
      required: true, // Gmail message ID
    },

    provider: {
      type: String,
      enum: ["gmail"],
      default: "gmail",
    },

    type: {
      type: String,
      enum: ["JOB", "INTERVIEW", "OFFER", "REJECTION", "OTHER"],
      required: true,
    },

    from: {
      type: String,
      required: true,
    },

    subject: {
      type: String,
    },

    text: {
      type: String,
    },

    date: {
      type: Date,
      required: true,
    },

    isEmbedded: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// prevent duplicate storage
emailSchema.index({ userId: 1, emailId: 1 }, { unique: true });

export const Email = mongoose.model("Email", emailSchema);
