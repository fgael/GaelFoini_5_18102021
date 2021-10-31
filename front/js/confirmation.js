function main() {
  let getLocalStorage = localStorage.getItem("orderId");
  let domDisplayId = document.getElementById("orderId");
  domDisplayId.innerText = getLocalStorage;
  localStorage.clear();
}

main();
