const mongoose = require("mongoose");

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER_PASS}@cluster0.wtzc1.mongodb.net/anly-project?retryWrites=true&w=majority&appName=Cluster0`
  )
  .then(() => console.log("connexion db ok!"))
  .catch((err) => console.log("Failed to connect to MongoDb", err));
