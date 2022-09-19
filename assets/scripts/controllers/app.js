let productsManager = new ProductManager();
let user = new User();
let activeUser = {};
let userManager = new UserManager();

productsManager.loadCards(DATA);
let resultsPage = document.getElementById("home-results");
renderCards(productsManager.allCards, resultsPage);

/* ------- START Page render function --------*/
function renderPage() {
  let currentHash = location.hash.slice(1);
  if (!currentHash) {
    currentHash = PAGES[0];
  }

  PAGES.forEach((page) => {
    let currentPage = document.getElementById(page);
    if (currentHash === page) {
      currentPage.style.display = "block";
    } else {
      currentPage.style.display = "none";
    }
  });

  if (currentHash === "cart") {
    let resultsPage = document.getElementById("cart-results");
    printOrder(user.addedItems, resultsPage);
    let container = document.getElementById("order-history-print");
    container.innerHTML = "";
    printOrderHistory(user.orderedItems, container);
  } else if (currentHash === "home" || currentHash === "") {
    let resultsPage = document.getElementById("home-results");
    renderCards(productsManager.allCards, resultsPage);
  } else if (currentHash === "order") {
    let addressElem = document.getElementById("address-input");
    addressElem.addEventListener("input", function (e) {
      user.address = e.target.value;
    });
  }

  let cartButton = document.getElementById("cart-btn");
  cartButton.addEventListener("click", function () {
    if (activeUser.isLoggedIn) {
      cartButton.href = "#cart";
    } else {
      cartButton.href = "#login";
    }
  });

  let quantityIndicator = document.getElementById("cart-item-count");
  user.checkOrderedQuantity();
  quantityIndicator.innerText = user.itemsQuantity;
}

window.addEventListener("load", renderPage);
window.addEventListener("hashchange", renderPage);

/* ------- END Page render function --------*/
/* --- START - Print Cards --- */
function renderCards(items, container) {
  // Clearing content everytime before render:
  container.innerHTML = "";
  items.forEach((elem) => {
    if (elem instanceof Card) {
      let cardContainer = document.createElement("div");
      cardContainer.classList.add("card__container");

      let img = document.createElement("img");
      img.src = elem.image;
      img.alt = elem.name;

      let title = document.createElement("h3");
      title.classList.add("card-title");
      title.innerText = elem.name;

      let weight = document.createElement("p");
      weight.classList.add("card-text");
      weight.innerHTML = `<strong>Тегло:</strong> ${elem.weight} гр.`;

      let category = document.createElement("p");
      category.classList.add("card-text");
      category.innerHTML = `<strong>Категория:</strong> ${elem.category}`;

      let price = document.createElement("p");
      price.classList.add("card-text");
      price.innerHTML = `<strong>Цена:</strong> ${elem.price.toFixed(2)} лв.`;

      let bottomContainer = document.createElement("div");
      bottomContainer.classList.add("card-bottom");

      let quantity = document.createElement("input");
      quantity.classList.add("item-quantity");
      quantity.setAttribute("type", "number");
      quantity.setAttribute("value", elem.quantity);
      quantity.setAttribute("min", "0");

      quantity.addEventListener("input", function (e) {
        elem.quantity = e.target.value;
        productsManager.handleQuantityIndicator(elem);
      });

      let addToCartButton = document.createElement("a");
      addToCartButton.classList.add("cart-btn", "card-btn");

      // Button should change value and function based on whther item has been added to cart:
      let quantityInput = document.getElementById("cart-item-count");
      if (user.hasAdded(elem)) {
        addToCartButton.innerText = "Добави в количката";
        addToCartButton.addEventListener("click", function (е) {
          user.addToCart(elem);
          addToCartButton.innerText = "Премахни от количката";
          user.checkOrderedQuantity();
          cardContainer.classList.add("cart-selected");
          quantity.setAttribute("value", elem.quantity);
          quantity.innerText = elem.quantity;
          user.calculateTotal(user.addedItems);
          renderPage();
        });
      } else {
        addToCartButton.innerText = "Премахни от количката";
        addToCartButton.addEventListener("click", function (e) {
          user.removeFromCart(elem);
          elem.quantity = 0;
          user.checkOrderedQuantity();
          addToCartButton.innerText = "Добави в количката";
          cardContainer.classList.remove("cart-selected");
          quantity.setAttribute("value", elem.quantity);
          quantity.innerText = elem.quantity;
          user.calculateTotal(user.addedItems);
          renderPage();
        });
      }

      // Appending elements:
      bottomContainer.append(quantity, addToCartButton);
      cardContainer.append(
        img,
        title,
        weight,
        category,
        price,
        bottomContainer
      );
      container.append(cardContainer);
    }
  });
}
/*---- END - Print Cards ----*/

/* --- START Search Field ---- */
// Event listener to search live and filter results:
let searchInput = document.getElementById("search-form");
searchInput.addEventListener("keyup", function (event) {
  productsManager.searchKeyWord = event.target.value;
  let filtered = productsManager.filter();
  renderCards(filtered, resultsPage);
});
/* --- END Search Field ---- */

/*---- START - Print ORDER ----*/
// This will print the ordered items in a different format, than cards:
function printOrder(items, container) {
  container.innerHTML = "";
  if (user.addedItems.length === 0) {
    let section = document.createElement("div");
    section.classList.add("no-products");
    let cartEmpty = document.createElement("p");
    cartEmpty.innerText = "Нямате продукти в количката... :(";
    section.append(cartEmpty);
    container.append(section);
  } else {
    items.forEach((elem) => {
      let itemContainer = document.createElement("div");
      itemContainer.classList.add("ordered-item");

      let image = document.createElement("img");
      image.src = elem.image;
      image.alt = elem.name;

      let productName = document.createElement("h3");
      productName.classList.add("card-title");
      productName.innerText = elem.name;

      let price = document.createElement("p");
      price.classList.add("card-text");
      price.innerHTML = `${elem.price.toFixed(2)} лв.`;

      let quantityContainer = document.createElement("div");
      itemContainer.classList.add("quantity__container");

      let itemQuantity = document.createElement("input");
      itemQuantity.classList.add("item-quantity");
      itemQuantity.setAttribute("type", "number");
      itemQuantity.setAttribute("value", elem.quantity);
      itemQuantity.setAttribute("min", "0");
      itemQuantity.innerHTML = elem.quantity;

      itemQuantity.addEventListener("input", function (e) {
        elem.quantity = e.target.value;
        productsManager.handleQuantityIndicator(elem);
        user.calculateTotal(user.addedItems);
        renderPage();
      });

      let removeFromCart = document.createElement("a");
      removeFromCart.classList.add("remove-from-cart");
      removeFromCart.innerText = "X";

      removeFromCart.addEventListener("click", function (e) {
        user.removeFromCart(elem);
        elem.quantity = 0;
        user.checkOrderedQuantity();
        itemQuantity.setAttribute("value", elem.quantity);
        itemQuantity.innerText = elem.quantity;
        renderPage();
      });

      quantityContainer.append(itemQuantity);
      itemContainer.append(
        image,
        productName,
        price,
        quantityContainer,
        removeFromCart
      );
      container.append(itemContainer);
    });

    let totalContainer = document.createElement("div");
    totalContainer.classList.add("order-total");
    let orderTotalText = document.createElement("p");
    orderTotalText.classList.add("order-total-text");
    let total = user.calculateTotal(user.addedItems);
    orderTotalText.innerHTML = `Вашата сметка е на стойност: <strong>${total} лв.</strong?`;
    let orderButton = document.createElement("a");
    orderButton.innerHTML = "Поръчай!";
    orderButton.href = "#order";
    orderButton.setAttribute("id", "order-btn");
    totalContainer.append(orderTotalText, orderButton);
    container.append(totalContainer);
  }
}

function printOrderHistory(items, container) {
  items.forEach((item) => {
    let row = container.insertRow(0);

    let date = row.insertCell(0);
    date.innerText = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;

    let address = row.insertCell(1);
    address.innerText = user.address;

    orderedProducts = row.insertCell(2);
    item.forEach((i) => {
      orderedProducts.innerHTML += `${i.name} - ${i.quantity} бр., `;
    });
    let sumTotal = row.insertCell(3);
    sumTotal.classList.add("orders-table");
    let result = 0;
    item.forEach((i) => {
      result += Number(i.quantity) * Number(i.price);
      return result;
    });
    sumTotal.innerText = result.toFixed(2);
  });
}

let sendOrder = document.getElementById("send-order");
sendOrder.addEventListener("click", function () {
  user.makeOrder();
});
