import React, { useState } from 'react';
import Header from "../../header/index.jsx";
import Footer from "../../footer/index.jsx";
import Modal from "../../modal/index.jsx";
import StuffUnit from "../../stuffUnit/index.jsx"; 
import styles from "./style.module.scss";
import { Link } from "react-router-dom";
const RoundMetal = () => {
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
        const artikul = 'gerbGost';
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
                    <img src={`${process.env.PUBLIC_URL}/resourses/catato.jpg`} alt="gerb" className={styles.image}/>
                    <div className={styles.nazvanie}>
                        <h3>Металличкская</h3>
                        <h4>Так закалялась сталь</h4>
                    </div>

                    <div className={styles.harakteristiki}>
                    <div className={styles.sindzi_4moshnik}><p>Латунь</p></div>
                    <div className={styles.sindzi_4moshnik}><p>Сталь</p></div>
                    </div>
                    <div className={styles.about_product}>
                        <p>Конструктор металических печатей с рассчётом цены внутри сайта было бы сделать слишком сложно, поэтому обратитесь в <Link to="/contacts">Контакты</Link> для связи с нашими самыми добрыми и отзывчивыми менеджерами, которые обязательно в лёгкой и доступной форме помогут Вам с дизайном и покупкой лучших металлических печатей на свете!</p>
                    </div>
                </div>

                <Footer />
            </main>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {modalItem && <StuffUnit item={modalItem} onDelete={handleDeleteFromModal} />}
            </Modal>
        </div>
    );
}

export default RoundMetal;