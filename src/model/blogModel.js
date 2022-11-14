const mongoose = require('mongoose');
const Object

const blogSchema = new mongoose.Schema( {
title:{ 
    type: String,
    required: true

},
body:{ 
    type: String,
    required: true,
},
authorId:{ 
    type: String,
    required: true,
    ref:'authorModel'
},
tags:{ 
    type: [String],

},
category:{ 
    type: String,
    required: true,
},
subcategory:{ 
    type: [String]
    
},
createdAt:{ 
    type: Date
},
updatedAt:{ 
    type: Date
},
deletedAt:{ 
    type: Boolean,

},
isDeleted:{ 
    type: Boolean,
    default: false,
},
publishedAt:{ 
    type: Boolean
},
isPublished:{ 
    type: Boolean,
    default: false
}

}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema)

