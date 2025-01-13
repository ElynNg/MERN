import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config/index";

const { JWT_SECRET } = config;

//Model
import User from "../../models/user";

const router = express.Router();

//@routes       GET apt/user
//@desc     Get all users
//@access public

router.get("/", async (req, res) => {
    try {
        const users = await User.find();

        if (!users) throw Error("No users!");
        console.log(users);
        res.status(200).json(users);
    } catch (e) {
        console.log(e);
        res.status(400).json({ msg: e.message });
    }
});

//@routes POST api/user
//@desc Register new user
//@access public
router.post("/", async (req, res) => {
    console.log(req.body);

    const { name, email, password } = req.body;

    //Simple validation
    if (!name || !email || !password) {
        return res.status(400).json({ msg: "* field are required!" });
    }

    //Check for existing user
    User.findOne({ email }).then((user) => {
        if (user)
            return res.status(400).json({ msg: "Already existing user!" });

        const newUser = new User({ name, email, password });

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;

                newUser.password = hash;
                newUser.save().then((user) => {
                    jwt.sign(
                        { id: user.id },
                        JWT_SECRET,
                        { expiresIn: 3600 },
                        (err, token) => {
                            if (err) throw err;
                            res.json({
                                token,
                                user: {
                                    id: user.id,
                                    name: user.name,
                                    email: user.email,
                                },
                            });
                        }
                    );
                });
            });
        });
    });
});

export default router;
