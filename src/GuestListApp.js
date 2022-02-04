import './App.css';
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';

/** @jsxImportSource @emotion/react */

const firstListStyle = css`
  display: flex;
  justify-content: center;
`;
const checkBoxStyle = css`
  margin-top: auto;
  margin-bottom: auto;
`;
const firstBodyTextStale = css`
  display: flex;
  justify-content: center;
  background-color: lightsteelblue;
  padding: 1rem;
  font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
  font-size: 2rem;
  color: black;
`;
const guestListStyle = css`
  display: flex;
  justify-content: center;
  padding: 20px 20px;
  background-color: lightsteelblue;
  // position: fixed;
  // left: 100px;
`;
const removeBoxStyle = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: red;
  border: none;
  color: white;
  height: 15px;
  font-size: 0.5rem;
  margin-left: 5px;
  margin-top: auto;
  :hover {
    font-size: 0.7rem;
    transition: font-size 0.2s ease;
  }
`;
const removeAllButtonStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: lightgrey;
  transition: background-color 0.2s ease;
  color: black;
  text-align: center;
  font-family: serif;
  vertical-align: middle;
  height: 30px;
  width: 130px;
  font-size: 1rem;
  letter-spacing: 0.03rem;
  line-height: 1.269rem;
  margin-right: auto;
  margin-left: auto;
  margin-top: auto;
  margin-bottom: auto;
  :hover {
    background-color: lightsalmon;
    font-size: 1.1rem;
    transition: font-size 0.2s ease;
  }
`;
const addButtonStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: lightgrey;
  transition: background-color 0.2s ease;
  color: black;
  font-family: serif;
  text-align: center;
  vertical-align: middle;
  width: 130px;
  height: 30px;
  font-size: 1rem;
  letter-spacing: 0.018rem;
  line-height: 1.269rem;
  margin-right: auto;
  margin-left: auto;
  margin-top: auto;
  margin-bottom: auto;
  :hover {
    background-color: lightseagreen;
    font-size: 1.1rem;
    transition: font-size 0.2s ease;
  }
`;
const nameFieldStyle = css`
  display: flexbox;
  justify-content: center;
  // border-style: none;
  height: 30px;
  margin: 10px;
  margin-right: 5rem;
`;
const inputStyle = css`
  display: grid;
  justify-content: center;
  // margin: 0 30rem;
  // justify-content: center;
  // position: absolute;
  // left: 500px;
`;
const guestInListStyle = css`
  display: flex;
  justify-content: center;
  // min-width: 400px;
`;
const textAttStyle = css`
  padding-left: 0.6rem;
  color: gray;
`;
const pleaseTextStyle = css`
  margin-right: 2rem;
`;
const baseUrl = 'https://amirs-guest-list.herokuapp.com';

// item of each user
function Guest(props) {
  const [attending, setAttending] = useState(props.attending);

  async function updateAttending(id) {
    const response = await fetch(`${baseUrl}/guests/${id}`, {
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
    <li css={firstListStyle} key={props.firstName} data-test-id="guest">
      <input
        css={checkBoxStyle}
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
      {attending ? (
        <p css={textAttStyle}> attending</p>
      ) : (
        <p css={textAttStyle}>not attending</p>
      )}
    </li>
  );
}
function All() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(true);
  const [guestsList, setGuestsList] = useState([]);
  const [remove, setDelete] = useState(false);

  async function createUser(input1, input2) {
    const response = await fetch(`${baseUrl}/guests/`, {
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
    setFirstName('');
    setLastName('');
  }

  async function handleRemove(id) {
    const response = await fetch(`${baseUrl}/guests/${id}`, {
      method: 'DELETE',
    });
    const deletedGuest = await response.json();
    console.log(deletedGuest);
    setDelete(!remove);
  }

  // Remove all

  function handleRemoveGuests() {
    guestsList.forEach((guest) => {
      handleRemove(guest.id).catch((error) => console.error(error));
    });
  }

  // Get all guests

  useEffect(() => {
    async function getAllGuests() {
      const response = await fetch(`${baseUrl}/guests/`);
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
      <h1 css={firstBodyTextStale}> Bienvenido al restaurante </h1>
      <h1 css={firstBodyTextStale}>Lista de reservas</h1>
      <div>
        <div css={inputStyle}>
          <label>
            First name
            <input
              css={nameFieldStyle}
              value={firstName}
              onChange={(event) => {
                setFirstName(event.currentTarget.value);
              }}
              disabled={disabled}
            />
          </label>
          <br />
          <label>
            Last name
            <input
              css={nameFieldStyle}
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
            css={addButtonStyle}
            onClick={() => {
              createUser(firstName, lastName).catch((error) => {
                console.error('Error:', error);
              });
            }}
          >
            Add guest
          </button>
          <button
            css={removeAllButtonStyle}
            onClick={() => {
              handleRemoveGuests().catch((error) => {
                console.error('Error:', error);
              });
            }}
          >
            Remove all
          </button>
        </div>
        <div css={guestListStyle}>
          {loading === true ? (
            <p>Loading...</p>
          ) : (
            <div>
              <ul css={pleaseTextStyle}>
                {guestsList.length === 0 && <p>Please add a guest! </p>}
                {guestsList.map((e) => {
                  return (
                    <div key={e.id + e.firstName} css={guestInListStyle}>
                      <Guest
                        key={e.id + e.firstName + e.lastName}
                        firstName={e.firstName}
                        lastName={e.lastName}
                        attending={e.attending}
                        id={e.id}
                      />
                      <button
                        aria-label="Remove"
                        css={removeBoxStyle}
                        onClick={() => {
                          handleRemove(e.id).catch((error) => {
                            console.error('Error:', error);
                          });
                        }}
                      >
                        Remove
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
