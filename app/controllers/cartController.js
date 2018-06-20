const router = require('express').Router();
const Cart = require('../models/Cart');
const productModel = require('../models/Product')


router.get('/shopping-cart', (req, res) => {
	if (!req.session.cart)
		return res.render('shopping-cart', {products: null})
	let cart = new Cart(req.session.cart);
	res.render('shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});

});

router.get('/add-to-cart/:id', (req, res) => {
	let productId = req.params.id;
	let cart = new Cart(req.session.cart? req.session.cart : {});
	productModel.fetchSingle()
	.then(product => {
		cart.add(product, product.productId);
		req.session.cart = cart;
		console.log(req.session.cart);
		res.redirect('/');
	})
	.catch(err => {
		res.redirect('/');
	})


});

router.get('/reduce/:id', (req, res) => {
	let productId = req.params.id;
	let cart = new Cart(req.session.cart? req.session.cart : {});
	cart.reduceByOne(productId);
	req.session.cart = cart;
	res.redirect('/');
});

router.get('/remove/:id'. (req, res) => {
	let productId = req.params.id;
	let cart = new Cart(req.session.cart? req.session.cart : {});
	cart.removeItem(productId);
	req.session.cart = cart;
	res.redirect('/');
});


router.get('checkout', (req, res) => {
	if (!req.session.cart)
		return res.redirect('/shopping-cart');
	let cart = new Cart(req.session.cart);
	res.render('checkout', {total: cart.totalPrice, })
});

router.post('checkout',ensureAuthenticated, (req, res) => {
	if (!req.session.cart)
		return res.redirect('/shopping-cart');

	let cart = new Cart(req.session.cart);

	var stripe = require("stripe")("");
	stripe.charges.create({
		amount: cart.totalPrice,
		currency: "USD",
		source: "tok_mastercard",
		description: "Test change",

	}. (err, charges) => {
		if (err)
			return res.redirect('/checkout');

		let order = new Object({
			user: req.user,
			cart: cart,
			address: req.body.address,
			name: req.body.name,
			paymentId: charge.id
		});

		orderController.add(order)
		.then(() => {
			 req.session.cart=null;
   			 res.redirect('/');
		})
		.catch(err => {
			
		});
	});
});

// Access Control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}


module.exports = router;