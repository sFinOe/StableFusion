import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import R from 'ramda';

import '@fontsource/ubuntu';

// import Button from 'react-bulma-companion/lib/Button';
import Container from 'react-bulma-companion/lib/Container';

import { Card, Text, Input, Checkbox, Button } from '@nextui-org/react';

import useKeyPress from '_hooks/useKeyPress';
import { attemptLogin } from '_store/thunks/auth';

import styles from './styles.module.css';

export default function Login() {
  const dispatch = useDispatch();

  const [remember, setRemember] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error_login , setError_login] = useState(false);
  

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (username) {
      setRemember(true);
      setUsername(username);
    }
  }, []);


  function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  const login = () => {

    const userCredentials = { username, password };

    if (remember) {
      localStorage.setItem('username', username);
    }
    dispatch(attemptLogin(userCredentials)).catch(R.identity);
    setError_login(true);

  };

  useKeyPress('Enter', login);

  const rememberMe = () => {
    localStorage.removeItem('username');
    setRemember(!remember);
  };

  const updateUsername = (e) => setUsername(e.target.value);
  const updatePassword = (e) => setPassword(e.target.value);

  const [opacity, setOpacity] = useState(1);
  const handleClick = () => {
    setOpacity(0.1);
  };


  return (
    <div className={styles.root}>
      <Container className={styles.container}>
        <Card css={{ mw: '550px', py: '$17' }} className={styles.card}>
          <Text style={{ fontSize: 35, fontFamily: 'Ubuntu', fontWeight: 500, marginLeft: -110, marginTop: '15px' }}>Welcome back</Text>
          <p style={{ fontSize: 17, fontFamily: 'Ubuntu', color: '#676767', marginLeft: -40 }}>Wolcome back! Please enter your details.</p>
          <Input
            size="xl"
            css={{ width: 340, paddingTop: 30}}
            rounded
            bordered
            label="Email"
            placeholder="Enter your email"
            color={error_login ? 'error' : 'primary'}
            value={username}
            onChange={updateUsername}
            helperText={error_login ? 'Invalid email or password' : ''}
            helperColor={error_login ? 'error' : 'primary'}
          />
          <Input.Password
            size="xl"
            css={{ width: 340, paddingTop: 20 }}
            rounded
            bordered
            type="password"
            label="Password"
            placeholder="Enter your password"
            color={error_login ? 'error' : 'primary'}
            value={password}
            onChange={updatePassword}
          />
          <div className={styles.remember}>
            <Checkbox  onChange={rememberMe} checked={remember} size="xs">Remember for 30 days</Checkbox>
            <a style={{ fontFamily: 'Ubuntu', fontSize: 14, marginLeft: 65 }} href="/recovery">
              Forget password
            </a>
          </div>
        <Button size="xl" style={{width : "350px", height : "60px", fontSize : "23px", fontFamily : "Ubuntu", fontWeight : 500, marginTop : "23px", backgroundColor : "#4361ED", color : "#fff"}} rounded onClick={login}>
        Sign in
        </Button>
          <p style={{ paddingTop: 20, marginBottom: '15px' }}>
            No account?
            {' '}
            <a href="/register"> Create one </a>
            {' '}
          </p>
        </Card>
      </Container>
    </div>
  );
}
