const { User } = require('../models');
const bcrypt = require('bcrypt')

module.exports = {
    // Get all users
    getUsers(req, res) {
        User.find()
            .then((user) => res.json(user))
            .catch((err) => res.status(500).json(err));
    },

    //Create new user
    async createUser(req, res) {
        const hashedPass = await bcrypt.hash(req.body.password, 10)
        const user = {
            username: req.body.username,
            email: req.body.email,
            password: hashedPass
        }
        User.create(user)
            .then((user) => res.json(user))
            .catch((err) => res.status(500).json(err));
    },

    //Login user
    async loginUser(req, res) {
        try{
            const check = await User.collection.findOne({email: req.body.email})
            // checking do password is fit each other
            if(await bcrypt.compare(req.body.password, check.password)){
                res.send(true)
            }else{
                res.status(400).send({message:'wrond password'})
            }
        }catch{
            res.status(400).send({message:'wrong details'})
        }
    },

    //Get single user
    getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId })
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No user found with that ID' })
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },

    //Update a user
    updateUser(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body }
        )
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No user found' })
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },

    // Delete a user
    deleteUser(req, res) {
        User.findOneAndDelete({ _id: req.params.userId })
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No user found' })
                    : res.json({ message: 'User deleted!' }))
            .catch((err) => res.status(500).json(err));
    },

    // Send a friend request to a user
    sendFriendRequest(req, res) {
        if(req.params.userId === req.params.friendId){
            res.status(400).json({ message: "You can't send request ti yourself"})
        }
        else{
            User.findOneAndUpdate(
                { _id: req.params.userId },
                { $addToSet: { friendsRequests: req.params.friendId } },
                { new:true },
            )
                .then((user) =>
                    !user
                        ? res
                            .status(404)
                            .json({ message: 'No user found' })
                        : res.json(user)
                )
                .catch((err) => res.status(500).json(err));
        }
    },

    // Accept a friend request to a user
    acceptFriendRequest(req, res) {
        User.findOne({ _id: req.params.userId })
            .then((user) => {
                const index = user.friendsRequests.indexOf(req.params.friendId)
                if(index !== -1){
                    User.findOneAndUpdate(
                        { _id: req.params.userId },
                        {
                            $addToSet: { friends: req.params.friendId },
                            $pull: {friendsRequests: req.params.friendId}
                        },
                        { new:true },
                    )
                        .then((user) =>
                            res.json(user)
                        )
                        .catch((err) => res.status(500).json(err));
                }else{
                    res.status(400).json({ message: 'No user found' })
                }
            })
    },

    // Remove a friend from a user
    deleteFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId } },
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

    // Remove a friend from a user
    deleteFriendRequest(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friendsRequests: req.params.friendId } },
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

    getFriendsList(req, res){
        User.findOne({ _id: req.params.userId })
            .then((user) => {
                res.status(200)
                res.json({ friends: user.friends })
            })
    },

    getFriendRequestsList(req, res){
        User.findOne({ _id: req.params.userId })
            .then((user) => {
                res.status(200)
                res.json({ friendsRequests: user.friendsRequests })
            })
    }
}
