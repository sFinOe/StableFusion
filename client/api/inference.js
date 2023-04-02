import request from 'superagent';
import { handleSuccess, handleError } from '_utils/api';


export const PostInference = (data) =>
  request.post('/api/v1/PostInference')
	.send(data)
	.then((res) => {
		return res;
	})
	.catch(handleError);