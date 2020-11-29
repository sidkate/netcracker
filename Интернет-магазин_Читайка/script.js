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
        // destructuring assignment example
        // let [title, count, price] = [product.title, product.count, product.price];
        // let cost = count * price;
        let basketItemTemplate = `
            <td>${product.title}</td>
            <td>${product.count} шт. </td>
            <td>${product.count * product.price} руб. </td>
            <td class="delete-item-basket" onclick="deleteProduct(${id})"> + </td>
        `;

        let basketItem = document.createElement('tr');
        /*let title = document.createElement('td');
        let count = document.createElement('td');
        let price = document.createElement('td');
        let itemDelete = document.createElement('td');

        title.innerText = product.title;
        count.innerText = product.count + ' шт. ';
        price.innerText = product.count * product.price + ' руб. ';
        itemDelete.innerText = " + ";*/
        basketItem.innerHTML = basketItemTemplate;
        //let itemDelete = basketItem.getElementsByClassName
        // itemDelete.onclick = () => {
        //     deleteProduct(id);
        // };

        //itemDelete.classList.add('delete-item-basket');

        popupList.appendChild(basketItem);
        /*basketItem.appendChild(title);
        basketItem.appendChild(count);
        basketItem.appendChild(price);
        basketItem.appendChild(itemDelete);*/
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