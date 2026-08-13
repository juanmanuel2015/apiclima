require("dotenv").config();

module.exports = {
  port: process.env.PORT || 3001,
  apiKey: process.env.OPENWEATHER_API_KEY
};