const router = require('express').Router();
const productModel = require('../models/productModel');
router.get('/', (req, res) => {
	productModel.loadTopView().then((rows)=>{
		let vm = {
			products: rows,
		}
		res.render('index',vm);
	});
});

router.get('/topview',(req,res)=>{
	productModel.loadTopView().then((rows)=>{
		let vm = {
			products: rows,
		}
		res.render('index',vm);
	});
});

router.get('/topnew',(req,res) =>{
	productModel.loadTopNew().then((rows)=>{
		let vm = {
			products: rows,
		}
		res.render('index',vm);
	});
});

router.get('/single-product/:id',(req,res)=>{
	let id = req.params.id;
	productModel.single(id).then((rows)=>{
		console.log(rows.description);
		let vm = {
			product: rows,
		}
		res.render('single-product',vm);
	});
});


module.exports = router;