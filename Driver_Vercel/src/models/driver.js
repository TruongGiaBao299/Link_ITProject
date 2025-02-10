const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // Sender
    DriverName: String,
    DriverNumber: String,
    email: String,
    DriverBirth: String,
    DriverId: String,
    DriverAddress: String,
    DriverDistrict: String,
    DriverWard: String,
    DriverCity: String,
    status: String,
    role: String,
    postOffice: String
});

const Driver = mongoose.model('driver', userSchema);

module.exports = Driver;
