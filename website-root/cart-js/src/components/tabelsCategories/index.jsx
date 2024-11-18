import styles from "./style.module.scss";
import Header from "../header/index";
import Footer from "../footer";
import { Link } from "react-router-dom";

const MacroCat = () => {
    return (
        <main>
            <Header />
            <div className={styles.main__container2}>
                <div className={styles.plate_row}>
                    <Link to="/tabLaserCat" className={styles.plate}>
                        <img src={`${process.env.PUBLIC_URL}/resourses/tabel.jpg`} alt="Гербовые" />
                        <div className={styles.plate_text2}>
                            <h2>Гравировка<br />лазером</h2>
                            <p>Таблички, на которых мы заботливо выгравировали то, что вы скажите нам нашим высококачественным лазером!</p>
                        </div>
                    </Link>

                    <Link to="/tab3dCat" className={styles.plate}>
                        <img src={`${process.env.PUBLIC_URL}/resourses/tab3d.jpg`} alt="Пломбиратор" />
                        <div className={styles.plate_text}>
                            <h2>Объёмные элементы</h2>
                            <p>Смотрятся очень презентабельно и привлекают внимание клиентов</p>
                        </div>
                    </Link>

                    <Link to="/tabApplicationCat" className={styles.plate}>
                        <img src={`${process.env.PUBLIC_URL}/resourses/tabapplication.jpg`} alt="Таблички" />
                        <div className={styles.plate_text2}>
                            <h2>Аппликация <br /> плёнкой</h2>
                            <p> Плюс этой технологии, это не высокая стоимость и возможность легко заменить элементы цветной пленки. Всепогодная, долго сорханяет внешний вид</p>
                        </div>
                    </Link>
                </div>
            </div>
            <Footer />
        </main>
    );
}

export default MacroCat;