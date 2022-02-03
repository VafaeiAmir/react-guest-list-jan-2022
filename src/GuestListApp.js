import './App.css';
// import { css } from '@emotion/react';
import { useEffect, useState } from 'react';

/** @jsxImportSource @emotion/react */

const baseUrl = 'http://amirs-guest-list.herokuapp.com/guests/';

// item of each guest
function Guest(props) {
  const [attending, setAttending] = useState(props.attending);

  async function updateAttending(id) {
    const response = await fetch(`${baseUrl}${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attending: !attending }),
    });
    const updatedGuest = await response.json();
    console.log(updatedGuest);
    setAttending(!attending);
  }

  return (
    <li key={props.firstName} data-test-id="guest">
      <input
        aria-label="attending"
        type="checkbox"
        checked={attending}
        onChange={() => {
          updateAttending(props.id).catch((error) => {
            console.error('Error:', error);
          });
        }}
      />
      <p>
        Name: {props.firstName} {props.lastName}
        <span> </span>
      </p>
      {attending ? <p> attending</p> : <p>not attending</p>}
    </li>
  );
}
function All() {
  const [firstName, aetFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(true);
  const [guestsList, setGuestsList] = useState([]);
  const [remove, setDelete] = useState(false);

  // Add user
  async function createUser(input1, input2) {
    const response = await fetch(`${baseUrl}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: input1,
        lastName: input2,
      }),
    });
    const createdGuest = await response.json();
    console.log(createdGuest);
    aetFirstName('');
    setLastName('');
  }

  // Remove guest

  async function handleRemove(id) {
    const response = await fetch(`${baseUrl}${id}`, {
      method: 'DELETE',
    });
    const deletedGuest = await response.json();
    console.log(deletedGuest);
    setDelete(!remove);
  }

  // Remove all

  async function handleRemoveGuests() {
    await guestsList.forEach((guest) => {
      handleRemove(guest.id).catch((error) => console.error(error));
    });
  }

  // Get all guests

  useEffect(() => {
    async function getAllGuests() {
      const response = await fetch(`${baseUrl}/`);
      const allGuests = await response.json();
      console.log(allGuests);
      setGuestsList(allGuests);
      setLoading(false);
    }
    getAllGuests().catch((error) => {
      console.error('Error:', error);
    });
  }, [lastName, remove]);

  const disabled = loading ? true : false;
  return (
    <div className="App">
      <h1> Guest List </h1>
      <div>
        <div>
          <label>
            First Name
            <input
              value={firstName}
              onChange={(event) => {
                aetFirstName(event.currentTarget.value);
              }}
              disabled={disabled}
            />
          </label>
          <br />
          <label>
            Last Name
            <input
              value={lastName}
              onChange={(event) => {
                setLastName(event.currentTarget.value);
              }}
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  createUser(firstName, lastName).catch((error) => {
                    console.error('Error:', error);
                  });
                }
              }}
              disabled={disabled}
            />
          </label>
          <br />
          <button
            onClick={() => {
              createUser(firstName, lastName).catch((error) => {
                console.error('Error:', error);
              });
            }}
          >
            Add guest
          </button>
          <button
            onClick={() => {
              handleRemoveGuests().catch((error) => {
                console.error('Error:', error);
              });
            }}
          >
            Remove guests
          </button>
        </div>
        <div>
          {loading === true ? (
            <p>Loading...</p>
          ) : (
            <div>
              <ul>
                {guestsList.length === 0 && <p>Please add a guest!</p>}
                {guestsList.map((e) => {
                  return (
                    <div key={e.id + e.firstName}>
                      <Guest
                        key={e.id + e.firstName + e.lastName}
                        firstName={e.firstName}
                        lastName={e.lastName}
                        attending={e.attending}
                        id={e.id}
                      />
                      <button
                        onClick={() => {
                          handleRemove(e.id).catch((error) => {
                            console.error('Error:', error);
                          });
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default All;
