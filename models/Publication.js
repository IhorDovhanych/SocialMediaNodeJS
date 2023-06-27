// Require schema and model from mongoose
const { Schema, model } = require("mongoose");
const publicationCommentSchema = require("./PublicationComment");
const User = require("./User");

// Construct a new instance of the schema class
const publicationSchema = new Schema(
    {
        publicationBody: {
            type: String,
            required: [true, "Please enter a publication body"],
            minLength: 1,
            maxLength: 280,
        },
        createdAt: {
            type: Date,
            default: Date.now(),
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User id not found"],
        },
        comments: [publicationCommentSchema],
    },
    {
        toJSON: {
            virtuals: true,
            getters: true,
        },
        id: false,
    }
);

//Virtual returns number of publications for each publication
publicationSchema.virtual("commentsCount").get(function () {
    return this.comments.length;
});

// Create Publication model via publicationSchema
const Publication = model("publication", publicationSchema);

// Export
module.exports = Publication;
