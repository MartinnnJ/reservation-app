import { useState, useEffect, useRef, useCallback } from "react";
import useModal, { modalActions } from "./hooks/useModal";
import useFilters, { filtersActions } from "./hooks/useFilters";
import usePaginator, { paginatorActions } from "./hooks/usePaginator";
import Paginator from "./components/Paginator";
import RoomsList from "./components/RoomsList";
import SearchBar from "./components/filters/SearchBar";
import Selector from "./components/filters/Selector";
import Modal from "./components/Modal";
import Message from "./components/Message";
import Timer from "./components/Timer";
import Loader from "./components/Loader";
import { createReservation, fetchRoom } from "./api/fetch";
import { roomsPerPage, intervalUpdateTime, msgTimeoutTime, deadlineDate, validateModalData, generateNewPersonsIds } from "./helpers";
import { AnimatePresence } from "framer-motion";

function App() {
  const searchBarRef = useRef();
  const [isAppLoaded, setIsAppLoaded] = useState(false);
  const [rooms, setRooms] = useState({ displayedRooms: [], allRooms: [] });
  const [message, setMessage] = useState({ visibility: false, status: '', errorClicks: 0 });
  const [btnsDisabled, setBtnsDisabled] = useState(false);
  const [filtersState, dispatchFilters, fetchAndFilterRooms] = useFilters(searchBarRef);
  const [modalState, dispatchModal] = useModal();
  const [paginatorState, dispatchPaginator] = usePaginator();

  // managing loading screen with classes
  const appClassResult = isAppLoaded ? 'wrapper' : 'wrapper hidden';

  // initial fetching and managing filters
  useEffect(() => {
    (async () => {
      const filteredRooms = await fetchAndFilterRooms();
      const roomSlice = filteredRooms.slice(0, roomsPerPage);
      dispatchPaginator({ type: paginatorActions[0], dataLength: filteredRooms.length });
      dispatchPaginator({ type: paginatorActions[1], pageSelected: 1 }); // paginator reset

      setRooms(prev => {
        return { ...prev, displayedRooms: [...roomSlice], allRooms: [...filteredRooms] }
      })
      console.log(filteredRooms);
    })()
  }, [dispatchPaginator, fetchAndFilterRooms]);

  // periodical updates
  useEffect(() => {
    const intervalId = setInterval(async () => {
      const filteredRooms = await fetchAndFilterRooms();
      dispatchPaginator({ type: paginatorActions[0], dataLength: filteredRooms.length });

      const paginatorEndSlice = roomsPerPage * paginatorState.pageSelected;
      const paginatorStartSlice = paginatorEndSlice - roomsPerPage;
      const roomSlice = filteredRooms.slice(paginatorStartSlice, paginatorEndSlice);

      setRooms(prev => {
        return { ...prev, displayedRooms: [...roomSlice], allRooms: [...filteredRooms] }
      })
      // console.log(filteredRooms);
    }, intervalUpdateTime);

    return () => { clearInterval(intervalId) }
  }, [paginatorState.pageSelected, dispatchPaginator, fetchAndFilterRooms])

  // managing error messages
  useEffect(() => {
    if (!message.visibility) return;
    
    const timerId = setTimeout(() => {
      setMessage(prev => {
        return { ...prev, visibility: false, status: '', errorClicks: 0 }
      });
    }, msgTimeoutTime);

    return () => {
      clearTimeout(timerId);
    }
  }, [message.visibility, message.errorClicks])

  // searchbar and filters event functions
  const onSearchChange = e => {
    dispatchFilters({ type: filtersActions[0], value: e.target.value });
  }

  const onSelectorChange = e => {
    const selectorName = e.target.name;
    if (selectorName === 'balcony') {
      dispatchFilters({ type: filtersActions[1], value: e.target.value });
    }
    if (selectorName === 'free') {
      dispatchFilters({ type: filtersActions[2], value: e.target.value });
    }
    if (selectorName === 'gender') {
      dispatchFilters({ type: filtersActions[3], value: e.target.value });
    }
  }

  // paginator event function
  const onPaginatorClick = e => {
    let pageClicked = e.target.dataset.page;
    // arrow click
    if (pageClicked === '>' || pageClicked === '<') {
      if (pageClicked === '>') {
        const calcNextPage = +paginatorState.pageSelected + 1;
        pageClicked = calcNextPage;
      }
      if (pageClicked === '<') {
        const calcPreviousPage = +paginatorState.pageSelected - 1;
        pageClicked = calcPreviousPage;
      }
    }
    // page number click
    if (+pageClicked === +paginatorState.pageSelected) return;
    dispatchPaginator({ type: paginatorActions[1], pageSelected: pageClicked });
    const paginatorEndSlice = roomsPerPage * pageClicked;
    const paginatorStartSlice = paginatorEndSlice - roomsPerPage;
    setRooms(prev => {
      const roomSlice = rooms.allRooms.slice(paginatorStartSlice, paginatorEndSlice);
      return { ...prev, displayedRooms: [...roomSlice] }
    })
  }

  // modal event functions
  const onOpenModal = async e => {
    const roomClicked = e.target.dataset.id;
    const result = await fetchRoom(roomClicked);
    dispatchModal({ type: modalActions[0], value: true })
    dispatchModal({ type: modalActions[1], value: result })
  }

  const onCloseModal = () => {
    dispatchModal({ type: modalActions[0], value: false });
    dispatchModal({ type: modalActions[4] });
  }

  const onModalInputChange = e => {
    dispatchModal({ type: modalActions[2], inputName: e.target.name, inputValue: e.target.value });
  }

  const onReservationBtnClick = async roomId => {
    const getSelectedGender = modalState.currRoomData.roomInfo.gender ?
      modalState.currRoomData.roomInfo.gender : modalState.gender;
    const oldPersons = modalState.currRoomData.roomInfo.persons.filter(obj => {
      if (obj.fullName && obj.email) {
        return true;
      }
      return false;
    })
    const modalData = {
      ...modalState.currRoomData,
      roomInfo: {
        gender: getSelectedGender,
        persons: modalState.inputValues // only new persons included
      }
    };

    const isValid = validateModalData(modalData);
    if (isValid) {
      console.log('Sending reservation...');
      const reservationData = generateNewPersonsIds(modalData);
      reservationData.roomInfo['persons'] = [...reservationData.roomInfo['persons'], ...oldPersons]; // merging new and old persons into one array
      const result = await createReservation(roomId, reservationData);

      if (result.status !== 200 && result.statusText !== 'OK') {
        setMessage(prev => {
          return { ...prev, visibility: true, status: 'ERROR', errorClicks: prev.errorClicks + 1 }
        });
        onCloseModal();
        return;
      }

      setMessage(prev => {
        return { ...prev, visibility: true, status: 'SUCCESS', errorClicks: prev.errorClicks + 1 }
      });
      onCloseModal();
    } else {
      setMessage(prev => {
        return { ...prev, visibility: true, status: 'INVALID', errorClicks: prev.errorClicks + 1 }
      });
    }
  }

  const onGenderChange = e => {
    dispatchModal({ type: modalActions[3], value: e.target.value });
  }

  // invokes when app is fully loaded
  const onAppLoadedChange = useCallback(bool => {
    setIsAppLoaded(bool);
  }, [])

  // disables all buttons when deadline is over
  const onTimeOut = useCallback(() => {
    setBtnsDisabled(true);
  }, [])

  return (
    <>
      {!isAppLoaded && <Loader text="Loading..." />}
      <div className={appClassResult}>
        <Timer deadline={deadlineDate} onAppLoadedChange={onAppLoadedChange} onTimeOut={onTimeOut} />
        <div className="filters">
          <SearchBar value={filtersState.searchValue} onSearchChange={onSearchChange} ref={searchBarRef} />
          <div className="filters__selectors">
            <Selector labelName="Balkón" name="balcony" onSelectorChange={onSelectorChange} value={filtersState.balconySelectorValue} />
            <Selector labelName="Voľné miesta" name="free" onSelectorChange={onSelectorChange} value={filtersState.freePlacesSelectorValue} />
            <Selector labelName="Obsadenie" name="gender" onSelectorChange={onSelectorChange} value={filtersState.genderSelectorValue} />
          </div>
        </div>
        <RoomsList rooms={rooms.displayedRooms} onOpenModal={onOpenModal} btnsDisabled={btnsDisabled} />
        <Paginator
          dataLength={paginatorState.dataLength}
          pageSelected={paginatorState.pageSelected}
          roomsPerPage={roomsPerPage}
          onPaginatorClick={onPaginatorClick}
        />
        <AnimatePresence>
          {modalState.isOpen && (
            <Modal
              modalState={modalState}
              onCloseModal={onCloseModal}
              onModalInputChange={onModalInputChange}
              onReservationBtnClick={onReservationBtnClick}
              onGenderChange={onGenderChange}
              btnsDisabled={btnsDisabled}
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {message.visibility && (
            <Message status={message.status} />
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

export default App;