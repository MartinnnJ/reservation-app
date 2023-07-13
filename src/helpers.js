import { v4 } from "uuid";

const roomsPerPage = 9;
const paginatorLengthLimit = 4; // definuje max. viditelny 'range' stran paginatora, realny pocet stran paginatora moze byt vacsi
const intervalUpdateTime = 4000; // ms
const msgTimeoutTime = 3000;
const deadlineDate = "Jul 13, 2024 15:41:30";

const getFreePlacesCount = roomInfoObj => {
  let freeCount = roomInfoObj['persons'].length;
  const persons = roomInfoObj['persons'];
  
  for (const obj of persons) {
    if (obj.personId || obj.fullName || obj.email) {
      freeCount -= 1;
    }
  }
  return freeCount;
}

const validateModalData = modalData => {
  let emptyPersonData = 0;

  const fullNameMinLength = 2;
  const emailMinLength = 3;
  const maxStringLength = 30;

  const gender = modalData.roomInfo.gender;
  const inputs = modalData.roomInfo.persons;
  const isGenderValid = gender === 'M' || gender === 'F';

  if (!isGenderValid) return false; // gender value is invalid, or its unselected

  for (const personData of inputs) {
    if (personData.fullName.length > 0 || personData.email.length > 0) {
      if (personData.fullName.length > 0 && personData.email.length > 0) {
        const isFullNameLengthValid = personData.fullName.length >= fullNameMinLength && personData.fullName.length <= maxStringLength;
        const isEmailLengthValid = personData.email.length >= emailMinLength && personData.email.length <= maxStringLength;

        if (isFullNameLengthValid && isEmailLengthValid) {
          const isFullNameCorrectFormat = personData.fullName.includes(' '); // Name Surname
          const isEmailCorrectFormat = personData.email.includes('@');

          if (isFullNameCorrectFormat && isEmailCorrectFormat) continue;

          return false; // fullName or email has incorrent format
        }

        return false; // fullName or email has incorrect length
      }

      return false; // fullName or email is missing per one person
    }

    if(!personData.fullName && !personData.email) {
      emptyPersonData += 1;
      if (emptyPersonData === inputs.length) {
        return false; // all modal inputs are empty
      }
      continue;
    }
  }

  return true;
}

const generateNewPersonsIds = modalData => {
  const temp = { ...modalData };
  const newPersonsArr = modalData.roomInfo.persons;
  const newPersonsArrWithIds = newPersonsArr.map(obj => {
    if (obj.fullName && obj.email) {
      const uniqueId = v4();
      return { ...obj, personId: `${uniqueId}` }
    }

    return { ...obj, personId: null };
  })

  temp.roomInfo['persons'] = newPersonsArrWithIds;
  return temp;
}

const countdownToDeadline = deadline => {
  // https://www.educative.io/answers/how-to-create-a-countdown-timer-using-javascript
  // deadline example: "Jul 25, 2023 16:37:52"
  const countDownDate = new Date(deadline).getTime();
  const now = new Date().getTime();
  const timeLeft = countDownDate - now;
  if (timeLeft < 0) return new Array(4).fill('00');

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
  // `${days}d : ${hours}h : ${minutes}m : ${seconds}s`
  return [
    days.toString().padStart(2, '0'),
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0')
  ];
}

export {
  roomsPerPage,
  paginatorLengthLimit,
  intervalUpdateTime,
  msgTimeoutTime,
  deadlineDate,
  getFreePlacesCount,
  validateModalData,
  generateNewPersonsIds,
  countdownToDeadline
}