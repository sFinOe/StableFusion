import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'redux-first-history';
import R from 'ramda';

import Section from 'react-bulma-companion/lib/Section';
import { attemptGetTodos } from '_store/thunks/todos';


import Gallery from '_components/organisms/Gallery';


export default function GalleryPage() {
	const dispatch = useDispatch();
	const { user } = useSelector(R.pick(['user']));
  
	const [loading, setLoading] = useState(true);
  
	useEffect(() => {
	  if (R.isEmpty(user)) {
		dispatch(push('/login'));
	  } else {
		dispatch(attemptGetTodos())
		  .catch(R.identity)
		  .then(() => setLoading(false));
	  }
	}, [dispatch, user]);

	return !loading && (
		<div className="gallery-page page">
			<Section className="gallery-section">
				<Gallery />
			</Section>
		</div>
	);
}