const router = require('express').Router();
const productModel = require('../models/productModel');
router.get('/', (req, res) => {
	let query = req.query.pageType;
	let type;
	if(!query || query === 'topview'){
		type = 'views';
	}
	else if(query === 'topnew'){
		type = 'updatedDate';
	}

	else if(query === 'topseller'){
		type = 'soldQuantity'
	}

	let p1 = productModel.loadTop10Product(type);
	let p2 = productModel.loadTop3Product('views');
	let p3 = productModel.loadTop3Product('updatedDate');
	let p4 = productModel.loadTop3Product('soldQuantity');

	Promise.all([p1,p2,p3,p4]).then(([top10pro,top3View,top3New,top3Seller])=>{
		let vm = {
			products: top10pro,
			top3View: top3View,
			top3New:top3New,
			top3Seller:top3Seller
		}
		res.render('index',vm);
	})
});

module.exports = router;