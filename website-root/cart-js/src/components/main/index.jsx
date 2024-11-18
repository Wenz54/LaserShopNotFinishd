import styles from "./style.module.scss"
import Header from "../header2/index";
import { Link } from 'react-router-dom'; // Импортируем Link
import Footer from "../footer";

const MainPage = () => {
    return (
        <div>
            <Header />
            <main>
                <div className={styles.Lenin} style={{ backgroundAttachment: "fixed" }}>
                    <div className={styles.prikol}>
                        <div className={styles.Takoy_molodoy__text}>
                            <div className={styles.LasGr}>
                                <h1>
                                    ЛАЗЕР <br /> ГРАФИКС
                                </h1>
                            </div>
                            <div className={styles.opisanie}>
                                <p>
                                    Мы занимаемся изготовлением качественных печатией и штампов, а так же сувенирной и иной продукции на проффесиональном оборудовании родом из Австрии и США<br /> Хотите заказать что-то у нас?
                                    Переходите в 
                                    <Link to="/categories">категории</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.mi_tut}>
                    <div className={styles.mi_tut__text}>
                        <h2>Lorem ipsum</h2>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis, commodi earum tempora alias officia dolorum rem esse hic recusandae a. Beatae accusantium ea architecto esse numquam sequi dolorum vel voluptates.</p>
                    </div>

                    <div className={styles.mi_tut__map}>
                        <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3218.8467192721937!2d39.717671789776624!3d47.28079290555556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sru!2sru!4v1685898993239!5m2!1sru!2sru" width="100%" height="450" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                    </div>
                </div>

                <Footer/>
            </main>
        </div>
    );
}

/*<div className={styles.Jiv}>
                    <div className={styles.bebe}>
                        <h2>Lorem ipsum</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                            Repellat, earum consectetur? Accusamus iste accusantium beatae
                            cumque ut, consequuntur incidunt omnis, architecto laborum nisi
                            adipisci enim quos nulla quia repellat possimus!</p>
                    </div>
                    <div className={styles.plitrow}>
                        <div className={styles.plito4ka}>
                            <h3>Lorem</h3>
                            Cюда фотки новинок пихать можно
                        </div>
                        <div className={styles.plito4ka}>
                            <h3>Lorem</h3>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                Nostrum vitae reprehenderit pariatur temporibus ipsam quis
                                quo laboriosam suscipit ullam quidem labore, distinctio
                                commodi impedit repellat sapiente dolore, dolor odio officiis.</p>
                        </div>
                        <div className={styles.plito4ka}>
                            <h3>Lorem</h3>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                Nostrum vitae reprehenderit pariatur temporibus ipsam quis
                                quo laboriosam suscipit ullam quidem labore, distinctio
                                commodi impedit repellat sapiente dolore, dolor odio officiis.</p>
                        </div>
                    </div>
                </div>*/

export default MainPage;