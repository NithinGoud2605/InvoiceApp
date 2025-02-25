const { User } = require('../models'); // Adjust the import as needed

exports.getMe = async (req, res) => {
  try {
    // Assuming req.user.sub is your cognitoSub from authentication middleware
    const user = await User.findOne({ where: { cognitoSub: req.user.sub } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return all user details
    return res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (err) {
    console.error("Error in getMe:", err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateMe = async (req, res) => {
  try {
    const { name } = req.body;

    // Validate input
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Invalid name provided' });
    }

    // Find user using Cognito sub
    const user = await User.findOne({ where: { cognitoSub: req.user.sub } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user information
    user.name = name;
    await user.save();

    return res.json({
      message: 'User profile updated successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        updatedAt: user.updatedAt
      }
    });
  } catch (err) {
    console.error("Error in updateMe:", err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
