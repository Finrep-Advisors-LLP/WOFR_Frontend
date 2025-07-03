import axios from "axios";

export default axios.create({
    // baseURL:"http://13.203.16.246:8000/",
    baseURL:"http://192.168.29.82:8000/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "ngrok-skip-browser-warning": true,
  },
});
