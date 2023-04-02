import React, {useState, useEffect} from "react";
import { Text, Button, Input, Loading, Avatar, Grid, Card, Modal, Image, Popover, Divider } from '@nextui-org/react';
import Container from 'react-bulma-companion/lib/Container';
import queryString from "query-string";

import { Store as RNC } from 'react-notifications-component';

import { GetGallery, PostDeleteImage, GetLowerImage, PostMakeMore } from '_api/gallery';
import { PostInference } from '_api/inference';
import { GetSingleStudio } from "_api/studio";

import { DownloadIcon, DeleteIcon, GenerateIcon } from "../../../assets/icons/icons";
import { formatTime } from "../../pages/HomePage/Assets";

import styles from './styles.module.css';

import '@fontsource/ubuntu/500.css'; 

export default function Gallery() {

	const [Data, setData] = useState([]);
	const [loadingImages, setLoadingImages] = useState(true);
	const [GetAll, setGetAll] = useState(false);
	const [InputPrompt, setInputPrompt] = useState("");
	const [GeneratingImage, setGeneratingImage] = useState(false);
	const [GeneratedImages, setGeneratedImages] = useState([]);
	const [GeneratedPrompts , setGeneratedPrompts] = useState([]);
	const [Studio, setStudio] = useState([]);
	const [ImagesToMake, setImagesToMake] = useState("");
	const [isMakeMore, setIsMakeMore] = useState(false);

	const [isEmpty , setIsEmpty] = useState(false);

	const [TokenId , setTokenId] = useState("");
	const [loading, setLoading] = useState(true); // new state variable for loading
	const Dataloading = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
	const testarray = ["1", "2", "3"]

	useEffect(() => {
		const queryParams = queryString.parse(window.location.search);
		if (queryParams.id === undefined){
			return;
		}
		const data = {
			token_id : queryParams.id
		}
		GetSingleStudio(data).then((response) => {
			setStudio(response.body);
		})
	}, [Studio === undefined]);

	
	useEffect(() => {
		const queryParams = queryString.parse(window.location.search);
		setTokenId(queryParams.id);
		let GetAll2 = false;
		if (queryParams.id === undefined){
		  GetAll2 = true;
		  setGetAll(true)
		}
		const requestData = {
		  token_id: queryParams.id,
		  GetAll : GetAll2
		};
		setLoading(true); // set loading to true before making the API call
		GetGallery(requestData)
		  .then((response) => {
			setData(response.body);
			if(response.body.length === 0){
				setIsEmpty(true);
			}
		  })
		  .finally(() => setLoading(false)); // set loading to false when API call is finished
	  }, [Data === undefined]);
	
	const [visible, setVisible] = useState(false);
	const [selectedImageSrc, setSelectedImageSrc] = useState("");
	const [CreateVisible, setCreateVisible] = useState(false);
	
	const openHandler = (imgSrc) => {
	  setSelectedImageSrc(imgSrc);
	  setVisible(true);
	};
	
	const closeHandler = () => {
	  setVisible(false);
	};

	const openCreateHandler = () => {
		setCreateVisible(true);
	};
	
	const closeCreateHandler = () => {
		setCreateVisible(false);
	  };
	  
	
	const handleImageLoad = () => {
	  setLoadingImages(false);
	};

	const handlePromptChange = (e) => {
		setInputPrompt(e.target.value);
	};

	const handleMakeMoreImages = (e) => {
		setImagesToMake(e.target.value);
	};

	const handleDeleteImg = (ImagePath) => {
		const data = {
		  ImagePath: ImagePath,
		};
		PostDeleteImage(data).then((res) => {
		  console.log(res);
		  setData(Data.filter((item) => item[0] !== ImagePath));
		  closeHandler();
		});
	  };

	const handleGenerateImage = () => {
		let editInputPrompt = InputPrompt.replace(Studio.name, TokenId);
		const data = {
			token_id : TokenId,
			prompt : editInputPrompt,
			negative_prompt : "disfigured, poorly drawn face, mutation, mutated, extra limb, ugly, disgusting, poorly drawn hands, missing limb, floating limbs, disconnected limbs, malformed hands, blurry, ((((mutated hands and fingers)))), watermark, watermarked, oversaturated, censored, distorted hands, amputation, missing hands, obese, doubled face, double hands",
			height : "512",
			width : "512",
			num_inference_steps : "28",
			guidance_scale : "7",
			num_images_per_prompt : "1",
			doneInference : false,
			tokenPath : ""
		}
		setGeneratedPrompts([...GeneratedPrompts, InputPrompt]);
		setInputPrompt("");
		setGeneratingImage(true);
		PostInference(data).then((response) => {
			setGeneratedImages([...GeneratedImages, response.body]);
			setData([...Data, response.body]);
			setGeneratingImage(false);
			
		});
	};

	const GenerateMoreImages = () => {
		if (isNaN(ImagesToMake) || ImagesToMake < 0 || ImagesToMake > 50) {
			RNC.addNotification({
				title: "Error",
				message: "You can't generate more than 50 images",
				type: "danger", // success, danger, info, default, warning
				container: "top-right",
				animationIn: ['animated', 'fadeInRight'],
				animationOut: ['animated', 'fadeOutRight'],
				dismiss: {
				  duration: 5000},
			  });
			return;
		}

		const Prompts = [
			`${TokenId} with headphones, natural skin texture, 24mm, 4k textures, soft cinematic light, adobe lightroom, photolab, hdr, intricate, elegant, highly detailed, sharp focus, ((((cinematic look)))), soothing tones, insane details, intricate details, hyperdetailed, low contrast, soft cinematic light, dim colors, exposure blend, hdr, faded`,
			`Hyper detailed ultra sharp, ${TokenId}, bloodwave, ornate, intricate, digital painting, concept art, smooth, sharp focus, illustration, full body, 8 k, (((full body))), long flowing hair, (((horror)))`,
			`a ${TokenId}, (stone skin cracked:1.4), (intricate details:1.22), hdr, (intricate details, hyperdetailed:1.2), whole body, cinematic, intense, cinematic composition, cinematic lighting, (rim lighting:1.3), color grading, focused`,
			`a 42 yo ${TokenId}, smiling, (milk bar:1.2), (gray apron:0.9), cook hat, artstation, (epic realistic:1.2), (hdr:1.3), (dark shot:0.7), intricate details, [[rutkowski]], intricate, cinematic, detailed`,
			`${TokenId} as samurai wearing demon oni mask, full samurai armor, head down, in village, full body shot, epic realistic, (hdr:1.4), (muted colors:1.4), (intricate details, hyperdetailed:1.2), dramatic , heavy rain, sunset, dark clouds`,
			`a black and white photo of ${TokenId}, inspired by Sheila Mullen, tumblr, boy has short black hair, photorealistic portrait of bjork, detailed punk hair, 1 9 9 9 aesthetic`,
			`a portrait photo of a ${TokenId}, (pressure suit: 0.03), communism, (hdr:1.28), hyperdetailed, cinematic, warm lights, intricate details, hyperrealistic, dark radial background, (muted colors:1.38), (neutral colors:1.2), red star, hammer and sickle, tactical headphones, USSR`,
			`natural skin texture, 24mm, 4k textures, soft cinematic light, adobe lightroom, photolab, hdr, (full shot body:1.4) photo of ${TokenId}, soviet union, 70s, retrofuturism, masterpiece, (photorealistic:1.4), best quality, ((old torn clothes, dirty)) beautiful lighting, ((old torn clothes, dirty))lying beaten on the ground, rain, mud, puddles, braided hairstyle, ray tracing, space background, ( very detailed background, detailed complex busy background : 1.4 ), sharp focus, volumetric fog, 8k uhd, dslr, high quality, film grain, ((depressive mood)), photorealism, lomography , at ( A sprawling soviet metropolis in a future dystopia ), view from below , translucency , (HDR:1.2), Mar <lora:bliznyashkiTheTwins_v1:1.1>`,
			`(((carton))), an ${TokenId}, pale, perfect makeup, bun hair, japanese village, (professional majestic oil painting by Ed Blinkey:1.2)`,
			`(((cartoon))), ${TokenId}, (assasin:1.5) (spread legs), (scars), sunset, black old leather armor, falling stars, very short curly red hair, shadow (((anxiety))), Fear, pain, beautiful face, (detailed skin, skin texture), (Muscles:1.6), darkest dungeon, creepy, terror, professional majestic oil painting by Ed Blinkey, Atey Ghailan, Studio Ghibli, by Jeremy Mann, Greg Manchess, Antonio Moro, trending on ArtStation, trending on CGSociety, Intricate, High Detail, Sharp focus, dramatic, photorealistic painting art by (greg rutkowski:1.4),`
		]
		let NewPrompt = [];
		let j = 0;
	
		for (let i = 0; i < ImagesToMake; i++) {
			if (j == Prompts.length)
				j = 0;
			NewPrompt.push(Prompts[j]);
			j++;
		}

		NewPrompt.forEach((prompt, index) => {
			const data = {
			  token_id : TokenId,
			  prompt : prompt,
			  negative_prompt : "disfigured, poorly drawn face, mutation, mutated, extra limb, ugly, disgusting, poorly drawn hands, missing limb, floating limbs, disconnected limbs, malformed hands, blurry, ((((mutated hands and fingers)))), watermark, watermarked, oversaturated, censored, distorted hands, amputation, missing hands, obese, doubled face, double hands",
			  height : "512",
			  width : "512",
			  num_inference_steps : "28",
			  guidance_scale : "7",
			  num_images_per_prompt : "1",
			  doneInference : false,
			  tokenPath : ""
			};
			setIsMakeMore(true);
			PostInference(data).then((response) => {
			//   console.log(response);
			  const newData = [response.body];
			  setData((prevData) => [...prevData, ...newData]);
			  if (index === NewPrompt.length - 1) {
				setIsMakeMore(false);
			  }
			});
		  });
	}

	const downloadLowerResolutionImage = (ImagePath) => {
		const data = {
			ImagePath : ImagePath,
		}
		GetLowerImage(data).then((res) => {
			const link = document.createElement('a');
			link.href = res.text;
			link.setAttribute('download', 'image.png');
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		})
	  };

	  return (
	<Container className={styles.root} >
		<Grid.Container className={styles.Gird_Contaier} >
			<Grid.Container style={{justifyContent : "space-between", marginBottom : "20px", alignItems : "center"}} >
				<Grid>
					<Text h2 style={{fontFamily : "Ubuntu", fontSize : "30px", fontWeight : "500"}} >My Creations</Text>
				</Grid>
				{
					!GetAll && (
						<Grid style={{justifyContent : "space-between", flexDirection : "row", display : "flex"}} >
												<Popover>
							<Popover.Trigger>
								<Button ghost rounded color="success" auto style={{fontFamily : "Ubuntu", fontSize : "20px", zIndex : "0", marginRight : "15px"}} >Make more</Button>
							</Popover.Trigger>
							<Popover.Content>
								<Grid style={{ height : "100px", width : "340px", flexDirection : "row", display : "flex",
								justifyContent : "space-around", alignItems : "center"}} >
									<Input aria-labelledby="makemore" value={ImagesToMake} onChange={handleMakeMoreImages} color="primary" animated={false} bordered  placeholder="Make more images" />
									{ !isMakeMore ? (
											<Button flat color="primary" auto onPress={GenerateMoreImages} style={{fontFamily : "Ubuntu", fontSize : "20px", zIndex : "0"}} >make</Button>
									) : (
											<Button disabled auto bordered color="success" css={{ px: "$13" }}>
          										<Loading type="points" color="currentColor" size="sm" />
        									</Button>
										)
									}
								</Grid>
							</Popover.Content>
						</Popover>
						<Button ghost rounded color="success" auto style={{fontFamily : "Ubuntu", fontSize : "20px", zIndex : "0"}} onPress={openCreateHandler} >Create</Button>
						</Grid>
					)
				}
			</Grid.Container>
			<Modal closeButton width="48%" open={CreateVisible} onClose={closeCreateHandler} >
				<Modal.Body>
					<Text h2 css={{  fontWeight : "500", fontFamily : "Ubuntu", fontSize : "28px", marginBottom : "-2px"}} >Studio {Studio.name}</Text>
					<Text css={{ fontFamily : "Ubuntu", letterSpacing : "0.1px", fontSize : "15px", color : "#616161"}} >{formatTime(Studio.Time)}</Text>
				</Modal.Body>
				<Grid.Container style={{flexDirection : "column"}} >
				<Modal.Body style={{ width : "100%", justifyContent : "space-between", flexDirection : "row"}} >
					<Modal.Body style={{width : "100%"}} >
						<Input aria-label="Prompt" color="default" bordered  placeholder="Portrait of Hiba in beach, looking to camera..." style={{fontFamily : "Ubuntu", fontSize : "17px" }}
								value={InputPrompt} onChange={handlePromptChange} />
					</Modal.Body>
					<Modal.Body style={{width : "30%"}} >
						<Button  disabled={GeneratingImage ? true : false} iconRight={GeneratingImage ? <Loading color="currentColor" size="sm" /> : <GenerateIcon width={20} height={20} />} color="success" auto style={{fontFamily : "Ubuntu", fontSize : "20px"}}
							onPress={handleGenerateImage}>Generate</Button>
					</Modal.Body>
				</Modal.Body>
				<Grid.Container style={{textAlign : "left", marginLeft : "50px", marginTop : "-18px", width : "91%"}} >
					<Grid>
						<Text h3 style={{fontFamily : "Ubuntu", fontSize : "17px", fontWeight : "400", color : "#3a3a3a"}} >Use the keyword <strong>{Studio.name}</strong> as the subject in your prompt. First prompt can be slow, but following prompts will be faster</Text>
					</Grid>
					<Grid style={{width : "96%"}} >
					</Grid>
					<Grid.Container style={{justifyContent : "center", paddingBottom : "30px", width : "96%"}} >
						{
							(GeneratedImages.length === 0 && !GeneratingImage ) && (
								<Grid style={{width : "100%"}}>
									<Divider y={3} />
								<Text style={{fontFamily : "Ubuntu", fontSize : "18px", fontWeight : "400", color : "#3a3a3a", textAlign : "center"}} >You dont't have any prompt yet. it's time to be create!</Text>
								</Grid>
							) 
						}
						{
							GeneratingImage && (
								<Grid.Container>
									<Divider y={3} />
									<Grid style={{ display : "flex", flex : "1",
												alignItems : "center"}} >
										<Grid>
        									<div className={styles.loading_card} style={{width : "110px", height : "110px"}} />
										</Grid>
										<Grid style={{marginLeft : "13px", marginBottom : "50px"}}  >
										{/* <Text style={{fontFamily : "Ubuntu", fontSize : "18px", fontWeight : "500", color : "#3a3a3a"}} >hwhwefhwefjjefjwefjwefj</Text> */}
										<div className={styles.loading_text} />
										<div className={styles.loading_mini_text} />
										</Grid>
									</Grid>
								</Grid.Container>
							)
						}
						{
							GeneratedImages.length > 0 && (
								GeneratedImages.map((image, index) => (
									<Grid.Container key={index} >
										<Divider y={3} />
										<Grid style={{ display : "flex", flex : "1",
													alignItems : "center"}} >
											<Grid>
												<img src={image} style={{width : "110px", height : "110px", borderRadius : "12px"}} />
											</Grid>
											<Grid style={{marginLeft : "13px"}} >
												<Text style={{fontFamily : "Ubuntu", fontSize : "18px", fontWeight : "500", color : "#3a3a3a"}} >{GeneratedPrompts[index].slice(0, 60) + (GeneratedPrompts[index].length > 60 ? '...' : '')}</Text>
												<Text css={{ fontFamily : "Ubuntu", letterSpacing : "0.1px", fontSize : "14px", color : "#616161"}} >Today 12.33 PM</Text>
												<Grid style={{marginTop : "20px", marginBottom : "12px"}} >
												<a href={image} download="image.png">Download</a>
												</Grid>
											</Grid>
										</Grid>
									</Grid.Container>
								))
							)
						}
					</Grid.Container>
				</Grid.Container>
				</Grid.Container>
			</Modal>
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
        				  	<Text h3 style={{fontFamily : "Ubuntu", fontSize : "23px"}} >AI Generated Image</Text>
							<Button icon={<DeleteIcon width={20} height={20} />} flat rounded color="error" auto onPress={() => {handleDeleteImg(selectedImageSrc)}} style={{fontFamily : "Ubuntu", fontSize : "20px"}} >Delete</Button>
        				</Modal.Body>
						<Modal.Body style={{justifyContent : "center", alignItems : "center"}} >
							<Modal.Body >
								<Button icon={<DownloadIcon width={26} height={26} />} rounded color="primary" auto style={{fontFamily : "Ubuntu", fontSize : "22px", height : "50px"}}
									onPress={() => {downloadLowerResolutionImage(selectedImageSrc)}} >Download 512x512</Button>
								<Button icon={<DownloadIcon width={26} height={26} />} rounded color="primary" auto style={{fontFamily : "Ubuntu", fontSize : "22px", height : "50px"}}
									onPress={
										() => {
											const link = document.createElement('a');
											link.href = selectedImageSrc;
											link.setAttribute('download', 'image.png');
											document.body.appendChild(link);
											link.click();
											document.body.removeChild(link);
										}
									} >Download 1024x1024</Button>
							</Modal.Body>
						</Modal.Body>
							</Modal.Body>
     				 </Modal>
			</Grid.Container>
		</Grid.Container>
	</Container>
  );
}