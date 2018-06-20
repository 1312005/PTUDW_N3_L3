module.exports = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	} else {
		req.flash('warning_msg', 'Please login to access that page');
		res.redirect('/login');
	};
} 