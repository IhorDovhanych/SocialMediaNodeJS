const router = require('express').Router();
const {
    getUsers,
    loginUser,
    getSingleUser,
    createUser,
    updateUser,
    deleteUser,
    sendFriendRequest,
    acceptFriendRequest,
    deleteFriend,
    deleteFriendRequest,
    getFriendsList,
    getFriendRequestsList
} = require('../../controllers/userController');

// /api/users
router.route('/').get(getUsers);

// /api/users/login
router.route('/login').post(loginUser);

// /api/users/login
router.route('/register').post(createUser);

// /api/users/:userId
router.route('/:userId').get(getSingleUser).put(updateUser).delete(deleteUser);

// /api/users/:userId
router.route('/:userId/password');

// /api/users/:userId/friends
router.route('/:userId/friends').get(getFriendsList);

// /api/users/:userId/friends/:friendId
router.route('/:userId/friends/:friendId').delete(deleteFriend);

// /api/users/:userId/friend-request
router.route('/:userId/friend-request').get(getFriendRequestsList);

// /api/users/:userId/friend-request/:friendId
router.route('/:userId/friend-request/:friendId').delete(deleteFriendRequest);

// /api/users/:userId/send-friend-request/:friendId
router.route('/:userId/send-friend-request/:friendId').post(sendFriendRequest);

// /api/users/:userId/accept-friend-request/:friendId
router.route('/:userId/accept-friend-request/:friendId').post(acceptFriendRequest);
module.exports = router;
