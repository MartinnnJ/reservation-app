import { createPortal } from 'react-dom';
import styles from "../styles/Message.module.scss";

function Message({ status }) {
  const messages = {
    'ERROR': 'Chyba! Skúste to znova neskôr',
    'INVALID': 'Chyba! Zle zadané údaje',
    'SUCCESS': 'Rezervácia úspešná',
  }
  
  const messageType = status === 'INVALID' || status === 'ERROR' ? styles.error : styles.success;

  return createPortal(
    <div className={`${styles.message} ${messageType}`}>
      {messages[status]}
    </div>,
    document.querySelector('#modal')
  )
}

export default Message;