    import React, { useState, useEffect } from 'react';
    import DOMPurify from 'dompurify';
    import validator from 'validator';
    import styles from "./style.module.scss";
    import Header from '../header/index';
    import Footer from '../footer/index';
    import SuccessModal from '../successModal/index'; 

    const Orderform = ({ files, onSubmit }) => {
        const [formData, setFormData] = useState({
            name: '',
            email: '',
            phone: ''
        });

        const [errors, setErrors] = useState({});
        const [cart, setCart] = useState([]);
        const [serverError, setServerError] = useState('');
        const [successMessage, setSuccessMessage] = useState('');
        const [uploadedFiles, setUploadedFiles] = useState([]);
        const [isModalOpen, setIsModalOpen] = useState(false); // Состояние для модального окна

        useEffect(() => {
            const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
            setCart(storedCart);
        }, []);

        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData({
                ...formData,
                [name]: value
            });
        };

        const validateForm = () => {
            let formErrors = {};
            if (!validator.isEmail(formData.email)) {
                formErrors.email = 'Invalid email address';
            }
            if (!validator.isMobilePhone(formData.phone, 'any')) {
                formErrors.phone = 'Invalid phone number';
            }
            return formErrors;
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            const formErrors = validateForm();
            if (Object.keys(formErrors).length > 0) {
                setErrors(formErrors);
                return;
            }
            const sanitizedData = {
                name: DOMPurify.sanitize(formData.name),
                email: DOMPurify.sanitize(formData.email),
                phone: DOMPurify.sanitize(formData.phone),
            };

            const formDataWithFiles = new FormData();
            formDataWithFiles.append('formData', JSON.stringify(sanitizedData));
            formDataWithFiles.append('cart', JSON.stringify(cart));
            if (uploadedFiles.length > 0) {
                uploadedFiles.forEach((file, index) => {
                    formDataWithFiles.append('files', file);
                });
            }

            console.log('Files to be sent:', uploadedFiles); // Добавьте это для проверки

            fetch('http://localhost:3000/send-email', {
                method: 'POST',
                body: formDataWithFiles
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.message) {
                    setSuccessMessage(data.message);
                    setServerError('');
                    if (onSubmit) {
                        onSubmit(); // Очистка корзины и файлов после отправки письма
                    }
                    setIsModalOpen(true); // Открываем модальное окно
                    localStorage.removeItem('cart'); // Очищаем localStorage
                } else {
                    setServerError('An error occurred while sending the email.');
                    setSuccessMessage('');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                setServerError('An error occurred while sending the email.');
                setSuccessMessage('');
            });
        };

        const handleFileChange = (event) => {
            const selectedFiles = Array.from(event.target.files);
            setUploadedFiles(prevFiles => [...prevFiles, ...selectedFiles]);
        };

        const handleDrop = (event) => {
            event.preventDefault();
            const droppedFiles = Array.from(event.dataTransfer.files);
            setUploadedFiles(prevFiles => [...prevFiles, ...droppedFiles]);
        };

        const handleDragOver = (event) => {
            event.preventDefault();
        };

        const handleFileDelete = (index) => {
            setUploadedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
        };

        return (
            <div className={styles.app}>
                <Header />
                <main>
                    <div className={styles.main__container}>
                        <div className={styles.wrapper}>
                            <div className={styles.orderPage}>
                                <form 
                                    className={styles.orderForm} 
                                    onSubmit={handleSubmit}
                                >
                                    <div className={styles.formGroup}>
                                        <label htmlFor="name">Имя</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                        {errors.name && <span className={styles.error}>{errors.name}</span>}
                                    </div><br></br>
                                    
                                    <div className={styles.formGroup}>
                                        <label htmlFor="email">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                        {errors.email && <span className={styles.error}>{errors.email}</span>}
                                    </div><br></br>
                                                                
                                    <div className={styles.formGroup}>
                                        <label htmlFor="phone">Телефон</label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                        />
                                        {errors.phone && <span className={styles.error}>{errors.phone}</span>}
                                    </div><br></br> 
                                    <div 
                                    className={styles.dropzone} 
                                    onDrop={handleDrop} 
                                    onDragOver={handleDragOver}
                                >
                                    <p>Перетащите ОГРН, ИНН, уставные документы, макет.</p>
                                    <input 
                                        type="file" 
                                        onChange={handleFileChange} 
                                        multiple 
                                        style={{ display: 'none' }} 
                                        id="file-upload" 
                                    />
                                    <label htmlFor="file-upload" className={styles.uploadButton}>
                                        <span>Выберите файлы</span>
                                    </label>
                                </div>

                                {uploadedFiles.length > 0 && (
                                    <div>
                                        <h4>Загруженные файлы:</h4>
                                        <ul>
                                            {uploadedFiles.map((file, index) => (
                                                <li key={index}>
                                                    {file.name}
                                                    <button className={styles.deleteFile} onClick={() => handleFileDelete(index)}>Удалить</button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                
                                    <button className={styles.orderNow}type="submit">Заказать</button>
                                    {serverError && <div className={styles.error}>{serverError}</div>}
                                    {/* Убираем successMessage из формы */}
                                </form>

                            
                            </div>
                        </div>
                    
                    </div> 
                    <Footer />
                </main>
                <SuccessModal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} />
            </div>
        );
    };

    export default Orderform;