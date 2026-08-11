"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDefaultRecipients = void 0;
const RecipientModel_1 = require("../models/RecipientModel");
const seedDefaultRecipients = async () => {
    try {
        const count = await RecipientModel_1.RecipientModel.countDocuments();
        if (count === 0) {
            await RecipientModel_1.RecipientModel.insertMany([
                {
                    name: 'John Family',
                    type: 'family',
                    monthlyQuota: 50,
                    contactPerson: 'John Doe',
                    contactEmail: 'john.family@example.com',
                    address: '123 Hope Street, Sector 4'
                },
                {
                    name: 'Mary Family',
                    type: 'family',
                    monthlyQuota: 50,
                    contactPerson: 'Mary Smith',
                    contactEmail: 'mary.family@example.com',
                    address: '456 Sunrise Ave, Sector 2'
                },
                {
                    name: 'Hope Community Shelter',
                    type: 'agency',
                    monthlyQuota: 500,
                    contactPerson: 'David Miller',
                    contactEmail: 'contact@hopeshelter.org',
                    address: '789 Community Road, City Center'
                },
                {
                    name: 'St. Jude Family Care',
                    type: 'agency',
                    monthlyQuota: 300,
                    contactPerson: 'Sister Clara',
                    contactEmail: 'clara@stjudecare.org',
                    address: '101 Care Lane, East District'
                }
            ]);
            console.log('✅ Default recipients seeded successfully');
        }
    }
    catch (error) {
        console.error('Error seeding default recipients:', error);
    }
};
exports.seedDefaultRecipients = seedDefaultRecipients;
