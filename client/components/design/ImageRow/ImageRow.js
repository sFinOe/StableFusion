import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';
import {CachedImage} from '_components/organisms/Footer/Footer';

function Image({ source }) {
  return <CachedImage src={source} alt="" className={styles.image} style={{ width: '200px', height: '200px' }} />;
}

function ImageRow({ sources }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'nowrap', position: 'relative', width: '100%', height: '100px' }}>
      {sources.map((source) => (
        <Image source={source} key={source} />
      ))}
    </div>
  );
}
export default ImageRow;
