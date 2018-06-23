	module.exports = function Cart(oldCart) {
	this.items = oldCart.items || {};
	this.totalQty = oldCart.totalQty || 0;
	this.totalPrice = oldCart.totalPrice || 0;

	this.updateCart = function(ids, qty) {
		console.log('In update cart of Cart Class');
		console.log(ids);
		console.log(qty);
		for (let i=0; i<ids.length; i++)
		{
			console.log('Considering product ID: ' + ids[i]);
			var isAlreadyStored = this.items[ids[i]];
			var distance = 0;
			if(isAlreadyStored !== undefined) 
			{
				console.log('current product ID: ');
				console.log(isAlreadyStored);
				if(parseInt(qty[i]) === 0)
				{
					this.removeItem(ids[i]);
				}
				else
				{
					distance = qty[i]-isAlreadyStored.qty;
					isAlreadyStored.qty = parseInt(qty[i]);
					isAlreadyStored.price = isAlreadyStored.item.price*isAlreadyStored.qty;
					this.totalQty+= distance;
					this.totalPrice+= (distance)*isAlreadyStored.price;
				}
			}
		}
	}

	this.add = function(item, id) {
		var isAlreadyStored = this.items[id];
		if (!isAlreadyStored) 
		{
			isAlreadyStored = this.items[id] = {item: item, qty:0, price:0};
		}
		isAlreadyStored.qty++;
		isAlreadyStored.price = isAlreadyStored.item.price*isAlreadyStored.qty;

		this.totalQty++;
		this.totalPrice += isAlreadyStored.item.price;
	};

	this.reduceByOne = function(id) {
		this.items[id].qty--;
		this.items[id].price -= this.items[id].item.price;
		this.totalQty--;
		this.totalPrice -= this.items[id].item.price;
		if (this.items[id].qty < 0)
		{
			delete this.items[id];
		}
	}

	this.removeItem = function(id) {
		this.totalQty -= this.items[id].qty;
		this.totalPrice -= this.items[id].price;
		delete this.items[id];
	}

	this.generateArray = function()
	{
		var arr = [];
		for (var id in this.items)
		{
			arr.push(this.items[id]);
		}
		return arr;
	}
};