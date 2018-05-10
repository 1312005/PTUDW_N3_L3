let productController = {
    index : (req,res)=>{
        res.render('shop');
    },
    singleProduct : (req,res)=>{
        res.render('single-product');
    }
};

module.exports = productController;