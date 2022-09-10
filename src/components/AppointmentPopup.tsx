import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CSS from 'csstype';

export enum Colors {
  support1 = '#264653',
  support2 = '#2a9d8f',
  support3 = '#8ab17d',
  support4 = '#f4a261',
  support5 = '#e88c7d',
  support6 = '#e76f51'
};
/* This function is responsible for show an appointment button, and it's popup. */
function AppointmentPopup(props: { top: number; height: number; appointment: any }) {
  /* The visibility of popup */
  const [show, setShow] = useState(false);
  /* OpenWeatherMap API key */
  const [apiKey, setApiKey] = useState(localStorage.getItem("api_key"));
  /* Condition about the possibility of weather forecast */
  const [canMakeForecast, setCanMakeForecast] = useState(false);

  /* Weather data */
  const [celsius, setCelsius] = useState(0);
  const [iconId, setIconId] = useState("01d");
  const [location, setLocation] = useState("");

  /* Users current location */
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);

  /* Button text options */
  const fontSize: number = 16;
  const buttonPadding: number = 6;
  const titleMaxHeight = props.height - (buttonPadding * 2);
  
  /* Get the response of the forecast quest, and set the necessary values.if there are some forecast what are maximum two hours away from the apoointments start, it set the canMakeForeCast value to true.*/
  function MakeForecast() {
    const url = createWeatherForecastUrl();
    axios.get(url).then((response) => {
      response.data.list.map((element: any) => {
        if (Math.abs(((props.appointment.start.getTime()) - new Date(element.dt_txt).getTime()) / (1000 * 3600)) < 2) {
          setCanMakeForecast(true);
          setWeatherData(element);
        }
      }
      );
    })
  }
  /* Generate the url query parameters. */
  function makeQueryParams(data: any): string {
    const querystring = require('querystring');
    const params = querystring.stringify(data);
    return params;
  }

  /* Generate the weather forecast url. If there is no location of the appointment, it use the users current location */
  function createWeatherForecastUrl(): string {
    const url = props.appointment.location ?
      `https://api.openweathermap.org/data/2.5/forecast?${makeQueryParams({ units: 'metric', q: props.appointment.location, appid: apiKey })}` :
      `https://api.openweathermap.org/data/2.5/forecast?${makeQueryParams({ units: 'metric', lat: lat, lon: long, appid: apiKey })}`;

    return url;
  }
  /* Generate the current weather url. If there is no location of the appointment, it use the users current location */
  function createCurrentWeatherUrl(): string {

    const url = props.appointment.location ?
      `https://api.openweathermap.org/data/2.5/weather?${makeQueryParams({ units: 'metric', q: props.appointment.location, appid: apiKey })}` :
      `https://api.openweathermap.org/data/2.5/weather?${makeQueryParams({ units: 'metric', lat: lat, lon: long, appid: apiKey })}`;

    return url;
  }
  function setWeatherData(weather: any) {
    setCelsius(weather.main.temp);
    setIconId(weather.weather[0].icon);
    setLocation(weather.name);
  }
  /* Get the current weather data, and set the necessary values. */
  function getCurrentWeather() {
    const url = createCurrentWeatherUrl();
    axios.get(url).then((response2) => {
      setWeatherData(response2.data);
    })
  };
  /* Get the users current location. */
  const geolocation = async () => {
    return await navigator.geolocation.getCurrentPosition(function (position) {
      setLat(position.coords.latitude);
      setLong(position.coords.longitude);
    })
  }
  /* Function of click the appointment button, try to make a forecast, and if it isn't possible, got the current weather data. */
  const openPopup = () => {
    setShow(true);
    MakeForecast();
    if (!canMakeForecast) {
      getCurrentWeather();
    }
  }
  /* Make the geolocation after the page is loaded. */
  useEffect(() => {
    if (!lat && !long)
      geolocation();
  },
    [],
  )

  return (
    <>
      <Button onFocus={(e: any) => (e.target.blur())} 
        className="appointment_button" 
        style={{
        transition: "all 500ms",
        border: "1px solid white",
        backgroundColor: Colors[props.appointment.color as keyof typeof Colors],
        position: "absolute",
        top: props.top,
        width: '100%',
        height: props.height
      }} 
        variant="primary" onClick={() => openPopup()}>
        {(
          (fontSize <= titleMaxHeight) ?
            (<span style={{ fontSize:fontSize,fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>{props.appointment.title}</span>) :
            (null)
        )}

      </Button>
      <Modal
        show={show}
        onHide={() => { setShow(false); }}
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h3>{props.appointment.title}</h3>
          <h4>{props.appointment.start.toLocaleDateString()} {props.appointment.start.toLocaleTimeString()} -<br />{props.appointment.end.toLocaleDateString()} {props.appointment.end.toLocaleTimeString()}</h4>
          <h4>{props.appointment.location}</h4>
          <hr style={{ color: "gray", height: 5 }} />
          <Row>
            <Col sm={8} style={{ color: "grey" }}>
              {canMakeForecast ? (<h4>Weather forecast</h4>) : (<h4>Current weather</h4>)}
              <h4>{location}</h4>
              <h4>{celsius} C°</h4>
            </Col>
            <Col sm={4}>
              <img style={{ width: 100 }} src={`http://openweathermap.org/img/wn/${iconId}@2x.png`} alt="weather" />
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AppointmentPopup