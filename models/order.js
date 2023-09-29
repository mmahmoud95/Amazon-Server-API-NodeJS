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
            price: Number
        }
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