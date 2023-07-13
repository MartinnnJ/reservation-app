import { getFreePlacesCount } from '../helpers';
import RoomsListItem from './RoomsListItem';
import styles from '../styles/RoomsList.module.scss';

function RoomsList({ rooms, onOpenModal, btnsDisabled }) {
  return (
    <table className={styles.table}>
      <thead className={styles['table__header']}>
        <tr>
          <th>Izba</th>
          <th>Voľné miesta</th>
          <th>Balkón</th>
          <th>Obsadenie</th>
          <th>Rezervácia</th>
        </tr>
      </thead>
      <tbody className={styles['table__body']}>
        {rooms.length === 0 && <tr><td colSpan="5">Žiadne izby sa nenašli</td></tr>}
        {rooms.map(room => {
          const freePlaces = getFreePlacesCount(room['roomInfo']);
          const gender = room.roomInfo.gender ?
            room.roomInfo.gender === 'M' ? 'Mužské' : 'Ženské' : '';
          const isBalcony = room.balcony ? 'Áno' : 'Nie';

          return (
            <RoomsListItem
              key={room.id}
              roomId={room.id}
              roomName={room.roomName}
              freePlaces={freePlaces}
              balcony={isBalcony}
              gender={gender}
              onOpenModal={onOpenModal}
              btnsDisabled={btnsDisabled}
            />
          )
        })}
        
      </tbody>
    </table>
  )
}

export default RoomsList;