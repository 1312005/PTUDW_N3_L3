'use strict'
const router = require('express').Router();
const productModel = require('../models/productModel');
const config = require('../../config/config.js');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const ensureHasRole = require('../middlewares/ensureHasRole');
const categoryModel = require('../models/categoryModel');
const manufacturerModel = require('../models/manufacturerModel');
const { check, validationResult } = require('express-validator/check');

const multiparty = require('multiparty');

router.get('/shop', (req, res) => {
	let page = req.query.page || 1;
	let offset = (page - 1) * config.PRODUCTS_PER_PAGE;
	let p1 = productModel.loadAllProduct(offset);
	let p2 = productModel.countProduct();
	Promise.all([p1, p2]).then(([lProducts, nProduct]) => {
		let totalProduct = nProduct[0].total;
		let numberPages = Math.ceil(totalProduct / config.PRODUCTS_PER_PAGE);
		let numbers = [];
		for (let i = 1; i <= numberPages; i++) {
			numbers.push({
				value: i,
				isCurPage: i === +page
			});
		}

		let vm = {
			products: lProducts,
			noProducts: lProducts.length === 0,
			page_numbers: numbers,
			nPages: numberPages
		};
		res.render('shop', vm);
	})
});

router.get('/single-product/:id', (req, res) => {
	let id = req.params.id;
	productModel.single(id).then((rows) => {
		console.log(rows);
		let lProducts = rows;
		let curView = rows.views;
		let newView = ++curView;
		let p1 = productModel.load5ProductFromTheSameManufacturer(id, rows.manufacturerId);
		let p2 = productModel.load5ProductInTheSameCategory(id, rows.categoryId);
		let p3 = productModel.updateView(id, newView);
		Promise.all([p1, p2, p3]).then(([proManufacturer, proCategory, value]) => {
			console.log('proManufacturer');
			console.log(proManufacturer);
			let vm = {
				product: lProducts,
				proManufacturer: proManufacturer,
				proCategory: proCategory,
			}
			res.render('single-product', vm);
		})
	});
});

router.get('/search', (req, res) => {
	const keyWord = req.query.key;
	const manufacturerName = req.query.manufacturer || "All";
	const categoryName = req.query.category || "All";
	const optionPrice = req.query.price || "All";
	let maxPrice = 0;
	let minPrice = 0;
	let page = req.query.page || 1;
	let offset = (page - 1) * config.PRODUCTS_PER_PAGE;

	let search;
	let countResult;
	if (optionPrice === "LowerThan100") {
		minPrice = config.MIN_PRICE;
		maxPrice = 5000000;
	} else if (optionPrice === "From100To500") {
		minPrice = 5000000;
		maxPrice = 10000000;
	} else if (optionPrice === "HigherThan500") {
		minPrice = 10000000;
		maxPrice = config.MAX_PRICE;
	} else {
		minPrice = 0;
		maxPrice = config.MAX_PRICE;
	}

	if (manufacturerName === "All") {
		// Category And Manufacturer = All;
		if (categoryName === "All") {
			search = productModel.searchProductByPrice(keyWord, minPrice, maxPrice, offset);
			countResult = productModel.countProductSearchByPrice(keyWord, minPrice, maxPrice, offset);
			result(search,countResult);
		}
		// Search by category
		else {
			console.log('search by category: ');
			console.log('categoryName: '+ categoryName);
			let category = new Promise((resolve, reject) => {
				productModel.getCategoryByName(categoryName).then(rows => {
					resolve(rows);
					console.log("categoryId: ");
					console.log(rows.categoryId);
				}).catch(err => {
					reject(err);
				})
			}).then(rows =>{
				search = productModel.searchProductByCategory(keyWord, rows.categoryId, minPrice, maxPrice, offset);
				countResult = productModel.countProductSearchByCategory(keyWord, rows.categoryId, minPrice, maxPrice);
				result(search,countResult);
			});
			
		}
	} else {
		// Search By Manufacturer
		if (categoryName === "All") {
			console.log('search by Manufacturer');
			let manufacturer = new Promise((resolve, reject) => {
				productModel.getManufacturerByName(manufacturerName).then((rows) => {
					console.log('manufacturer: ');
					console.log(rows);
					resolve(rows);
				}).catch(err => {
					reject(err);
				})
			}).then(manufacturer=>{
				search = productModel.searchProductByManufacturer(keyWord, manufacturer.manufacturerId, minPrice, maxPrice, offset);
				countResult = productModel.countProductSearchByManufacturer(keyWord, manufacturer.manufacturerId, minPrice, maxPrice);
				result(search,countResult);
			});
		} else {
			let category = productModel.getCategoryByName(categoryName);
			let manufacturer = productModel.getManufacturerByName(manufacturerName);
			Promise.all([category, manufacturer]).then(([cate,manu]) => {
				search = productModel.searchProductByCriteria(keyWord, cate.categoryId, manu.manufacturerId, minPrice, maxPrice, offset);
				countResult = productModel.countProductSearchByCriteria(keyWord, cate.categoryId, manu.manufacturerId, minPrice, maxPrice);
				result(search,countResult);
			})

		}

	}

	function result(search,countResult){
		Promise.all([search, countResult]).then(([lProducts, nProduct]) => {
			// console.log(lProducts);
			// console.log(nProduct[0].total);
			let totalProduct = nProduct[0].total;
			let numberPages = Math.ceil(totalProduct / config.PRODUCTS_PER_PAGE);
			let numbers = [];
			for (let i = 1; i <= numberPages; i++) {
				numbers.push({
					value: i,
					isCurPage: i === +page
				});
			}
			
			let query = {
				key: keyWord,
				manufacturer: manufacturerName,
				category: categoryName,
				optionPrice: optionPrice
			}
			let vm = {
				query: query,
				products: lProducts,
				noProducts: lProducts.length === 0,
				page_numbers: numbers,
				nPages: numberPages
			};
	
			res.render('search_result', vm);
		})
	}
})

router.get('/addproduct', ensureHasRole,(req, res) => {
	let categories;
	let manufacturers;
	categoryModel.loadAllCategory()
	 .then(categoriesResult => {
	 	categories = categoriesResult;
	 	manufacturerModel.loadAllManufacturer()
	 	 .then(manufacturerResult => {
	 	 	manufacturers = manufacturerResult;
	 	 	console.log('manufacturers LIST: ');
	 	 	console.log(manufacturers);
	 	 	console.log('categories LIST: ');
	 	 	console.log(categories);
	 	 	return res.render('admin/addproduct', { layout: 'admin',manufacturers: manufacturers,categories: categories });
	 	 })
	 	 .catch(err => {
	 	 	console.log(err);
	 	 	req.flash('error_msg', 'cannot load manufacturers infos');
	 	 	return res.render('admin/addproduct', { layout: 'admin'});
	 	 });
	 })
	 .catch(err => {
	 	console.log(err);
	 	req.flash('error_msg', 'cannot load categories infos');
	 	res.render('admin/addproduct', { layout: 'admin'});
	 });
	
});

// [
//         check('productname', 'productname is require').isLength({ min: 1 }),
//         check('description', 'description is require').isLength({ min: 100}),
//         check('price', 'price is require and is a number')
//         .matches('\\d+'),
//         check('qty', 'qty is require and is a number')
//         .matches('\\d+'),
//         check('manufacturerId', 'manufacturerId is require').exists(),
//         check('categoryId', 'categoryId is require').exists(),
//         check('images', 'Images is require').exists()
//     ], 
router.post('/addproduct',(req, res) => {
		const errors = validationResult(req);
          if (!errors.isEmpty()) {
            res.render('admin/addproduct', {layout: 'admin', errors: errors.mapped()});
            console.log("VALIDATE FAILED");
            console.log(errors);
          }
          else { 
          	let form = new multiparty.Form();
          	form.parse(req, function(err, fields, files) {  
		    let imgArray = files.images;

		    let list = '';
		    for (let i = 0; i < imgArray.length; i++) {
		        //var newPath = '/uploads/'+fields.imgName+'/';
		        let newPath = './public/uploads/';
		        let singleImg = imgArray[i];
		        newPath+= singleImg.originalFilename;
		        //list+= (newPath + ";");
		        list+= (singleImg.originalFilename + ";");
		        require('../utils/readAndWriteFile')(singleImg, newPath);           
		    }
		    //res.send("File uploaded to:<br\>" + list.slice(0, -1));
		    let product = {
		    productname: req.body.productname,
		    categoryId: parseInt(req.body.categoryId),
		    manufacturerId: parseInt(req.body.manufacturerId),
		    qty: parseInt(req.body.qty),
		    Images: list.slice(0, -1),
		    price: parseInt(req. body.price),
		    description: req.body.description
		    }
		    console.log('PRODUCT PREparE TO INSET');
		    console.log(product);
		    productModel.add(product.productname,product.categoryId, product.manufacturerId,product.qty,product.Images,product.price,product.description)
		     .then( anew => {
		     	req.flash('success_msg', 'added new arrival product');
		     	return res.render('admin/addproduct', {layout: 'admin'});
		     })
		     .catch(err => {
		     	console.log(err);
		     	req.flash('error_msg', 'something goes wrong while trying to process');
		     	return res.render('admin/addproduct', {layout: 'admin'});
		     })
		});
		}
    });

module.exports = router;