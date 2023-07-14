import { createPortal } from 'react-dom';
import { motion } from "framer-motion";
import styles from "../styles/Message.module.scss";

function Message({ status }) {
  const messages = {
    'ERROR': 'Chyba! Skúste to znova neskôr',
    'INVALID': 'Chyba! Zle zadané údaje',
    'SUCCESS': 'Rezervácia úspešná',
  }
  
  const messageType = status === 'INVALID' || status === 'ERROR' ? styles.error : styles.success;

  return createPortal(
    <motion.div
      initial={{ opacity: 0, translateY: "3rem" }}
      animate={{ opacity: 1, translateY: 0 }}
      exit={{ opacity: 0, translateY: "3rem" }}
      transition={{ duration: .15 }}
      className={`${styles.message} ${messageType}`}
    >
      {messages[status]}
    </motion.div>,
    document.querySelector('#modal')
  )
}

export default Message;