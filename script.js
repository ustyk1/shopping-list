"use strict";
import { products } from './data.js';

// Task 1 - done
// 1. Виведення всього списку на екран таким чином, щоб спочатку йшли некуплені продукти, а потім куплені.
// 2. Додавання покупки до списку. Враховуйте, що при додаванні покупки з вже існуючим продуктом у списку, необхідно збільшувати кількість в існуючій покупці, а не додавати нову. 
// 3. Купівля продукту. Функція приймає назву продукту і помічає його як придбаний

// Task 2 - done
// 1. Виведення чека на екран.
// 2. Підрахунок загальної суми покупки
// 3. Отримання найдорожчої покупки у чеку.
// 4. Підрахунок середньої вартості одного товару у чеку. 

const purchases = [];
const $shoppingForm = document.querySelector('.shopping-list-form');
const $shopWrapper = document.querySelector('.shop');
const $shoppingList = document.querySelector('.shopping-list.list');
const $arithmeticButton = document.querySelector('.average-cost-button');
const $mostExpensivePurchaseButton = document.querySelector('.most-expensive-purchase-button');
const $averageCostValue  = document.querySelector('.average-cost-value');
const $mostExpensivePurchaseValue  = document.querySelector('.most-expensive-purchase-value')

let isReceiptReceived = false;
let purchasesInReceipt = [];

const getProductId = button => button.dataset.buttonId;
const getProductData = productId => products.find(item => item.id === productId);
const isTheSameProduct = productData => purchases.includes(productData);
const getCheckedPurchasesForReceipt = perchases => purchasesInReceipt = perchases.filter(purchase => purchase.isBought) || [];

function updatePurchaseStatus(input) {
  purchases.find(purchase => purchase.id === input.dataset.checkPurchase).isBought = input.checked;
}

function updatePurchaseAmountFromInput(input) {
  purchases.find(purchase => purchase.id === input.dataset.purchaseAmount).amount = Number(input.value);
}

function renderProductCards() { 
  $shopWrapper.innerHTML = products.map(product => {
    return `
      <li class="shop__item">
        <button class="shop__item__add-button" data-button-id="${product.id}"><i class="fa-solid fa-cart-plus"></i></button>
        <figure class="product">
          <img src="${product.path}" alt="${product.id}">
          <p>${product.nameOfProduct}</p>
        </figure>
      </li>
    `
  }).join('');
}

function createNewPurchase(product) {
  const newPurchaseWrapper = document.createElement('li');
  newPurchaseWrapper.className = 'list__item item';
  newPurchaseWrapper.dataset.product = product.id;
  newPurchaseWrapper.innerHTML = `
    <input type="checkbox" id="${'purchase-' + product.id}" data-check-purchase="${product.id}" hidden>
    <div class="item__img-wrapper"><img src="${product.path}" alt=""></div>
    <div class="item__name">${product.nameOfProduct}</div>
    <input class="item__amount" data-purchase-amount="${product.id}" type="text" name="${product.id}" id="" value="1">
    <div class="item__purchase-status">
      <label for="${'purchase-' + product.id}">
        <span class="item__checkmark"></span>
      </label>
    </div>
  `;
 
  return newPurchaseWrapper;
}

function sortCheckedPurchase(checkbox) {
  checkbox.checked ? $shoppingList.append(checkbox.parentElement) : $shoppingList.prepend(checkbox.parentElement);
  updatePurchaseStatus(checkbox);
}

function getTotalSumOfReceipt(boughtPurchases, formData) {
  const sum = boughtPurchases.reduce((sum, boughtPurchase) => sum + 
    (boughtPurchase.price * formData.get(`${boughtPurchase.id}`)), 0);
  return sum.toFixed(2);
}

function renderNewPurchase(product) {
  $shoppingList.prepend(createNewPurchase(product));

  const $inputCheckbox = $shoppingList.querySelector(`[data-check-purchase="${product.id}"]`);
  const $inputAmount = $shoppingList.querySelector(`[data-purchase-amount="${product.id}"]`);

  $inputCheckbox.addEventListener('change', event => {
    const inputCheckbox =  event.target;
    sortCheckedPurchase(inputCheckbox);
  });

  $inputAmount.addEventListener('change', event => {
    const inputText =  event.target;
    updatePurchaseAmountFromInput(inputText);
  });
}

function addPurchaseAmountFromBuyButton(productId) {
  const purchaseAmountInputs = Array.from($shoppingList.querySelectorAll('.item__amount'));

  purchaseAmountInputs.find(input => input.dataset.purchaseAmount === productId).value++;
  purchases.find(purchase => purchase.id === productId).amount += 1;
}

function renderReceipt(boughtPurchases, formdata) {
  const totalSum = getTotalSumOfReceipt(boughtPurchases, formdata);

  const $receiptWrapper = document.querySelector('.receipt-total');
  $receiptWrapper.innerHTML =  `
    <div class="receipt">
      <h3>SHOP</h3>
      <p class="address">Address: Lorem Ipsum, 23-10</p>
      <p class="phone">Phone: 11-23-45-678</p>
      <hr>
      <p class="receipt__header-title">CASH RECEIPT</p>
      <hr>
      <p class="receipt__purchases-header "><span>Product</span><span>Amount</span><span>Price</span><span>Sum</span></p>
      <ul class="receipt__purchases-wrapper purchases">
        <li class="purchases__element">
          <span></span><span></span><span></span>
        </li>
      </ul>
      <hr>
      <p class="receipt__total"><span>TOTAL</span><span class="total">${totalSum}</span></p>
      <hr>
      <p class="receipt__bank-card"><span>Bank card</span><span>--- --- --- 234</span></p>
      <p class="receipt__approval-code"><span>Approval Code</span><span># 123456</span></p>
      <hr>
      <p class="receipt__footer-title">THANK YOU!</p>
      <div class="receipt__barcode">
        <img src="./assets/svg/bar_code.svg" alt="barcode">
      </div>
    </div>
  `;

  const $receiptPurchasesWrapper = document.querySelector('.receipt__purchases-wrapper');
  $receiptPurchasesWrapper.innerHTML = boughtPurchases.map(purchase => {
    return `
      <li class="purchases__element">
        <span>${purchase.nameOfProduct}</span><span>${purchase.amount}</span><span>${purchase.price}</span><span>${purchase.price * purchase.amount}</span>
      </li>
    `
  }).join('');
}

function getAverageCostOfOneProduct(purchasesInReceipt) {
  if (!purchasesInReceipt.length) return;

  let numberOfPurchases = 0;
  let sumOfOneProducts = 0;

  purchasesInReceipt.forEach(purchase => {
    numberOfPurchases += purchase.amount;
    sumOfOneProducts += (purchase.amount * purchase.price);
  });
 
  const result = (sumOfOneProducts / numberOfPurchases).toFixed(2);
  $averageCostValue.textContent = `Середня вартість одного товару у чеку становить ${result}`;
}

function getTheMostExpensivePurchase(purchasesInReceipt) {
  let largestSumOfPurchase = 0;
  let expensivePurchase = '';

  purchasesInReceipt.forEach(purchase => {
    let purchaseSum = purchase.amount * purchase.price;

    if (purchaseSum > largestSumOfPurchase) {
      largestSumOfPurchase = purchaseSum;
      expensivePurchase = purchase.nameOfProduct;
    }
  });

  $mostExpensivePurchaseValue.textContent = `Найдорожча покупка у чеку - ${expensivePurchase} на суму ${largestSumOfPurchase}`;
}

//--------------------------------------------------------------------
renderProductCards();

$shoppingForm.addEventListener('submit', (event) => {
  event.preventDefault();

  $averageCostValue.textContent = '';
  $mostExpensivePurchaseValue.textContent = '';

  const formData = new FormData($shoppingForm);
  renderReceipt(getCheckedPurchasesForReceipt(purchases), formData)
  isReceiptReceived = true;
});

$shopWrapper.addEventListener('click', event => {
  event.stopPropagation();
  const $buyButton = event.target.classList.contains('shop__item__add-button');

  if($buyButton) {
    const productId =  getProductId(event.target); //отримуємо id товара із data-button-id 
    const productData = getProductData(productId); //отримуємо дані товара по його id

    if (isTheSameProduct(productData)) { //якщо ми клікнули на товар який вже є у списку покупок 
      addPurchaseAmountFromBuyButton(productId);
    } else {
      purchases.push(productData);
      renderNewPurchase(productData);
    }    
  }
});

$arithmeticButton.addEventListener('click', () => {
  if (!purchases.length) return;
  isReceiptReceived ? getAverageCostOfOneProduct(purchasesInReceipt) : alert('Отримайте чек!');
  // purchasesInReceipt.length = 0;
});

$mostExpensivePurchaseButton.addEventListener('click', () => {
  if (!purchases.length) return;
  isReceiptReceived ? getTheMostExpensivePurchase(purchasesInReceipt) : alert('Отримайте чек!');
})
