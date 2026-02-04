import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one resume per user
      index: true
    },

    filename: { type: String, default: "resume.pdf" },
    mimetype: { type: String, default: "application/pdf" },
    size: { type: Number, default: 0 },

    // where the PDF is stored on disk
    storagePath: { type: String, required: true },

    uploadedAt: { type: Date, default: Date.now },

    // output from MCP parsing pipeline
    parsed_resume: { type: mongoose.Schema.Types.Mixed, default: {} },

    // ATS score output
    score: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const Resume = mongoose.model("Resume", ResumeSchema);
