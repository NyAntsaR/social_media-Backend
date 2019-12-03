const crypto = require('crypto');
const uuidv1 = require("uuid/v1");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    hashed_password: {
        type: String,
        required: true
    },
    salt: String,
    created: {
        type: Date,
        default: Date.now
    },
    updated: Date,
    photo: {
        data: Buffer,
        contentType: String
    }
});

// virtual fields
userSchema.virtual( 'password' )
.set( function(password) {
    // create temporary variable called_password
    this._password = password;
    // generate a unique timestamp using the universal unique Identifier package
    this.salt = uuidv1();
    // encrypt password
    this.hashed_password = this.encryptPassword(password);
})
.get( function() {
    return this._password;
})

// methods 
userSchema.methods = {
    // method to authenticate
    authenticate : function (plainText) {
        return this.encryptPassword(plainText) === this.hashed_password
    },
    
    // encrypt password
    encryptPassword: function( password ) {
        if ( !password ) return "";
        try {
            return crypto
                    .createHmac( 'sha1', this.salt)
                    .update(password)
                    .digest('hex');
        } catch (err) {
            return "";
        }
    }
}



module.exports = mongoose.model("User", userSchema);