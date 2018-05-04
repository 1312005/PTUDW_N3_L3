var homeController = {
    index: (req, res) => {
        res.render('index', {layout: false});
    }
}

module.exports = homeController;