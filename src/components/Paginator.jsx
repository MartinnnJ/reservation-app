import { useState } from 'react';
import { paginatorLengthLimit } from '../helpers';
import styles from '../styles/Paginator.module.scss';

function Paginator({ dataLength, pageSelected, roomsPerPage, onPaginatorClick }) {
  const [paginatorStartValue, setPaginatorStartValue] = useState(1);

  if (paginatorStartValue > pageSelected) {
    setPaginatorStartValue(1); // resetujeme hodnoty paginatora na 1, ak sa pouzije filter
  }
  
  let isHidden = false;

  let paginatorLength = Math.ceil(dataLength / roomsPerPage); // konecny pocet stran paginatora
  if (paginatorLength <= 1) {
    paginatorLength = 1;
    isHidden = true;
  }
  const paginatorValues = new Array(paginatorLength).fill(paginatorStartValue).map((number, i) => number + i);
  const paginatorValuesSliced = paginatorValues.slice(0, paginatorLengthLimit); // zobrazovany pocet stran paginatora

  const renderedPaginatorValues = paginatorValuesSliced.map((pageNumber, i) => {
    const isBtnActive = pageNumber === +pageSelected ? true : false;
    const modifierClass = isBtnActive ? '--active' : '';

    return (
      <div
        key={i}
        className={styles[`paginator__btn${modifierClass}`]}
        data-page={pageNumber}
        onClick={onPaginatorClick}
      >
        {pageNumber}
      </div>
    )
  })

  const handleArrowClick = e => {
    const arrowClicked = e.target.dataset.page;
    if (arrowClicked === '>') {
      const lastValue = paginatorValuesSliced.slice(-1)[0];
      if (lastValue >= paginatorLength) return;
      setPaginatorStartValue(prev => prev + 1);
      onPaginatorClick(e);
    }
    if (arrowClicked === '<') {
      const firstValue = paginatorValuesSliced.at(0);
      if (firstValue <= 1) return;
      setPaginatorStartValue(prev => prev - 1);
      onPaginatorClick(e);
    }
  }

  return (
    <div className={`${styles.paginator} ${isHidden ? styles.hidden : ''}`}>
      {paginatorLength > paginatorLengthLimit ? (
        [
          <div key={-1} className={styles['paginator__btn--arrow']} data-page="<" onClick={handleArrowClick}>&laquo;</div>,
          ...renderedPaginatorValues,
          <div key={9999} className={styles['paginator__btn--arrow']} data-page=">" onClick={handleArrowClick}>&raquo;</div>
        ]
      ) : renderedPaginatorValues}
    </div>
  )
}

export default Paginator;