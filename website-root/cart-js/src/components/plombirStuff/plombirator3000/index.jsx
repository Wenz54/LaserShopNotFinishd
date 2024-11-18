import React, { useState } from 'react';
import Header from "../../header/index.jsx";
import Footer from "../../footer/index.jsx";
import Modal from "../../modal/index.jsx";
import StuffUnit from "../../stuffUnit/index.jsx"; 
import styles from "./style.module.scss";

const Plombirator = () => {
    const [quantity, setQuantity] = useState(1);
    const [price, setPrice] = useState(900.00);
    const [osnastkiPrice, setOsnastkiPrice] = useState(0.00);
    const [uploadMessage, setUploadMessage] = useState('');
    const [quality, setQuality] = useState(1);
    const [unitPrice, setUnitPrice] = useState(900);
    const [sumPriceOsnastki, setSumPriceOsnastki] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false); // Состояние для модального окна
    const [modalItem, setModalItem] = useState(null); // Состояние для данных модального окна

    const minQuality = 1;
    const maxQuality = 100;

    const osnastki = [
        { id: 'professional1', name: 'Professional 1', price: 900, imgSrc: 'resourses/Kruglie_tovari/52045/52045.jpg', size: 'Ø45' },
        { id: 'professional2', name: 'Professional 2', price: 800, imgSrc: 'resourses/Kruglie_tovari/52045/52045.jpg', size: 'Ø42' },
        { id: 'printy1', name: 'Printy 1', price: 500, imgSrc: 'resourses/Kruglie_tovari/4630/4630.jpg', size: 'Ø45' },
        { id: 'printy2', name: 'Printy 2', price: 400, imgSrc: 'resourses/Kruglie_tovari/4642/4642.jpg', size: 'Ø42' },
        { id: 'ideal', name: 'Ideal', price: 300, imgSrc: 'resourses/Kruglie_tovari/4924ideal/4924.jpg', size: 'Ø42' },
        { id: 'empty', name: 'Очистить'}
    ];

    const updatePriceAndQuality = (newQuality) => {
        if (newQuality < minQuality) {
            newQuality = minQuality;
        } else if (newQuality > maxQuality) {
            newQuality = maxQuality;
        }

        setQuality(newQuality);
        const newPrice = unitPrice * newQuality;
        setPrice(newPrice);
    };

    const handleButtonClick = (price) => {
        setSumPriceOsnastki(price);
        const currentQualityOsnastki = price * quality;
        setOsnastkiPrice(currentQualityOsnastki);
    };

    const handleMinusClick = () => {
        updatePriceAndQuality(quality - 1);
        const currentQualityOsnastki = sumPriceOsnastki * (quality - 1);
        setOsnastkiPrice(currentQualityOsnastki);
    };

    const handlePlusClick = () => {
        updatePriceAndQuality(quality + 1);
        const currentQualityOsnastki = sumPriceOsnastki * (quality + 1);
        setOsnastkiPrice(currentQualityOsnastki);
    };

    const handleFileSelect = (evt) => {
        evt.stopPropagation();
        evt.preventDefault();

        const files = evt.dataTransfer.files;
        const output = [];
        for (let i = 0, f; f = files[i]; i++) {
            output.push(
                `<li><strong>${escape(f.name)}</strong> (${f.type || 'n/a'}) - ${f.size} bytes, last modified: ${f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a'}</li>`
            );

            const formData = new FormData();
            formData.append('file', f);

            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'upload.php', true);

            xhr.upload.onprogress = (e) => {
                if (e.lengthComputable) {
                    const percentage = Math.round((e.loaded / e.total) * 100);
                    setUploadMessage(`Uploading: ${percentage}%`);
                }
            };

            xhr.onload = () => {
                if (xhr.status === 200) {
                    setUploadMessage('Мы загрузили ваше фото!');
                } else {
                    setUploadMessage('Возникла ошибка при отправке данных на сервер. Пожалуйста, свяжитесь с нами любым удобным Вам способом через страницу "Контакты"');
                }
            };

            xhr.send(formData);
        }
        document.getElementById('list').innerHTML = `<ul>${output.join('')}</ul>`;
    };

    const handleDragOver = (evt) => {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'copy';
    };

    const handleAddToCart = async () => {
        const artikul = 'metalPlombirator';
        try {
            const response = await fetch('http://localhost:3000/api/add-to-cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ artikul, quantity: quality }), // Send quantity
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
    
            const product = await response.json();
            console.log('Product added to cart:', product);
    
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart.push({ ...product, quantity: quality }); // Add quantity to the item
            localStorage.setItem('cart', JSON.stringify(cart));
    
            // Открыть модальное окно с данными продукта
            setModalItem({ ...product, quantity: quality });
            setIsModalOpen(true);
            console.log('Modal should be open now'); // Добавьте этот лог для отладки
        } catch (error) {
            console.error('Error adding product to cart', error);
        }
    };

    const handleDeleteFromModal = () => {
        // Закрыть модальное окно
        setIsModalOpen(false);
        // Удалить элемент из корзины
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(item => item._id !== modalItem._id);
        localStorage.setItem('cart', JSON.stringify(cart));
        setModalItem(null);
    };

    return (
        <div className={styles.gerb1Page}>
            <Header />

            <main>
                <div className={styles.container}>
                    <img src={`${process.env.PUBLIC_URL}/resourses/plombirator.jpg`} alt="gerb" className={styles.image}/>
                    <div className={styles.nazvanie}>
                        <h3>Пломбиратор</h3>
                        <h4>Не для зубов!</h4>
                    </div>

                    <div className={styles.harakteristiki}>
                        <div className={styles.sindzi_4moshnik}><p>Ø10мм</p></div>
                    </div>
                    <div className={styles.about_product}>
                        <p>
                        
Пломбиратор — это механизм для нанесения оттиска на пломбы, оснащенный пластиковыми ручками и двумя латунными плашками, на которых выполняется механическая гравировка символов. Диаметр каждой плашки составляет 9 миллиметров. Гравировать можно как одну, так и обе плашки, при этом изображение может быть одинаковым на обеих или уникальным для каждой. Содержание оттиска может быть любым, но без сложных логотипов и растровых изображений. Оснастка пломбиратора выполнена из металла с пластиковыми ручками, что обеспечивает удобство использования.

Цены за количество знаков в оттиске:

До 9 символов — 350 рублей (включая плашку).

Больше 9 символов — за каждый дополнительный символ + 20 рублей.

Максимум 20 символов.</p>
                    </div>
                </div>

                <div className={styles.interactivePartWrapper}>
                    <div className={styles.itemQuality}>
                        <button id="minus" className={styles.minus} onClick={handleMinusClick}>-</button>
                        <h3>{quality}</h3>
                        <button id="plus" className={styles.plus} onClick={handlePlusClick}>+</button>
                    </div>
                    <div className={styles.priceRow}>
                        <div className={styles.priceStamp}>{(unitPrice * quality).toFixed(2)}р</div>
                    </div>
                    <h2>Последний шаг: мышкой перетащите сюда ваши документы</h2>
                    <div id="drop_zone" className={styles.dropZone} onDragOver={handleDragOver} onDrop={handleFileSelect}>Вот сюда</div>
                    <output id="list" className={styles.list}>{uploadMessage}</output>

                    <div className={styles.orderBtns}>
                        <button id="addToBasket" className={styles.addToBasket} data-artikul="metalPlombirator" onClick={handleAddToCart}>Добавить в корзину</button>
                    </div>
                </div>

                <Footer />
            </main>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                modalItem={modalItem} // Используем modalItem вместо modalItems
                handleDeleteFromModal={handleDeleteFromModal}
            />
        </div>
    );
}

export default Plombirator;