/**
 *
 * @returns
 */
// recuperation localstorage
function localStorageProductKey() {
  let getLocalStorage = [];
  // recuperation tableau localstorage tant qu'il y a une valeur
  for (let i = 0; i < localStorage.length; i++) {
    // une cle par produit
    getLocalStorage[i] = JSON.parse(localStorage.getItem(localStorage.key(i)));
  }
  return getLocalStorage;
}

/**
 *
 * @param {*} localStorageProductKey
 */
// recuperation produit du localstorage (panier) et affichage
function displayCart(localStorageProductKey) {
  // for of pour afficher chaque produit
  for (product of localStorageProductKey) {
    const domCreation = document.getElementById("cart__items");
    domCreation.insertAdjacentHTML(
      "beforeend",
      `<article class="cart__item" data-id="${product.id}">
                  <div class="cart__item__img">
                      <img src="${product.imgurl}" alt="${product.alt}">
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

/**
 *
 * @param {*} localStorageProductKey
 */
// affichage du calcul qté + prix (localstorage)
function displayTotalPrice(localStorageProductKey) {
  let totalPrice = 0;
  let totalQty = 0;
  for (product of localStorageProductKey) {
    totalPrice += parseInt(product.qty * product.price, 10);
    totalQty += parseInt(product.qty, 10);
  }
  const domTotalQty = document.getElementById("totalQuantity");
  domTotalQty.innerText = totalQty;
  const domTotalPrice = document.getElementById("totalPrice");
  domTotalPrice.innerText = totalPrice;
}

/**
 *
 */
function listen() {
  qtyListen();
  deleteProductListen();
}

/**
 *
 */
// ecoute de la quantité pour qté total + prix
function qtyListen() {
  let qtyInput = document.querySelectorAll(".itemQuantity");
  // ecoute pour chaque element input
  qtyInput.forEach(function (input) {
    input.addEventListener("input", function (inputevent) {
      let inputQty = inputevent.target.value;
      if (inputQty >= 1 && inputQty <= 100) {
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
        let localStorageArray = localStorageProductKey();
        displayTotalPrice(localStorageArray);
      } else {
        alert("Veuillez choisir une quantité entre 1 et 100.");
      }
    });
  });
}

/**
 *
 */
// suppression d'un element dans le panier
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
      // suppression du noeud
      input.closest("div.cart__item__content").parentNode.remove();
      let localStorageArray = localStorageProductKey();
      displayTotalPrice(localStorageArray);
    });
  });
}

/**
 *
 * @param {*} form
 * @returns
 */
// conditions regex et verification
function validationRegex(form) {
  // conditions regex string email et adresse
  const stringRegex = /^[a-zA-Z-]+$/;
  const emailRegex = /^\w+([.-]?\w+)@\w+([.-]?\w+).(.\w{2,3})+$/;
  const addressRegex = /^[a-zA-Z0-9\s,.'-]{3,}$/;
  let control = true;
  // si la valeur du form n'est pas identique : message d'erreur
  if (!form.firstName.value.match(stringRegex)) {
    document.getElementById("firstNameErrorMsg").innerText = "Mauvais prénom";
    control = false;
    // sinon aucun message
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

/**
 *
 */
// fetch POST API si regex valide
function validation() {
  // ecoute du bouton commande
  let orderButton = document.getElementById("order");
  orderButton.addEventListener("click", function (event) {
    let form = document.querySelector(".cart__order__form");
    event.preventDefault();
    if (localStorage.length !== 0) {
      // verification conditions regex
      if (validationRegex(form)) {
        console.log("bravo");
        // recuperation elements
        let formInfo = {
          firstName: form.firstName.value,
          lastName: form.lastName.value,
          address: form.address.value,
          city: form.city.value,
          email: form.email.value,
        };
        let product = [];
        // recuperation tableau localstorage tant qu'il y a une valeur
        for (let i = 0; i < localStorage.length; i++) {
          product[i] = JSON.parse(localStorage.getItem(localStorage.key(i))).id;
        }
        // recuperation formulaire validé + id des produits dans order
        const order = {
          contact: formInfo,
          products: product,
        };
        // POST du formulaire client + id produits vers API
        const options = {
          method: "POST",
          body: JSON.stringify(order),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        };
        // envoie des informations commande vers la route order
        fetch("http://localhost:3000/api/products/order", options)
          .then((res) => res.json())
          .then(function (data) {
            //envoie vers la page confirmation avec id de la commande concaténé
            window.location.href = "confirmation.html?id=" + data.orderId;
          })
          .catch(function (err) {
            alert("error");
          });
      } else {
        event.preventDefault();
        console.log("formulaire mal rempli.");
      }
    } else {
      event.preventDefault();
      alert("Votre panier est vide.");
    }
  });
}

/**
 *
 */
async function main() {
  let localStorageArray = localStorageProductKey(); // recuperation localstorage
  displayCart(localStorageArray); // affichage du panier localstorage
  displayTotalPrice(localStorageArray); // affichage du calcul qté + prix (localstorage)
  listen(); // fonction d ecoute principale
  validation(); // appel de la fonction verification regex puis fetch POST API si regex valide
}

main();
