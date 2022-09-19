class ProductManager {
  constructor() {
    this.allCards = [];
    this.searchKeyWord = "";
  }

  /* --- START - Load all cards --- */
  loadCards(arr) {
    arr.forEach((elem) => {
      let currentElem = new Card(
        elem.name,
        elem.image,
        elem.weight,
        elem.category,
        elem.price,
        elem.quantity
      );

      if (currentElem instanceof Card) {
        productsManager.allCards.push(currentElem);
      }
    });
  }
  /* --- END - Load all cards --- */

  /* --- START -  FILTER Search Form --- */

  filter() {
    let filtered = [];
    this.allCards.forEach((item) => {
      let current = item;
      let searchWord = this.searchKeyWord.toLowerCase();
      if (current.name.toLowerCase().includes(searchWord)) {
        filtered.push(current);
      }
    });
    return filtered;
  }

  handleQuantityIndicator(elem) {
    let quantity = document.getElementsByClassName("item-quantity");
    let quantityIndicator = document.getElementById("cart-item-count");
    user.checkOrderedQuantity();
    quantityIndicator.innerText = user.itemsQuantity;
    // quantity.setAttribute("value", elem.quantity);
    quantity.innerText = elem.quantity;
    user.addToCart(elem);
    if (Number(elem.quantity) === 0) {
      user.removeFromCart(elem);
      renderPage();
    }
  }
}
/* --- END -  FILTER Search Form --- */
