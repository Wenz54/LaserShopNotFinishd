import React, { useState } from 'react';
import Header from "../../header/index.jsx";
import Footer from "../../footer/index.jsx";
import Modal from "../../modal/index.jsx";
import StuffUnit from "../../stuffUnit/index.jsx"; 
import styles from "./style.module.scss";

const TabOfficeApplication = () => {
    const [quantity, setQuantity] = useState(1);
    const [price, setPrice] = useState(0.00);
    const [uploadMessage, setUploadMessage] = useState('');
    const [quality, setQuality] = useState(1);
    const [unitPrice, setUnitPrice] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalItem, setModalItem] = useState(null); // Используем modalItem вместо modalItems
    const [selectedArtikul, setSelectedArtikul] = useState(''); // Состояние для выбранного артикула

    const minQuality = 1;
    const maxQuality = 1000;

    const osnastki = [
        { id: 'professional1', name: '400x300', price: 3800, imgSrc: 'resourses/tabel.jpg', artikul: '3dLittle' },
        { id: 'professional2', name: '500x500', price: 6800, imgSrc: 'resourses/tabel.jpg', artikul: '3dLittle+' },
        { id: 'printy1', name: '500x700', price: 9500, imgSrc: 'resourses/tabel.jpg', artikul: '3dMedium' },
        { id: 'printy2', name: '600x800', price: 13000, imgSrc: 'resourses/tabel.jpg', artikul: '3dBig' },
        { id: 'ideal', name: '1200x2000', price: 20000, imgSrc: 'resourses/tabel.jpg', artikul: '3dBig+' },
        { id: 'empty', name: 'Очистить', price: 0, imgSrc: '', artikul: '' }
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

    const handleButtonClick = (price, artikul) => {
        setUnitPrice(price);
        setSelectedArtikul(artikul); // Сохранить выбранный артикул
        const newPrice = price * quality;
        setPrice(newPrice);
        console.log('Selected artikul:', artikul); // Логирование выбранного артикула
    };

    const handleMinusClick = () => {
        updatePriceAndQuality(quality - 1);
    };

    const handlePlusClick = () => {
        updatePriceAndQuality(quality + 1);
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
        try {
            console.log('Sending request to add to cart:', { artikul: selectedArtikul, quantity: quality }); // Логирование запроса
            const response = await fetch('http://localhost:3000/api/add-to-cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ artikul: selectedArtikul, quantity: quality }), // отправление количества и артикула
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
    
            const product = await response.json();
            console.log('Product added to cart:', product);
    
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart.push({ ...product, quantity: quality }); // количество
            localStorage.setItem('cart', JSON.stringify(cart));
    
            // Открыть модальное окно с данными продукта
            setModalItem({ ...product, quantity: quality });
            setIsModalOpen(true);
            console.log('Modal should be open now'); // лог для отладки
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
                    <img src={`${process.env.PUBLIC_URL}/resourses/tabel.jpg`} alt="gerb" className={styles.image}/>
                    <div className={styles.nazvanie}>
                        <h3>Фасадная</h3>
                        <h4>Для улицы</h4>
                    </div>

                    <div className={styles.harakteristiki}>
                        <div className={styles.sindzi_4moshnik}><p>400x300-1200x2000</p></div>
                    </div>
                    <div className={styles.about_product}>
                        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Blanditiis architecto sed ut fuga culpa soluta quidem corrupti, iusto illo voluptates, accusantium dolorem nostrum. Vitae laudantium quis neque officiis eveniet ullam! Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eveniet doloribus nam labore veritatis ut rerum obcaecati, iusto sint amet animi, natus laboriosam dicta voluptates aperiam id consectetur, repellendus autem a.</p>
                        <br /> <h3>Выберите размер:</h3> <br /> <h6 style={{ marginTop: '-2%' }}></h6>
                    </div>
                </div>

                <div className={styles.interactivePartWrapper}>
                    <div className={styles.itemQuality}>
                        <button id="minus" className={styles.minus} onClick={handleMinusClick}>-</button>
                        <h3>{quality}</h3>
                        <button id="plus" className={styles.plus} onClick={handlePlusClick}>+</button>
                    </div>

                    <div className={styles.chooseOsnastka}>
                        {osnastki.map((osnastka) => (
                            <button key={osnastka.id} id={osnastka.id} className={styles.chooseOsnastkaButton} onClick={() => handleButtonClick(osnastka.price, osnastka.artikul)}>
                                {osnastka.imgSrc && <img src={`${process.env.PUBLIC_URL}/${osnastka.imgSrc}`} alt={osnastka.name} />}
                                <p>{osnastka.name}</p>
                                <figcaption className={styles.figcaption} style={{ color: 'black', textAlign: 'center' }}>
                                    {osnastka.price}р
                                </figcaption>
                                <p>{osnastka.size}</p>
                            </button>
                        ))}
                    </div>
                    <div className={styles.priceRow}>
                        <div className={styles.priceStamp}>{(unitPrice * quality).toFixed(2)}р</div>
                    </div>
                    <h2>Последний шаг: мышкой перетащите сюда ваши документы</h2>
                    <div id="drop_zone" className={styles.dropZone} onDragOver={handleDragOver} onDrop={handleFileSelect}>Вот сюда</div>
                    <output id="list" className={styles.list}>{uploadMessage}</output>

                    <div className={styles.orderBtns}>
                        <button id="addToBasket" className={styles.addToBasket} data-artikul="gerbGost" onClick={handleAddToCart}>Добавить в корзину</button>
                    </div>
                </div>

                <Footer />
            </main>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                modalItem={modalItem} // Передаем modalItem вместо modalItems
                handleDeleteFromModal={handleDeleteFromModal}
            />
        </div>
    );
}

export default TabOfficeApplication;