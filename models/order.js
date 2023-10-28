const mongoose= require('mongoose');
const orderSchema = mongoose.Schema({
    user:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'User',
        required:true
    },
    cartItems:[
        {
            productId: {
                type: mongoose.SchemaTypes.ObjectId,
                ref: "products",
            },
            quantity: {
                type: Number,
                required: true
            },
            price:{
                type: Number
            }
        },
    ],
    taxPrice:{
        type:Number,
        default:0  
    },
    shippingPrice:{
        type:Number,
        default:0
    },
    totalOrderPrice:{
        type:Number
    },
    paymentMethodType:{
        type:String,
        enum:["cash","card"],
        default:"cash"
    },
    shippingAddress:{
        country: { type: String, minlength: 4, default: "Egypt" },
        street: {
          type: String,
          minlength: 4,
          default: "el moez street",
        },
        city: {
          type: String,
          minlength: 4,
          default: "el moez street",
        },
        province: { 
            type: String, minlength: 4, default: "cairo" 
        },
        zip: { 
            type: Number, minlength: 5, default: "11111" 
        },
        phone: {
            type:Number
        }
    },
    isPaid:{
        type:Boolean,
        default:false
    },
    paidAt:{
        type:Date
    },
    isDelivered:{
        type:Boolean,
        default:false
    },
    deliveredAt:{
        type:Date
    },

    
},
    {timestamps:true})


    var orderModel=mongoose.model('order',orderSchema)
    module.exports=orderModel;