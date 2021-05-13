const express = require("express");
const axios = require("axios");
const connection = require("../db/conn");

const router = express.Router();

// post request handler
router.post("/", (req, res) => {
  // getting data from user
  const { translateText, sourceLang, targetLang } = req.body;

  // checking, previous translations to avoid repeated hits
  const sql = `SELECT * FROM translated_data WHERE source_language = '${sourceLang}' AND target_language = '${targetLang}' AND text = '${translateText}'`;

  connection.query(sql, function (err, result) {
    if (err) {
      return res.status(500).json({ status: "error" });
    }

    if (result != "") {
      // if translation already present
      return res.status(200).json({ status: "ok", data: result[0] });
    } else {
      const translateTextURI = encodeURI(translateText);

      // Calling API to translate text
      const url = `https://script.google.com/macros/s/AKfycbwwsTatVWPrVsdTWQCHMBSKLg3dSicsWrU0JHc_AdiCuN7gHsA/exec?q=${translateTextURI}&source=${sourceLang}&target=${targetLang}`;

      axios.default
        .get(url)
        .then((response) => {
          let obj = {
            from: sourceLang,
            to: targetLang,
            translated_text: response.data,
          };

          // Insert translated data to database for future use
          const sql = `INSERT INTO translated_data (source_language, target_language, text, translated_text) VALUES ('${sourceLang}', '${targetLang}', '${translateText}', '${response.data}')`;

          connection.query(sql, function (err, result) {
            if (err) {
              return res.status(500).json({ status: "error" });
            } else {
              // Sending translated data to user
              return res.status(200).json({ status: "ok", data: obj });
            }
          });
        })
        .catch((err) => {
          res.status(500).json({ status: "error" });
        });
    }
  });
});

module.exports = router;
