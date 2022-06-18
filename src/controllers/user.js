import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import passport from "passport";

import db from "../models";
const User = db.User;
const UserType = db.UserType;

// load input validation
import validateRegisterForm from "../validation/register";
import validateLoginForm from "../validation/login";

// create user
const create = (req, res) => {
  const { errors, isValid } = validateRegisterForm(req.body);
  let {
    firstname,
    lastname,
    email,
    password,
    address,
    city,
    UserTypeId,
    phone,
  } = req.body;

  // check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findAll({
    where: { email },
  }).then((user) => {
    if (user.length) {
      return res.status(400).json({ email: "Email already exists!" });
    } else {
      let newUser = {
        firstname,
        lastname,
        email,
        password,
        address,
        city,
        phone,
        UserTypeId,
        user_image: "",
      };

      if (req.file) {
        let imgPath = process.env.IMG_PATH + req.file.filename;
        newUser.user_image = imgPath;
      }

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          User.create(newUser)
            .then((user) => {
              res.json({ user });
            })
            .catch((err) => {
              res.status(500).json({ err });
            });
        });
      });
    }
  });
};

const login = (req, res) => {
  const { errors, isValid } = validateLoginForm(req.body);

  // check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { email, password } = req.body;

  User.findAll({
    where: {
      email,
    },
    attributes: { exclude: ['password", "createdAt", "updatedAt'] },
  })
    .then((user) => {
      //check for user
      if (!user.length) {
        errors.email = "User not found!";
        return res.status(404).json(errors);
      }

      let originalPassword = user[0].dataValues.password;

      //check for password
      bcrypt
        .compare(password, originalPassword)
        .then((isMatch) => {
          if (isMatch) {
            // user matched
            console.log("matched!");
            const { id, username } = user[0].dataValues;
            const payload = { id, username }; //jwt payload
            // console.log(payload)

            jwt.sign(
              payload,
              "secret",
              {
                expiresIn: "24h",
              },
              (err, token) => {
                res.json({
                  success: true,
                  token: "Bearer " + token,
                  user: user[0].dataValues,
                });
              }
            );
          } else {
            errors.password = "Password not correct";
            return res.status(400).json(errors);
          }
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => res.status(500).json({ err }));
};

// fetch all users
const findAllUsers = async (req, res) => {
  await User.findAll({
    attributes: { exclude: ["password", "createdAt", "updatedAt"] },
    include: {
      model: UserType,
      attributes: {
        include: [["name", "type_name"]],
        // exclude: ["name", "accessLevel", "role"],
      },
    },
  })
    .then((user) => {
      res.json({ user });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ err });
    });
};

// fetch user by userId
const findById = (req, res) => {
  const id = req.params.userId;

  User.findAll({
    where: { id },
    // include: ["marks", "dept"],
    include: [{ all: true }],
    attributes: { exclude: ["password", "createdAt", "updatedAt"] },
  })
    .then((user) => {
      if (!user.length) {
        return res.json({ msg: "user not found" });
      }
      res.json({ user });
    })
    .catch((err) => res.status(500).json({ err }));
};

// update a user's info
const update = (req, res) => {
  let user = req.body;
  const id = req.params.userId;

  if (!req.file) {
    user.user_image = user.user_image || "";
  } else {
    let imgPath = process.env.IMG_PATH + req.file.filename;
    user.user_image = imgPath;
  }

  if (user.password) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) throw err;
        user.password = hash;
        User.update(user, { where: { id } })
          .then((user) => res.status(200).json({ user }))
          .catch((err) => res.status(500).json({ err }));
      });
    });
  } else {
    User.update(user, { where: { id } })
      .then((user) => res.status(200).json({ user }))
      .catch((err) => res.status(500).json({ err }));
  }
};

// delete a user
const deleteUser = (req, res) => {
  const id = req.params.userId;

  User.destroy({ where: { id } })
    .then((user) =>
      res.status(200).json({ msg: "User has been deleted successfully!" })
    )
    .catch((err) => res.status(500).json({ msg: "Something went wrong." }));
};

export { create, login, findAllUsers, findById, update, deleteUser };
