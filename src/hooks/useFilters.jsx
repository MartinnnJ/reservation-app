import { useReducer, useEffect, useCallback } from "react";
import { getFreePlacesCount } from "../helpers";
import { fetchAllRooms } from "../api/fetch";

export const filtersActions = [
  'SEARCH_INPUT_CHANGE',
  'BALCONY_SELECTOR_VALUE_CHANGE',
  'FREE_SELECTOR_VALUE_CHANGE',
  'GENDER_SELECTOR_VALUE_CHANGE'
]

const filtersInitState = {
  searchValue: '',
  balconySelectorValue: '',
  freePlacesSelectorValue: '',
  genderSelectorValue: ''
}

const filtersReducer = (state, action) => {
  if (action.type === filtersActions[0]) {
    return { ...state, searchValue: action.value }
  }
  if (action.type === filtersActions[1]) {
    return { ...state, balconySelectorValue: action.value }
  }
  if (action.type === filtersActions[2]) {
    return { ...state, freePlacesSelectorValue: action.value }
  }
  if (action.type === filtersActions[3]) {
    return { ...state, genderSelectorValue: action.value }
  }

  return filtersInitState;
}

function useFilters(ref) {
  const [filtersState, dispatchFilters] = useReducer(filtersReducer, filtersInitState);

  // 'document.activeElement' returns the currently focused element in the document
  useEffect(() => {
    window.addEventListener('keydown', e => {
      if (e.code === 'Escape' && ref.current === document.activeElement) {
        dispatchFilters({ type: filtersActions[0], value: '' })
      }
    })
  }, [ref]);

  const searchFilter = useCallback(roomObj => {
    const searchTermUpperCased = filtersState.searchValue.toUpperCase();
    return roomObj.roomName.includes(searchTermUpperCased) ? true : false;
  }, [filtersState.searchValue])

  const balconyFilter = useCallback(roomObj => {
    const currBalconyStateBool = filtersState.balconySelectorValue === '' ? // ---
      null : +filtersState.balconySelectorValue === 1 ?
      true : false;

    if (currBalconyStateBool === null) return true;
    if (currBalconyStateBool === roomObj.balcony) return true;
    return false;

  }, [filtersState.balconySelectorValue])

  const genderFilter = useCallback(roomObj => {
    const currGenderStateChar = filtersState.genderSelectorValue === '' ? // ---
      null : +filtersState.genderSelectorValue === 1 ?
      'M' : 'F';

    if (currGenderStateChar === null) return true;
    if (currGenderStateChar === roomObj.roomInfo.gender) return true;
    return false;

  }, [filtersState.genderSelectorValue])

  const freePlacesFilter = useCallback(roomObj => {
    const currFreePlacesStateNum = filtersState.freePlacesSelectorValue === '' ? // ---
      null : +filtersState.freePlacesSelectorValue;

    const currFreePlacesInDatabase = getFreePlacesCount(roomObj.roomInfo);

    if (currFreePlacesStateNum === null) return true;
    if (currFreePlacesStateNum === currFreePlacesInDatabase) return true;
    return false;

  }, [filtersState.freePlacesSelectorValue])

  const fetchAndFilterRooms = useCallback(async () => {
    const allRooms = await fetchAllRooms();
    const filteredRooms = allRooms.filter(searchFilter)
      .filter(balconyFilter).filter(genderFilter).filter(freePlacesFilter);
    
    return filteredRooms;
  }, [searchFilter, balconyFilter, genderFilter, freePlacesFilter])

  return [
    filtersState,
    dispatchFilters,
    fetchAndFilterRooms
  ];
}

export default useFilters;