import { useReducer } from "react";
import { getFreePlacesCount } from "../helpers";

export const modalActions = [
  'IS_MODAL_OPEN',
  'CURR_ROOM_DATA',
  'MODAL_INPUT',
  'MODAL_GENDER_SELECT',
  'MODAL_RESET_VALUES',
]

const modalInitState = {
  isOpen: false,
  currRoomData: {},
  inputValues: [
    { "fullName": '', "email": '' },
    { "fullName": '', "email": '' },
    { "fullName": '', "email": '' },
    { "fullName": '', "email": '' }
  ],
  gender: null,
}

const modalReducer = (state, action) => {
  if (action.type === modalActions[0]) {
    return { ...state, isOpen: action.value }
  }
  if (action.type === modalActions[1]) {
    const freePlaces = getFreePlacesCount(action.value.roomInfo);
    return { ...state, currRoomData: { ...action.value }, inputValues: state.inputValues.slice(0, freePlaces)  }
  }
  if (action.type === modalActions[2]) {
    const inputName = action.inputName.split('-');
    const inputValue = action.inputValue;

    const index = inputName[1]; // 0, 1, 2, 3
    const name = inputName[0]; // name, email

    const updatedPersonObject = {
      ...state.inputValues[index],
      [name === 'name' ? 'fullName' : 'email']: inputValue
    }

    const temp = [...state.inputValues];
    temp.splice(index, 1, updatedPersonObject);

    return { ...state, inputValues: temp }
  }

  if (action.type === modalActions[3]) {
    return { ...state, gender: action.value }
  }

  if (action.type === modalActions[4]) {
    return { ...state, inputValues: [...modalInitState.inputValues], gender: modalInitState.gender }
  }

  return modalInitState;
}

function useModal() {
  const [modalState, dispatchModal] = useReducer(modalReducer, modalInitState);

  return [modalState, dispatchModal];
}

export default useModal;