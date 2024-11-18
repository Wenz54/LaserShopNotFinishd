import { Link } from "react-router-dom";
import styles from "./style.module.scss"; // Assuming you have a corresponding SCSS file

const Header = () => {
  return (
    <header className={styles.scrolled}>
      <Link to="/"><img src={`${process.env.PUBLIC_URL}/resourses/LOGO.png`} alt="logo" /></Link>
      <div className={styles.src}>
      </div>
      <nav>
        <Link to="/about">О нас</Link>
        <Link to="/categories">Категории</Link>
        <Link to="/contacts">Контакты</Link>
        <Link to="/cart">Корзина</Link>
      </nav>
    </header>
  );
}

export default Header;