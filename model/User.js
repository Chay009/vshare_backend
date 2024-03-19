const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    roles: {
        User: {
            type: Number,
            default: 2001
        },
        Editor: Number,
        Admin: Number
    },
    password: {
        type: String,
        required: true
    },

    verified: { type: Boolean, default: false },

    refreshTokens: [
        {
            token: {
                type: String,
                required: true,
            },
            deviceInfo: {
                // also include geo location info too by converting to names
                deviceLocation: {
                    type: Object,
                    required:true
                },
                ua: String,
                browser: {
                    name: String,
                    version: String,
                    major: String,
                },
                cpu: {
                    architecture: String,
                    default: {}, // Default to an empty object if not provided
                },
                device: {
                    type: Object,
                    default: {}, // Default to an empty object if not provided
                },
                engine: {
                    name: String,
                    version: String,
                },
                os: {
                    name: String,
                    version: String,
                },
            },
        },
    ],

    

    // each object in this arrs store a device credentials
    webAuthnCredentials: [],


    isWebAuthnRegistered: {
        type: Boolean,
        default: false, // Default value is false
      },

    },
    {timestamps: true},
    
   


);

    // Mongoose middleware to set isRegistered based on webAuthnCredentials
    userSchema.pre('save', function (next) {
        this.isWebAuthnRegistered = Array.isArray(this.webAuthnCredentials) && this.webAuthnCredentials.length > 0;
        next();
      });

module.exports = mongoose.model('User', userSchema);