var mysql = require("mysql");
var inquirer = require("inquirer");

//Create connection to the database
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,

	user: "root",

	password: "",

	database: "bamazon"
});

connection.connect(function(err){
	if(err) throw err;
	console.log("connected as id " + connection.threadId + "...");
});





//Assign function to a variable to display current inventory  
var displayProducts = function(){
	connection.query("SELECT * FROM products", function(err, res) {
      for (var i = 0; i < res.length; i++) {
         console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].price);
      }
      console.log("-----------------------------------");
    });
};

//Assign function to a variable that will retrieve information about the buyer's choices
var buyerChoice = function(){
	//Prompt for getting buyer choice and quantity
	inquirer.prompt([{
		name: "product",
		type: "input",
		message: "What is the ID of the product you would like to purchase?"
		},
		{
		name: "units",
		type: "input",
		message: "How many units would you like to purchase?"
		}
	])
	.then(function(answers){
		connection.query("SELECT stock_quantity FROM products WHERE item_id=?", [answers.product], function(err, res){
			if (err) throw err;
			var stock = res[0].stock_quantity;
			if(answers.units > stock){
			console.log("Insufficient quantity!");
			}else {
				stock-=answers.units;
				connection.query("UPDATE products SET ? WHERE ?", [{
					stock_quantity: stock},
					{item_id: answers.product}
					], function(error){
					if (error) throw error;
					});
				var unitPrice;

				connection.query("SELECT price FROM products WHERE item_id=?", [answers.product], function(err, res){
					console.log("Your total cost for this purchase is " + (answers.units * res[0].price))
				});
				
				
			}
		});
	})	
};

displayProducts();
setTimeout(buyerChoice, 1000);

