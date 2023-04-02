import request from 'superagent';
import { handleSuccess, handleError } from '_utils/api';


export const CheckStudio = () =>
  request.get('/api/v1/CheckStudio')
	.then((res) => {
		return res;
	})
	.catch(handleError);

export const PostStudio = (data) =>
  request.post('/api/v1/PostStudio')
	.send(data)
	.then(handleSuccess)
	.catch(handleError);

export const GetStudioImages = (data) =>
  request.post('/api/v1/GetStudioImages')
	.send(data)
	.then((res) => {
		return res;
	})
	.catch(handleError);


export const PostDeleteStudio = (data) =>
  request.post('/api/v1/PostDeleteStudio')
	.send(data)
	.then((res) => {
		return res;
		})
	.catch(handleError);


export const PostTraining = (data) =>
  request.post('/api/v1/PostTraining')
	.send(data)
	.then((res) => {
		return res;
		})
	.catch(handleError);

export const PostPrompts = (data) =>
  request.post('/api/v1/PostPrompts')
	.send(data)
	.then((res) => {
		return res;
		})
	.catch(handleError);


export const PostPreImages = (data) =>
  request.post('/api/v1/PreImages')
	.send(data)
	.then((res) => {
		return res;
		})
	.catch(handleError);

export const GetSingleStudio = (data) =>
  request.post('/api/v1/GetSingleStudio')
	.send(data)
	.then((res) => {
		return res;
		})
	.catch(handleError);