import User from "../models/User.js";
import Farm from "../models/Farm.js";

// @desc    Get farmer profile
// @route   GET /api/farmer/profile
// @access  Private
const getFarmerProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const farm = await Farm.findOne({ userId: req.user.id });

        if (user) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                contactNumber: user.contactNumber,
                profilePic: user.profilePic,
                role: user.role,
                farmDetails: farm || null,
            });
        } else {
            res.status(404);
            throw new Error("User not found");
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Update farmer profile & farm details
// @route   PUT /api/farmer/profile
// @access  Private
const updateFarmerProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            user.name = req.body.name || user.name;
            if (req.body.password) {
                user.password = req.body.password;
            }
            if (req.body.contactNumber !== undefined) {
                user.contactNumber = req.body.contactNumber;
            }
            if (req.body.profilePic !== undefined) {
                user.profilePic = req.body.profilePic;
            }

            const updatedUser = await user.save();

            // Update or create farm details
            const { farmSize, soilType, state, district, plantedCrops } = req.body;
            let farm = await Farm.findOne({ userId: req.user.id });

            if (farmSize || soilType || state || district || plantedCrops !== undefined) {
                if (farm) {
                    farm.farmSize = farmSize || farm.farmSize;
                    farm.soilType = soilType || farm.soilType;
                    farm.state = state || farm.state;
                    farm.district = district || farm.district;
                    if (plantedCrops !== undefined) farm.plantedCrops = plantedCrops;
                    await farm.save();
                } else {
                    farm = await Farm.create({
                        userId: req.user.id,
                        farmSize,
                        soilType,
                        state,
                        district,
                        plantedCrops: plantedCrops || [],
                    });
                }
            }

            res.json({
                _id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                contactNumber: updatedUser.contactNumber,
                profilePic: updatedUser.profilePic,
                role: updatedUser.role,
                farmDetails: farm || null,
            });
        } else {
            res.status(404);
            throw new Error("User not found");
        }
    } catch (error) {
        next(error);
    }
};

export { getFarmerProfile, updateFarmerProfile };
