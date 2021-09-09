const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

userSchema.methods.generateAuthToken = async function () {
  try {
    console.log(this._id);
    const token = jwt.sign(
      { _id: this._id.toString() },
      "mynameisasimsoftwareengineer"
    );

    this.tokens = this.tokens.concat({ token });

    await this.save();

    return token;
  } catch (error) {
    console.log("there is an error in generation token at registeration time");
  }
};

const users = mongoose.model("Users", userSchema);

module.exports = users;
