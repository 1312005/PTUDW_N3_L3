$(function(){
    $('#btn-search-by-name').click(function (e) { 
        e.preventDefault();
        let nameProduct = $('#name-product').val();
        window.location = '/search?key='+nameProduct;
    });

    // $('#btn-search').click(function (e) { 
    //     e.preventDefault();
    //     let nameProduct = $('#name-product').val();
    //     // let data = {
    //     //     key: nameProduct
    //     // };
        
    //     $.ajax({
    //         type: "GET",
    //         url: "/shop/search?key="+nameProduct,
    //         // data: data,
    //         // dataType: 'json'
    //     })
    //     .done(function(response){
    //         alert('done');
    //         alert(response);
    //         console.log(response);
    //     });
    // });
});
