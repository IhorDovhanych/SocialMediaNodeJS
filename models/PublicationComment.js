// Require schema and model from mongoose
const { Schema } = require("mongoose");
// const { User } = require('./User');
// Construct a new instance of the schema class
const publicationCommentSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "user id not found"],
        },
        commentBody: {
            type: String,
            required: [true, "Please enter a comment to publication"],
            minLength: 1,
            maxLength: 280,
        },
        createdAt: {
            type: Date,
            default: Date.now(),
        },
    },
    {
        toJSON: {
            getters: true,
        },
        id: true,
    }
);

// Export
module.exports = publicationCommentSchema;
