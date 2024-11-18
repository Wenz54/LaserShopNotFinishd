import styles from "./style.module.scss";
import Header from "../header/index";
import Footer from "../footer";

const Plombir = () => {
    return (
        <div className={styles.pageContainer}>

            <Header />

            <main>
                <div className={styles.main__container2}>
                    <div className={styles.plate_row}>
                        <a href="/plombirator" className={styles.plate}>
                            <img src={`${process.env.PUBLIC_URL}/resourses/plombirator.jpg`} alt="Гербовые" className={styles.image} />
                            <div className={styles.plate_text}>
                                <h2 className={styles.name}>Пломбиратор</h2>
                            </div>
                            <h3 className={styles.price}>1800₽</h3>
                        </a>

                        <a href="/roundMetal" className={styles.plate}>
                            <img src={`${process.env.PUBLIC_URL}/resourses/catato.jpg`} alt="Для органов" className={styles.image} />
                            <div className={styles.plate_text}>
                                <h2 className={styles.name}>Металлическая</h2>

                            </div>
                            <h3 className={styles.price}>600₽</h3>
                        </a>
                    </div>

                    <Footer />
                </div>
            </main>
        </div>
    );
}

export default Plombir;