import React, {useState, useEffect} from "react";
import { Text, Button, Grid, Modal } from '@nextui-org/react';
import Container from 'react-bulma-companion/lib/Container';

 

import { GetSelfies } from '_api/selfies';
import {PostDeleteImage } from '_api/gallery';

import { DownloadIcon, DeleteIcon, GenerateIcon } from "../../../assets/icons/icons";

import styles from './styles.module.css';
import '@fontsource/ubuntu';

export default function Selfies() {

	const [Data, setData] = useState([]);
	const [loadingImages, setLoadingImages] = useState(true);
	const [visible, setVisible] = useState(false);
	const [selectedImageSrc, setSelectedImageSrc] = useState("");
	const [CreateVisible, setCreateVisible] = useState(false);
	const [loading, setLoading] = useState(true); // new state variable for loading
	const [isEmpty, setIsEmpty] = useState(false);

	const Dataloading = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]


	useEffect(() => {
		const requestData = {
		};
		setLoading(true); // set loading to true before making the API call
		GetSelfies(requestData)
		  .then((response) => {
			setData(response.body);
			if (response.body.length === 0) {
			  setIsEmpty(true);
			}
		  })
		  .finally(() => setLoading(false)); // set loading to false when API call is finished
	  }, [Data === undefined]);


	const openHandler = (imgSrc) => {
		setSelectedImageSrc(imgSrc);
		setVisible(true);
	  };

	const handleImageLoad = () => {
		setLoadingImages(false);
	  };

	const closeHandler = () => {
		setVisible(false);
	  };

	
	  const handleDeleteImg = (ImagePath) => {
		const data = {
		  ImagePath: ImagePath,
		};
		PostDeleteImage(data).then((res) => {
		//   console.log(res);
		  setData(Data.filter((item) => item !== ImagePath));
		  closeHandler();
		});
	  };


	

	  return (
		<Container className={styles.root} >
			<Grid.Container className={styles.Gird_Contaier} >
				<Grid.Container style={{justifyContent : "space-between", marginBottom : "20px", alignItems : "center"}} >
					<Grid>
						<Text h2 style={{fontFamily : "Ubuntu", fontSize : "30px", marginBottom : "30px", fontWeight : "500"}} >My Selfies</Text>
					</Grid>
					<Grid.Container style={{ flexWrap : "wrap" }} gap={1} >
					{Data.map((image, index) => (
						 <div key={index} className={styles.image_cover}  >
						 <Grid
						   css={{ borderRadius: "15px" }}
						   onClick={() => openHandler(image)}
						 >
						   <img
							 src={image}
							 alt="image"
							 style={{
							   borderRadius: "15px",
							   width: "240px",
							   height: "240px",
							   boxShadow: "0px 10px 20px 0px rgba(0, 0, 0, 0.1)",
							   objectFit: "cover",
							 }}
							 onLoad={handleImageLoad}
						   />
						 </Grid>
						</div>
					))}
						{(loadingImages && !isEmpty) && (
							Dataloading.map((item, index) => (
								<Grid key={index} >
        							<div className={styles.loading_card} >
	 								</div>
								</Grid>
							))
        				)}
					{isEmpty && (
					  <>
					    {Array.from({ length: 3 }, (_, index) => (
					      <Grid key={index}>
					        <div className={styles.empty_card}>
					          <img
					            src={"/images/empty.jpg"}
					            style={{
					              borderRadius: "15px",
					              width: "240px",
					              height: "240px",
					              boxShadow: "0px 10px 20px 0px rgba(0, 0, 0, 0.1)",
					              objectFit: "cover",
					            }}
					          />
					        </div>
					      </Grid>
					    ))}
					  </>
					)}
					 <Modal width="650px" open={visible} onClose={closeHandler} >
						<Modal.Body style={{ padding : "30px 20px 30px 20px"}} >
        				<Modal.Body >
        				  <img src={selectedImageSrc} style={{
							  borderRadius: "25px", margin : "10px , 10px , 10px , 10px"
							}} width={"100%"} height={"100%"} />
        				</Modal.Body>
						<Modal.Body style={{justifyContent : "space-between", flexDirection : "row"}}>
        				  	<Text h3 style={{fontFamily : "Ubuntu", fontSize : "23px"}} >Selfie</Text>
							<Button icon={<DeleteIcon width={20} height={20} />} flat rounded color="error" auto onPress={() => {handleDeleteImg(selectedImageSrc)}} style={{fontFamily : "Ubuntu", fontSize : "20px"}} >Delete</Button>
        				</Modal.Body>
						<Modal.Body style={{justifyContent : "center", alignItems : "center"}} >
						</Modal.Body>
							</Modal.Body>
     				 </Modal>
					</Grid.Container>
				</Grid.Container>
			</Grid.Container>
		</Container>
  );
}