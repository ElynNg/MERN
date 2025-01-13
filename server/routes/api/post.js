import express from "express";

//Model
import Post from "../../models/post";

const router = express.Router();

router.get("/", async (req, res) => {
    const postFindResult = await Post.find();

    console.log(postFindResult, "All post get!");

    res.json(postFindResult);
});

router.post("/", async (req, res) => {
    try {
        console.log(req, "req");
        const { title, contents, fileUrl, creator } = req.body;
        const newPost = await Post.create({
            title,
            contents,
            fileUrl,
            creator,
        });

        res.json(newPost);
    } catch (e) {
        console.log(e);
    }
});

export default router;
