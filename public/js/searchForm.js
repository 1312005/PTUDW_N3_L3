
// function search(){
//     let nameProduct = document.getElementById('name-product').value;
//     $.ajax({
//         type: 'GET',
//         url: "/shop",
//         async: false,
//         data: {
//             key: nameProduct,
//         },
//         dataType: 'string',
//         success: function (res) {
//             alert('success');
//         }
//     })
// }

$(function(){
    $('#btn-search').click(function (e) { 
        // e.preventDefault();
        let nameProduct = $('#name-product').val();
        console.log(nameProduct);
        alert(nameProduct);
        $.ajax({
            type: "GET",
            url: "/shop/search",
            data: {
                'key':nameProduct,
            },
            dataType: "string",
            success: function (response) {
                console.log(response);
                alert(response);
            }
        })
        .done(function(){
            console.log('done');
        });
    });
});
