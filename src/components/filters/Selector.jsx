import styles from '../../styles/filters/Selector.module.scss';

function Selector({ labelName, name, value, onSelectorChange }) {
  const arrLength = name === 'free' ? 5 : 2;
  const selectorValues = new Array(arrLength).fill(0).map((number, i) => number + i);

  return (
    <div className={styles.filters}>
      <label>{labelName}:</label>
      <select name={name} onChange={onSelectorChange} value={value}>
        <option value="">---</option>
        {selectorValues.map((number, i) => {
          let optionDisplayName = '';
          if (arrLength === 2) { // moze to byt bud 'balcony', alebo 'gender'
            optionDisplayName = name === 'balcony' ?
              number === 1 ? 'Áno' : 'Nie' : number === 1 ? 'Mužské' : 'Ženské';
          } else { // moze to byt iba 'free'
            optionDisplayName = number;
          }
          return <option key={i} value={number}>{optionDisplayName}</option>
        })}
      </select>
    </div>
  )
}

export default Selector;