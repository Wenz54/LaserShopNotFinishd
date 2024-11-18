import styles from "./style.module.scss"
import Header from "../../header/index.jsx"
import Footer from "../../footer/index.jsx";
const TabelsCategory = () => {
    return (
        <div className={styles.gerbCategory}>
            <Header />
            <main>
                <div className={styles.main__container2}>
                    <div className={styles.plate_row}>
                        <a href="/tabFasadApplication" className={styles.plate}>
                            <img src={`${process.env.PUBLIC_URL}/resourses/tabel.jpg`} alt="Гербовые" className={styles.image} />
                            <div className={styles.plate_text}>
                                <h2 className={styles.name}>Фасадная</h2>
                            </div>
                            <h3 className={styles.price}>3.800 - 20.000₽</h3>
                        </a>

                        <a href="/tabOfficeApplication" className={styles.plate}>
                            <img src={`${process.env.PUBLIC_URL}/resourses/secret.jpg`} alt="Для органов" className={styles.image} />
                            <div className={styles.plate_text}>
                                <h2 className={styles.name}>Офисная</h2>
                            </div>
                            <h3 className={styles.price}>600 - 2.280₽</h3>
                        </a>

                    </div>

                    <Footer/>
                </div>
            </main>
        </div>
    );
}

export default TabelsCategory;