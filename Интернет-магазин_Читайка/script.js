var counter = 0;
var products = {};

function addItemToBasket(title, price, id) {

    var basketElement = document.getElementById('basket');

    counter++;

    basketElement.innerText = counter;

    var product = products[id];

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

    showLoader(function () {
        hideLoader();
        openPopup();
    });
}

function updatePopupData() {

    let popupList = document.getElementById('popupList');

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
        itemDelete.onclick = function () {
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
        var basketElement = document.getElementById('basket');
        basketElement.innerText = counter;
        delete products[id];
        updatePopupData();

    }
}

function openPopup() {
    var popup = document.getElementById('popup');
    popup.style.visibility = 'visible';
}

function closePopup() {
    var popup = document.getElementById('popup');
    popup.style.visibility = 'hidden';
}

function showLoader(callback) {
    var loader = document.getElementById('loader');
    loader.style.visibility = 'visible';
    setTimeout(callback, 2000);
}

function hideLoader() {
    var loader = document.getElementById('loader');
    loader.style.visibility = 'hidden';
}
