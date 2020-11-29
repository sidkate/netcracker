let basketElement;
let loader;
let popup;
let popupList;
let shoppingCart;

window.onload = () => {
    // initializing global variables after page was loaded
    basketElement = document.getElementById('basket');
    loader = document.getElementById('loader');
    popup = document.getElementById('popup');
    popupList = document.getElementById('popupList');

    shoppingCart = new ShoppingCart();
}

class ShoppingCart {

    constructor() {
        this.counter = 0;
        this.products = new Map();
    }

    addItemToBasket(title, price, id) {

        this.counter++;

        basketElement.innerText = this.counter;

        let product = this.products.get(id);

        if (product) {
            product.count++;
        } else {
            this.products.set(id, {
                title: title,
                price: price,
                id: id,
                count: 1
            });
        }

        this.updatePopupData();

        this.showLoader(() => {
            this.hideLoader();
            this.openPopup();
        });
    }

    updatePopupData() {

        popupList.innerHTML = '';

        for (let [id, product] of this.products) {

            //let product = products[id];
            // destructuring assignment example
            // let [title, count, price] = [product.title, product.count, product.price];
            // let cost = count * price;
            let basketItemTemplate = `
                <td>${product.title}</td>
                <td>${product.count} шт. </td>
                <td>${product.count * product.price} руб. </td>
                <td class="delete-item-basket" onclick="shoppingCart.deleteProduct(${id})"> + </td>
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

    deleteProduct(id) {
        let product = this.products.get(id);
        if (product) {
            this.counter -= product.count;
            basketElement.innerText = this.counter;
            this.products.delete(id);
            this.updatePopupData();

        }
    }

    openPopup() {
        popup.style.visibility = 'visible';
    }

    closePopup() {
        popup.style.visibility = 'hidden';
    }

    showLoader(callback) {
        loader.style.visibility = 'visible';
        setTimeout(callback, 2000);
    }

    hideLoader() {
        loader.style.visibility = 'hidden';
    }

}