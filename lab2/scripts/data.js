/* =========================
   ДАННЫЕ ТОВАРОВ
   =========================
   
   Чтобы добавить товар — добавьте объект в массив PRODUCTS.
   Чтобы добавить бренд/категорию — просто используйте новое значение
   в поле brand/category, чекбокс появится автоматически.
*/

const PRODUCTS = [
    {
        id: '1',
        name: 'Масло Mobil1 FS 5W-40 4L',
        price: 3200,
        image: 'images/mobil5w30.webp',
        brand: 'mobil',
        category: 'oils',
        popular: true,

        description: 'Полностью синтетическое моторное масло Mobil 1 5W-40. Обеспечивает отличную защиту двигателя, экономию топлива и продлённый интервал замены. Подходит для бензиновых и дизельных двигателей.',

        specs: {
            'Объём': '4 л',
            'Вязкость': '5W-30',
            'Тип': 'Синтетическое',
            'API': 'SN',
            'ACEA': 'A3/B4',
            'Страна': 'Финляндия'
        }
    },
    {
        id: '2',
        name: 'Масло Castrol Magnatec 10W-40 4L',
        price: 2500,
        image: 'images/castrol.webp',
        brand: 'castrol',
        category: 'oils',
        popular: true,

        description: 'Полусинтетическое моторное масло с вязкостью 10W-40. Подходит для бензиновых и дизельных двигателей большинства европейских, американских, японских, корейских и китайских и корейских автомобилей.',

        specs: {
            'Объём': '4 л',
            'Вязкость': '10W40',
            'Тип': 'Полусинтетическое',
            'API': 'SL',
            'ACEA': 'A3/B4',
            'Страна': 'Германия'
        }
    },
    {
        id: '3',
        name: 'Электробензонасос BOSCH 0 580 453 453',
        price: 1500,
        image: 'images/fuelpump.webp',
        brand: 'bosch',
        category: 'parts',
        popular: true,

        description: 'Электрический топливный насос, погружного типа',

        specs: {
            'Подходит для': 'LADA 2108-21099 (инж. двигатель объёмом 1.5)',
            'Рабочее давление:': '3.3-3.8 атм.',
            'Производительность': 'не менее 60л/час',
            'Совместимые модули ЭБН': '21083-1139007-01, 21083-1139009'
        }
    },
    {
        id: '4',
        name: 'АКБ DOMINATOR 60AH/600a',
        price: 6500,
        image: 'images/akb.webp',
        brand: 'dominator',
        category: 'batteries',
        popular: true
    },
    {
        id: '5',
        name: 'Кованный диск ВСМПО R14 4x98 5.5j',
        price: 6000,
        image: 'images/vsmpo1.jpg',
        brand: 'vsmpo',
        category: 'forgedWheels',
        popular: true
    },
    {
        id: '6',
        name: 'Антифриз SINTEC G12+ 3kg',
        price: 1500,
        image: 'images/antifreeze.webp',
        brand: 'sintec',
        category: 'oils',
        popular: true
    },
    {
        id: '7',
        name: 'Свечи зажигания NGK-BPR6ES-11',
        price: 1200,
        image: 'images/svechi.webp',
        brand: 'ngk',
        category: 'parts',
        popular: true
    },
    {
        id: '8',
        name: 'Тормозные колодки LADA SPORT 21080-3501800-83',
        price: 2500,
        image: 'images/brakepads.webp',
        brand: 'lada',
        category: 'parts',
        popular: true
    },
    {
        id: '9',
        name: 'Кованный диск ВСМПО Паллада R14 4x98 6j',
        price: 7200,
        image: 'images/wheels.webp',
        brand: 'vsmpo',
        category: 'forgedWheels',
        popular: false
    }
];

/* Человекочитаемые названия брендов и категорий
   (для чекбоксов фильтров) */
const BRAND_LABELS = {
    mobil: 'Mobil',
    castrol: 'Castrol',
    bosch: 'BOSCH',
    dominator: 'DOMINATOR',
    vsmpo: 'ВСМПО',
    sintec: 'SINTEC',
    ngk: 'NGK',
    lada: 'LADA'
};

const CATEGORY_LABELS = {
    oils: 'Автомобильные масла',
    tires: 'Шины и диски',
    forgedWheels: 'Кованные диски',
    parts: 'Запасные части',
    batteries: 'Аккумуляторы'
};