import styles from '../styles/RoomsListItem.module.scss';

function RoomsListItem({ roomId, roomName, freePlaces, balcony, gender, onOpenModal, btnsDisabled }) {
  const isBtnDisabled = btnsDisabled || +freePlaces === 0 ? true : false;
  
  return (
    <tr className={styles['table__row']}>
      <td>{roomName}</td>
      <td>{freePlaces}</td>
      <td>{balcony}</td>
      <td>{gender}</td>
      <td>
        <button className={styles['table__row--btn']} data-id={roomId} onClick={onOpenModal} disabled={isBtnDisabled}>
          Rezervácia
        </button>
      </td>
    </tr>
  )
}

export default RoomsListItem;