import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'redux-first-history';
import R from 'ramda';
import { Text, Button, Input, Loading, Avatar, Grid, Card, Modal, Image, Popover, Divider } from '@nextui-org/react';

import HomeButton from '_components/buttons/HomeButton';
import ImageRow from '_components/design/ImageRow';

import Section from 'react-bulma-companion/lib/Section';
import Container from 'react-bulma-companion/lib/Container';
import Title from 'react-bulma-companion/lib/Title';
import preview from '../../../assets/images/preview.svg';
import publish from '../../../assets/images/publish.svg';
import square from '../../../assets/images/square.svg';

import styles from './styles.module.css';

import '@fontsource/ubuntu/500.css';

export default function WelcomePage() {
  const [opacity, setOpacity] = useState(1);
  const handleClick = () => {
    setOpacity(0.4);
  };

  const dispatch = useDispatch();
  const { user } = useSelector(R.pick(['user']));

  useEffect(() => {
    if (!R.isEmpty(user)) {
      dispatch(push('/home'));
    }
  }, [dispatch, user]);

  return (
    <div className={styles.root}>
      <Container className={styles.ai_header}>
        <Grid.Container className={styles.ai_header_content}>
          <Grid>
            <h1 style={{ fontSize: "80px", color: '#000', fontFamily: 'Ubuntu', fontWeight: 500, lineHeight: '90px', width : "90%" }}>Create Your Avatar with AI</h1>
            <p style={{ fontSize: "28px", color: '#000', fontFamily: 'Ubuntu', paddingRight: 140, paddingTop: 10 }}>
              Generate avatars that perfectly capture your unique style
            </p>
          </Grid>
          <Grid className={styles.ai_header_button_dev}>
            <HomeButton />
          </Grid>
        </Grid.Container>
        <Grid>
          <img src="/images/landing_page.png" alt="landing page" style={{width : "600px", height : "600px", objectFit : "cover", marginTop : "30px" }} />
        </Grid>
      </Container>
      <div className={styles.ai_middle_body}>
        <ImageRow
          className={styles.imageRow}
          sources={[
            '/images/image_2.png',
            '/images/image_3.png',
            '/images/image_4.png',
            '/images/image_5.png',
            '/images/image_6.png',
            '/images/image_7.png',
            '/images/image_8.png',
            '/images/image_9.png',
            '/images/image_10.png',
            '/images/image_11.png',
            '/images/image_1.png',
          ]}
        />
      </div>
      <Grid.Container className={styles.container}>
        <Container>
          <Grid className={styles.landing_details}>
            <Grid className={styles.lading_guide}>
              <img src={publish} style={{ paddingBottom: '10px' }} />
              <h3 style={{ fontFamily: 'Ubuntu' }}>1. Upload</h3>
              <p style={{ fontSize: '20px', width: '200px' }}>
                Upload
                {' '}
                <strong> some selfies </strong>
                {' '}
                of you (or other person) with different angles
              </p>
            </Grid>
            <Grid className={styles.lading_guide}>
              <img src={square} style={{ paddingBottom: '10px' }} />
              <h3 style={{ fontFamily: 'Ubuntu' }}>2. Wait</h3>
              <p style={{ fontSize: '20px', width: '200px' }}>
                Take a coffee while we build
                {' '}
                <strong> your studio </strong>
                {' '}
                based on your photos
              </p>
            </Grid>
            <Grid className={styles.lading_guide}>
              <img src={preview} style={{ paddingBottom: '10px' }} />
              <h3 style={{ fontFamily: 'Ubuntu' }}>3. Prompt</h3>
              <p style={{ fontSize: '20px', width: '200px' }}>
                Use your imagination to craft the
                {' '}
                <strong> perfect prompt! </strong>
                {' '}
              </p>
            </Grid>
          </Grid>
        </Container>
      </Grid.Container>
      <Container>
        <div className={styles.fqa_container}>
          <h2 style={{ fontSize: 35, color: '#000', fontFamily: 'Ubuntu', fontWeight: 500, lineHeight: '90px' }}>Frequently Asked Questions</h2>
          <p style={{ fontSize: 20, color: '#000', fontFamily: 'Ubuntu', fontWeight: 500 }}>
            The most common questions about Stable diffusion and other APIs
          </p>
          <div className={styles.fqa_content}>
            <div className={styles.fqa_content_item}>
              <Card css={{ p: '$6', mw: '400px', paddingLeft: '$10', paddingRight: '$10', paddingTop: '$13', paddingBottom: '$15' }}>
                <Card.Header css={{ alignItems: 'center', textAlign: 'center', justifyContent: 'center' }}>
                  <Text h4 style={{ fontSize: 25 }}>
                    How long does it take?
                  </Text>
                </Card.Header>
                <Text>
                  It depends on the number of photos you upload. The more photos you upload, the longer it takes. It usually takes
                  {' '}
                  <strong> 10-12 minutes</strong>
                  {' '}
                  to generate a studio.
                </Text>
              </Card>
            </div>
            <div className={styles.fqa_content_item}>
              <Card css={{ p: '$6', mw: '400px', paddingLeft: '$10', paddingRight: '$10', paddingTop: '$13', paddingBottom: '$15' }}>
                <Card.Header css={{ alignItems: 'center', textAlign: 'center', justifyContent: 'center' }}>
                  <Text h4 style={{ fontSize: 25 }}>
                    How is this created?
                  </Text>
                </Card.Header>
                <Text>
                  We use a DreamBooth AI to train a neural network on your photos and we use the
                  {' '}
                  <strong>trained model to generate amazing images </strong>
                  {' '}
                  using stable diffusion algorithm.
                </Text>
              </Card>
            </div>
            <div className={styles.fqa_content_item}>
              <Card css={{ p: '$6', mw: '400px', paddingLeft: '$10', paddingRight: '$10', paddingTop: '$13', paddingBottom: '$15' }}>
                <Card.Header css={{ alignItems: 'center', textAlign: 'center', justifyContent: 'center' }}>
                  <Text h4 style={{ fontSize: 25 }}>
                    Can I use Commercially?
                  </Text>
                </Card.Header>
                <Text>
                  <strong> Yes, you can </strong>
                  {' '}
                  use it commercially. You can use it for your business, your website, your social media, your blog or
                  sell as you like.
                </Text>
              </Card>
            </div>
          </div>
        </div>
        <div className={styles.fqa_container}>
          <div className={styles.fqa_content_2}>
            <div className={styles.fqa_content_item}>
              <Card css={{ p: '$6', mw: '400px', paddingLeft: '$10', paddingRight: '$10', paddingTop: '$13', paddingBottom: '$15' }}>
                <Card.Header>
                  <Text h4 style={{ fontSize: 25 }}>
                    Do i need any GPU to use Stable Diffusion?
                  </Text>
                </Card.Header>
                <Text>
                  <strong> No, you don't need any GPU </strong>
                  {' '}
                  to use Stable Diffusion or DreamBooth everything works in background to make it easy
                  for you to use. You can use it on your mobile phone, laptop or desktop.
                </Text>
              </Card>
            </div>
            <div className={styles.fqa_content_item}>
              <Card css={{ p: '$6', mw: '400px', paddingLeft: '$10', paddingRight: '$10', paddingTop: '$13', paddingBottom: '$15' }}>
                <Card.Header css={{ alignItems: 'center', textAlign: 'center', justifyContent: 'center' }}>
                  <Text h4 style={{ fontSize: 25 }}>
                    What is DreamBooth?
                  </Text>
                </Card.Header>
                <Text>
                  DreamBooth is a tool to
                  {' '}
                  <strong> fine-tune </strong>
                  {' '}
                  an existing text-to-image model like Stable Diffusion using only a few of your
                  own images. It means that you can customize the AI model so that it can make an infinite number of variations of you, your dog, or
                  your car.
                </Text>
              </Card>
            </div>
            <div className={styles.fqa_content_item}>
              <Card css={{ p: '$6', mw: '400px', paddingLeft: '$10', paddingRight: '$10', paddingTop: '$13', paddingBottom: '$15' }}>
                <Card.Header css={{ alignItems: 'center', textAlign: 'center', justifyContent: 'center' }}>
                  <Text h4 style={{ fontSize: 25 }}>
                    What is Stable Diffusion?
                  </Text>
                </Card.Header>
                <Text>
                  Stable Diffusion is a latent diffusion model that is capable of
                  {' '}
                  <strong> generating detailed images from text descriptions. </strong>
                  {' '}
                  It can also be used for tasks such as inpainting, outpainting,
                  text-to-image and image-to-image translations.
                </Text>
              </Card>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
