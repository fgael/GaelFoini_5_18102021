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
      product.price
    );
    if (colorChoosen != "" && qtyChoosen >= 1 && qtyChoosen <= 100) {
      localStorage.setItem(
        product.name + " " + colorChoosen,
        JSON.stringify(productChoosen)
      );
    } else {
      alert("Veuillez renseigner une couleur et une quantité.");
    }
    console.log(productChoosen);
  });
}

class productClass {
  constructor(id, name, color, qty, imgurl, price) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.qty = qty;
    this.imgurl = imgurl;
    this.price = price;
  }
}

function displayProduct(product) {
  const parentImg = document.querySelector("div.item__img");
  const productImg = document.createElement("img"); // creation element img
  productImg.setAttribute("src", product.imageUrl); // img ajout src
  productImg.setAttribute("alt", product.altTxt); // img ajout alt
  parentImg.appendChild(productImg);

  const parentName = document.getElementById("title");
  parentName.innerText = product.name;

  const parentPrice = document.getElementById("price");
  parentPrice.innerText = product.price;

  const parentDescription = document.getElementById("description");
  parentDescription.innerText = product.description;

  let parentColor = document.getElementById("colors");
  let colorsList = product.colors;

  for (element of colorsList) {
    const color = document.createElement("option");
    color.setAttribute("value", element);
    color.innerText = element;
    parentColor.appendChild(color);
  }
}

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

async function main() {
  const url = new URL(window.location.href);
  let productId = url.searchParams.get("id");
  let product = await fetchId(productId); // product = reponse API
  displayProduct(product);
  listenClick(product);
  console.log(product);
}

main();
