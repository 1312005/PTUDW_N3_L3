const orderModel = require('../models/OrderModel');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');


const router = require('express').Router();


router.get('/bought_histories', ensureAuthenticated,(req, res) => {
	let id = req.user.id;
	orderModel.fetchAllBelongTo(id)
	.then((orders) => {
		console.log(orders); 
		res.render('bought_histories', { orders: orders });
	})
	.catch((err) =>  {
		console.log(err);
		res.render('bought_histories');
	});
})

router.get('/order/:numbercode', ensureAuthenticated,(req, res) => {
	let orderNumber = req.params.numbercode;
	let productDetailpromise = orderModel.getProductDetail(orderNumber);
	let genericDetailpromise = orderModel.getGenericDetail(orderNumber);
	Promise.all([productDetailpromise, genericDetailpromise])
	 .then(([productDetail, genericDetail]) => {
	 	console.log("CHI TIET SP");
	 	console.log(productDetail);
	 	console.log("CHI TIET KHAC");
	 	console.log(genericDetail);
	 	res.render('bought_details', { productDetail: productDetail,genericDetail: genericDetail[0] })
	 });
});

module.exports = router;