import { createPortal } from 'react-dom';
import { getFreePlacesCount } from '../helpers';
import styles from '../styles/Modal.module.scss';

function Overlay({ onCloseModal }) {
  return <div className={styles.overlay} onClick={onCloseModal}></div>;
}

//--------------------------------------------------------------------

function Modal({ modalState, onCloseModal, onModalInputChange, onReservationBtnClick, onGenderChange, btnsDisabled }) {
  const freePlaces = getFreePlacesCount(modalState.currRoomData.roomInfo);
  const alreadySelectedGender = modalState.currRoomData.roomInfo.gender;
  const isGenderAlreadySelected = !alreadySelectedGender ? false : true;
  const disabled = freePlaces < 4 && isGenderAlreadySelected ? true : false;
  const inputNumberValues = new Array(freePlaces).fill(0).map((number, i) => number + i);

  return createPortal(
    <>
      <Overlay onCloseModal={onCloseModal} />

      <div className={styles.modal}>
        <div className={styles['modal__close-box']}>
          <div className={styles['modal__close-box--btn']} onClick={onCloseModal}>✖</div>
        </div>
        <div className={styles.modal__info}>Rezervácia: <strong>{modalState.currRoomData.roomName}</strong></div>

        {inputNumberValues.map((num, i) => {
          const nameInputValue = modalState.inputValues[num]['fullName'];
          const emailInputValue = modalState.inputValues[num]['email'];

          return (
            <div key={i} className={styles['modal__person-data']}>
              <div className={styles['modal__person-data--name-box']}>
                <label>Meno Priezvisko:</label>
                <input type="text" name={`name-${num}`} value={nameInputValue} onChange={onModalInputChange} autoComplete="off" />
              </div>
              <div className={styles['modal__person-data--email-box']}>
                <label>E-mail:</label>
                <input type="email" name={`email-${num}`} value={emailInputValue} onChange={onModalInputChange} placeholder="@" autoComplete="off" />
              </div>
            </div>
          )
        })}

        <div className={styles['modal__gender-selector']}>
          <label htmlFor="male">Mužské</label>
          <input
            type="radio"
            name="gender"
            id="male"
            value="M"
            onChange={onGenderChange}
            checked={isGenderAlreadySelected ? alreadySelectedGender === 'M' ? true : false : modalState.gender === 'M'}
            disabled={disabled}
          />

          <label htmlFor="female">Ženské</label>
          <input
            type="radio"
            name="gender"
            id="female"
            value="F"
            onChange={onGenderChange}
            checked={isGenderAlreadySelected ? alreadySelectedGender === 'F' ? true : false : modalState.gender === 'F'}
            disabled={disabled}
          />
        </div>

        <div className={styles['modal__reservation-box']}>
          <button
            className={styles['modal__reservation-box--btn']}
            onClick={() => onReservationBtnClick(modalState.currRoomData.id)}
            disabled={btnsDisabled}
          >
            Rezervovať
          </button>
        </div>
      </div>
    </>,
    document.querySelector('#modal')
  )
}

export default Modal;