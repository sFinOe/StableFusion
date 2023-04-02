import request from 'superagent';
import { handleSuccess, handleError } from '_utils/api';

export const GetSelfies = (data) =>
  request.post('/api/v1/GetSelfies')
	.send(data)
	.then((res) => {
		return res;
	})
	.catch(handleError);