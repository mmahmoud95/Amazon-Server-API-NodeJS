# Amazon-Server-API-NodeJS


first of all you should type in terminal or cmd

******** npm i or npm install    *****for installing modules

# Hamza user ,Admin,Auth,AutRole
in dbConnection in config folder
**************
in index   in server listen add your port number if you like, mine is 2000 
***************************
to sign up or add user 
localhost:2000/api/user/signup

add in body at least 
*****
{"firstName":"hamza","lastName":"Mohamed","email":"hamzawy@gmail.com","password":"123456789"}
*****
to log in
*******
localhost:3333/api/user/login
****add in body email and password
{"email":"hamzawy@gmail.com","password":"123456789"}
third 
you will have to copy your token

and in the next url 
paste it in header as (inputToken)


in auth request you can access id and userType and email because i used them in generating your token

user Schema -password hashing -authorization -and log In and sign up and admin operations and user operations
and we have 2 middlewares one check log in status and another to check whether admin or user

# Mostafa Product And Cart
instruction product 

for products post,patch,delete after login and be admin
 to Add new Product after  method post 
1-url:http://localhost:3333/products/
2-you have to put token in header authorization
3-in body put like this 
{"title":"sumsong A5599","descreption":"New Model A71",
"imageUrl":"https://m.mediass-amazon.com/images/I/81Hpc6Lw4pL._AC_SL1500_.jpg",
"category":"6508ba552d75f94e7f0491c9","sku":"a4554d5adasssd","quantity":"154","price":5999,"rating":5}


to update product by id method patch
1-url:http://localhost:3333/products/productId     productId =the _id product you want to update
2-the same add new product
3-the same add new product and edit any field you want to update

to delet product by id method delete 
1-url:http://localhost:3333/products/productId     productId =the _id product you want to update

to delet all products method delete 
1-url:http://localhost:3333/products


get no need to login
to get All product 
1-url:http://localhost:3333/products/

to get product by id 
1-url:http://localhost:3333/products/productId     productId =the _id product you want to get


instruction cart
for products post,patch,delete after logIn

to create a new cart method post
1-http://localhost:3333/cart/
2-you have to put token in header authorization
3-in body put like this 
{"items":[{"productId":"650daec028417ff67548d978"}]}
or leave body empty

to update cart method patch
1-http://localhost:3333/cart/
2-the same
3-in body put like this 
{"productId":"650daec028417ff67548d978"}

to get cart method get 
1-http://localhost:3333/cart/
2-the same

to delete product from cart
1-http://localhost:3333/cart/
2-the same
3- in body put like this 
{"productId":"650daec028417ff67548d978"}

# Ranad
all operations Realted to category subcategory sub subcategory

# Martina Order And Payment
on creating order we use 2 methods to pay :
1- Cash on delivery,it's almost done.

//createCashOrder ,you must be user , 
1-login to have token,put token in the headers, cartId in url, use method post,
2-use this path 'localhost:3333/order/:cartId'
3-fill at least : user object id


//get All Orders , you must be admin , 
1-login to have token, put token in the headers, method get
2-use this path 'localhost:3333/order/allOrders'


//get Specific User Order : you must be user,
1-login to have token, put token in the headers, user id in url, method get
2-use this path 'localhost:3333/order/userOrders/:userId'

//update Order To Paid ,admin change order staus to (ispaid :true) after deliver product to client ,
1-login as admin ,get token ,put token in the headers,orderId in url,method patch .
2- use this path 'localhost:3333/order/updateOrderToPaid/:orderId' .


//updateOrderTODelivered,admin change order staus to (isDelivered :true) after deliver product to client ,
1-login as admin ,get token ,put token in the headers,orderId in url,method patch.
2- use this path 'localhost:3333/order/updateOrderToPaid/:orderId' .


2- online  payment, we use stripe payment gate , to facilitate money transactions and to keep client information secret ,
 not found or use in our database .
still working on it , but at least we can create checkout session and get url response to complete transaction process,

- first you should create user and login,
-use method get , localhost:3333/order/checkout_session/:cartId
you will get checkout url in the end of response ctrl+click on it and complete your card data ,
yo can use this card number "4242424242424242"


