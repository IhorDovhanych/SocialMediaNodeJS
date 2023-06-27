const { createDecipheriv } = require("crypto");
const { Publication, User } = require("../models");

module.exports = {
    // Get all publications
    async getPublications(req, res) {
        const publication = await Publication.find();
        try {
            res.json(publication);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Create new publication
    async createPublication(req, res) {
        const publication = await Publication.create({
            publicationBody: req.body.publicationBody,
            user: req.body.userId,
        });
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.body.userId },
                { $push: { publications: publication._id } },
                { new: true }
            );
            try {
                res.json(user);
            } catch (err) {
                res.status(500).json(err);
            }
        } catch (err) {
            res.status(500).json(err);
        }
    },

    //Get single publication
    async getSinglePublication(req, res) {
        const publication = await Publication.findOne({
            _id: req.params.publicationId,
        });
        try {
            !publication
                ? res.status(404).json({ message: "No publication found" })
                : res.json(publication);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    //Update a publication
    async updatePublication(req, res) {
        const publication = await Publication.findOneAndUpdate(
            { _id: req.params.publicationId },
            { $set: req.body },
            { new: true }
        );
        try {
            !publication
                ? res.status(404).json({ message: "No publication found" })
                : res.json(publication);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Delete a publication
    async deletePublication(req, res) {
        const publication = await Publication.findOneAndDelete({
            _id: req.params.publicationId,
        });
        try {
            if (!publication) {
                res.status(404).json({ message: "No publication found" });
            } else {
                const user = await User.findOneAndUpdate(
                    { publications: req.params.publicationId },
                    { $pull: { publications: req.params.publicationId } },
                    { new: true }
                );
                res.json({ message: "Publication deleted!", user });
            }
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Add comment to a publication
    async createComment(req, res) {
        const publication = await Publication.findOneAndUpdate(
            { _id: req.params.publicationId },
            { $addToSet: { comments: req.body } },
            { new: true }
        );
        try {
            !publication
                ? res.status(404).json({ message: "No publication found" })
                : res.json(publication);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Remove a comment from a publication
    async deleteComment(req, res) {
        const publication = await Publication.findOne({
            _id: req.params.publicationId,
        });
        const index = publication.comments.findIndex(
            (obj) => obj.id === req.params.commentId
        );
        if (index !== -1) {
            publication.comments.splice(index, 1);

            const updatedPublication = await Publication.findOneAndUpdate(
                { _id: req.params.publicationId },
                { $set: { comments: publication.comments } },
                { new: true }
            );
            try {
                !publication
                    ? res.status(404).json({ message: "No publication found" })
                    : res.json(updatedPublication);
            } catch (err) {
                res.status(500).json(err);
            }
        } else {
            res.status(500).json({ message: "Comment not found" });
        }
    },

    async updateComment(req, res) {
        const publication = await Publication.findOne({
            _id: req.params.publicationId,
        });
        const index = publication.comments.findIndex(
            (obj) => obj.id === req.params.commentId
        );
        if (index !== -1) {
            publication.comments[index].commentBody = req.body.commentBody;

            const updatedPublication = await Publication.findOneAndUpdate(
                { _id: req.params.publicationId },
                { $set: { comments: publication.comments } },
                { new: true }
            );
            try {
                !publication
                    ? res.status(404).json({ message: "No publication found" })
                    : res.json(updatedPublication);
            } catch (err) {
                res.status(500).json(err);
            }
        } else {
            res.status(500).json({ message: "Comment not found" });
        }
    },
};
