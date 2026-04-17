const Role = require('../models/Role');
const User = require('../models/User');

const seedData = async () => {
    try {
        // Roles
        const roles = [
            { name: 'Admin', slug: 'admin', description: 'System Administrator', isSystemRole: true },
            { name: 'Creator', slug: 'creator', description: 'Content Creator', isSystemRole: false },
            { name: 'Reviewer L1', slug: 'reviewer_l1', description: 'Level 1 Reviewer', isSystemRole: false },
            { name: 'Reviewer L2', slug: 'reviewer_l2', description: 'Level 2 Reviewer', isSystemRole: false }
        ];

        for (let r of roles) {
            await Role.findOneAndUpdate({ slug: r.slug }, r, { upsert: true });
        }

        // Initial Admin & Mock Users
        const password = 'Qwe@1234';
        const adminRole = await Role.findOne({ slug: 'admin' });
        const creatorRole = await Role.findOne({ slug: 'creator' });
        const l1Role = await Role.findOne({ slug: 'reviewer_l1' });
        const l2Role = await Role.findOne({ slug: 'reviewer_l2' });

        const mockUsers = [
            { username: 'admin', password, role: adminRole._id },
            { username: 'creator', password, role: creatorRole._id },
            { username: 'reviewer1', password, role: l1Role._id },
            { username: 'reviewer2', password, role: l2Role._id }
        ];

        for (let u of mockUsers) {
            const userExists = await User.findOne({ username: u.username });
            if (!userExists) {
                // For Admin, extra check: Ensure only one user has the Admin role
                if (u.username === 'admin') {
                    const anyAdmin = await User.findOne({ role: adminRole._id });
                    if (anyAdmin) {
                        continue;
                    }
                }
                await User.create(u);
            } else {
                // Update role and password for existing mock users
                userExists.password = password;
                userExists.role = u.role;
                await userExists.save();
            }
        }

    } catch (error) {
        console.error('Seeding error:', error);
    }
};

module.exports = seedData;
