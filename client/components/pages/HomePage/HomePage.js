import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'redux-first-history';
import R from 'ramda';

import Section from 'react-bulma-companion/lib/Section';
import Container from 'react-bulma-companion/lib/Container';

import FileUpload from './Upload/FileUpload';

import styles from './styles.module.css';

export default function HomePage() {
  const dispatch = useDispatch();
  const { user } = useSelector(R.pick(['user']));

  useEffect(() => {
    if (R.isEmpty(user)) {
      dispatch(push('/login'));
    }
  }, [dispatch, user]);

  return (
    <div className={styles.root}>
      <Section>
        <Container>
          <div className={styles.container} >
            <FileUpload/>
          </div>
        </Container>
      </Section>
    </div>
  );
}
