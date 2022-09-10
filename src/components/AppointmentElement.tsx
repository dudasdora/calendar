import React, { useState ,useEffect,useRef} from "react";
import { Appointment } from './Appointment'
import AppointmentPopup from './AppointmentPopup'

/* This function is responsible for the placement of an appointments by it's start and end hours. */
export function AppointmentElement(props: { value: Appointment, currentDay: Date }) {
  /* Appointment */
  const [appointment, setAppointment] = useState(props.value);
  /* Current date of datepicker */
  const [currentDay, setCurrentDay] = useState(props.currentDay);
  /* Top of the button */
  const [top, setTop] = useState(0);
  /* Height of the button */
  const [height, setHeight] = useState(0);

  /* Check if the two date parameters are the same day. */
  function areTheSameDay(date1: Date, date2: Date) {
    
    if (date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()) {
      return true;
    }
    return false;
  }
  /* Calculate the top value of an appointment button. It checks if it has started the current day. */
  function calculateTop() {
    if (!areTheSameDay(currentDay, appointment.start)) {
      return 0;
    }
    return appointment.start.getHours() * 100 + appointment.start.getMinutes() / 60 * 100;
  }
  /* Calculate the height value of an appointment button. It checks if it ends the current day. */
  function calculateHeight() {
    if (appointment.end.getHours() < appointment.start.getHours() && areTheSameDay(currentDay, appointment.start)) {
      return 2500 - calculateTop();
    }
    return appointment.end.getHours() * 100 + appointment.end.getMinutes() / 60 * 100 - calculateTop();
  }
  /* After the page loaded, set the top and height values of the appointments. */
  useEffect(() => {
    setTop(calculateTop());
    setHeight(calculateHeight());
  }, [appointment,currentDay]);

  return (
    <div>
        <AppointmentPopup top={top} height={height} appointment={appointment} />
    </div>
  );

}
export default AppointmentElement