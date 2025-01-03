require("dotenv").config();

const express = require("express");

const cookieParser = require("cookie-parser");

const bodyParser = require("body-parser");

const app = express();

const cors = require("cors");

const helmet = require('helmet');

app.use(cors());

app.use(bodyParser.json({ limit: "20mb" }));

app.use(bodyParser.urlencoded({ limit: "20mb", extended: true }));

app.use(cookieParser());

app.use(helmet());

// Empty GET request to check if server is running
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// changed port to env for auto porting from heroku
const PORT = process.env.PORT || 3005

app.listen(PORT, () => { console.log(`Server listening on port ${PORT}...`); });

require("./routes")(app);
