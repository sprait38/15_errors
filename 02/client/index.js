/* eslint-disable no-console */
/* eslint-disable eqeqeq */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
window.addEventListener('online', (e) => {
  createInfoBlock('<h2>Соединение с сервером восстановлено.</h2>');
  getListProduct();
});

window.addEventListener('offline', (e) => {
  createInfoBlock('<h3>Пропало соединение с сервером.</h3>');
});

const spiner = document.body.querySelector('#spiner');
spiner.style.display = 'block';

const container = document.createElement('div');
container.classList.add(
  'container',
  'd-flex',
  'justify-content-between',
  'flex-wrap',
  'py-4',
);

let errors = null;
let counter = null;

function createInfoBlock(ErrorInfo) {
  const infoblock = document.createElement('div');

  infoblock.style.position = 'fixed';
  infoblock.style.backgroundColor = '#fff';
  infoblock.style.height = '200px';
  infoblock.style.width = '1000px';
  infoblock.style.right = '0px';
  infoblock.style.bottom = '0px';

  infoblock.innerHTML = ErrorInfo;
  document.body.append(infoblock);

  setTimeout(() => {
    infoblock.style.display = 'none';
  }, 3000);
}

function getListProduct() {
  return fetch('http://localhost:3000/api/products')
    .then((res) => {
      if (res.status == 404) {
        const err = new TypeError('Список товаров пуст');
        errors = err.message;
        throw err;
      } else if (res.status == 500) {
        if (counter < 2) {
          counter += 1;
          createInfoBlock('<h2>Непредвидимая ошибка. <br> Попытка отправки повторного запроса на сервер...</h2>');
          spiner.style.display = '';
          getListProduct();
        } else {
          const err = new TypeError('Произошла ошибка. Попробуйте обновить страницу позже.');
          errors = err.message;
          throw err;
        }
      }
      return res.json();
    })
    .then((data) => {
      for (const product of data.products) {
        const productCard = document.createElement('div');
        const img = document.createElement('img');
        const cardBody = document.createElement('div');
        const name = document.createElement('h2');
        const price = document.createElement('p');

        productCard.style.width = '18%';
        productCard.classList.add('card', 'my-2');
        img.classList.add('card-img-top');
        cardBody.classList.add('card-body');
        name.classList.add('card-tittle');
        price.classList.add('card-text');

        img.src = product.image;
        name.textContent = product.name;
        price.textContent = product.price;

        cardBody.append(name, price);
        productCard.append(img, cardBody);
        container.append(productCard);
      }
    })
    .catch((error) => {
      console.log(`${error.name}:${error.message}`);
      if (error.name == 'SyntaxError') {
        createInfoBlock('<h2>Произошла ошибка! Попробуйте обновить страницу позже.</h2>');
      }
      if (error.message == 'Failed to fetch') {
        createInfoBlock('<h2>Произошла ошибка! Проверьте подключение к интернету.</h2>');
      }
      if (errors) {
        createInfoBlock(`<h2> ${errors} </h2>`);
      }
    })
    .finally(() => { spiner.style.display = 'none'; });
}
getListProduct();

document.body.append(container);
