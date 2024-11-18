import React, { useState, useEffect } from 'react';
import styles from "./style.module.scss";
import Header from '../header/index';
import Footer from '../footer/index';
import RightSide from '../rightSide/index';
import StuffUnit from '../stuffUnit/index';
import Modal from '../modal/index';
import Orderform from '../orderForm/index';

const App = () => {
    const [cart, setCart] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [addedItems, setAddedItems] = useState([]);
    const [files, setFiles] = useState([]);
    const [showOrderForm, setShowOrderForm] = useState(false);

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(mergeDuplicateItems(storedCart));
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const mergeDuplicateItems = (cart) => {
        const itemMap = new Map();

        cart.forEach(item => {
            if (itemMap.has(item.name)) {
                const existingItem = itemMap.get(item.name);
                existingItem.quantity += item.quantity;
            } else {
                itemMap.set(item.name, { ...item });
            }
        });

        return Array.from(itemMap.values());
    };

    const handleDelete = (item) => {
        const updatedCart = cart.filter(cartItem => cartItem !== item);
        setCart(updatedCart);
    };

    const handleAddToCart = (items) => {
        const updatedCart = [...cart, ...items];
        setCart(mergeDuplicateItems(updatedCart));
        setAddedItems(items);
        setIsModalOpen(true);
    };

    const handleOrderClick = () => {
        setShowOrderForm(true);
    };

    const handleOrderSubmit = () => {
        setCart([]);
        setFiles([]);
        setShowOrderForm(false);
    };

    const handleQuantityChange = (item, newQuantity) => {
        const updatedCart = cart.map(cartItem => {
            if (cartItem === item) {
                return { ...cartItem, quantity: newQuantity };
            }
            return cartItem;
        });
        setCart(updatedCart);
    };

    return (
        <div className={styles.app}>
            <Header />
            <main>
                <div className={styles.main__container}>
                    <div className={styles.wrapper}>
                        <div className={styles.leftSide}>
                            <ul className={styles.spisok}>
                                {cart.map((item, index) => (
                                    <StuffUnit
                                        key={index}
                                        item={item}
                                        onDelete={() => handleDelete(item)}
                                        onQuantityChange={(item, newQuantity) => handleQuantityChange(item, newQuantity)}
                                    />
                                ))}
                            </ul>
                        </div>
                        <div className={styles.rightSide}>
                            <RightSide cart={cart} onOrderClick={handleOrderClick} />
                        </div>
                    </div>
                    <Footer />
                </div>
            </main>
            {isModalOpen && <Modal items={addedItems} onClose={() => setIsModalOpen(false)} />}
            {showOrderForm && <Orderform files={files} onSubmit={handleOrderSubmit} />}
        </div>
    );
};

export default App;