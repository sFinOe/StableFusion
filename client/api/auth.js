import request from 'superagent';
import { handleSuccess, handleError } from '_utils/api';
import { Store as RNC } from 'react-notifications-component';

export const postRegister = user =>
  request.post('/api/auth/register')
    .send(user)
    .then(handleSuccess)
    .catch(handleError);

export const postLogin = user =>
  request.post('/api/auth/login')
    .send(user)
    .then(handleSuccess)
    .catch((err) => {
      console.log(err.response.text);
      if (err.response.text === "Not verified"){
        RNC.addNotification({
          title: 'Email Not Verifed',
          message: "Please check your email to verify your account.",
          type: 'info',
          container: 'top-right',
          animationIn: ['animated', 'fadeInRight'],
          animationOut: ['animated', 'fadeOutRight'],
          dismiss: {
            duration: 5000,
          },
        });
      }
    });

export const postLogout = () =>
  request.post('/api/auth/logout')
    .then(handleSuccess)
    .catch(handleError);
