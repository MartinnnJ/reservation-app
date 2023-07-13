import { useReducer } from "react";

export const paginatorActions = [
  'SET_LENGTH',
  'PAGE_CHANGE'
]

const paginatorInitState = {
  dataLength: 0,
  pageSelected: 1,
}

const paginatorReducer = (state, action) => {
  if (action.type === paginatorActions[0]) {
    return { ...state, dataLength: action.dataLength }
  }

  if (action.type === paginatorActions[1]) {
    return { ...state, pageSelected: action.pageSelected }
  }

  return paginatorInitState;
}

function usePaginator() {
  const [paginatorState, dispatchPaginator] = useReducer(paginatorReducer, paginatorInitState);

  return [paginatorState, dispatchPaginator];
}

export default usePaginator;