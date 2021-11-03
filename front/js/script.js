/**
 *
 * @param {*} products
 */
//affichage des produits
function displayProducts(products) {
  // recuperation id items
  const domCreation = document.getElementById("items");
  // insertion html
  domCreation.insertAdjacentHTML(
    "beforeend",
    `<a href="./product.html?id=${products._id}">
        <article>
            <img src="${products.imageUrl}" alt="${products.altTxt}">
            <h3 class="productName">${products.name}</h3>
            <p class="productDescription">${products.description}</p>
          </article>
     </a>`
  );
}

/**
 *
 * @returns
 */
// communication API
async function fetchProducts() {
  return fetch("http://localhost:3000/api/products")
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
// fonction principale
async function main() {
  let products = await fetchProducts(); // products = reponse API
  for (let element of products) {
    displayProducts(element); // affichage des elements du tableau products
  }
}

main();
