const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/mydbprac", {
    useNewURLParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
  })
  .then(() => {
    console.log("database connected successfully");
  })
  .catch((err) => {
    console.log("something went wron", err);
  });
