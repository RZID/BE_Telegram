const model = require("../model/user");
const bcrypt = require("bcrypt");
const responser = require("../helper/responser");
const jwt = require("jsonwebtoken");
module.exports = {
  login: (req, res) => {
    model
      .login(req.body.email)
      .then(async (response) => {
        if (response.length < 1) {
          return responser.unauthorized(res, "User unregistered");
        } else {
          const checkPass = await bcrypt.compare(
            req.body.pass,
            response[0].pass_user
          );
          if (checkPass) {
            const userData = {
              name: response[0].name_user,
              email: response[0].email_user,
            };
            const tokenization = jwt.sign(userData, process.env.JWT_SECRET);
            responser.ok(res, {
              name: response[0].name_user,
              email: response[0].email_user,
              token: tokenization,
            });
          } else {
            return responser.unauthorized(res, "Password Wrong!");
          }
        }
      })
      .catch((err) => {
        if (err.message == 401) {
          return responser.unauthorized(res, "Unactivated Account");
        } else if (err.message == 404) {
          return responser.notFound(res, "Account unregistered");
        } else {
          return responser.ise(res, err);
        }
      });
  },
  register: async (req, res) => {
    const salt = await bcrypt.genSalt();
    req.body.pass = await bcrypt.hash(req.body.pass, salt);
    model
      .register(req.body.name, req.body.email, req.body.pass)
      .then((response) => {
        responser.ok(
          res,
          "Succesfully registered! Check your email for verification"
        );
      })
      .catch((err) => {
        if (err.message == 409) {
          responser.conflict(res, "User Already Exists!");
        } else {
          responser.ise(res, err);
        }
      });
  },
  getUserData: (req, res) => {
    model
      .getUserData(req.body.email)
      .then((result) => {
        responser.ok(res, result);
      })
      .catch((err) => {
        responser.ise(res, err);
      });
  },
  setProfile: (req, res) => {
    if (req.file) {
      if (req.body.email) {
        model
          .insertPhoto(req.body.email, req.file.filename)
          .then((resolve) => {
            responser.ok(res, resolve);
          })
          .catch((err) => responser.ise(res, err.message));
      } else {
        responser.ise(res, "Check your email!");
      }
    }
  },
  setName: (req, res) => {
    if (req.body.email && req.body.name) {
      model
        .setName(req.body.email, req.body.name)
        .then((response) => {
          responser.ok(res, response);
        })
        .catch((err) => responser.ise(res, err));
    } else {
      responser.conflict(res, "Fill all input!");
    }
  },
  setLocation: (req, res) => {
    if (req.body.email && req.body.lat && req.body.long) {
      model
        .setLocation(req.body.email, req.body.lat, req.body.long)
        .then((response) => {
          responser.ok(res, response);
        })
        .catch((err) => responser.ise(res, err));
    } else {
      responser.conflict(res, "Fill all input!");
    }
  },
  getUser: (req, res) => {
    if ((req.query.email, req.query.me)) {
      model
        .getUser(req.query.email)
        .then((response) => {
          responser.ok(res, response);
        })
        .catch((err) => {
          console.log(err);
          responser.ise(res, err);
        });
    } else {
      responser.conflict(res, "Ooops...");
    }
  },
  addRooms: (req, res) => {
    if (req.body.participant1 && req.body.participant2) {
      const unique = jwt.sign(
        { 1: req.body.participant1, 2: req.body.participant2 },
        process.env.JWT_SECRET
      );
      model
        .addNewRoom(unique)
        .then(() => {
          const arrayUsers = [req.body.participant1, req.body.participant2];
          arrayUsers.map((el) => model.addParticipant(el, unique));
        })
        .catch((err) => responser.ise(res, err));
      responser.ok(res, unique);
    } else {
      responser.conflict(res, "Fill all input!");
    }
  },
};
