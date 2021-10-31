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

function verification() {
  let orderButton = document.getElementById("order");
  orderButton.addEventListener("click", function (event) {
    let form = document.querySelector(".cart__order__form");
    event.preventDefault();
    if (validationRegex(form)) {
      console.log("bravo");
      let formInfo = {
        firstName: form.firstName.value,
        lastName: form.lastName.value,
        address: form.address.value,
        city: form.city.value,
        email: form.email.value,
      };
      let product = [];
      for (let i = 0; i < localStorage.length; i++) {
        product[i] = JSON.parse(localStorage.getItem(localStorage.key(i))).id;
      }
      const order = {
        contact: formInfo,
        products: product,
      };
      const options = {
        method: "POST",
        body: JSON.stringify(order),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };
      fetch("http://localhost:3000/api/products/order", options)
        .then((res) => res.json())
        .then(function (data) {
          localStorage.clear();
          localStorage.setItem("orderId", data.orderId);
          window.location.href = "confirmation.html";
        })
        .catch(function (err) {
          alert("ARTUNG");
        });
    } else {
      event.preventDefault();
      console.log("formulaire mal rempli.");
    }
  });
}

function validationRegex(form) {
  const stringRegex = /^[a-zA-Z-]+$/;
  const emailRegex = /^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/;
  const addressRegex = /^[a-zA-Z0-9\s,.'-]{3,}$/;
  let control = true;
  if (!form.firstName.value.match(stringRegex)) {
    document.getElementById("firstNameErrorMsg").innerText = "Mauvais prénom";
    control = false;
  } else {
    document.getElementById("firstNameErrorMsg").innerText = "";
  }
  if (!form.lastName.value.match(stringRegex)) {
    document.getElementById("lastNameErrorMsg").innerText = "Mauvais nom";
    control = false;
  } else {
    document.getElementById("lastNameErrorMsg").innerText = "";
  }
  if (!form.address.value.match(addressRegex)) {
    document.getElementById("addressErrorMsg").innerText = "Mauvaise adresse";
    control = false;
  } else {
    document.getElementById("addressErrorMsg").innerText = "";
  }
  if (!form.city.value.match(stringRegex)) {
    document.getElementById("cityErrorMsg").innerText = "Mauvaise ville";
    control = false;
  } else {
    document.getElementById("cityErrorMsg").innerText = "";
  }
  if (!form.email.value.match(emailRegex)) {
    document.getElementById("emailErrorMsg").innerText = "Mauvais email";
    control = false;
  } else {
    document.getElementById("emailErrorMsg").innerText = "";
  }
  if (control) {
    return true;
  } else {
    return false;
  }
}

function validateListen() {}

function listen() {
  qtyListen();
  deleteProductListen();
  validateListen();
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
  // ecoute pour chaque lien "supprimer"
  deleteLink.forEach(function (input) {
    input.addEventListener("click", function () {
      // recuperation cle pour localstorage
      const productName = input
        .closest("div.cart__item__content")
        .querySelector("div.cart__item__content__titlePrice > h2").innerText;
      // suppression cle local storage
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
  listen();
  verification();
  validationRegex();
}

main();
