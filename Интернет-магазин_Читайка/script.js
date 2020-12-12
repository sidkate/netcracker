let basketElement;
let loader;
let shoppingCart;

window.onload = () => {
    // initializing global variables after page was loaded
    basketElement = document.getElementById('basket');
    loader = document.getElementById('loader');

    let container = document.getElementById('container');
    shoppingCart = new ShoppingCart(container);

    let someDiscount = discountCalc(0.15);
    showCatalog(getCatalogItems, someDiscount, [1, 3]);
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
            <td><span class="cost">${this.getCost()}</span> руб. </td>
            <td class="delete-item-basket" onclick="shoppingCart.deleteProduct(${this.id})"> + </td>
        `;

        let basketItem = document.createElement('tr');

        basketItem.innerHTML = basketItemTemplate;

        let costElement = basketItem.getElementsByClassName('cost')[0];

        wrapper.appendChild(basketItem);
        let counterWrapper = basketItem.getElementsByClassName('counter')[0];
        let counter = new Counter(counterWrapper, this.count);
        counter.onplus = (counter) => {
            this.plus();
            costElement.innerText = this.getCost();
        }
        counter.onminus = (counter) => {
            this.minus();
            costElement.innerText = this.getCost();
        }
    }

    getCost() {
        return this.count * this.price;
    }
}

class Counter {

    constructor(wrapper, count) {
        this.wrapper = wrapper;
        this.count = count;
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
        counterValueElement.innerText = this.count;
    }

    plus() {
        this.count++;
        if (this.onplus)
            this.onplus(this);
        this.updateCounterValue();
    }

    minus() {
        this.count--;
        if (this.onminus)
            this.onminus(this);
        this.updateCounterValue();
    }

}

const discountCalc = (discountRate) => {
    return (price) => {
        return price - (price * discountRate);
    }
}

let getCatalogItems = (discount, discountItems) => {
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
    if (discount && discountItems) {
        return items.map((item) => {
            if (discountItems.includes(item.id)) {
                let newItem = {
                    ...item
                };
                newItem.price = discount(item.price);
                return newItem;
            } else {
                return item;
            }
        });
    }
    return items;
}

let showCatalog = (func, discount, discountItems) => {
    let items = func(discount, discountItems);
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