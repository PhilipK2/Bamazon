var customer = require("./bamazonCustomer.js");
var manager = require("./bamazonManager.js");
var inquirer = require("inquirer");

function runApp(err, res) {

    inquirer.prompt([{
        type: "list",
        name: "start",
        message: "How would you like to log in?",
        choices: [
            "Log in as customer",
            "Log in as manager",
            "Exit"
        ]
    }]).then(function(ans) {
        switch (ans.start) {
            case "Log in as customer":
                customer();
                break;
            case "Log in as manager":
                manager();
                break;
            case "Exit":
                process.exit();
                break;
        }

    })
};
runApp();