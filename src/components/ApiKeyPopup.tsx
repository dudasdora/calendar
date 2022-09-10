import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import Form from 'react-bootstrap/Form';

/* This function is responsible for setting the API key by the user. */
function ApiKeyPopup({ apiKeyfromPopup }: any) {
  const [apiValue, setApiValue] = useState("");
  const [label, setLabel] = useState("Openweather Map API key");

  /* Function of click the save button, it checks if the API key is valid. If its valid cache it, and call the Parent setter function. */
  function handleSave() {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid=${apiValue}`;
    axios.get(url)
      .then(response => {
        localStorage.setItem("api_key", apiValue);
        apiKeyfromPopup(apiValue);
      })
      .catch(error => {
        setLabel("Your API key is invalid, please enter a valid key!");
      });
  };

  return (

      <Modal show={true} onHide={handleSave} backdrop="static" shouldCloseOnEsc={
        false}>
        <Modal.Header >
          <Modal.Title>{label}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Enter your API key here:</Form.Label>
              <Form.Control
                type="text"
                placeholder="775c2dfba155e62a08f835c21170d1b8"
                value={apiValue}
                onChange={e => setApiValue(e.target.value)}
                autoFocus
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
  );
}

export default ApiKeyPopup