import styles from '../styles/Loader.module.scss';

function Loader({ text }) {
  return <div className={styles.loader}>{text}</div>
}

export default Loader;