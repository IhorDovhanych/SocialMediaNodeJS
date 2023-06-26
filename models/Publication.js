// Require schema and model from mongoose
const { Schema, model } = require('mongoose');
const publicationCommentSchema = require('./PublicationComment');
const User = require('./User');

// Construct a new instance of the schema class
const publicationSchema = new Schema({
    publicationBody: {
        type: String,
        required: [true, 'Please enter a publication text'],
        minLength: 1,
        maxLength: 280
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'user id not found']
    },
    comments: [publicationCommentSchema],
},
    {
        toJSON: {
            virtuals: true,
            getters: true,
        },
        id: false
    }
)

//Virtual returns number of publications for each publication
publicationSchema.virtual('publicationCount').get(function () {
    return this.publications.length
})

// Create Publication model via publicationSchema
const Publication = model('publication', publicationSchema);

// Export
module.exports = Publication;