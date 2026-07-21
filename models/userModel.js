const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Your Name"],
    },
    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true
    },
    gender: {
        type: String,
        required: [true, "Please Enter Gender"]
    },
    password: {
        type: String,
        required: [true, "Please Enter Your Password"],
        minLength: [8, "Password should have atleast 8 characters"],
        select: false,
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "Doctor", "Admin"]
    },

    // Doctor extra fields
    qualification: {
        type: String,
        required: function () { return this.role === "Doctor"; }
    },
    specialization: {
        type: String,
        required: function () { return this.role === "Doctor"; }
    },
    registrationNumber: {
        type: String,
        required: function () { return this.role === "Doctor"; }
    },
    medicalCouncilName: {
        type: String,
        required: function () { return this.role === "Doctor"; }
    },
    yearsOfExperience: {
        type: Number,
        required: function () { return this.role === "Doctor"; }
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,
});


// HASH PASSWORD
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});


// JWT TOKEN
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, "FLIPKART", {
        expiresIn: "3d"
    });
};


// COMPARE PASSWORD
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};


// RESET PASSWORD TOKEN
userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto.createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
};

module.exports = mongoose.model("User", userSchema);
