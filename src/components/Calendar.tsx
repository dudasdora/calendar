import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import data from './../data/jr_resource.json';
import { Appointment } from './Appointment'
import { AppointmentElement } from './AppointmentElement'
import Stack from 'react-bootstrap/Stack';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import { IconButton } from '@mui/material';

/* This function is responsible for show the calendar, it loads the current days appointment elements. */
export function Calendar(apiKey: any) {
  /* The datepicker current date */
  const [currentDate, setCurrentDate] = useState(new Date());
  /* All appointments */
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  /* Current dates appointments */
  const [currentDateAppointments, setCurrentDateAppointments] = useState<Appointment[]>([]);
  
  const isFirstRender = useRef(true);

  /* Change the current date withs days by the difference value. */
  function addDaysToDate(difference: number) {
    let newDay = (currentDate.getDate() + difference);
    let month = (currentDate.getMonth());
    let year = (currentDate.getFullYear());
    setCurrentDate(new Date(year, month, newDay));;
  }

  /* Load the appointments from json file, and sort them by start dates. */
  function addAppointments() {
    const copiedArray: any[] = Array.from(appointments);
    data.events.forEach((appointment) => {
      const parsedAppointment: Appointment = {
        id: appointment.id,
        start: new Date(appointment.start),
        end: new Date(appointment.end),
        title: appointment.title,
        color: appointment.color,
        location: appointment.location,
        registered: appointment.registered
      };
      copiedArray.push(parsedAppointment);

    });
    setAppointments(copiedArray.slice().sort((a, b) => b.start - a.start).reverse());
  }

  /* Set the first date of callendar by checking the sorted appointment lists first elment. */
  function setFirstDate() {
    if (appointments.length > 0) {
      let day = (appointments[0].start.getDate());
      let month = (appointments[0].start.getMonth());
      let year = (appointments[0].start.getFullYear());
      setCurrentDate(new Date(year, month, day));
    }
  }

  /* Filter the appointments by the current date of date picker, store them in another list. */
  function filterAppointmentsByDate() {
    const filterAppointments = appointments.filter(appointment => areTheSameDay(appointment.start, currentDate) ||
      areTheSameDay(appointment.end, currentDate));    
      
    return setCurrentDateAppointments(filterAppointments);

  }
  /* Check if the two date parameters are the same day. */
  function areTheSameDay(date1: Date, date2: Date) {
    if (date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()) {
      return true;
    }
    return false;
  }

  /* After the page is loaded read the appointments. */
  useEffect(() => {
    console.log(apiKey);
    addAppointments();
  },
    [],
  );

  /* After the appointments changed, set the first date of the calendar. */
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setFirstDate();
  }, [appointments]);

  /* After the current date changed filter the appointments. */
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    filterAppointmentsByDate();
    console.log(currentDate)
  }, [currentDate,apiKey]);

  return (
    <Stack className="calendar_div mx-auto" >
      <Stack className=" mx-auto" direction="horizontal" gap={3}>
        <IconButton onClick={() => addDaysToDate(-1)}><ArrowBackIosRoundedIcon /></IconButton>
        <DatePicker selected={currentDate} onChange={(date: Date) => setCurrentDate(date)} />
        <IconButton onClick={() => addDaysToDate(1)}><ArrowForwardIosRoundedIcon /></IconButton>
      </Stack>
      <div className="appointmentList">

        {[...Array(23)].map((x, i) =>
          <div className="hourMarker" style={{ top: i * 100 + 100, color: "gray", }} >{i + 1}</div>
        )}
        {currentDateAppointments.map((d,i) =><div> <AppointmentElement key={d.id} value={d} currentDay={currentDate} /></div>
        )}
      </div>
    </Stack>
  )

}
