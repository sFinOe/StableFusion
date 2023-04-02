import React from 'react';

import Footer from 'react-bulma-companion/lib/Footer';
import Container from 'react-bulma-companion/lib/Container';
import Content from 'react-bulma-companion/lib/Content';

import { Text } from '@nextui-org/react';

import styles from './styles.module.css';

export default function FooterComponent() {
  const year = new Date().getFullYear();

  return (
    <Footer className={styles.root}>
      <div className={styles.container}>
        <Container>
          <div className={styles.footer}>
            <div>
              <img src="/images/logo.png" width={100} height={60} />
              <Text style={{ fontSize: 14, paddingTop: '10px' }}>© 2023 Your LOGO . All rights reserved.</Text>
              <Text style={{ fontSize: 14 }}>
                Built by
                {' '}
                <a href="https://www.linkedin.com/in/sfinoe" target="_blank" rel="noreferrer">
                  {' '}
                  zakaria kasmi
                </a>
                , on the technology of Stable Diffusion and Dreambooth
              </Text>
            </div>
            <div>
              <Text h3>Privacy Policy</Text>
            </div>
          </div>
        </Container>
      </div>
    </Footer>
  );
}
