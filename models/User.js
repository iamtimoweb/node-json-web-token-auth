const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

// create a schema for the model
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: [true, "please enter an email address"],
            unique: true,
            lowercase: true,
            validate: [isEmail, "please enter a valid email"],
        },
        password: {
            type: String,
            required: [true, "please enter a password"],
            minlength: [8, "The password should atleast be 8 characters"],
        },
    },
    { timestamps: true }
);

/*
 * Mangoose Hooks
 */
// fire a function before doc is saved to the database
userSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// static method to login the user
userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });
    if (user) {
        // compare the password
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error("Incorrect Password");
    }
    throw Error("Incorrect Email Address");
};

const User = mongoose.model("User", userSchema);
module.exports = User;
