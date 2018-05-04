var aboutController = {
    index: (req, res) => {
        res.render('aboutus', {layout: false});
    }
};

module.exports = aboutController;