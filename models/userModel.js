const mongoose = require("mongoose");
const validator = require("validator");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      text: true,
      minLength: [3, "Name must have not less than 3 characters."],
      maxLength: [10, "Name must have not more than 10 characters."],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      text: true,
    },
    username: {
      type: String,
      trim: true,
      text: true,
      unique: [true, "Username must be unique."],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      validate: [validator.isEmail, "Invalid email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [6, "Password must have at least 6 characters"],
      select: false,
    },

    passwordConfirm: {
      type: String,
      required: [true, "Confirm password is required"],
      validate: {
        // eslint-disable-next-line object-shorthand
        validator: function (el) {
          return el === this.password;
        },
        message: "Confirm password must be the same as password.",
      },
    },
    picture: {
      type: String,
      trim: true,
      default:
        "https://res.cloudinary.com/dmhcnhtng/image/upload/v1643044376/avatars/default_pic_jeaybr.png",
    },
    cover: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      trim: true,
    },
    bYear: {
      type: Number,
      required: true,
      trim: true,
    },
    bMonth: {
      type: Number,
      required: true,
      trim: true,
    },
    bDay: {
      type: Number,
      required: true,
      trim: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    friends: {
      type: Array,
      default: [],
    },
    following: {
      type: Array,
      default: [],
    },
    followers: {
      type: Array,
      default: [],
    },
    requests: {
      type: Array,
      default: [],
    },
    search: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
        },
      },
    ],
    details: {
      bio: {
        type: String,
      },
      otherName: {
        type: String,
      },
      job: {
        type: String,
      },
      workplace: {
        type: String,
      },
      highSchool: {
        type: String,
      },
      college: {
        type: String,
      },
      currentCity: {
        type: String,
      },
      hometown: {
        type: String,
      },
      relationship: {
        type: String,
        enum: ["Single", "In a relationship", "Married", "Divorced"],
      },
      instagram: {
        type: String,
      },
    },
    savedPosts: [
      {
        post: {
          type: mongoose.Schema.ObjectId,
          ref: "Post",
        },
        savedAt: {
          type: Date,
          default: new Date(),
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
  }

  next();
});

userSchema.plugin(uniqueValidator);

const User = mongoose.model("User", userSchema);
module.exports = User;
