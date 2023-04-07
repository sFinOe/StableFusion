import React, { useState, useEffect, useCallback } from "react";

import { Store as RNC } from "react-notifications-component";

import { postUpload } from "_api/upload";
import { CheckStudio, PostStudio, GetStudioImages, PostDeleteStudio, PostTraining, PostPrompts } from "_api/studio";

import { formatTime } from "../Assets";
import ImageComponent from "./GetImage";
import PreImages from "./PreImages";

import styles from "./styles.module.css";

import { Text, Button, Input, Loading, Avatar, Grid } from "@nextui-org/react";

import approval from "../../../../assets/icons/approval.svg";
import { UploadIcon, ValidIcon, LightningIcon, RightArrowIcon } from "../../../../assets/icons/icons";
import loading from "../../../../assets/images/loading.svg";

import "@fontsource/ubuntu/500.css";

function FileUpload() {
  const [imagesDataset, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [isStudio, setIsStudio] = useState(false);
  const [studioName, setStudioName] = useState("");
  const [studioType, setStudioType] = useState("");
  const [TokenId, setTokenId] = useState("");
  const [ButtonLoading, setButtonLoading] = useState(false);
  const [disabledButtons, setDisabledButtons] = useState([]);

  const [AvailableStudio, setAvailableStudio] = useState([]);
  const [isTrained, setIsTrained] = useState(false);
  const [PathImages, setPathImages] = useState([]);
  const [isFinished, setIsFinished] = useState(false);

  const dataImages = [
    { src: "/images/style_image_1.png", alt: `photo of xxxx looking left, classic, old styles, insane details` },
    {
      src: "/images/style_image_2.png",
      alt: `direct look, xxxx powerfull god, creator of the universe, galaxy, intricate details, close up portrait, rich background`,
    },
    {
      src: "/images/style_image_3.png",
      alt: `Old xxxx with wrinkles face looking left, (stylish hairstyle:1.3), gray hair, clear facial features, piercing gaze, (military clothes:1.2), intricate details), epic, High Detail, Sharp focus, dramatic, photorealistic painting art by midjourney and greg rutkowski`,
    },
    { src: "/images/style_image_4.png", alt: `selfie of xxxx, insane details, 4k, realistic` },
    { src: "/images/style_image_5.png", alt: `portrait of xxxx, looking to camera, insane details, city, 4k` },
    {
      src: "/images/style_image_6.jpeg",
      alt: `High detail RAW color art, animation, xxxx as Thorin Oakenshield from LOTR, (inside the mountain dwarven halls), ((Dwarf king)), ((((crown on head whit Arkenstone)))) Black leather armor, ((dirty Black long curly hair)) huge black wolf fur collar ((against the background of gold placers smaug dragon)) Atey Ghailan, by Jeremy Mann, Greg Manchess, Antonio Moro, trending on ArtStation, trending on CGSociety, Intricate, High Detail, Sharp focus, dramatic, photorealistic painting art by midjourney and greg rutkowski, bokeh on background`,
    },
    {
      src: "/images/style_image_7.jpeg",
      alt: `cyberpunk smiling xxxx, under rain, short jacket, dramatic, hdr, complex background, cinematic, filmic, (rutkowski, artstation:0.8), soaking wet`,
    },
    {
      src: "/images/style_image_8.png",
      alt: `RAW photo, a portrait photo of xxxx in casual clothes, night, city street, (high detailed skin:1.2), 8k uhd, dslr, soft lighting, high quality, film grain, Fujifilm XT3`,
    },
    {
      src: "/images/style_image_9.jpeg",
      alt: `a photo of a xxxx miner, tired look, 55 years old man, face stained with coal, helmet with a flashlight, deep wrinkles, 85 mm focal lenth, Lightroom, Hasselblad 907X`,
    },
    {
      src: "/images/style_image_10.jpeg",
      alt: `xxxx as Bilbo Baggins, sits under a tree, ((smoking a pipe and blowing smoke)), (clouds of tobacco smoke) wearing shorts, hobbit hobbit of the Shire, bare feet, hairy fur legs High detail RAW color art, animation Atey Ghailan, by Jeremy Mann, Greg Manchess, Antonio Moro, trending on ArtStation, trending on CGSociety, Intricate, High Detail, Sharp focus, dramatic, photorealistic painting art by midjourney and greg rutkowski, bokeh on background`,
    },
    {
      src: "/images/style_image_11.jpeg",
      alt: `High detail RAW color art, animation, xxxx as Bilbo Baggins from LOTR, (hobbit of the Shire), ((against the background of gold placers smaug dragon)) Atey Ghailan, by Jeremy Mann, Greg Manchess, Antonio Moro, trending on ArtStation, trending on CGSociety, Intricate, High Detail, Sharp focus, dramatic, photorealistic painting art by midjourney and greg rutkowski, bokeh on background`,
    },
    {
      src: "/images/style_image_12.jpeg",
      alt: `High detail RAW color art, animation, xxxx, (young Cathe Blanchett:1.2) as Galadriel from LOTR walks on the surface of the water, (pointy ears), in sequoia forest, elf ears, ((cartoon style)), ((lord of the rings)), mystical, elegant, beautiful face, elven forest, sheer white silk airy dress, luxury elegant tiara, (((domineering look))), danger, (fear and horror), mordor, negative view, creepy, dark magic, magical atmosphere, (muscle), (detailed skin, skin texture), intricately detailed, fine details, hyperdetailed, raytracing, subsurface scattering, diffused soft lighting, shallow depth of field, by (Oliver Wetter) Atey Ghailan, by Jeremy Mann, Greg Manchess, Antonio Moro, trending on ArtStation, trending on CGSociety, Intricate, High Detail, Sharp focus, dramatic, photorealistic painting art by midjourney and greg rutkowski, bokeh on background`,
    },
  ];

  const proffessions_images = [
    {
      src: "/images/profession_1.png",
      alt: `photo of xxxx as magician, High detail RAW color art, High Detail, Sharp focus, dramatic, photorealistic painting art by midjourney and greg rutkowski, bokeh on background`,
    },
    {
      src: "/images/profession_2.png",
      alt: "photo of xxxx as astronaut, High detail RAW color art, High Detail, Sharp focus, dramatic, photorealistic painting art by midjourney and greg rutkowski, bokeh on background",
    },
    {
      src: "/images/profession_3.png",
      alt: "photo of xxxx as hunter, High detail RAW color art, High Detail, Sharp focus, dramatic, photorealistic painting art by midjourney and greg rutkowski, bokeh on background",
    },
    {
      src: "/images/profession_4.png",
      alt: "photo of xxxx as teacher, High detail RAW color art, High Detail, Sharp focus, dramatic, photorealistic painting art by midjourney and greg rutkowski, bokeh on background",
    },
    {
      src: "/images/profession_5.png",
      alt: "photo of xxxx as boxer, High detail RAW color art, High Detail, Sharp focus, dramatic, photorealistic painting art by midjourney and greg rutkowski, bokeh on background",
    },
    {
      src: "/images/profession_6.png",
      alt: "photo of xxxx as Military Leader, High detail RAW color art, High Detail, Sharp focus, dramatic, photorealistic painting art by midjourney and greg rutkowski, bokeh on background",
    },
    {
      src: "/images/profession_7.png",
      alt: "photo of xxxx as acountable, High detail RAW color art, High Detail, Sharp focus, dramatic, photorealistic painting art by midjourney and greg rutkowski, bokeh on background",
    },
    {
      src: "/images/profession_8.png",
      alt: "photo of xxxx as Flight Attendant, High detail RAW color art, High Detail, Sharp focus, dramatic, photorealistic painting art by midjourney and greg rutkowski, bokeh on background",
    },
    {
      src: "/images/profession_9.png",
      alt: "photo of xxxx as musican, High detail RAW color art, High Detail, Sharp focus, dramatic, photorealistic painting art by midjourney and greg rutkowski, bokeh on background",
    },
    {
      src: "/images/profession_10.png",
      alt: "photo of xxxx as constructor, High detail RAW color art, High Detail, Sharp focus, dramatic, photorealistic painting art by midjourney and greg rutkowski, bokeh on background",
    },
    {
      src: "/images/profession_11.png",
      alt: "photo of xxxx as police, High detail RAW color art, High Detail, Sharp focus, dramatic, photorealistic painting art by midjourney and greg rutkowski, bokeh on background",
    },
    {
      src: "/images/profession_12.png",
      alt: "photo of xxxx as cooker, High detail RAW color art, High Detail, Sharp focus, dramatic, photorealistic painting art by midjourney and greg rutkowski, bokeh on background",
    },
  ];

  function handleUpload(images) {
    let i = 0;
    let ready = false;
    const formData = new FormData();
    images.forEach((image) => {
      formData.append("images", image);
    });
    postUpload(formData).then((res) => {
      setTokenId(res.body.token_id);
      setPathImages(res.body.images);
      ready = true;
    });
    setUploading(true);
    const uploadSimulation = setInterval(() => {
      const uploading_progress = document.getElementById(`uploading_${i}`);
      if (i < images.length) {
        if (uploading_progress) {
          uploading_progress.src = "/images/upload_success.png";
        }
        i++;
      }
      if (i === images.length && ready) {
        clearInterval(uploadSimulation);
        setIsDone(true);
      }
    }, 1000);
  }

  const handleClick = (event) => {
    event.preventDefault();
    const fileInput = document.createElement("input");
    fileInput.setAttribute("type", "file");
    fileInput.setAttribute("multiple", true);
    fileInput.setAttribute("accept", "image/png, image/jpeg");
    fileInput.click();
    fileInput.onchange = () => {
      const files = Array.from(fileInput.files);
      const nonImageFiles = files.filter((file) => !file.type.startsWith("image/"));
      if (nonImageFiles.length > 0) {
        RNC.addNotification({
          title: "Error",
          message: "You can only upload images",
          type: "danger", // success, danger, info, default, warning
          container: "top-right",
          animationIn: ["animated", "fadeInRight"],
          animationOut: ["animated", "fadeOutRight"],
          dismiss: {
            duration: 5000,
          },
        });
        return;
      }
      const updatedImages = imagesDataset.concat(files);
      if (updatedImages.length > 20) {
        RNC.addNotification({
          title: "Error",
          message: "You can't upload more than 20 images",
          type: "info", // success, danger, info, default, warning
          container: "top-right",
          animationIn: ["animated", "fadeInRight"],
          animationOut: ["animated", "fadeOutRight"],
          dismiss: {
            duration: 5000,
          },
        });
        return;
      }
      const promises = updatedImages.map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
              if (file.size > 2 * 1024 * 1024) {
                reject("File size must be less than 2MB");
              } else if (img.width !== 512 || img.height !== 512) {
                reject("Image dimensions must be 512x512");
              } else {
                resolve();
              }
            };
            img.src = event.target.result;
          };
          reader.readAsDataURL(file);
        });
      });
      Promise.all(promises)
        .then(() => {
          setImages(updatedImages);
        })
        .catch((error) => {
          RNC.addNotification({
            title: "Error",
            message: error,
            type: "danger", // success, danger, info, default, warning
            container: "top-right",
            animationIn: ["animated", "fadeInRight"],
            animationOut: ["animated", "fadeOutRight"],
            dismiss: {
              duration: 5000,
            },
          });
        });
    };
  };

  const handleRemove = (index) => {
    const updatedImages = [...imagesDataset];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };

  const CheckAvailableStudio = useCallback(async () => {
    try {
      const res = await CheckStudio();
      if (res.body.length > 0) {
        const reversedArray = res.body.reverse();
        setAvailableStudio(reversedArray);
        setIsStudio(true);
      }
    } catch (error) {
      // handle error
      console.log(error);
    }
  }, [setAvailableStudio, setIsStudio]);

  const handleNameChange = (e) => {
    setStudioName(e.target.value);
  };

  const handleTypeChange = (e) => {
    setStudioType(e.target.value);
  };

  const CreateNewStudio = () => {
    const studio = {
      name: studioName,
      type: studioType,
      token_id: TokenId,
      images: PathImages,
    };
    setButtonLoading(true);
    PostStudio(studio).then((res) => {
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    });
  };

  const handleDeleteStudio = (id, index) => {
    const studio = {
      token_id: id,
    };
    PostDeleteStudio(studio).then((res) => {
      RNC.addNotification({
        title: "Success",
        message: "Studio has been deleted successfully",
        type: "success", // success, danger, info, default, warning
        container: "top-right",
        animationIn: ["animated", "fadeInRight"],
        animationOut: ["animated", "fadeOutRight"],
        dismiss: {
          duration: 5000,
        },
      });
      const resArray = res.body.reverse();
      setAvailableStudio(resArray);
      if (AvailableStudio.length === 1) {
        setIsStudio(false);
      }
    });
  };

  const handleTraining = (studio, index) => {
    setDisabledButtons([...disabledButtons, index]);
    const studio_data = {
      token_id: studio.token_id,
      type: studio.type,
      img_length: studio.images.length,
    };
    PostTraining(studio_data).then((res) => {
      setIsTrained(true);
    });

    useEffect(() => {
      // console.log("is finisheddddddddddddddddddddddddddd", studio.finished);
    }, [studio.finished]);
  };

  const [selectedImages, setSelectedImages] = useState({});
  const [Selected_professions, setSelected_professions] = useState({});
  const [Normal_prompt, setNormal_prompt] = useState([]);
  const [Profession_prompt, setProfession_prompt] = useState([]);

  const handleImageClick = async (index, studio) => {
    const token_id = studio.token_id;
    if (selectedImages[token_id]?.includes(index)) {
      setSelectedImages((prevState) => ({
        ...prevState,
        [token_id]: prevState[token_id]?.filter((i) => i !== index),
      }));
      const div = document.getElementById(`dataImages_${index}`);
      const prompt = div.alt.replace("xxxx", `${token_id}`);
      setNormal_prompt((prevState) => ({
        ...prevState,
        [token_id]: prevState[token_id]?.filter((i) => i !== prompt),
      }));
    } else {
      setSelectedImages((prevState) => ({
        ...prevState,
        [token_id]: [...(prevState[token_id] || []), index],
      }));
      const div = document.getElementById(`dataImages_${index}`);
      const prompt = div.alt.replace("xxxx", `${token_id}`);
      setNormal_prompt((prevState) => ({
        ...prevState,
        [token_id]: [...(prevState[token_id] || []), prompt],
      }));
    }
    const data = {
      token_id: token_id,
      prompts: Normal_prompt[token_id] || [],
      professions_prompts: Profession_prompt[token_id] || [],
    };
    await PostPrompts(data);
  };

  const handleProffessionsImageClick = async (index, studio) => {
    const token_id = studio.token_id;
    if (Selected_professions[token_id]?.includes(index)) {
      setSelected_professions((prevState) => ({
        ...prevState,
        [token_id]: prevState[token_id]?.filter((i) => i !== index),
      }));
      const div = document.getElementById(`proffessions_${index}`);
      setProfession_prompt((prevState) => ({
        ...prevState,
        [token_id]: prevState[token_id]?.filter((i) => i !== div.alt),
      }));
    } else {
      setSelected_professions((prevState) => ({
        ...prevState,
        [token_id]: [...(prevState[token_id] || []), index],
      }));
      const div = document.getElementById(`proffessions_${index}`);
      setProfession_prompt((prevState) => ({
        ...prevState,
        [token_id]: [...(prevState[token_id] || []), div.alt],
      }));
    }
    const data = {
      token_id: token_id,
      prompts: Normal_prompt[token_id] || [],
      professions_prompts: Profession_prompt[token_id] || [],
    };
    await PostPrompts(data);
  };

  const RemoveselectImage = (index, studio) => {
    const token_id = studio.token_id;
    setSelectedImages((prevState) => ({
      ...prevState,
      [token_id]: prevState[token_id]?.filter((i) => i !== index),
    }));
    const div = document.getElementById(`dataImages_${index}`);
    setNormal_prompt((prevState) => ({
      ...prevState,
      [token_id]: prevState[token_id]?.filter((i) => i !== div.alt),
    }));
  };

  const RemoveSelectProffession = (index, studio) => {
    const token_id = studio.token_id;
    setSelected_professions((prevState) => ({
      ...prevState,
      [token_id]: prevState[token_id]?.filter((i) => i !== index),
    }));
    const div = document.getElementById(`proffessions_${index}`);
    setProfession_prompt((prevState) => ({
      ...prevState,
      [token_id]: prevState[token_id]?.filter((i) => i !== div.alt),
    }));
  };

  function ToGallery(studio) {
    const token_id = studio.token_id;
    window.location.href = `/gallery/?id=${token_id}`;
  }

  function UpdateStudio() {
    useEffect(() => {
      const intervalId = setInterval(() => {
        CheckAvailableStudio();
      }, 500);

      return () => {
        clearInterval(intervalId);
      };
    }, [AvailableStudio]);
  }

  window.onload = function () {
    CheckAvailableStudio();
  };

  // UpdateStudio();

  return (
    <div className={styles.root}>
      <div style={{ justifyContent: "left", display: "flex", width: "70%" }}>
        <Text h1 size={"$2xl"} css={{ fontWeight: 500, fontFamily: "Ubuntu", marginBottom: "15px" }}>
          Create a new Studio
        </Text>
      </div>
      {!uploading && (
        <div className={styles.upload_form} onClick={handleClick}>
          <div className={styles.input_container}>
            <div className={styles.image_container}>
              <img src={"/images/drag_drop.png"} alt="1" />
            </div>
            <div className={styles.text_container}>
              <Text h3 css={{ fontFamily: "Ubuntu", letterSpacing: "0.1px" }}>
                Drag and drop or click to upload Upload
              </Text>
              <div>
                <Text h4 css={{ fontFamily: "Ubuntu", letterSpacing: "0.1px" }}>
                  Upload{" "}
                  <mark style={{ backgroundColor: "#d780ff", paddingLeft: "6px", paddingRight: "6px", borderRadius: "5px" }}>10-20 pictures</mark> of
                  you
                </Text>
              </div>
              <div style={{ textAlign: "center" }}>
                <Text size={18} css={{ letterSpacing: "0.1px" }}>
                  To get the best results, we suggest uploading 3 full body or entire object photos, 5 medium shots of the chest and up, and 10
                  close-up photos and:
                </Text>
              </div>
              <div>
                <ul role="list">
                  <li style={{ display: "flex", alignItems: "center", letterSpacing: "0.1px", fontSize: "17px" }}>
                    {" "}
                    <img src={approval} width={20} height={20} style={{ marginRight: "7px" }} />
                    Mix it up - change body pose, background, and lighting in each photo
                  </li>
                  <li style={{ display: "flex", alignItems: "center", letterSpacing: "0.1px", fontSize: "17px" }}>
                    {" "}
                    <img src={approval} width={20} height={20} style={{ marginRight: "7px" }} />
                    Capture a range of expressions
                  </li>
                  <li style={{ display: "flex", alignItems: "center", letterSpacing: "0.1px", fontSize: "17px" }}>
                    {" "}
                    <img src={approval} width={20} height={20} style={{ marginRight: "7px" }} />
                    Show the subject's eyes looking in different directions
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className={styles.showcase_container}>
        <div className={styles.image_showcase}>
          {imagesDataset.map((image, index) => (
            <div style={{ width: 120, margin: "10px" }} key={index}>
              {!uploading && (
                <div className={styles.cancel_button} onClick={() => handleRemove(index)}>
                  <img id={`uploading_${index}`} src={uploading ? loading : "images/delete_img.png"} width={30} height={30} />
                </div>
              )}
              {uploading && (
                <div className={styles.cancel_button}>
                  <img id={`uploading_${index}`} src={uploading ? loading : "images/delete_img.png"} width={30} height={30} />
                </div>
              )}

              <img
                key={index}
                src={URL.createObjectURL(image)}
                style={{
                  marginTop: 5,
                  width: 120,
                  height: 120,
                  objectFit: "cover",
                  borderRadius: "12px",
                  border: "4px solid #fff",
                  boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.3)",
                }}
              />
            </div>
          ))}
        </div>
      </div>
      {!uploading && (
        <div style={{ marginTop: "10px" }}>
          {imagesDataset.length > 0 && (
            <Button
              disabled={imagesDataset.length > 9 ? false : true}
              icon={<UploadIcon width={20} height={20} />}
              auto
              autoFocus
              css={{
                fontFamily: "Ubuntu",
                boxShadow: "$lg",
                fontSize: "19px",
                paddingLeft: "25px",
                paddingRight: "25px",
                paddingTop: "25px",
                paddingBottom: "25px",
                letterSpacing: "0.1px",
              }}
              onPress={() => {
                handleUpload(imagesDataset);
              }}
            >
              Upload (min 10 photos)
            </Button>
          )}
        </div>
      )}
      {isDone && (
        <div className={styles.create_studio}>
          <div className={styles.new_studio}>
            <div className={styles.input_field}>
              <Input
                label="Studio name"
                color="primary"
                bordered
                placeholder="Enter studio name"
                css={{ width: 280 }}
                value={studioName}
                onChange={handleNameChange}
              />
            </div>
            <div className={styles.input_field}>
              <Input
                label="Studio type"
                color="primary"
                bordered
                placeholder="Enter type of the subject"
                css={{ width: 280 }}
                value={studioType}
                onChange={handleTypeChange}
              />
            </div>
            <div className={styles.button_studio}>
              <Button
                disabled={studioName && studioType && !ButtonLoading ? false : true}
                iconRight={ButtonLoading ? <Loading color="currentColor" size="sm" /> : <ValidIcon width={20} height={20} />}
                auto
                css={{
                  fontFamily: "Ubuntu",
                  boxShadow: "$lg",
                  fontSize: "19px",
                  paddingLeft: "25px",
                  paddingRight: "25px",
                  paddingTop: "22px",
                  paddingBottom: "22px",
                  letterSpacing: "0.1px",
                }}
                onPress={CreateNewStudio}
              >
                Create Studio
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className={styles.studio_container}>
        <div style={{ justifyContent: "left", display: "flex", width: "70%" }}>
          <Text h1 size={"$2xl"} css={{ fontWeight: 500, fontFamily: "Ubuntu" }}>
            My Studios
          </Text>
        </div>
        <div className={styles.studios_container}>
          {!isStudio ? (
            <div className={styles.empty_studio_card}>
              <div style={{ textAlign: "center", width: "100%", paddingTop: "45px", paddingBottom: "45px" }}>
                <Text css={{ fontFamily: "Ubuntu", letterSpacing: "0.1px", fontSize: "17px", color: "#616161" }}>You have no studio yet</Text>
              </div>
              -
            </div>
          ) : (
            <div style={{ width: "100%" }}>
              {AvailableStudio.map((studio, index) => (
                <div id={`studio_${index}`} key={index} className={styles.studio_card}>
                  <div className={styles.studio_css}>
                    <div style={{ alignItems: "center", justifyContent: "space-between", display: "flex" }}>
                      <Text h2 css={{ fontWeight: "500", fontFamily: "Ubuntu", fontSize: "25px", marginBottom: "-2px" }}>
                        Studio {studio.name}
                      </Text>
                      <div
                        className={styles.delete_card}
                        onClick={() => {
                          handleDeleteStudio(studio.token_id, index);
                        }}
                      >
                        <img src={"/images/trash.png"} width={20} height={20} />
                      </div>
                    </div>
                    <div>
                      <Text css={{ fontFamily: "Ubuntu", letterSpacing: "0.1px", fontSize: "15px", color: "#616161" }}>
                        {formatTime(studio.Time)}
                      </Text>
                    </div>
                    {!studio.training && ( // !studio.training
                      <div className={styles.ready_to_train}>
                        <div style={{ textAlign: "center" }}>
                          <Text h2 css={{ fontWeight: "500", fontFamily: "Ubuntu", fontSize: "25px" }}>
                            Your Studio is ready to be trained
                          </Text>
                          <div className={styles.training_overview}>
                            <Avatar.Group count={studio.images.length - 5} style={{ zIndex: "0" }}>
                              {studio.images.slice(0, 5).map((image, index) => (
                                <ImageComponent key={index} image={image} />
                              ))}
                            </Avatar.Group>
                          </div>
                          <div style={{ justifyContent: "center", alignContent: "center", display: "flex", marginTop: "24px", marginBottom: "24px" }}>
                            <Button
                              disabled={disabledButtons.includes(index) ? true : false}
                              iconRight={
                                disabledButtons.includes(index) ? (
                                  <Loading color="currentColor" size="sm" />
                                ) : (
                                  <LightningIcon width={22} height={22} />
                                )
                              }
                              auto
                              rounded
                              css={{
                                fontFamily: "Ubuntu",
                                boxShadow: "$lg",
                                fontSize: "19px",
                                paddingLeft: "25px",
                                paddingRight: "25px",
                                paddingTop: "22px",
                                paddingBottom: "22px",
                                letterSpacing: "0.1px",
                              }}
                              onPress={() => handleTraining(studio, index)}
                            >
                              Start Training
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                    {studio.training &&
                      !studio.finished && ( // (studio.training && !studio.finished)
                        <Grid.Container style={{ paddingTop: "20px", paddingBottom: "20px" }} direction="column">
                          <Grid.Container justify="center" alignItems="center" direction="column">
                            <Grid>
                              <Loading size="xl" type="default" />
                            </Grid>
                            <Grid style={{ marginTop: "25px", textAlign: "center", width: "50%" }}>
                              <Text css={{ fontFamily: "Ubuntu", letterSpacing: "0.1px", fontSize: "18px", color: "#616161" }}>
                                The studio is creating <strong>the custom model based on your uploded photos.</strong> This operation usually takes
                                ~20min{" "}
                              </Text>
                            </Grid>
                          </Grid.Container>
                          <Grid.Container style={{ marginTop: "40px", marginBottom: "10px" }}>
                            <Grid>
                              <Text css={{ fontFamily: "Ubuntu", letterSpacing: "0.1px", fontSize: "18px", color: "#616161" }}>
                                In the meantime, choose 5 styles that you want to try first:
                              </Text>
                            </Grid>
                          </Grid.Container>
                          <Grid.Container gap={1} justify="center" style={{ marginTop: "10px", marginBottom: "10px" }}>
                            {dataImages.map((image, index) => (
                              <Grid
                                key={index}
                                className={styles.img_block}
                                onClick={() =>
                                  selectedImages[studio.token_id]?.length !== 5 ? handleImageClick(index, studio) : RemoveselectImage(index, studio)
                                }
                              >
                                <Grid style={{ position: "absolute", marginLeft: "90px", marginTop: "-10px", zIndex: "1" }}>
                                  {selectedImages[studio.token_id]?.includes(index) ? (
                                    <img src={"/images/upload_success.png"} width={30} height={30} />
                                  ) : null}
                                </Grid>
                                <img
                                  id={`dataImages_${index}`}
                                  src={image.src}
                                  alt={image.alt}
                                  style={{
                                    width: "120px",
                                    height: "120px",
                                    borderRadius: "20px",
                                    border: "3px solid #8b00b7",
                                    opacity: selectedImages[studio.token_id]?.includes(index) ? "0.5" : "1",
                                  }}
                                />
                              </Grid>
                            ))}
                          </Grid.Container>
                          <Grid.Container style={{ marginTop: "20px", marginBottom: "10px" }}>
                            <Grid>
                              <Text css={{ fontFamily: "Ubuntu", letterSpacing: "0.1px", fontSize: "18px", color: "#616161" }}>
                                Then, choose 5 professions you like:
                              </Text>
                            </Grid>
                          </Grid.Container>
                          <Grid.Container gap={1} justify="center" style={{ marginTop: "10px", marginBottom: "10px" }}>
                            {proffessions_images.map((image, index) => (
                              <Grid
                                key={index}
                                className={styles.img_block}
                                onClick={() =>
                                  Selected_professions[studio.token_id]?.length !== 5
                                    ? handleProffessionsImageClick(index, studio)
                                    : RemoveSelectProffession(index, studio)
                                }
                              >
                                <Grid style={{ position: "absolute", marginLeft: "90px", marginTop: "-10px", zIndex: "1" }}>
                                  {Selected_professions[studio.token_id]?.includes(index) ? (
                                    <img src={"/images/upload_success.png"} width={30} height={30} />
                                  ) : null}
                                </Grid>
                                <img
                                  id={`proffessions_${index}`}
                                  src={image.src}
                                  alt={image.alt}
                                  style={{
                                    width: "120px",
                                    height: "120px",
                                    borderRadius: "20px",
                                    border: "3px solid #8b00b7",
                                    opacity: Selected_professions[studio.token_id]?.includes(index) ? "0.5" : "1",
                                  }}
                                />
                              </Grid>
                            ))}
                          </Grid.Container>
                        </Grid.Container>
                      )}
                    {studio.finished && !studio.inference && (
                      <Grid.Container style={{ paddingTop: "20px", paddingBottom: "20px" }} direction="column">
                        <Grid.Container justify="center" alignItems="center" direction="column">
                          <Grid>
                            <Loading size="xl" type="points" />
                          </Grid>
                          <Grid style={{ marginTop: "40px", textAlign: "center", width: "50%", marginBottom: "20px" }}>
                            <Text css={{ fontFamily: "Ubuntu", letterSpacing: "0.1px", fontSize: "18px", color: "#616161" }}>
                              The studio is <strong>generating the images based on the trained model.</strong> This operation usually takes ~3min
                            </Text>
                          </Grid>
                        </Grid.Container>
                      </Grid.Container>
                    )}
                    {studio.finished && studio.inference && (
                      <Grid.Container style={{ paddingTop: "10px", paddingBottom: "10px" }} direction="column">
                        <Grid.Container justify="center" alignItems="center" direction="column">
                          <Grid style={{ marginTop: "25px", textAlign: "center", width: "50%" }}>
                            {/* <Text css={{ fontFamily : "Ubuntu", letterSpacing : "0.1px", fontSize : "18px", color : "#616161"}} >Your images has been generated successfully</Text> */}
                            <Text h2 css={{ fontWeight: "500", fontFamily: "Ubuntu", fontSize: "25px" }}>
                              Your images has been generated successfully
                            </Text>
                          </Grid>
                          <Grid>
                            <div className={styles.training_overview}>
                              <PreImages key={1} token_id={studio.token_id} />
                            </div>
                          </Grid>
                          <Grid style={{ paddingTop: "20px", paddingBottom: "20px" }}>
                            <Button
                              auto
                              rounded
                              iconRight={<RightArrowIcon width={23} height={23} />}
                              color={"success"}
                              css={{
                                fontFamily: "Ubuntu",
                                boxShadow: "$md",
                                fontSize: "19px",
                                paddingLeft: "25px",
                                paddingRight: "25px",
                                paddingTop: "22px",
                                paddingBottom: "22px",
                                letterSpacing: "0.1px",
                              }}
                              onPress={() => ToGallery(studio)}
                            >
                              View my Studio
                            </Button>
                          </Grid>
                        </Grid.Container>
                      </Grid.Container>
                    )}
                  </div>
                </div>
                // </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FileUpload;
