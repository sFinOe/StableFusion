import React from 'react';

import Footer from 'react-bulma-companion/lib/Footer';
import Container from 'react-bulma-companion/lib/Container';

import { Text } from '@nextui-org/react';
import { useQuery } from 'react-query';
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




export function CachedImage({ src, style, className }) {
  const { data } = useQuery(['image', src], async () => {
    const response = await fetch(src);
    return response.blob();
  }, {
    staleTime: 60 * 60 * 1000, // cache for one hour
    cacheTime: 60 * 60 * 1000, // clear cache after one hour
  });

  const url = data ? URL.createObjectURL(data) : src;

  return <img src={url} alt="cached image" style={style} className={className} />;
}
