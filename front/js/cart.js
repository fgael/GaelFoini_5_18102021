function displayCart(localStorageInfo) {
  for (product of localStorageInfo) {
    const domCreation = document.getElementById("cart__items");
    domCreation.insertAdjacentHTML(
      "beforeend",
      `<article class="cart__item" data-id="${product.id}">
                  <div class="cart__item__img">
                      <img src="${product.imgurl}" alt="Photographie d'un canapé">
                  </div>
                  <div class="cart__item__content">
                      <div class="cart__item__content__titlePrice">
                          <h2>${product.name} ${product.color}</h2>
                          <p>${product.price} €</p>
                      </div>
                      <div class="cart__item__content__settings">
                          <div class="cart__item__content__settings__quantity">
                          <p>Qté : </p>
                          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.qty}">
                      </div>
                      <div class="cart__item__content__settings__delete">
                          <p class="deleteItem">Supprimer</p>
                      </div>
                  </div>
              </div>
            </article>`
    );
  }
}

function listenFunction() {
  qtyListen();
  deleteProductListen();
}

function qtyListen() {
  let qtyInput = document.querySelectorAll(".itemQuantity");
  // ecoute pour chaque element input
  qtyInput.forEach(function (input) {
    input.addEventListener("input", function (inputevent) {
      let inputQty = inputevent.target.value;
      // recuperation cle pour localstorage
      const productName = input
        .closest("div.cart__item__content")
        .querySelector("div.cart__item__content__titlePrice > h2").innerText;
      // enregistrement qte apres modif input
      let localStorageKey = JSON.parse(localStorage.getItem(productName));
      localStorageKey.qty = inputQty;
      // injection qté dans localstorage
      localStorage.setItem(productName, JSON.stringify(localStorageKey));
      // affichage des nouvelles qte et prix
      let localStorageArray = localStorageInfo();
      displayTotalPrice(localStorageArray);
    });
  });
}

function deleteProductListen() {
  let deleteLink = document.querySelectorAll(".deleteItem");
  // ecoute pour chaque lien supprimer
  deleteLink.forEach(function (input) {
    input.addEventListener("click", function () {
      // recuperation cle pour localstorage
      const productName = input
        .closest("div.cart__item__content")
        .querySelector("div.cart__item__content__titlePrice > h2").innerText;
      localStorage.removeItem(productName);
      input.closest("div.cart__item__content").parentNode.remove();
      let localStorageArray = localStorageInfo();
      displayTotalPrice(localStorageArray);
    });
  });
}

function displayTotalPrice(localStorageInfo) {
  let totalPrice = 0;
  let totalQty = 0;
  for (product of localStorageInfo) {
    totalPrice += parseInt(product.qty * product.price, 10);
    totalQty += parseInt(product.qty, 10);
  }
  const domTotalQty = document.getElementById("totalQuantity");
  domTotalQty.innerText = totalQty;
  const domTotalPrice = document.getElementById("totalPrice");
  domTotalPrice.innerText = totalPrice;
}

function localStorageInfo() {
  let getLocalStorage = [];
  for (let i = 0; i < localStorage.length; i++) {
    getLocalStorage[i] = JSON.parse(localStorage.getItem(localStorage.key(i)));
  }
  return getLocalStorage;
}

async function main() {
  let localStorageArray = localStorageInfo();
  displayCart(localStorageArray); // affichage du panier (localstorage)
  displayTotalPrice(localStorageArray); // affichage du calcul qté + prix (localstorage)
  listenFunction();
}

main();
