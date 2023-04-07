import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import R from 'ramda';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons/faTriangleExclamation';

import Field from 'react-bulma-companion/lib/Field';
import Control from 'react-bulma-companion/lib/Control';
import Icon from 'react-bulma-companion/lib/Icon';
// import Input from 'react-bulma-companion/lib/Input';
import '@fontsource/ubuntu';

import { Card, Text, Input, Loading,Button } from '@nextui-org/react';

import useKeyPress from '_hooks/useKeyPress';
import { postCheckUsername } from '_api/users';
import { validateUsername, validatePassword, validateFullName } from '_utils/validation';
import { attemptRegister } from '_store/thunks/auth';

import styles from './styles.module.css';
import Container from 'react-bulma-companion/lib/Container';



export default function Register() {
  const dispatch = useDispatch();

  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [NameMessage, setNameMessage] = useState('');
  const [password, setPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [validName, setValidName] = useState(false);

  const [Clicked, setClicked] = useState(false);

  const checkPassword = (newUsername, newPassword) => {
    const { valid, message } = validatePassword(newUsername, newPassword);

    setPasswordValid(valid);
    setPasswordMessage(message);
  };

  const checkUsername = newUsername => {
    const { valid, message } = validateUsername(newUsername);

    if (valid) {
      setUsernameMessage('Checking username...');
      setUsernameAvailable(false);

      postCheckUsername(newUsername)
        .then(res => {
          setUsernameAvailable(res.available);
          setUsernameMessage(res.message);
        })
        .catch(R.identity);
    } else {
      setUsernameAvailable(valid);
      setUsernameMessage(message);
    }
  };

  const checkFullname = newName => {
    const { valid, message } = validateFullName(newName);

    setValidName(valid);
    setNameMessage(message);

  };

  const updateName = newName => {
    setName(newName);
  };

  const updateUsername = newUserName => {
    setUsername(newUserName);
    checkPassword(newUserName, password);
  };

  const handleNameChange = e => {
    updateName(e.target.value);
    checkFullname(e.target.value);
  };

  const handleUsernameChange = e => {
    updateUsername(e.target.value);
    checkUsername(e.target.value);
  };

  const handlePasswordChange = e => {
    setPassword(e.target.value);
    checkPassword(username, e.target.value);
  };

  const generateToken = async () => {
    const array = new Uint8Array(32);
    const token = await window.crypto.getRandomValues(array);
    const hexToken = Array.from(token, byte => byte.toString(16)).join('');
    return hexToken;
  }
  const register = () => {
    setClicked(true);
    generateToken().then(token => {
      if (usernameAvailable && passwordValid) {
        const first_name = name.split(' ')[0];
        const last_name = name.split(' ')[1];
        const newUser = {
          username,
          first_name,
          last_name,
          password,
          email_verification_token : token
        };
        
        dispatch(attemptRegister(newUser))
        .catch(R.identity);
      }
    });
    };

  useKeyPress('Enter', register);

  return (
  <div className={styles.root}>
    <Container className={styles.container}>

      <Card css={{ mw: '550px', py: '$17' }} className={styles.card} >
        <div>

        <Text style={{ fontSize: 35, fontFamily: 'Ubuntu', fontWeight: 500, marginTop: '15px' }}>Create an account</Text>
        <p style={{ fontSize: 17, fontFamily: 'Ubuntu', color: '#676767' }}>Enter the information you entered while registering</p>
        </div>
      
        <Field>
        <Input
            size="xl"
            css={{ width: 340, marginTop: 30}}
            rounded
            bordered
            label="Full Name"
            placeholder="Enter your name"
            color={name ? (validName ? 'success' : 'danger') : 'primary'}
            value={name}
            onChange={handleNameChange}
            helperText={validName ? 'Valid Name' : NameMessage}
            helperColor={validName ? 'success' : 'danger'}
          />
          </Field>
          <Field>
        <Control iconsRight>
          <Input
            size="xl"
            css={{ width: 340, marginTop: 8}}
            rounded
            bordered
            id="username"
            placeholder="Enter your email"
            label="Email"
            color={username ? (usernameAvailable ? 'success' : 'danger') : 'primary'}
            value={username}
            onChange={handleUsernameChange}
            helperText={username ? usernameMessage : ''}
            helperColor={usernameAvailable ? 'success' : 'danger'}
          />
          {username && (
            <Icon
              size="small"
              align="right"
              color={usernameAvailable ? 'success' : 'danger'}
            >
              <FontAwesomeIcon
                style={{ paddingTop: 90 }}
                icon={usernameAvailable ? faCheck : faTriangleExclamation}
              />
            </Icon>
          )}
        </Control>
        </Field>
        <Field>
        <Control iconsRight>
          <Input.Password
            size="xl"
            css={{ width: 340, marginTop: 10}}
            rounded
            bordered
            label="Password"
            id="password"
            type="password"
            placeholder="Enter your password"
            color={password ? (passwordValid ? 'success' : 'danger') : 'primary'}
            value={password}
            onChange={handlePasswordChange}
            helperText={password ? passwordMessage : ''}
            helperColor={passwordValid ? 'success' : 'danger'}
          />
        </Control>
      </Field>
      <hr className="separator" />
      <div className={styles.button_signup}>
        <Button auto disabled={(!passwordValid || !usernameAvailable || Clicked) ? true : false} iconRight={Clicked ? <Loading type="points-opacity" color="currentColor" size="md" /> : false} size="xl" style={{width : "350px", height : "60px", fontSize : "23px", fontFamily : "Ubuntu", fontWeight : 500}} rounded color="success" onClick={register}>
          Create Account
        </Button>
        <p style={{ paddingTop: 20, marginBottom: '15px' }}>
          You have account ?
            {' '}
            <a href="/login"> Log in </a>
            {' '}
          </p>
      </div>
      </Card>
    </Container>
  </div>
  );
}
