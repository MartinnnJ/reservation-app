import axios from "axios";

export const fetchRoom = async roomId => {
  const response = await axios.get(`http://localhost:3000/rooms/${roomId}`).then(data => {
    return data.data;
  })

  return response;
}

export const fetchAllRooms = async () => {
  const response = await axios.get(`http://localhost:3000/rooms`).then(data => {
    return data.data;
  })

  return response;
}

export const createReservation = async (roomId, newData) => {
  const response = await axios.patch(`http://localhost:3000/rooms/${roomId}`, newData).then(data => {
    return data;
  })

  return response;
}