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

document.querySelectorAll('.btn-add').forEach(btn => {
    btn.addEventListener('click', () => {
        const product = {
            id: btn.dataset.id,
            name: btn.dataset.name,
            price: +btn.dataset.price,
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