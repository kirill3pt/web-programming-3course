const CART_KEY = 'cart';

function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cart = getCart();
    const total = cart.reduce((sum, item) => sum + item.qty, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = total;
    });
}

function renderCart() {
    const container = document.getElementById('cart-items');

    // На главной странице контейнера корзины нет
    if (!container) return;

    const totalElement = document.getElementById('cart-total');
    const header = document.querySelector('.cart-table-header');
    const cart = getCart();

    container.replaceChildren();

    if (header) {
        header.style.display = cart.length === 0 ? 'none' : 'grid';
    }

    if (cart.length === 0) {
        const message = document.createElement('p');
        message.className = 'cart-empty';
        message.textContent = 'Корзина пуста. Добавьте товары из каталога.';
        container.appendChild(message);

        if (totalElement) totalElement.textContent = '0 ₽';
        return;
    }

    let total = 0;

    cart.forEach(item => {
        const row = document.createElement('div');
        row.className = 'cart-product';

        // 1. Фото и название
        const info = document.createElement('div');
        info.className = 'cart-product-info';

        const image = document.createElement('img');
        image.className = 'cart-product-image';
        image.src = item.image || 'images/logo.png';   // ← берём из товара
        image.alt = item.name;

        const name = document.createElement('div');
        name.className = 'cart-product-name';
        name.textContent = item.name;

        info.append(image, name);

        // 2. Цена за единицу
        const price = document.createElement('div');
        price.textContent = `${item.price.toLocaleString('ru-RU')} ₽`;

        // 3. Количество
        const quantity = document.createElement('div');
        quantity.className = 'cart-quantity';

        const minus = document.createElement('button');
        minus.type = 'button';
        minus.textContent = '−';
        minus.setAttribute('aria-label', 'Уменьшить количество');

        const count = document.createElement('span');
        count.textContent = item.qty;

        const plus = document.createElement('button');
        plus.type = 'button';
        plus.textContent = '+';
        plus.setAttribute('aria-label', 'Увеличить количество');

        quantity.append(minus, count, plus);

        // 4. Доставка
        const delivery = document.createElement('div');
        delivery.className = 'cart-delivery';
        delivery.textContent = 'FREE';

        // 5. Стоимость всей позиции
        const subtotal = document.createElement('div');
        subtotal.className = 'cart-product-subtotal';

        const updateSubtotal = () => {
            subtotal.textContent =
                `${(item.price * item.qty).toLocaleString('ru-RU')} ₽`;
        };

        updateSubtotal();

        // 6. Удаление
        const remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'cart-remove';
        remove.textContent = 'Удалить';

        minus.addEventListener('click', () => {
            const updatedCart = getCart();
            const product = updatedCart.find(p => p.id === item.id);

            if (!product) return;

            product.qty--;

            saveCart(updatedCart.filter(p => p.qty > 0));
            renderCart();
        });

        plus.addEventListener('click', () => {
            const updatedCart = getCart();
            const product = updatedCart.find(p => p.id === item.id);

            if (!product) return;

            product.qty++;

            saveCart(updatedCart);
            renderCart();
        });

        remove.addEventListener('click', () => {
            saveCart(getCart().filter(p => p.id !== item.id));
            renderCart();
        });

        row.append(info, price, quantity, delivery, subtotal, remove);
        container.appendChild(row);

        total += item.price * item.qty;
    });

    if (totalElement) {
        totalElement.textContent = `${total.toLocaleString('ru-RU')} ₽`;
    }
}

// Кнопка очистки корзины
const clearButton = document.getElementById('clear-cart');

if (clearButton) {
    clearButton.addEventListener('click', () => {
        saveCart([]);
        renderCart();
    });
}

// Отображение при загрузке страницы
renderCart();

// Добавление в корзину
document.querySelectorAll('.product-card__btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const product = {
            id: btn.dataset.id,
            name: btn.dataset.name,
            price: +btn.dataset.price,
            image: btn.dataset.image,   // ← сохраняем картинку
            qty: 1
        };

        const cart = getCart();
        const existing = cart.find(item => item.id === product.id);

        if (existing) {
            existing.qty += 1;
        } else {
            cart.push(product);
        }

        saveCart(cart);

        btn.textContent = 'Добавлено ✓';
        btn.classList.add('added');
        btn.disabled = true;

        setTimeout(() => {
            btn.textContent = 'Добавить в корзину';
            btn.classList.remove('added');
            btn.disabled = false;
        }, 1200);
    });
});

updateCartCount();