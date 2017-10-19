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


// ============= BEGINNING PROMPT ===================== //
function mngrApp(err, res) {
    inquirer.prompt([{
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
            "View all products",
            "View low inventory products",
            "Add inventory to existing product",
            "Add new product to store",
            "Exit"
        ]
    }]).then(function(answer) {
        switch (answer.action) {
            case "View all products":
                displayInventory();
                break;
            case "View low inventory products":
                lowInventory();
                break;
            case "Add inventory to existing product":
                addInventory();
                break;
            case "Add new product to store":
                addItem();
                break;
            case "Exit":
                process.exit();
        }
    });
}

// ============= RETURN PROMPT ===================== //
function returnQuestion(err, res) {
    inquirer.prompt([{
        type: "list",
        name: "return",
        message: "Return to previous menu?",
        choices: [
            "Yes",
            "No"
        ]
    }]).then(function(ans) {
        switch (ans.return) {
            case "Yes":
                mngrApp();
                break;
            case "No":
                returnQuestion();
                break;
        }
    });
}

// ============= PRODCUTS OPTION ===================== //
function displayInventory() {
    connection.query('SELECT * FROM products', function(err, res) {
        console.log("Here is our inventory");
        console.log("\n===================================================");
        for (var i = 0; i < res.length; i++) {
            console.log("Item ID: " + res[i].item_id + "\nProduct: " + res[i].product_name + "\nDepartment: " + res[i].department_name +
                "\nPrice: $" + res[i].price + "\nStock: " + res[i].stock_quantity + "\n===================================================");
        }
        returnQuestion();
    });
}

// ============= LOW INVENTORY ===================== //
function lowInventory() {
    var query = "SELECT * FROM products WHERE stock_quantity < 5";
    connection.query(query, function(err, res) {
        console.log("\n===================================================");
        for (var i = 0; i < res.length; i++) {
            console.log("Item ID: " + res[i].item_id + "\nProduct: " + res[i].product_name +
                "\nStock: " + res[i].stock_quantity + "\n===================================================");
        }
        returnQuestion();
    });
}

// ============= ADD INVENTORY ===================== //
function addInventory() {
    inquirer.prompt([{
            type: "input",
            name: "id",
            message: "What is the ID of the item you would like to add more of?"
        },
        {
            type: "input",
            name: "amount",
            message: "How many of this item do you want to add?"
        }
    ]).then(function(req) {
        var quantity = req.amount;
        var itemId = req.id;
        connection.query('SELECT * FROM products WHERE item_id =' + itemId, function(err, selected) {
            console.log("\n===================================================");
            console.log("\nYou have added " + req.amount + " " + selected[0].product_name + " to our inventory.");
            console.log("\n===================================================");

            connection.query("UPDATE products SET stock_quantity=? WHERE item_id=?", [selected[0].stock_quantity + Number(quantity), itemId],
                function(err) {
                    if (err) throw err;
                })
            returnQuestion();
        });
    });
}

// ============= ADD PRODUCT ===================== //
function addItem() {
    inquirer.prompt([{
            type: "input",
            name: "name",
            message: "What is the name of the item you are adding?"
        },
        {
            type: "input",
            name: "dept",
            message: "What department should this be listed under?"
        },
        {
            type: "input",
            name: "price",
            message: "How much is this item?"
        },
        {
            type: "input",
            name: "stock",
            message: "How many are you adding?"
        }
    ]).then(function(req) {
        var name = req.name;
        var department = req.dept;
        var price = req.price;
        var stock = req.stock;
        connection.query('INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?,?,?,?)', [name, department, price, stock],
            function(err, selected) {
                console.log("\n===================================================");
                console.log("\n" + name + " Has been added to our inventory");
                console.log("\n===================================================");
                inquirer.prompt([{
                    type: "list",
                    name: "return",
                    message: "Would you like to see our current inventory?",
                    choices: [
                        "Yes",
                        "No"
                    ]
                }]).then(function(ans) {
                    switch (ans.return) {
                        case "Yes":
                            displayInventory();
                            break;
                        case "No":
                            returnQuestion();
                            break;
                    }
                });
            })
    })
}

module.exports = mngrApp;