const router = require('express').Router();
const productModel = require('../models/productModel');
router.get('/', (req, res) => {
	productModel.loadTopView().then((rows)=>{
		console.log(rows);
		let vm = {
			products: rows,
		}
		res.render('index',vm);
	});
});

router.get('/topview',(req,res)=>{
	productModel.loadTopView().then((rows)=>{
		console.log(rows);
		let vm = {
			products: rows,
		}
		res.render('index',vm);
	});
});

router.get('/topnew',(req,res) =>{
	productModel.loadTopNew().then((rows)=>{
		console.log(rows);
		let vm = {
			products: rows,
		}
		res.render('index',vm);
	});
});

router.get('/single-product/:id',(req,res)=>{
	// let id = req.params.id;
	// productModel.single(id).then((rows)=>{
	// 	console.log(rows);
	// 	let vm = {
	// 		products: rows,
	// 	}
	// 	res.render('single-product');
	// });
	res.render('single-product');
});
module.exports = router;