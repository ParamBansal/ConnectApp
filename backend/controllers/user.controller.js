import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(401).json({
                message: "Something is missing, please check!",
                success: false,
            });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(401).json({
                message: "Try different email",
                success: false,
            });
        };
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            username,
            email,
            password: hashedPassword
        });
        return res.status(201).json({
            message: "Account created successfully.",
            success: true,
        });
    } catch (error) {
        console.log(error);
    }
}
export const login = async (req, res) => {
    console.log("login hit")
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                message: "Something is missing, please check!",
                success: false,
            });
        }

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false,
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false,
            });
        };

        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });

        // --- IMPROVEMENT: Use Mongoose .populate() for efficiency ---
        const populatedUser = await User.findById(user._id)
            .populate('posts')
            .populate('bookmarks')
            .select('-password');

        // Create the user object for the response
        const userToSend = {
            _id: populatedUser._id,
            username: populatedUser.username,
            email: populatedUser.email,
            profilePicture: populatedUser.profilePicture,
            bio: populatedUser.bio,
            followers: populatedUser.followers,
            following: populatedUser.following,
            posts: populatedUser.posts,
            bookmarks: populatedUser.bookmarks
        };

        const cookieOptions = {
            maxAge: 1 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: true, // <-- ADD THIS
            sameSite: 'none' // <-- CHANGE THIS
        };

        return res.cookie('token', token, cookieOptions).json({
            message: `Welcome back ${userToSend.username}`,
            success: true,
            user: userToSend
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error.", success: false });
    }
};
export const logout = async (_, res) => {
    try {
        return res.cookie("token", "", {
            maxAge: 0,
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }).json({
            message: 'Logged out successfully.',
            success: true
        });
    } catch (error) {
        console.log(error);
    }
};

export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        let user = await User.findById(userId).populate({ path: 'posts', createdAt: -1 }).populate('bookmarks');
        return res.status(200).json({
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
};

export const editProfile = async (req, res) => {
    console.log("🎯 editProfile hit");
    console.log("req.id:", req.id);
    console.log("req.body:", req.body);
    console.log("req.file:", req.file ? req.file.originalname : null);
    try {
        const userId = req.id;
        const { bio, gender } = req.body;
        const profilePicture = req.file;
        let cloudResponse;

        if (profilePicture) {
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({
                message: 'User not found.',
                success: false
            });
        };
        if (bio) user.bio = bio;
        if (gender) user.gender = gender;
        if (profilePicture) user.profilePicture = cloudResponse.secure_url;

        await user.save();

        return res.status(200).json({
            message: 'Profile updated.',
            success: true,
            user
        });

    } catch (error) {
        console.log(error);
    }
};
export const getSuggestedUsers = async (req, res) => {
    try {
        const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password");
        if (!suggestedUsers) {
            return res.status(400).json({
                message: 'Currently do not have any users',
            })
        };
        return res.status(200).json({
            success: true,
            users: suggestedUsers
        })
    } catch (error) {
        console.log(error);
    }
};


export const followOrUnfollow = async (req, res) => {
    try {
        const followKrneWala = req.id;
        const jiskoFollowKrunga = req.params.id;

        if (followKrneWala === jiskoFollowKrunga) {
            return res.status(400).json({ message: 'You cannot follow/unfollow yourself', success: false });
        }

        const user = await User.findById(followKrneWala);
        const targetUser = await User.findById(jiskoFollowKrunga);

        if (!user || !targetUser) {
            return res.status(400).json({ message: 'User not found', success: false });
        }

        const isFollowing = user.following.includes(jiskoFollowKrunga);

        if (isFollowing) {
            // Unfollow logic
            await Promise.all([
                User.updateOne({ _id: followKrneWala }, { $pull: { following: jiskoFollowKrunga } }),
                User.updateOne({ _id: jiskoFollowKrunga }, { $pull: { followers: followKrneWala } }),
            ]);

            // --- IMPROVEMENT ---
            // After updating, find the user again to get the latest `following` array
            const updatedUser = await User.findById(followKrneWala);
            return res.status(200).json({
                message: 'Unfollowed successfully',
                success: true,
                following: updatedUser.following // Send the updated array back
            });

        } else {
            // Follow logic
            await Promise.all([
                User.updateOne({ _id: followKrneWala }, { $push: { following: jiskoFollowKrunga } }),
                User.updateOne({ _id: jiskoFollowKrunga }, { $push: { followers: followKrneWala } }),
            ]);

            // --- IMPROVEMENT ---
            // After updating, find the user again to get the latest `following` array
            const updatedUser = await User.findById(followKrneWala);
            return res.status(200).json({
                message: 'followed successfully',
                success: true,
                following: updatedUser.following // Send the updated array back
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
}