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
		let lProducts = rows;
		let curView = rows.views;
		let newView = ++curView;
		productModel.updateView(id,newView).then((value)=>{
			let vm = {
				product: lProducts,
			}
			res.render('single-product',vm);
		})
	});
});


module.exports = router;