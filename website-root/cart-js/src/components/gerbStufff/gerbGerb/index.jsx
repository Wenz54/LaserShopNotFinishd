import React, { useState } from 'react';
import Header from "../../header/index.jsx";
import Footer from "../../footer/index.jsx";
import Modal from "../../modal/index.jsx";
import StuffUnit from "../../stuffUnit/index.jsx";
import styles from "./style.module.scss";

const Gerb1 = () => {
    const [quantity, setQuantity] = useState(1);
    const [price, setPrice] = useState(1200.00);
    const [osnastkiPrice, setOsnastkiPrice] = useState(0.00);
    const [uploadMessage, setUploadMessage] = useState('');
    const [quality, setQuality] = useState(1);
    const [unitPrice, setUnitPrice] = useState(1200.00);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalItems, setModalItems] = useState([]);
    const [selectedArtikul, setSelectedArtikul] = useState('gerbGost');
    const [selectedOsnastkaArtikul, setSelectedOsnastkaArtikul] = useState('');
    const [selectedStampType, setSelectedStampType] = useState('');
    const minQuality = 1;
    const maxQuality = 1000;

    const osnastki = [
        { id: 'professional1', name: 'Professional', price: 2800, artikul: 'proffesionalOsn', imgSrc: 'resourses/Kruglie_tovari/52045/52045.jpg', size: 'Ø45' },
        { id: 'printy1', name: 'Printy', price: 500, artikul: 'printyOsn', imgSrc: 'resourses/Kruglie_tovari/4630/4630.jpg', size: 'Ø45' },
        { id: 'ideal1', name: 'Ideal', price: 400, artikul: 'idealOsn', imgSrc: 'resourses/Kruglie_tovari/4924ideal/4924.jpg', size: 'Ø42' },
        { id: 'none', name: 'Очистить', price: 0, artikul: '' }
    ];

    const stampTypes = [
        { id: 'type1', name: 'Тип 1', price: 100, imgSrc: 'resourses/Kruglie_tovari/52045/52045.jpg' },
        { id: 'type2', name: 'Тип 2', price: 200, imgSrc: 'resourses/Kruglie_tovari/4630/4630.jpg' },
        { id: 'type3', name: 'Тип 3', price: 300, imgSrc: 'resourses/Kruglie_tovari/4924ideal/4924.jpg' },
        { id: 'usual', name: 'Обычная', price: 0, artikul: 'gerbGost' },
    ];

    const updatePriceAndQuality = (newQuality) => {
        if (newQuality < minQuality) {
            newQuality = minQuality;
        } else if (newQuality > maxQuality) {
            newQuality = maxQuality;
        }

        setQuality(newQuality);
        const newPrice = (unitPrice + osnastkiPrice) * newQuality;
        setPrice(newPrice);
    };

    const handleButtonClick = (price, artikul) => {
        if (selectedOsnastkaArtikul === artikul) {
            setSelectedOsnastkaArtikul('');
            setOsnastkiPrice(osnastkiPrice - price);
        } else {
            if (selectedOsnastkaArtikul !== '') {
                const oldPrice = osnastki.find((osnastka) => osnastka.artikul === selectedOsnastkaArtikul)?.price || 0;
                setOsnastkiPrice(osnastkiPrice - oldPrice + price);
            } else {
                setOsnastkiPrice(osnastkiPrice + price);
            }
            setSelectedOsnastkaArtikul(artikul);
        }

        const buttons = document.querySelectorAll(`.${styles.chooseOsnastkaButton}`);
        buttons.forEach((button) => {
            button.classList.remove(styles.active);
        });

        const activeButton = document.getElementById(artikul);
        if (activeButton) {
            activeButton.classList.add(styles.active);
        }

        const newPrice = (unitPrice + osnastkiPrice) * quality;
        setPrice(newPrice);
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
        const listElement = document.getElementById('list');
        if (listElement) {
            listElement.innerHTML = `<ul>${output.join('')}</ul>`;
        }
    };

    const handleDragOver = (evt) => {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'copy';
    };

    const handleAddToCart = async () => {
        try {
            console.log('Sending request to add to cart:', { artikul: selectedArtikul, quantity: quality, osnastkaArtikul: selectedOsnastkaArtikul });
    
            if (selectedOsnastkaArtikul !== '') {
                const response = await fetch('https://lasergrafics.ru/api/add-to-cart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ artikul: selectedArtikul, quantity: quality }),
                });
    
                const response2 = await fetch('https://lasergrafics.ru/api/add-to-cart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ artikul: selectedOsnastkaArtikul, quantity: quality }),
                });
    
                if (!response.ok) {
                    const errorText = await response.text(); // Получаем текст ответа
                    console.error('Error response:', errorText); // Логируем текст ответа
                    throw new Error('Network response was not ok');
                }
                if (!response2.ok) {
                    const errorText = await response.text(); // Получаем текст ответа
                    console.error('Error response:', errorText); // Логируем текст ответа
                    throw new Error('Network response was not ok');
                }
    
                const product1 = await response.json();
                const product2 = await response2.json();
    
                console.log('Products added to cart:', product1, product2);
    
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                cart.push({ ...product1, quantity: quality });
                cart.push({ ...product2, quantity: quality });
                localStorage.setItem('cart', JSON.stringify(cart));
                setModalItems([{ ...product1, quantity: quality }, { ...product2, quantity: quality }]);
                setIsModalOpen(true);
            } else {
                const response = await fetch('https://lasergrafics.ru/api/add-to-cart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ artikul: selectedArtikul, quantity: quality }),
                });
    
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
    
                const product = await response.json();
    
                console.log('Product added to cart:', product);
    
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                cart.push({ ...product, quantity: quality });
                localStorage.setItem('cart', JSON.stringify(cart));
                setModalItems([{ ...product, quantity: quality }]);
                setIsModalOpen(true);
            }
        } catch (error) {
            console.error('Error adding product to cart', error);
        }
    };


    const handleDeleteFromModal = (itemId) => {
        setIsModalOpen(false);
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(item => item._id !== itemId);
        localStorage.setItem('cart', JSON.stringify(cart));
        setModalItems(modalItems.filter(item => item._id !== itemId));
    };

    const handleStampTypeClick = (price, id) => {
        if (id === 'clear') {
            setSelectedStampType('');
            setUnitPrice(900.00);
            setSelectedArtikul('gerbGost');
        } else {
            if (selectedStampType !== '') {
                const oldPrice = stampTypes.find((stampType) => stampType.id === selectedStampType)?.price || 0;
                setUnitPrice(unitPrice - oldPrice + price);
            } else {
                setUnitPrice(unitPrice + price);
            }
            setSelectedStampType(id);

            switch (id) {
                case 'type1':
                    setSelectedArtikul('gerbGostMcr');
                    break;
                case 'type2':
                    setSelectedArtikul('gerbGostLogo');
                    break;
                case 'type3':
                    setSelectedArtikul('gerbGostMcrLogo');
                    break;
                case 'usual':
                    setSelectedArtikul('gerbGost');
                    break;
                default:
                    setSelectedArtikul('gerbGost');
            }
        }
        const newPrice = (unitPrice + osnastkiPrice) * quality;
        setPrice(newPrice);
    };

    return (
        <div className={styles.gerb1Page}>
            <Header />

            <main>
                <div className={styles.container}>
                    <img src={`${process.env.PUBLIC_URL}/resourses/pechati/menti.jpg`} alt="Гербовые" />
                    <div className={styles.nazvanie}>
                        <h3>Гербовая</h3>
                        <h4>По ГОСТу Р 51511-2001</h4>
                    </div>
                    <div className={styles.harakteristiki}>
                        <div className={styles.sindzi_4moshnik}><p>Ø40-48мм</p></div>
                        <div className={styles.sindzi_4moshnik}><p>Клише печати</p></div>
                        <div className={styles.sindzi_4moshnik}><p>Маслобензостойкая резина</p></div>
                    </div>
                    <div className={styles.about_product}>
                        <p><a>Гербовые печати для государственных или муниципальных
                            учреждений.</a> <br /> Cодержание — вышестоящая организация, полное и краткое наименование организации, ОГРН, ИНН, место нахождения организации, в центре герб РФ или герб субъекта РФ, средства защиты — микрошрифт, растровая сетка, линии толщиной 0,08 мм, оснастка — автоматическая, ручная, документы — свидетельства ОГРН, ИНН, уставные документы, при выдаче печати – подпись клиента в журнале учета  печатей и штампов.
                            <br/><a>ООО «Лазер Графикс»</a> (сертификат соответствия <a>№ ПС.RU.П.1028 от 01.02.2024) </a> имеет право изготавливать мастичные печати всех типов, в том числе с воспроизведением Государственного герба России, гербов субъектов Российской Федерации, городов России, логотипов предприятий Российской Федерации всех форм собственности и без таковых.</p>
                        <br /> <h3>Выберите оснастку:</h3> <br /> <h6 style={{ marginTop: '-2%' }}></h6>
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
                            <button
                                key={osnastka.id}
                                id={osnastka.id}
                                className={`${styles.chooseOsnastkaButton} ${selectedOsnastkaArtikul === osnastka.artikul ? styles.active : ''}`}
                                onClick={() => handleButtonClick(osnastka.price, osnastka.artikul)}
                            >
                                {osnastka.imgSrc && <img src={`${process.env.PUBLIC_URL}/${osnastka.imgSrc}`} alt={osnastka.name} />}
                                <p className={styles.osnastkaName}>{osnastka.name}</p>
                                {osnastka.price !== 0 && (
                                    <figcaption className={styles.figcaption} style={{ color: 'black', textAlign: 'center' }}>
                                        {osnastka.price}р
                                    </figcaption>
                                )}
                                <p>{osnastka.size}</p>
                            </button>
                        ))}
                    </div>
                    <div className={styles.priceRow}>
                        <div className={styles.priceStamp}>{(unitPrice * quality).toFixed(2)}р</div>  <p className={styles.priceStamp}> + </p>
                        <div className={styles.priceOsn}>{(osnastkiPrice * quality).toFixed(2)}р</div>
                    </div>

                    <div className={styles.orderBtns}>
                        <button id="addToBasket" className={styles.addToBasket} data-artikul="gerbGost" onClick={handleAddToCart}>Добавить в корзину</button>
                    </div>
                </div>

                <Footer />
            </main>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                modalItems={modalItems}
                handleDeleteFromModal={handleDeleteFromModal}
            />
        </div>
    );
}

export default Gerb1;