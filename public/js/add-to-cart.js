function intervalTrigger(msg) {
    return window.setInterval(customAlert(msg), 160);
}
function customAlert(msg) {
    var alertDiv = document.createElement('div');
    alertDiv.innerHTML = "<div id='success-alert' style='position: fixed; z-index: 99999;transition: transform 300ms ease-in-out 5s;width: 100%; height:120px;text-align: center;background : #2ECC71;line-height: 120px;font-size:44px; color: #FFF;top: 50%; left: 50%;transform: translate(-50%, -50%);'>" + msg + "</div>";
    document.getElementsByTagName('body')[0].appendChild(alertDiv);
}

$(function () {
    $('.btn-addcart').on('click', function () {
        var id = $(this).attr("data-product_id");
        //alert(id);
        $.ajax({
            url: 'addcart/' + id,
            method: 'POST',
            success: (data) => {
                console.log(data);
                let cart = data.cart;
                $('#cart-price').text(cart.totalPrice.toLocaleString('en-US') + ' vnđ');
                $('#cart-qty').text(cart.totalQty);
                var id = intervalTrigger('added to cart');
                setTimeout(function () {
                    window.clearInterval(id);
                    document.getElementById('success-alert').remove();
                }, 600);
            },
            err: (err) => {
                console.log(err);
            }
        });
    });
});