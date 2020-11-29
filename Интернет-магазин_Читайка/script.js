let counter = 0;
let products = {};

let basketElement;
let loader;
let popup;
let popupList;

window.onload = () => {
    // initializing global variables after page was loaded
    basketElement = document.getElementById('basket');
    loader = document.getElementById('loader');
    popup = document.getElementById('popup');
    popupList = document.getElementById('popupList');
}

function addItemToBasket(title, price, id) {

    counter++;

    basketElement.innerText = counter;

    let product = products[id];

    if (product) {
        product.count++;
    } else {
        products[id] = {
            title: title,
            price: price,
            id: id,
            count: 1
        };
    }

    updatePopupData();

    showLoader(() => {
        hideLoader();
        openPopup();
    });
}

function updatePopupData() {

    popupList.innerHTML = '';

    for (let id in products) {

        let product = products[id];
        let basketItem = document.createElement('tr');
        let title = document.createElement('td');
        let count = document.createElement('td');
        let price = document.createElement('td');
        let itemDelete = document.createElement('td');

        title.innerText = product.title;
        count.innerText = product.count + ' шт. ';
        price.innerText = product.count * product.price + ' руб. ';
        itemDelete.innerText = " + ";
        itemDelete.onclick = () => {
            deleteProduct(id);
        };

        itemDelete.classList.add('delete-item-basket');

        popupList.appendChild(basketItem);
        basketItem.appendChild(title);
        basketItem.appendChild(count);
        basketItem.appendChild(price);
        basketItem.appendChild(itemDelete);
    }
}

function deleteProduct(id) {
    let product = products[id];
    if (product) {
        counter -= product.count;
        basketElement.innerText = counter;
        delete products[id];
        updatePopupData();

    }
}

function openPopup() {
    popup.style.visibility = 'visible';
}

function closePopup() {
    popup.style.visibility = 'hidden';
}

function showLoader(callback) {
    loader.style.visibility = 'visible';
    setTimeout(callback, 2000);
}

function hideLoader() {
    loader.style.visibility = 'hidden';
}