// Require schema and model from mongoose
const { Schema, model } = require('mongoose');
// Require publicationSchema for 'publications' key
//const publicationSchema = require('./Publication');

// Construct a new instance of the schema class
const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Please enter a username'],
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Please enter an email'],
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minLength: 8,
    },
    publications: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Publication',
        },
    ],
    friends: [this],
    friendsRequests: [this]
},
    {
        toJSON: {
            getters: true,
        },
    }
);

// Create User model via userSchema
const User = model('user', userSchema);



// Export
module.exports = User;
