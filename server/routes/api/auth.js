import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import auth from "../../middleware/auth";
import config from "../../config/index";

const { JWT_SECRET } = config;

import User from "../../models/user";

const router = express.Router();

//@route POST api/auth
//@desc Auth user
//@access Pubic
router.post("/", (req, res) => {
    const { email, password } = req.body;

    //Simple check validation
    if (!email | !password) {
        return res.status(400).json({ msg: "Please fill in required fields" });
    }

    User.findOne({ email }).then((user) => {
        if (!user)
            return res.status(400).json({ msg: "This user does not exist!" });

        bcrypt.compare(password, user.password).then((isMatch) => {
            if (!isMatch) {
                return res
                    .status(400)
                    .json({ msg: "The password is incorrect!" });
            }

            jwt.sign(
                { id: user.id },
                JWT_SECRET,
                { expiresIn: "2 days" },
                (err, token) => {
                    if (err) throw err;

                    res.json({
                        token,
                        user: {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            role: user.role,
                        },
                    });
                }
            );
        });
    });
});
