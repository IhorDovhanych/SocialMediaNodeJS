const { createDecipheriv } = require('crypto');
const { Publication, User } = require('../models');

module.exports = {
    // Get all publications
    getPublications(req, res) {
        Publication.find()
            .then((publication) => res.json(publication))
            .catch((err) => res.status(500).json(err));
    },

    // Create new publication
    createPublication(req, res) {
        Publication.create({
            publicationText: req.body.publicationText,
            user: req.body.userId
        })
            .then((dbPublicationData) => {
                return User.findOneAndUpdate(
                    { _id: req.body.userId },
                    { $push: { publications: dbPublicationData._id } },
                    { new: true }
                );
            })
            .then(response => {
                if (!response) {
                    res.status(404).json({ message: 'Error' });
                    return;
                }
                res.json(response)
            })
            .catch(err => res.json(err));
    },

    //Get single publication
    getSinglePublication(req, res) {
        Publication.findOne({ _id: req.params.publicationId })
            .then((publication) =>
                !publication
                    ? res.status(404).json({ message: 'No publication found' })
                    : res.json(publication)
            )
            .catch((err) => res.status(500).json(err));
    },

    //Update a publication
    updatePublication(req, res) {
        Publication.findOneAndUpdate(
            { _id: req.params.publicationId },
            { $set: req.body }
        )
            .then((publication) =>
                !course
                    ? res.status(404).json({ message: 'No publication found' })
                    : res.json(publication)
            )
            .catch((err) => res.status(500).json(err));
    },

    // Delete a publication
    deletePublication(req, res) {
        Publication.findOneAndDelete({ _id: req.params.publicationId })
            .then((publication) =>
                !publication
                    ? res.status(404).json({ message: 'No publication found' })
                    : res.json({ message: 'Publication deleted!' }))
            .catch((err) => res.status(500).json(err));
    },

    // Add comment to a publication
    createComment(req, res) {
        Publication.findOneAndUpdate(
            { _id: req.params.publicationId },
            { $addToSet: { comments: req.body } },
        )
            .then((publication) =>
                !publication
                    ? res
                        .status(404)
                        .json({ message: 'No publication found' })
                    : res.json(publication)
            )
            .catch((err) => res.status(500).json(err));
    },

    // Remove a comment from a publication
    deleteComment(req, res) {
        Publication.findOneAndUpdate(
            { _id: req.params.publicationId },
            { $pull: { comments: { id: req.body.commentId } } },
        )
            .then((user) =>
                !user
                    ? res
                        .status(404)
                        .json({ message: 'No user found' })
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },
}
