import request from 'superagent';
import { handleSuccess, handleError } from '_utils/api';


export const GetGallery = (data) =>
  request.post('/api/v1/GetGallery')
	.send(data)
	.then((res) => {
		return res;
	})
	.catch(handleError);

export const PostDeleteImage = (data) =>
  request.post('/api/v1/PostDeleteImage')
	.send(data)
	.then((res) => {
		return res;
	})
	.catch(handleError);


export const GetLowerImage = (data) =>
  request.post('/api/v1/GetLowerImage')
	.send(data)
	.then((res) => {
		return res;
	})
	.catch(handleError);

export const PostMakeMore = (data) =>
  request.post('/api/v1/PostMakeMore')
	.send(data)
	.then((res) => {
		return res;
	})
	.catch(handleError);