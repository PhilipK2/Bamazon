var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "ddbhi645",
    database: "bamazon"
});
connection.connect(function(err) { //ASYN TAKES TIME TO EXECUTE
    if (err) throw err;
    // console.log("connected as id " + connection.threadId);
});

function displayInventory() {
    connection.query('SELECT * FROM products', function(err, res) {
        console.log("Here is our inventory");
        console.log("\n===================================================");
        for (var i = 0; i < res.length; i++) {
            console.log("Item ID: " + res[i].item_id + "\nProduct: " + res[i].product_name + "\nDepartment: " + res[i].department_name +
                "\nPrice: $" + res[i].price + "\nStock: " + res[i].stock_quantity + "\n===================================================");
        }
        inquirer.prompt([{
                type: "input",
                name: "id",
                message: "\nWhich item would you like to purchase (enter Item ID)?"
            },
            {
                type: "input",
                name: "quantity",
                message: "\nHow many of this item would do you want?"
            }
        ]).then(function(order) {
            var quantity = order.quantity;
            var itemId = order.id;
            connection.query('SELECT * FROM products WHERE item_id =' + itemId, function(err, selected) {
                if (err) throw err;
                if (selected[0].stock_quantity - quantity >= 0) {
                    console.log("\n===================================================");
                    console.log("\nWe have enough of that item!");
                    console.log("\nYou will be charged $" + (quantity * selected[0].price));
                    console.log("\nhanks for shopping with us!");
                    console.log("\n===================================================");

                    connection.query('UPDATE products SET stock_quantity=? WHERE item_id=?', [selected[0].stock_quantity - quantity, itemId],
                        function(err, res) {

                            inquirer.prompt([{
                                type: "list",
                                name: "continue",
                                message: "What would you like to do?",
                                choices: [
                                    "Continue shopping",
                                    "Stop shopping"
                                ]
                            }]).then(function(ans) {
                                switch (ans.continue) {
                                    case "Continue shopping":
                                        displayInventory();
                                        break;
                                    case "Stop shopping":
                                        process.exit();
                                        break;
                                }
                            })
                        });
                } else {
                    displayInventory();
                    console.log("\n===================================================");
                    console.log("\nWe do not have enough of that item, we have " + (selected[0].stock_quantity) + " available");
                    console.log("\n===================================================");
                }
            });
        });
    });
}

module.exports = displayInventory;