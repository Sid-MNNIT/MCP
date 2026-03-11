import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: function () {
        // password required ONLY for local auth
        return this.provider === "local";
      },
    },

    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    googleId: {
      type: String,
    },

    refreshToken: {
      type: String,
    },

    lastLogin: {
      type: Date,
    },

    //profile

    fullname: {
      type: String,
      required: true,
      trim: true,
    },

    age: {
      type: Number,
      required: false,
    },

    about: {
      type: String,
      maxlength: 500,
    },

    phone: {
      type: String
    },

    location: {
      city: String,
      country: {
        type: String,
        default: "India",
      },
    },

    openToWork: {
      type: Boolean,
      default: false,
    },

    socials: {
      github: String,
      linkedin: String,
      twitter: String,
      portfolio: String,
    },

    avatar: {
      type: String,
    },

    headline: {
      type: String,
      maxlength: 100,
    },

    /* -------------------- */
    /* CAREER PROFILE       */
    /* -------------------- */

    skills: {
      type: [String],
      default: [],
    },

    experience: [
      {
        title: { type: String, required: true },
        company: { type: String, required: true },
        startDate: Date,
        endDate: Date,
        isCurrent: {
          type: Boolean,
          default: false,
        },
        description: String,
      },
    ],

    education: [
      {
        degree: String,
        fieldOfStudy: String,  // ← NEW
        institution: String,
        year: Number,
      },
    ],

    // system flags

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isProfileComplete: {
      type: Boolean,
      default: false,
    },
    isGmailConnected: {
      type: Boolean,
      default: false
    },

    /* -------------------- */
    /* NOTIFICATION PREFS   */
    /* -------------------- */

    notificationPrefs: {
      interviewAlerts: { type: Boolean, default: true },
      rejectionAlerts: { type: Boolean, default: true },
      offerAlerts:     { type: Boolean, default: true },
      assessmentAlerts:{ type: Boolean, default: false },
      weeklyDigest:    { type: Boolean, default: false },
    },


    /* -------------------- */
    /* RESUME DATA          */
    /* -------------------- */

    // resume: {
    //   skills: {
    //     type: [String],
    //     default: [],
    //   },
    //   preferredSkills: {
    //     type: [String],
    //     default: [],
    //   },
    //   experience: {
    //     type: Number, // years
    //     default: 0,
    //   },
    //   education: {
    //     type: [String],
    //     default: [],
    //   },
    //   contact: {
    //     email: String,
    //     phone: String,
    //   },
    //   uploadedAt: {
    //     type: Date,
    //   },
    // },

    /* -------------------- */
    /* JOB PREFERENCES      */
    /* -------------------- */

    jobPreferences: {
      country: {
        type: String,
        default: "in",
      },
      city: {
        type: String,
      },
      remoteOnly: {
        type: Boolean,
        default: false,
      },
      jobTypes: {
        type: [String], // full-time, part-time, contract
        default: [],
      },
      minSalary: {
        type: Number,
      },
      maxSalary: {
        type: Number,
      },
    },

    /* -------------------- */
    /* SAVED JOBS           */
    /* -------------------- */

    savedJobs: [
      {
        id: {
          type: String,
          required: true,
        },
        title: String,
        company: String,
        location: String,
        url: String,
        matchScore: Number,
        savedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);

});


userSchema.methods.isPasswordCorrect = async function (password) {
  if (!this.password) return false;
  return bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
