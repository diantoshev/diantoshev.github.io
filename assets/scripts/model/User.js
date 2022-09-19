class User {
  constructor(username, password) {
    this.username = username;
    this.password = password;
    this.isLoggedIn = false;
    this.address = "";
    this.addedItems = [];
    this.orderedItems = [];
    this.itemsQuantity = 0;
    this.orderTotal = 0;
  }

  // Add to cart:
  addToCart(card) {
    if (this.addedItems.indexOf(card) === -1) {
      this.addedItems.push(card);
    }
  }

  // Remove from cart:
  removeFromCart(card) {
    let index = this.addedItems.indexOf(card);
    this.addedItems.splice(index, 1);
  }

  // Check if a card has already been liked:
  hasAdded(card) {
    return this.addedItems.indexOf(card) === -1;
  }

  // Will check the total order quantity to display in cart indicator:
  checkOrderedQuantity() {
    let allQuantity = [];
    productsManager.allCards.forEach((item) => {
      allQuantity.push(Number(item.quantity));
    });
    allQuantity = allQuantity.reduce((partialSum, a) => partialSum + a, 0);
    this.itemsQuantity = allQuantity;
    return this.itemsQuantity;
  }

  calculateTotal(items) {
    let total = 0;
    items.forEach((item) => {
      total += Number(item.quantity) * Number(item.price);
    });
    this.orderTotal = total.toFixed(2);
    return this.orderTotal;
  }

  makeOrder() {
    this.orderedItems.push(JSON.parse(JSON.stringify(this.addedItems)));
    this.addedItems = [];
    this.orderTotal = 0;
    productsManager.allCards.forEach((elem) => {
      elem.quantity = 0;
    });
  }
}
