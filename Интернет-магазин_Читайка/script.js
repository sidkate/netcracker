let basketElement;
let loader;
let shoppingCart;

window.onload = () => {
    // initializing global variables after page was loaded
    basketElement = document.getElementById('basket');
    loader = document.getElementById('loader');
    //popup = document.getElementById('popup');
    //popupList = document.getElementById('popupList');

    let container = document.getElementById('container');
    shoppingCart = new ShoppingCart(container);
    showCatalog();
}

class ShoppingCart {

    constructor(wrapper) {
        this.counter = 0;
        this.products = new Map();
        this.popupWrapper = wrapper;
        this.popup = undefined;
    }

    addItemToBasket(title, price, id) {
        if (this.popup)
            return;

        let product = this.products.get(id);

        if (!product) {
            product = new Product(id, title, price);
            this.products.set(id, product);
        }
        product.plus();

        //this.updatePopupData();

        this.showLoader(() => {
            this.hideLoader();
            this.openPopup();
        });
    }

    updatePopupData() {

        this.popupList.innerHTML = '';

        for (let [id, product] of this.products) {
            product.appendToPopupList(this.popupList);
        }

        if (this.counter == 0)
            this.closePopup();
    }

    deleteProduct(id) {
        let product = this.products.get(id);
        if (product) {
            this.counter -= product.count;
            this.updateBasketCounter();
            this.products.delete(id);
            this.updatePopupData();
        }
    }

    openPopup() {
        if (this.popup)
            return;

        let popupTemplate = `
            <span class="close-popup" onclick="shoppingCart.closePopup()">+</span>
            <p class="heading-popup">Товары в Вашей корзине:</p>
            <table class="heading-list-popup" width="500">
            <tr>
                <td>наименование</td>
                <td>количество</td>
                <td>стоимость</td>
            </tr>
            </table>
            <table class="popap-list" id="popupList" width="500">
            </table>
        `;
        let popupElement = document.createElement('div');
        popupElement.id = 'popup';
        popupElement.classList.add('popup');
        popupElement.innerHTML = popupTemplate;
        this.popupWrapper.appendChild(popupElement);
        this.popupList = document.getElementById('popupList');

        this.popup = popupElement;

        this.updatePopupData();
    }

    closePopup() {
        if (this.popup) {
            this.popupWrapper.removeChild(this.popup);
            this.popup = undefined;
        }
    }

    showLoader(callback) {
        loader.style.visibility = 'visible';
        setTimeout(callback, 2000);
    }

    hideLoader() {
        loader.style.visibility = 'hidden';
    }

    plus() {
        this.counter++;
        this.updateBasketCounter();
    }

    minus() {
        if (this.counter > 0) {
            this.counter--;
            this.updateBasketCounter();
        }
    }

    updateBasketCounter() {
        basketElement.innerText = this.counter;
    }

}

class Product {

    constructor(id, title, price) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.count = 0;
    }

    plus() {
        this.count++;
        shoppingCart.plus();
    }

    minus() {
        if (this.count > 1) {
            this.count--;
            shoppingCart.minus();
        } else {
            shoppingCart.deleteProduct(this.id);
        }
    }

    appendToPopupList(wrapper) {
        // destructuring assignment example
        // let [title, count, price] = [this.title, this.count, this.price];
        // let cost = count * price;
        let basketItemTemplate = `
            <td>${this.title}</td>
            <td class="counter"></td>
            <!--<td>${this.count} шт. </td>-->
            <td>${this.count * this.price} руб. </td>
            <td class="delete-item-basket" onclick="shoppingCart.deleteProduct(${this.id})"> + </td>
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

        wrapper.appendChild(basketItem);
        let counterWrapper = basketItem.getElementsByClassName('counter')[0];
        new Counter(counterWrapper, this);
        /*basketItem.appendChild(title);
        basketItem.appendChild(count);
        basketItem.appendChild(price);
        basketItem.appendChild(itemDelete);*/
    }
}

class Counter {

    constructor(wrapper, product) {
        this.product = product;
        this.wrapper = wrapper;
        this.createElement();
        this.updateCounterValue();
    }

    createElement() {
        let counterTemplate = `
            <div class="counter-in-popup">
            <div class="minus">-</div>
            <div class="counter-value"></div>
            <div class="plus">+</div>
            </div>
        `;
        this.wrapper.innerHTML = counterTemplate;
        let minusElement = this.wrapper.getElementsByClassName('minus')[0];
        let plusElement = this.wrapper.getElementsByClassName('plus')[0];
        minusElement.onclick = () => { this.minus() };
        plusElement.onclick = () => { this.plus() };
    }

    updateCounterValue() {
        let counterValueElement = this.wrapper.getElementsByClassName('counter-value')[0];
        counterValueElement.innerText = this.product.count;
    }

    plus() {
        this.product.plus();
        this.updateCounterValue();
    }

    minus() {
        this.product.minus();
        this.updateCounterValue();
    }

}

let getCatalogItems = () => {
    const items = [
        {
            id: 1,
            title: 'Гарри Поттер и Философский камень',
            img: 'img/harry_potter_1books.jpg',
            price: 800.0
        },
        {
            id: 2,
            title: 'Гарри Поттер и Тайная комната',
            img: 'img/harry_potter_2books.jpg',
            price: 950.0
        },
        {
            id: 3,
            title: 'Гарри Поттер и узник Азкабана',
            img: 'img/harry_potter_3books.jpg',
            price: 840.0
        },
    ];
    return items;
}

let showCatalog = () => {
    let items = getCatalogItems();
    items.forEach(item => {
        let list = document.getElementsByClassName("product-list")[0];
        let li = document.createElement('li');
        li.innerHTML = `
            <a href="#"><img src="${item.img}" width="195" height="280" /><br />${item.title}</a><br />${item.price} р.
            <button class="product-list__button" onclick="shoppingCart.addItemToBasket('${item.title}', ${item.price}, ${item.id})">
                В корзину
            </button>
        `;
        list.appendChild(li);
    });
}