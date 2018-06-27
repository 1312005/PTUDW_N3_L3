const router = require('express').Router();
const orderModel = require('../../models/OrderModel');
const orderDetailModel = require('../../models/orderDetailModel');
const deliveryAddressModel = require('../../models/deliveryAddressModel');
const config = require('../../../config/config');
const ensureAuthenticated = require('../../middlewares/ensureAuthenticated');
const ensureHasRole = require('../../middlewares/ensureHasRole');
const {
  check,
  validationResult
} = require('express-validator/check');
const validator = require('validator');

router.get('/orders_management', (req, res) => {
  let page = req.query.page || 1;
  let offset = (page - 1) * config.ORDER_PER_PAGE;
  let lOrder = orderModel.loadAllOrders(offset);
  let nOrder = orderModel.countOrders();
  Promise.all([lOrder, nOrder]).then(([lOrder, nOrder]) => {
    let totalOrder = nOrder[0].total;
    let numberPages = Math.ceil(totalOrder / config.ORDER_PER_PAGE);
    let numbers = [];
    for (let i = 1; i <= numberPages; i++) {
      numbers.push({
        value: i,
        isCurPage: i === +page
      });
    }
    for (let i = 0; i < lOrder.length; i++) {
      let date = new Date(lOrder[i].created_at);
      //console.log((date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear());
      let dateFormat = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
      // console.log(dateFormat);
      lOrder[i]['dateFormat'] = dateFormat;

      let state = lOrder[i].state;
      if(+state === -1){
        lOrder[i]['stateFormat'] = 'Waiting';
      }
      else if(+state === 0){
        lOrder[i]['stateFormat'] = 'Processing';
      }
      else{
        lOrder[i]['stateFormat'] = 'Done';
      }
    }
    let vm = {
      layout: 'admin',
      lOrder: lOrder,
      noOrder: lOrder.length === 0,
      page_numbers: numbers,
      nPages: numberPages,
    };
    res.render('admin/orders_management', vm);
  });
});

// ensureHasRole,
router.get('/orders_management/order_detail/:id', (req, res) => {
  let orderId = req.params.id;
  let order = orderModel.orderAndMember(orderId);
  let orderDetail = orderDetailModel.loadAllDetailByOrderId(orderId);
  let deliveryAddress = deliveryAddressModel.loadDeliveryByOrderId(orderId);
  
  Promise.all([order, orderDetail,deliveryAddress]).then(([order, lOrderDetail,deliveryAddress]) => {
      console.log('order');
      console.log(order);
      console.log('lOrderDetail');
      console.log(lOrderDetail);
      console.log('delivery');
      console.log(deliveryAddress);
      let date = new Date(order.created_at);
      //console.log((date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear());
      let dateFormat = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
      // console.log(dateFormat);
      order['dateFormat'] = dateFormat;
      let state = order.state;
      if(+state === -1){
        order['stateFormat'] = 'Waiting';
      }
      else if(+state === 0){
        order['stateFormat'] = 'Processing';
      }
      else{
        order['stateFormat'] = 'Done';
      }
      
    
    let vm = {
      layout: 'admin',
      order: order,
      lOrderDetail: lOrderDetail,
      deliveryAddress: deliveryAddress,
    };
    res.render('admin/orders_detail', vm);
  });
  // res.render('admin/orders_management',{layout:'admin'});
});

router.post('/change_state_order',(req,res)=>{
  let orderId = req.body.orderId;
  let state = req.body.state;
  orderModel.changeStateOrder(orderId,state).then(value=>{
    let stateFormat;
    if(+state === -1){
      stateFormat = 'Waiting';
    }
    else if(+state === 0){
      stateFormat = 'Processing';
    }
    else{
      stateFormat = 'Done';
    }
    console.log(stateFormat);
    res.status(200).send(stateFormat);
  })
})

router.delete('/delete_order',(req,res)=>{
  let orderId = req.body.orderId;
  let p1 = orderDetailModel.deleteAllOrderDetailByOrderId(orderId);
  let p2 = deliveryAddressModel.deleteDeliveryAddressByOrderId(orderId);
  Promise.all([p1,p2]).then(([value1,value2]) =>{
    orderModel.deleteOrder(orderId).then(value=>{
      res.status(200).send("Thành Công");
    })
  });
})

router.delete('/delete_order_detail',(req,res)=>{

  /*Thứ tự thao tác
  - Lấy tổng tiền order
  - Lấy tổng tiền orderDetail xóa
  - Xóa orderDetail
  - Update tổng tiền ở order = tổng tiền order - tổng tiền orderDetail xóa
  - Kiểm tra xem số lượng orderDetail có = 0 không, nếu bằng thì xóa luôn order
  */
  let orderId = req.body.orderId;
  let detailId = req.body.detailId;
  let p1 = orderDetailModel.single(detailId);
  let p2 = orderModel.single(orderId);
  Promise.all([p1,p2]).then(([detail,order])=>{
    let totalAmount = order.totalAmount;
    let totalAmountDetail = detail.totalAmount;
    orderDetailModel.deleteOrderDetailById(detailId).then(value=>{
      orderModel.updateTotalAmount(orderId,totalAmount-totalAmountDetail).then(value =>{
        orderDetailModel.loadAllDetailByOrderId(orderId).then((rows)=>{
          //Nếu số lượng order detail = 0 thì xóa cả order đi luôn
          let response = {
            noOrder: rows.length === 0,
            newTotalAmount: totalAmount - totalAmountDetail,
          };
          if(rows.length === 0){
            deliveryAddressModel.deleteDeliveryAddressByOrderId(orderId).then(value=>{
              orderModel.deleteOrder(orderId).then(value =>{
                res.status(200).send(response);
              });
            })
          }
          else{
            res.status(200).send(response); // Send số lượng orderDetail còn lại
          }
        });
      });
    });
  })
 
})
module.exports = router;