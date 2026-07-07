const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const sanitizeUser = (user) => ({
    id: user._id,
    username: user.username,
    email: user.email,
});

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({
            $or: [{ email: email.toLowerCase() }, { username }],
        });

        if (existingUser) {
            return res.status(409).json({ message: 'A user with this email or username already exists' });
        }

        const user = new User({ username, email, password });
        await user.save();

        const token = generateToken(user._id);
        res.status(201).json({ token, user: sanitizeUser(user) });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = generateToken(user._id);
        res.status(200).json({ token, user: sanitizeUser(user) });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

exports.getMe = async (req, res) => {
    res.status(200).json({ user: sanitizeUser(req.user) });
};

exports.updateProfile = async (req, res) => {
    try {
        const { username, email } = req.body;

        const existingUser = await User.findOne({
            _id: { $ne: req.user._id },
            $or: [{ email: email.toLowerCase() }, { username }],
        });

        if (existingUser) {
            return res.status(409).json({ message: 'A user with this email or username already exists' });
        }

        req.user.username = username;
        req.user.email = email;
        await req.user.save();

        res.status(200).json({ user: sanitizeUser(req.user) });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: 'A user with this email or username already exists' });
        }
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user._id);
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ message: 'Error changing password', error: error.message });
    }
};
