const { User } = require("../models");
const bcrypt = require("bcrypt");

module.exports = {
    // Get all users
    async getUsers(req, res) {
        const user = await User.find();
        try {
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    //Get single user
    async getSingleUser(req, res) {
        const user = await User.findOne({ _id: req.params.userId });
        try {
            !user
                ? res
                      .status(404)
                      .json({ message: "No user found with that ID" })
                : res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    //Create new user
    async registerUser(req, res) {
        if (req.body.password.length >= 8) {
            const hashedPass = await bcrypt.hash(req.body.password, 10);
            const userBody = {
                username: req.body.username,
                email: req.body.email,
                password: hashedPass,
            };
            const user = await User.create(userBody);
            try {
                res.json(user);
            } catch (err) {
                res.status(500).json(err);
            }
        } else {
            res.status(400).send({
                message: "Password must be 8 symbols at least",
            });
        }
    },

    //Login user
    async loginUser(req, res) {
        try {
            const check = await User.collection.findOne({
                email: req.body.email,
            });
            // checking do password is fit each other
            if (await bcrypt.compare(req.body.password, check.password)) {
                res.send(true);
            } else {
                res.status(400).send({ message: "Wrond password" });
            }
        } catch {
            res.status(400).send({ message: "Wrong details" });
        }
    },

    //Update a user
    async updateUser(req, res) {
        if (req.body.password == null && req.body.password == undefined) {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $set: req.body },
                { new: true }
            );
            try {
                !user
                    ? res.status(404).json({ message: "No user found" })
                    : res.json(user);
            } catch (err) {
                res.status(500).json(err);
            }
        } else {
            res.status(400).json({ message: "You can't change password here" });
        }
    },

    // Delete a user
    async deleteUser(req, res) {
        const user = await User.findOneAndDelete({ _id: req.params.userId });
        try {
            !user
                ? res.status(404).json({ message: "No user found" })
                : res.json({ message: "User deleted!" });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Send a friend request to a user
    async sendFriendRequest(req, res) {
        if (req.params.userId === req.params.friendId) {
            res.status(400).json({
                message: "You can't send request to yourself",
            });
        } else {
            const user = await User.findOne({ _id: req.params.userId });

            if (user.friendsRequests.includes(req.params.friendId)) {
                const user = await User.findOneAndUpdate(
                    { _id: req.params.userId },
                    {
                        $pull: { friendsRequests: req.params.friendId },
                        $addToSet: { friends: req.params.friendId },
                    },
                    { new: true }
                );
                const friend = await User.findOneAndUpdate(
                    { _id: req.params.friendId },
                    {
                        $addToSet: { friends: req.params.userId },
                        $pull: { friendsRequests: req.params.userId },
                    },
                    { new: true }
                );

                try {
                    res.status(200);
                    res.json({ user1: user, user2: friend });
                } catch (err) {
                    (err) => res.status(500).json(err);
                }
            } else {
                const friend = await User.findOneAndUpdate(
                    { _id: req.params.friendId },
                    { $addToSet: { friendsRequests: req.params.userId } },
                    { new: true }
                );
                try {
                    !friend
                        ? res.status(404).json({ message: "No user found" })
                        : res.json(friend);
                } catch (err) {
                    res.status(500).json(err);
                }
            }
        }
    },

    // Accept a friend request to a user
    async acceptFriendRequest(req, res) {
        const user = await User.findOne({ _id: req.params.userId });

        try {
            const index = user.friendsRequests.indexOf(req.params.friendId);
            if (index !== -1) {
                const user = await User.findOneAndUpdate(
                    { _id: req.params.userId },
                    {
                        $addToSet: { friends: req.params.friendId },
                        $pull: { friendsRequests: req.params.friendId },
                    },
                    { new: true }
                );
                const friend = await User.findOneAndUpdate(
                    { _id: req.params.friendId },
                    { $addToSet: { friends: req.params.userId } },
                    { new: true }
                );
                try {
                    !user
                        ? res
                              .status(404)
                              .json({ message: "No user found to accept" })
                        : res.json({
                              user1: user,
                              user2: friend,
                          });
                } catch (err) {
                    res.status(500).json(err);
                }
            } else {
                res.status(400).json({ message: "No user found" });
            }
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Remove a friend from a user
    async deleteFriend(req, res) {
        const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId } },
            { new: true }
        );
        try {
            if (!user) {
                res.status(404).json({ message: "No user found" });
            } else {
                const friend = await User.findOneAndUpdate(
                    { _id: req.params.friendId },
                    { $pull: { friends: req.params.userId } },
                    { new: true }
                );
                try {
                    res.status(200);
                    res.json({ user1: user, user2: friend });
                } catch (err) {
                    (err) => res.status(500).json(err);
                }
            }
        } catch (err) {
            (err) => res.status(500).json(err);
        }
    },

    // Remove a friend from a user
    async deleteFriendRequest(req, res) {
        const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friendsRequests: req.params.friendId } },
            { new: true }
        );
        try {
            !user
                ? res.status(404).json({ message: "No user found" })
                : res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async getFriendsList(req, res) {
        const user = await User.findOne({ _id: req.params.userId });
        try {
            res.status(200);
            res.json({ friends: user.friends });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async getFriendRequestsList(req, res) {
        const user = await User.findOne({ _id: req.params.userId });
        try {
            res.status(200);
            res.json({ friends: user.friendsRequests });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async updateUserPassword(req, res) {
        if (req.body.password.length >= 8) {
            const hashedPass = await bcrypt.hash(req.body.password, 10);
            const userBody = {
                password: hashedPass,
            };
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $set: userBody },
                { new: true }
            );
            try {
                !user
                    ? res.status(404).json({ message: "No user found" })
                    : res.json(user);
            } catch (err) {
                res.status(500).json(err);
            }
        } else {
            res.status(400).json({
                message: "Password must be 8 symbols at least",
            });
        }
    },
};
