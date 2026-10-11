/* Корзина */

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

function addToCart(product) {
    const cart = getCart();
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    saveCart(cart);
}

/* Создание карточки товара */

function createProductCard(product) {
    const card = document.createElement('a');
    card.className = 'product-card';
    card.href = `singlepage.html?id=${product.id}`;

    card.innerHTML = `
        <div class="product-card__image">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
        </div>
        <div class="product-card__body">
            <h3 class="product-card__title">${product.name}</h3>
            <p class="product-card__price">${product.price.toLocaleString('ru-RU')} ₽</p>
            <button class="product-card__btn" type="button"
                    data-id="${product.id}"
                    data-name="${product.name}"
                    data-price="${product.price}"
                    data-image="${product.image}">
                Добавить в корзину
            </button>
        </div>
    `;

    return card;
}

function renderProducts(container, products) {
    if (!container) return;

    container.replaceChildren();

    if (products.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'catalog-empty';
        empty.textContent = 'Товары не найдены';
        container.appendChild(empty);
        return;
    }

    products.forEach(product => {
        container.appendChild(createProductCard(product));
    });

    bindAddToCartButtons();
}

/* Обработчик кнопок «Добавить в корзину» */

function bindAddToCartButtons() {
    const buttons = document.querySelectorAll('.product-card__btn, .product-page__btn');

    buttons.forEach(btn => {
        if (btn.dataset.bound === 'true') return;
        btn.dataset.bound = 'true';

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            addToCart({
                id: btn.dataset.id,
                name: btn.dataset.name,
                price: +btn.dataset.price,
                image: btn.dataset.image
            });

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
}

/* Рендер корзины */

function renderCart() {
    const container = document.getElementById('cart-items');
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

        const info = document.createElement('div');
        info.className = 'cart-product-info';

        const image = document.createElement('img');
        image.className = 'cart-product-image';
        image.src = item.image || 'images/logo.png';
        image.alt = item.name;

        const name = document.createElement('div');
        name.className = 'cart-product-name';
        name.textContent = item.name;

        info.append(image, name);

        const price = document.createElement('div');
        price.textContent = `${item.price.toLocaleString('ru-RU')} ₽`;

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

        const delivery = document.createElement('div');
        delivery.className = 'cart-delivery';
        delivery.textContent = 'FREE';

        const subtotal = document.createElement('div');
        subtotal.className = 'cart-product-subtotal';
        subtotal.textContent = `${(item.price * item.qty).toLocaleString('ru-RU')} ₽`;

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

/* Главная страница */

function renderPopularProducts() {
    const container = document.getElementById('popular-products');
    if (!container) return;

    const popular = PRODUCTS.filter(p => p.popular);
    renderProducts(container, popular);
}

/* Каталог */

const catalogState = {
    brands: [],
    categories: [],
    sort: 'default',
    priceMin: null,
    priceMax: null,
    search: ''
};

function filterProducts(products, state) {
    return products.filter(p => {
        if (state.brands.length && !state.brands.includes(p.brand)) return false;
        if (state.categories.length && !state.categories.includes(p.category)) return false;
        if (state.priceMin !== null && p.price < state.priceMin) return false;
        if (state.priceMax !== null && p.price > state.priceMax) return false;

        if (state.search) {
            const query = state.search.toLowerCase();
            if (!p.name.toLowerCase().includes(query)) return false;
        }

        return true;
    });
}

function sortProducts(products, sort) {
    const sorted = [...products];
    switch (sort) {
        case 'price-asc': sorted.sort((a, b) => a.price - b.price); break;
        case 'price-desc': sorted.sort((a, b) => b.price - a.price); break;
        case 'name-asc': sorted.sort((a, b) => a.name.localeCompare(b.name, 'ru')); break;
        case 'name-desc': sorted.sort((a, b) => b.name.localeCompare(a.name, 'ru')); break;
    }
    return sorted;
}

function renderCatalog() {
    const container = document.getElementById('catalog-products');
    if (!container) return;

    let list = filterProducts(PRODUCTS, catalogState);
    list = sortProducts(list, catalogState.sort);

    const countEl = document.getElementById('products-count');
    if (countEl) countEl.textContent = list.length;

    renderProducts(container, list);
    updateURL();
}

function getUniqueValues(products, key) {
    return [...new Set(products.map(p => p[key]))].sort();
}

function renderFilterGroup(containerId, name, values, labels) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.replaceChildren();

    values.forEach(value => {
        const label = document.createElement('label');
        label.className = 'filter-check';
        label.innerHTML = `
            <input type="checkbox" name="${name}" value="${value}">
            <span>${labels[value] || value}</span>
        `;
        container.appendChild(label);
    });
}

/* URL фильтров */

function updateURL() {
    const params = new URLSearchParams();

    if (catalogState.search) params.set('search', catalogState.search);
    if (catalogState.brands.length) params.set('brands', catalogState.brands.join(','));
    if (catalogState.categories.length) params.set('categories', catalogState.categories.join(','));
    if (catalogState.sort !== 'default') params.set('sort', catalogState.sort);
    if (catalogState.priceMin !== null) params.set('priceMin', catalogState.priceMin);
    if (catalogState.priceMax !== null) params.set('priceMax', catalogState.priceMax);

    const query = params.toString();
    const newURL = query ? `?${query}` : window.location.pathname;
    history.replaceState(null, '', newURL);
}

function readURL() {
    const params = new URLSearchParams(window.location.search);

    if (params.has('search')) catalogState.search = params.get('search');
    if (params.has('brands')) catalogState.brands = params.get('brands').split(',').filter(Boolean);
    if (params.has('categories')) catalogState.categories = params.get('categories').split(',').filter(Boolean);
    if (params.has('sort')) catalogState.sort = params.get('sort');
    if (params.has('priceMin')) catalogState.priceMin = +params.get('priceMin');
    if (params.has('priceMax')) catalogState.priceMax = +params.get('priceMax');
}


/* Мобильные фильтры */

function initMobileFilters() {
    const toggle = document.getElementById('filters-toggle');
    const panel = document.getElementById('filters-panel');
    const overlay = document.getElementById('filters-overlay');
    const closeBtn = document.getElementById('filters-close');

    if (!toggle || !panel || !overlay) return;

    function openFilters() {
        panel.classList.add('is-open');
        overlay.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    }

    function closeFilters() {
        panel.classList.remove('is-open');
        overlay.classList.remove('is-open');
        document.body.style.overflow = '';
    }

    toggle.addEventListener('click', openFilters);
    overlay.addEventListener('click', closeFilters);
    if (closeBtn) closeBtn.addEventListener('click', closeFilters);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeFilters();
    });

    const resetBtn = document.getElementById('reset-filters');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            setTimeout(closeFilters, 200);
        });
    }
}

/* Инициализация каталога */

function initCatalogFilters() {
    const sidebar = document.querySelector('.catalog-sidebar');
    if (!sidebar) return;

    readURL();

    renderFilterGroup('brand-filters', 'brand', getUniqueValues(PRODUCTS, 'brand'), BRAND_LABELS);
    renderFilterGroup('category-filters', 'category', getUniqueValues(PRODUCTS, 'category'), CATEGORY_LABELS);

    document.querySelectorAll('input[name="brand"]').forEach(cb => {
        if (catalogState.brands.includes(cb.value)) cb.checked = true;
    });
    document.querySelectorAll('input[name="category"]').forEach(cb => {
        if (catalogState.categories.includes(cb.value)) cb.checked = true;
    });

    const sortSelect = document.getElementById('sort');
    if (sortSelect && catalogState.sort !== 'default') {
        sortSelect.value = catalogState.sort;
    }

    const priceMinInput = document.getElementById('price-min');
    const priceMaxInput = document.getElementById('price-max');
    if (priceMinInput && catalogState.priceMin !== null) priceMinInput.value = catalogState.priceMin;
    if (priceMaxInput && catalogState.priceMax !== null) priceMaxInput.value = catalogState.priceMax;

    const searchInput = document.querySelector('input[name="search"]');
    if (searchInput && catalogState.search) {
        searchInput.value = catalogState.search;
    }

    const infoBox = document.getElementById('search-info');
    const queryEl = document.getElementById('search-query');
    if (infoBox && queryEl && catalogState.search) {
        infoBox.style.display = 'flex';
        queryEl.textContent = catalogState.search;
    }

    const clearSearchBtn = document.getElementById('clear-search');
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', () => {
            catalogState.search = '';
            if (infoBox) infoBox.style.display = 'none';
            if (searchInput) searchInput.value = '';
            renderCatalog();
        });
    }

    document.querySelectorAll('input[name="brand"]').forEach(cb => {
        cb.addEventListener('change', () => {
            catalogState.brands = [...document.querySelectorAll('input[name="brand"]:checked')]
                .map(el => el.value);
            renderCatalog();
        });
    });

    document.querySelectorAll('input[name="category"]').forEach(cb => {
        cb.addEventListener('change', () => {
            catalogState.categories = [...document.querySelectorAll('input[name="category"]:checked')]
                .map(el => el.value);
            renderCatalog();
        });
    });

    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            catalogState.sort = sortSelect.value;
            renderCatalog();
        });
    }

    const applyPriceBtn = document.getElementById('apply-price');
    if (applyPriceBtn) {
        applyPriceBtn.addEventListener('click', () => {
            const min = document.getElementById('price-min').value;
            const max = document.getElementById('price-max').value;

            catalogState.priceMin = min === '' ? null : +min;
            catalogState.priceMax = max === '' ? null : +max;

            renderCatalog();
        });
    }

    const resetBtn = document.getElementById('reset-filters');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            document.querySelectorAll('.catalog-sidebar input[type="checkbox"]')
                .forEach(cb => cb.checked = false);
            document.getElementById('price-min').value = '';
            document.getElementById('price-max').value = '';
            if (sortSelect) sortSelect.value = 'default';

            catalogState.brands = [];
            catalogState.categories = [];
            catalogState.sort = 'default';
            catalogState.priceMin = null;
            catalogState.priceMax = null;
            catalogState.search = '';

            if (infoBox) infoBox.style.display = 'none';
            if (searchInput) searchInput.value = '';

            renderCatalog();
        });
    }

    renderCatalog();
}

/* Категории на главной */

function renderCategories() {
    const container = document.getElementById('categories-grid');
    if (!container) return;

    const CATEGORY_IMAGES = {
        oils: 'images/castrol.webp',
        parts: 'images/fuelpump.webp',
        batteries: 'images/akb.webp',
        forgedWheels: 'images/wheels.webp'
    };

    const categories = [...new Set(PRODUCTS.map(p => p.category))];

    container.replaceChildren();

    categories.forEach(key => {
        const count = PRODUCTS.filter(p => p.category === key).length;
        const title = CATEGORY_LABELS[key] || key;
        const image = CATEGORY_IMAGES[key] || 'images/logo.png';
        const word = pluralize(count, ['товар', 'товара', 'товаров']);

        const card = document.createElement('a');
        card.className = 'category-card';
        card.href = `product.html?categories=${key}`;
        card.innerHTML = `
            <div class="category-card__image">
                <img src="${image}" alt="${title}" loading="lazy">
            </div>
            <div class="category-card__body">
                <h3 class="category-card__title">${title}</h3>
                <p class="category-card__count">${count} ${word}</p>
            </div>
        `;
        container.appendChild(card);
    });
}

function pluralize(n, forms) {
    const mod10 = n % 10;
    const mod100 = n % 100;

    if (mod10 === 1 && mod100 !== 11) return forms[0];
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1];
    return forms[2];
}

/* Страница товара */

function renderProductPage() {
    const container = document.getElementById('product-page');
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
        container.innerHTML = '<p class="product-page__error">Товар не найден</p>';
        return;
    }

    const product = PRODUCTS.find(p => String(p.id) === String(id));

    if (!product) {
        container.innerHTML = '<p class="product-page__error">Товар не найден</p>';
        return;
    }

    document.title = `${product.name} — Автомагазин`;

    const brandName = BRAND_LABELS[product.brand] || product.brand;
    const categoryName = CATEGORY_LABELS[product.category] || product.category;

    const specsHTML = product.specs ? `
        <div class="product-page__specs">
            <h3 class="product-page__specs-title">Характеристики</h3>
            <dl class="product-page__specs-list">
                ${Object.entries(product.specs).map(([key, value]) => `
                    <div class="spec-row">
                        <dt class="spec-row__key">${key}</dt>
                        <dd class="spec-row__value">${value}</dd>
                    </div>
                `).join('')}
            </dl>
        </div>
    ` : '';

    const descHTML = product.description ? `
        <div class="product-page__desc-block">
            <h3 class="product-page__desc-title">Описание</h3>
            <p class="product-page__desc">${product.description}</p>
        </div>
    ` : '';

    container.innerHTML = `
        <div class="product-page__inner">

            <div class="product-page__image">
                <img src="${product.image}" alt="${product.name}">
            </div>

            <div class="product-page__info">

                <div class="product-page__breadcrumbs">
                    <a href="index.html">Главная</a>
                    <span> / </span>
                    <a href="product.html">Каталог</a>
                    <span> / </span>
                    <a href="product.html?categories=${product.category}">${categoryName}</a>
                </div>

                <h1 class="product-page__title">${product.name}</h1>

                <div class="product-page__meta">
                    <span><strong>Бренд:</strong> ${brandName}</span>
                    <span><strong>Категория:</strong> ${categoryName}</span>
                </div>

                <p class="product-page__price">${product.price.toLocaleString('ru-RU')} ₽</p>

                <button class="product-page__btn" type="button"
                        data-id="${product.id}"
                        data-name="${product.name}"
                        data-price="${product.price}"
                        data-image="${product.image}">
                    Добавить в корзину
                </button>

                ${specsHTML}
                ${descHTML}

            </div>

        </div>
    `;

    bindAddToCartButtons();
}

/* Checkout */

function initCheckout() {
    const steps = document.querySelectorAll('.checkout-step');
    if (!steps.length) return;

    let currentStep = 1;

    function openStep(num) {
        steps.forEach(step => {
            const stepNum = +step.dataset.step;
            step.classList.toggle('is-active', stepNum === num);
            step.classList.toggle('is-completed', stepNum < num);
        });

        currentStep = num;

        const active = document.querySelector(`.checkout-step[data-step="${num}"]`);
        if (active) {
            active.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        if (num === 6) {
            renderOrderPreview();
        }
    }

    function validateStep(step) {
        const inputs = step.querySelectorAll('input[required], textarea[required]');
        let valid = true;
        let firstInvalid = null;

        inputs.forEach(input => {
            input.classList.remove('is-invalid');

            const value = input.value.trim();

            if (!value) {
                input.classList.add('is-invalid');
                valid = false;
                if (!firstInvalid) firstInvalid = input;
                return;
            }

            if (input.pattern) {
                const regex = new RegExp('^' + input.pattern + '$');
                if (!regex.test(value)) {
                    input.classList.add('is-invalid');
                    valid = false;
                    if (!firstInvalid) firstInvalid = input;
                }
            }

            if (input.name === 'cardNumber') {
                const digits = value.replace(/\D/g, '');
                if (digits.length !== 16) {
                    input.classList.add('is-invalid');
                    valid = false;
                    if (!firstInvalid) firstInvalid = input;
                }
            }

            if (input.name === 'cardExpiry') {
                const match = value.match(/^(\d{2})\/(\d{2})$/);
                if (!match) {
                    input.classList.add('is-invalid');
                    valid = false;
                    if (!firstInvalid) firstInvalid = input;
                } else {
                    const month = +match[1];
                    if (month < 1 || month > 12) {
                        input.classList.add('is-invalid');
                        valid = false;
                        if (!firstInvalid) firstInvalid = input;
                    }
                }
            }

            if (input.name === 'cardCvv') {
                if (value.length < 3 || value.length > 4) {
                    input.classList.add('is-invalid');
                    valid = false;
                    if (!firstInvalid) firstInvalid = input;
                }
            }

            if (input.name === 'recipientPhone') {
                const digits = value.replace(/\D/g, '');
                if (digits.length !== 11) {
                    input.classList.add('is-invalid');
                    valid = false;
                    if (!firstInvalid) firstInvalid = input;
                }
            }
        });

        if (!valid) {
            alert('Проверьте правильность заполнения полей');
            if (firstInvalid) firstInvalid.focus();
        }

        return valid;
    }

    document.querySelectorAll('.checkout-next').forEach(btn => {
        btn.addEventListener('click', () => {
            const step = btn.closest('.checkout-step');
            const num = +btn.dataset.next;

            if (!validateStep(step)) return;

            openStep(num);
        });
    });

    document.querySelectorAll('.checkout-step__header').forEach(header => {
        header.addEventListener('click', () => {
            const step = header.closest('.checkout-step');
            const num = +step.dataset.step;

            if (num < currentStep) {
                openStep(num);
            }
        });
    });

    openStep(1);
}

function renderOrderPreview() {
    const container = document.getElementById('order-items');
    const totalEl = document.getElementById('order-total');
    if (!container) return;

    const cart = getCart();
    container.replaceChildren();

    if (cart.length === 0) {
        container.innerHTML = '<p>Корзина пуста</p>';
        if (totalEl) totalEl.textContent = '0 ₽';
        return;
    }

    let total = 0;

    cart.forEach(item => {
        const row = document.createElement('div');
        row.className = 'order-item';

        row.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="order-item__img">
            <div class="order-item__info">
                <div class="order-item__name">${item.name}</div>
                <div class="order-item__qty">${item.qty} × ${item.price.toLocaleString('ru-RU')} ₽</div>
            </div>
            <div class="order-item__sum">${(item.price * item.qty).toLocaleString('ru-RU')} ₽</div>
        `;

        container.appendChild(row);
        total += item.price * item.qty;
    });

    if (totalEl) totalEl.textContent = `${total.toLocaleString('ru-RU')} ₽`;
}

function initPlaceOrder() {
    const btn = document.getElementById('place-order');
    if (!btn) return;

    btn.addEventListener('click', () => {
        alert('Заказ оформлен! Спасибо за покупку.');
        saveCart([]);
        window.location.href = 'index.html';
    });
}

function initCheckoutFormatting() {
    const cardInput = document.querySelector('input[name="cardNumber"]');
    const expiryInput = document.querySelector('input[name="cardExpiry"]');
    const cvvInput = document.querySelector('input[name="cardCvv"]');
    const phoneInput = document.querySelector('input[name="recipientPhone"]');

    if (cardInput) {
        cardInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            value = value.substring(0, 16);

            const parts = value.match(/.{1,4}/g) || [];
            e.target.value = parts.join(' ');
        });
    }

    if (expiryInput) {
        expiryInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            value = value.substring(0, 4);

            if (value.length >= 1 && value[0] > '1') {
                value = '0' + value;
            }

            if (value.length >= 2) {
                const month = +value.substring(0, 2);
                if (month > 12) {
                    value = '12' + value.substring(2);
                }
                if (month === 0) {
                    value = '01' + value.substring(2);
                }
            }

            if (value.length >= 3) {
                value = value.substring(0, 2) + '/' + value.substring(2);
            }
            e.target.value = value;
        });
    }

    if (cvvInput) {
        cvvInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
        });
    }

    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');

            if (value.startsWith('8')) value = '7' + value.substring(1);
            if (value && !value.startsWith('7')) value = '7' + value;

            value = value.substring(0, 11);

            let formatted = '+7';
            if (value.length > 1) formatted += ' (' + value.substring(1, 4);
            if (value.length >= 5) formatted += ') ' + value.substring(4, 7);
            if (value.length >= 8) formatted += '-' + value.substring(7, 9);
            if (value.length >= 10) formatted += '-' + value.substring(9, 11);

            e.target.value = formatted;
        });

        phoneInput.addEventListener('focus', (e) => {
            if (!e.target.value) e.target.value = '+7 (';
        });

        phoneInput.addEventListener('blur', (e) => {
            if (e.target.value === '+7 (' || e.target.value === '+7') {
                e.target.value = '';
            }
        });
    }
}

/* Инициализация */

document.addEventListener('DOMContentLoaded', () => {
    renderCart();

    const clearButton = document.getElementById('clear-cart');
    if (clearButton) {
        clearButton.addEventListener('click', () => {
            saveCart([]);
            renderCart();
        });
    }

    renderPopularProducts();

    initCatalogFilters();

    renderProductPage();

    updateCartCount();

    initCheckout();
    initCheckoutFormatting();
    initPlaceOrder();
    renderCategories();
    
    initMobileFilters();
    updateCartCount();
});