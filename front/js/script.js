function displayProducts(products) {
  const domCreation = document.getElementById("items"); // creation section items

  const productLink = document.createElement("a"); // creation element a
  productLink.setAttribute("href", "product.html?id=" + products._id); // ajout attributs href + id

  const productArticle = document.createElement("article"); // creation element article

  const imgLink = document.createElement("img"); // creation element img
  imgLink.setAttribute("src", products.imageUrl); // img ajout src
  imgLink.setAttribute("alt", products.altTxt); // img ajout alt

  const titleLink = document.createElement("h3");
  titleLink.classList.add("productName");
  titleLink.innerText = products.name;

  gkgkg;

  const descriptionLink = document.createElement("p");
  descriptionLink.classList.add("productDescription");
  descriptionLink.innerText = products.description;

  domCreation.appendChild(productLink); // implementation Lien dans section Items
  productLink.appendChild(productArticle); // implementation Article dans Lien
  productArticle.appendChild(imgLink); // implementation imgLink dans Article
  productArticle.appendChild(titleLink); // implementation titleLink dans Article
  productArticle.appendChild(descriptionLink); // implementation descriptionLink dans Article
}

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

async function main() {
  let products = await fetchProducts(); // products = reponse API
  for (elements of products) {
    displayProducts(elements); // affichage differents elements tableau products
  }
}

main();
