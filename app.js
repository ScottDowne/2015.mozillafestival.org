var express = require('express'),
    Habitat = require('habitat'),
    path = require('path'),
    request = require('request'),
    bodyParser = require('body-parser'),
    compression = require('compression'),
    RateLimit = require('express-rate-limit'),
    GoogleSpreadsheet = require("google-spreadsheet");

Habitat.load();

var app = express(),
  env = new Habitat();

app.enable('trust proxy');

var limiter = RateLimit({
  windowMs: 60 * 1000,
  delayMs: 1000,
  max: 5,
  global: false
});

app.configure(function() {
  app.use(compression());
  app.use(express.static(__dirname + '/public', {maxAge: 3600000}));
  app.use(bodyParser.json());
  app.use(function(err, req, res, next) {
    res.send(err);
  });
});

app.post('/add-session', limiter, function (req, res) {
  var sessionName = req.body.sessionName;
  var firstName = req.body.firstName;
  var surname = req.body.surname;
  var email = req.body.email;
  var organization = req.body.organization;
  var twitter = req.body.twitter;
  var otherFacilitators = req.body.otherFacilitators;
  var description = req.body.description;
  var agenda = req.body.agenda;
  var participants = req.body.participants;
  var outcome = req.body.outcome;
  var theme = req.body.theme;
  var mode = req.body.mode;
  var audience = req.body.audience;

  /*request({
    method: 'POST',
    url: "https://docs.google.com/forms/d/1MdPWZ6GsMpDiZnq3qwCfQSJ-7icdCQYGWuHIXrPlO3g/formResponse",
    form: {
      "entry.1997444383": sessionName,
      "entry.1998897375": firstName,
      "entry.2103035832": surname,
      "entry.867181236": email,
      "entry.2119147272": organization,
      "entry.19580374": twitter,
      "entry.1737828681": otherFacilitators,
      "entry.2044069696": description,
      "entry.415053139": agenda,
      "entry.1536930973": participants,
      "entry.70607986": outcome,
      "entry.1933249344": theme,
      "entry.1397401732": mode,
      "entry.91255530": audience
    }
  }, function(err) {
    if (err) {
      res.status(500).send({error: err});
    } else {
      hatchet.send("mozfest_session_proposal", {
        email: email
      }, function(err, data) {
        if (err) {
          console.error("Error sending email: " + err);
        } else {
          console.log("we sent a message!");
        }
      });
      res.send("Ok");
    }
  });*/
  res.send("Ok");
});

/* ********************
* temporarily disable posting to /add-fringe-event 
* leaving code here so we can quickly turn these pages back on in June and September
******************** */

// app.post('/add-fringe-event', limiter, function (req, res) {
//   var userInputs = {};
//   var fringeFormFields = env.get("FRINGE_FORM_FIELD");
//   var realFieldNames = {
//     name: fringeFormFields.name,
//     time: fringeFormFields.time,
//     location: fringeFormFields.location,
//     description: fringeFormFields.description,
//     link: fringeFormFields.link,
//     privacy: fringeFormFields.privacy
//   };
//   Object.keys(req.body).forEach(function(maskedFieldName){
//     var realFieldName = realFieldNames[maskedFieldName];
//     userInputs[realFieldName] = req.body[maskedFieldName];
//   });
//   request({
//     method: 'POST',
//     url: env.get('FRINGE_EVENT_FORM_ACTION_URL'),
//     form: userInputs
//   }, function(err) {
//     if (err) {
//       console.log("[Error] ", err);
//       res.status(500).send({error: err});
//     } else {
//       res.send("Ok");
//     }
//   });
// });

app.get('*', function (request, response) {
  response.sendfile(path.join(__dirname, '/public/index.html'));

  /* ********************
  * temporarily disable the following
  * leaving code here so we can quickly turn these pages back on in June and September
  ******************** */

  // if (request.path === "/get-fringe-events") {
  //   // this fetches data stored in the Fringe Events Google Spreadsheet
  //   var sheet = new GoogleSpreadsheet(env.get('FRINGE_EVENT_SPREADSHEET_ID'));
  //   sheet.getRows(1, function(err, rows){
  //     if (err) {
  //       console.log("[Error] ", err);
  //       response.status(500).json(err);
  //     } else {
  //       response.send( rows.filter(function(row) {
  //                       return row.approved;
  //                     }));
  //     }
  //   });
  // } else {
  //   response.sendfile(path.join(__dirname, '/public/index.html'));
  // }
});

app.listen(env.get('PORT'), function () {
  console.log('Server listening ( http://localhost:%d )', env.get('PORT'));
});
