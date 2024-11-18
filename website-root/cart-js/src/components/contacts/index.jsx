import styles from "./style.module.scss";
import Header from "../header/index";
import Footer from "../footer/index"; // Assuming you have a Footer component

const Contacts = () => {
    return (
  
           

            <main> <Header />
                <div className={styles.contactInner}>
                    <div className={styles.contactOverlay}>
                        <div className={styles.overlayInner}>
                            <h2>Свяжитесь с Лазер Графикс!</h2>
                            <div className={styles.overlayColumns}>
                                <div className={styles.owColumn}>
                                    <h2>По почте</h2>
                                    <a href="#">Gmail</a>
                                    <a href="#">Mail</a>
                                    <a href="#">Yandex</a>
                                    <h2>Через мессенджеры</h2>
                                    <a href="#">Viber</a>
                                    <a href="#">Telegram</a>
                                    <a href="#">Whatsapp</a>
                                    <h2>По номеру</h2>
                                    <a href="#">+7(000)-000-00-00</a>
                                    <h2>А также наши социальные сети</h2>
                                    <a href="#">Telegram</a>
                                    <a href="#">VK</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </main>

    );
}

export default Contacts;