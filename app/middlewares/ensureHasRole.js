module.exports = (req, res, next) => {
	if (req.isAuthenticated())
		if (req.user.isAdmin === 1)
			return next();
	req.flash('err_msg', 'this page is forbidden');
	res.redirect('/shop');	
} 