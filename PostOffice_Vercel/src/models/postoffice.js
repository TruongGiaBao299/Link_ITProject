const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    OfficeUserName: String,
    OfficeUserNumber: String,
    OfficeUserId: String,
    email: String,
    OfficeUserAddress: String,
    OfficeName: String,
    OfficeHotline: String,
    OfficeAddress: String,
    OfficeDistrict: String,
    OfficeWard: String,
    OfficeCity: String,
    OfficeLocation: String,
    OfficeLatitude: String,
    OfficeLongitude: String,
    status: String
});

const PostOffice = mongoose.model('postoffice', userSchema);

module.exports = PostOffice;
