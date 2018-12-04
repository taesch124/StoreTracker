# StoreTracker

Store Tracker is a CLI using prompts to track a stores products and stars as well as users that can have three levels of permissions (Customer, Manager, Supervisor). At first the user will either be prompted to log in or create an account. When creating an account, it will prompt for both a username and password, and will confirm the username is not already taken. As of right now, the user is allowed to select their permission level when creating an account. Upon logging in, the user can decide to see each of the menus for each permission level, log in again, or quit.

![Image of account screen](https://github.com/taesch124/StoreTracker/blob/master/assets/images/application-flow/login.PNG)


## Customer Menu

 The Manager Menu allows users to View all of the products for sale, with only information relevant to customers. Customer's can also purchase a product from the inventory, but will be validated that it is not higher than the current stock. Upon purchasing an item, it will be added to a customer's cart which can also be viewed from the menu. Then the final option is to checkout all items from the cart, which calculates the total for the customer and removes stock from the company invntory.

![Image of customer menu](https://github.com/taesch124/StoreTracker/blob/master/assets/images/application-flow/customer-menu.PNG)

![Image of customer actions](https://github.com/taesch124/StoreTracker/blob/master/assets/images/application-flow/customer-actions.PNG)


## Manager Menu

The Manager Menu allows users to View all of the products for sale, with all information available. Manager's can also view the store's low inventory, which shows when an item has less than 5 units in stock. If units are low, managers are allowed to add stock to the store's inventory. Lastly, users are allowed to add new Products to the Store as long as it fits into an existing department.

![Image of manager menu](https://github.com/taesch124/StoreTracker/blob/master/assets/images/application-flow/manager-menu.PNG)

![Image of manager actions](https://github.com/taesch124/StoreTracker/blob/master/assets/images/application-flow/manager-actions.PNG)

## Supervisor Menu

The Supervisor Menu allows users to View all of the departments in the store. Supervisor's are also allowed to add a new department to the store, which requires an overhead cost to keep it operational. Lastly, the supervisor can view the total sales for each department, as well as their total profit after accounting for overhead costs. 

![Image of supervisor menu](https://github.com/taesch124/StoreTracker/blob/master/assets/images/application-flow/supervisor-menu.PNG)

![Image of supervisor actions](https://github.com/taesch124/StoreTracker/blob/master/assets/images/application-flow/supervisor-actions.PNG)