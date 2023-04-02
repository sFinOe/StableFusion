import request from 'superagent';
import { handleSuccess, handleError } from '_utils/api';


export const postUpload = images =>
  request.post('/api/v1/upload')
    .send(images)
    .then((res) => {
      return res;
    })
    .catch(handleError);