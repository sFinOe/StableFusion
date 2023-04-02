import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'redux-first-history';
import R from 'ramda';

import Section from 'react-bulma-companion/lib/Section';
import Title from 'react-bulma-companion/lib/Title';
import Columns from 'react-bulma-companion/lib/Columns';
import Column from 'react-bulma-companion/lib/Column';
import { attemptGetTodos } from '_store/thunks/todos';


import Selfies from '_components/organisms/Selfies';

export default function SelfiesPage() {
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
		<div className="selfies-page page">
			<Section className="selfies-section">
				<Selfies />
			</Section>
		</div>
	);
}
