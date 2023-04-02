import request from 'superagent';
import { handleSuccess, handleError } from '_utils/api';


export const PostTest = (data) =>
  request.post('/api/v1/PostTest')
	.send(data)
	.then((res) => {
		return res;
	})
	.catch(handleError);