/**
 *
 * @param {*} product
 */
// fonction ecoute et envoie au localstorage
// recuperation couleur, quantite, et ecoute ajout au panier
async function listenClick(product) {
  let colorChoosen = "";
  let qtyChoosen = "";
  let colorSelection = document.getElementById("colors");
  colorSelection.addEventListener("change", function (colorChooseEvent) {
    colorChoosen = colorChooseEvent.target.value;
  });
  let qtySelection = document.getElementById("quantity");
  qtySelection.addEventListener("input", function (qtyChooseEvent) {
    qtyChoosen = qtyChooseEvent.target.value;
  });
  let orderSelection = document.getElementById("addToCart");
  orderSelection.addEventListener("click", function () {
    let productChoosen = new productClass(
      product._id,
      product.name,
      colorChoosen,
      qtyChoosen,
      product.imageUrl,
      product.price,
      product.altTxt
    );
    // envoi au local storage du produit
    if (colorChoosen != "" && qtyChoosen >= 1 && qtyChoosen <= 100) {
      localStorage.setItem(
        product.name + " " + colorChoosen,
        JSON.stringify(productChoosen)
      );
    } else {
      alert("Veuillez renseigner une couleur et une quantité.");
    }
  });
}

/**
 *
 */
// création instance de classe produit
class productClass {
  constructor(id, name, color, qty, imgurl, price, alt) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.qty = qty;
    this.imgurl = imgurl;
    this.price = price;
    this.alt = alt;
  }
}

/**
 *
 * @param {*} product
 */
// affichage produit
function displayProduct(product) {
  // recuperation selecteurs + création attributs
  const parentImg = document.querySelector("div.item__img");
  const productImg = document.createElement("img");
  productImg.setAttribute("src", product.imageUrl);
  productImg.setAttribute("alt", product.altTxt);
  parentImg.appendChild(productImg);

  const parentName = document.getElementById("title");
  parentName.innerText = product.name;

  const parentPrice = document.getElementById("price");
  parentPrice.innerText = product.price;

  const parentDescription = document.getElementById("description");
  parentDescription.innerText = product.description;

  let parentColor = document.getElementById("colors");
  let colorsList = product.colors;

  // Affichage des couleurs (incrémentation suivant nombre de couleur)
  for (let color of colorsList) {
    const displayColor = document.createElement("option");
    displayColor.setAttribute("value", color);
    displayColor.innerText = color;
    parentColor.appendChild(displayColor);
  }
}

/**
 *
 * @param {*} productId
 * @returns
 */
// communication API
async function fetchId(productId) {
  return fetch("http://localhost:3000/api/products/" + productId)
    .then(function (res) {
      if (res.ok) {
        return res.json();
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

/**
 *
 */
//fonction principale
async function main() {
  const url = new URL(window.location.href); // pointage url
  let productId = url.searchParams.get("id"); // productId = url + id
  let product = await fetchId(productId); // product = reponse API
  displayProduct(product); // affichage produit
  listenClick(product); // ecoute du bouton ajouter au panier
}

main();
