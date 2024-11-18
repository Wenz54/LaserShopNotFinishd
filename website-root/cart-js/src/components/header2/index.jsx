import React, { useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import styles from "./style.module.scss"; // Assuming you have a corresponding SCSS file

const Header = () => {
  const headerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        headerRef.current.classList.add(styles.scrolled);
      } else {
        headerRef.current.classList.remove(styles.scrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header ref={headerRef} className={styles.header}>
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