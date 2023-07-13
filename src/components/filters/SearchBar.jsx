import { forwardRef } from 'react';
import styles from '../../styles/filters/SearchBar.module.scss';

const SearchBar = forwardRef(function SearchBar({ value, onSearchChange }, ref) {
  return(
    <div className={styles.input}>
      <input
        className={styles['input--search-bar']}
        type="text"
        value={value}
        onChange={onSearchChange}
        ref={ref}
        placeholder='Hľadaj podľa názvu izby'
      />
    </div>
  )
})

export default SearchBar;