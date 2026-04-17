const Role = require('../models/Role');
const User = require('../models/User');

const seedData = async () => {
    try {
        // Roles
        const roles = [
            { name: 'Admin', slug: 'admin', description: 'System Administrator' },
            { name: 'Creator', slug: 'creator', description: 'Content Creator' },
            { name: 'Reviewer L1', slug: 'reviewer_l1', description: 'Level 1 Reviewer' },
            { name: 'Reviewer L2', slug: 'reviewer_l2', description: 'Level 2 Reviewer' }
        ];

        for (let r of roles) {
            await Role.findOneAndUpdate({ slug: r.slug }, r, { upsert: true });
        }
        console.log('Roles seeded');

        // Initial Admin
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
                await User.create(u);
                console.log(`User seeded: ${u.username} / ${password}`);
            } else {
                // Optionally update password for existing users as requested
                userExists.password = password;
                await userExists.save();
                console.log(`User password updated: ${u.username}`);
            }
        }

    } catch (error) {
        console.error('Seeding error:', error);
    }
};

module.exports = seedData;
