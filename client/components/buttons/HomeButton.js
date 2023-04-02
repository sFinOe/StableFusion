import React, { useEffect, useState } from 'react';

import '@fontsource/ubuntu';
import styles from './styles.module.css';

 

export default function HomeButton() {
  const [opacity, setOpacity] = useState(1);
  const handleClick = () => {
    setOpacity(0.1);
  };

  return (
    <a href="/login" className={styles.HomeButton_button}>
      <img src="/images/add_icon.png" style={{ paddingRight: '6px', opacity }} width={30} height={30} />
      <p style={{ fontSize: '23px', fontFamily: 'Ubuntu', color: '#fff', opacity, fontWeight : 500 }}>Create Your Avatar</p>
    </a>
  );
}
