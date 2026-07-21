const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter product name"],
        trim: true
    },

    description: {
        type: String,
        required: [true, "Please enter product description"]
    },

    price: {
        type: Number,
        required: [true, "Please enter product price"]
    },

    // ❌ cuttedPrice removed

    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],

    category: {
        type: String,
        required: [true, "Please enter product category"]
    },

    stock: {
        type: Number,
        required: [true, "Please enter product stock"],
        maxlength: [4, "Stock cannot exceed limit"],
        default: 1
    },

    // ✅ NEW FIELD ADDED
    status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active"
    },

    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', productSchema);
