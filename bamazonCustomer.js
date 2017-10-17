var inquirer = require("inquirer");
var mysql = require("mysql");

//running this application will first display all of the items availabel for sale.
// include the ids, names, and prices of products for sale
// the app should then promp the users with 2 messages
// as the id of the product they want to buy
// the second message asks how amy units of prod the want to buy

//once the customer has said what they want check to see if theres enough to meet demand.
//if not the app should log a phrase "INSUFFICIENT QUANTITY" then prevent order from going through.
//if have enough then fulfill the order
//this means updating the DB
//once update is through show total.