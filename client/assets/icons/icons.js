import React from 'react';

import gallery from './gallery.svg';
import upload from './upload_icon.svg';
import valid from './valid_studio.svg';
import lightning from './lightning.svg';
import right_arrow from './right_arrow.svg';
import download_icon from './download_icon.svg';
import delete_icon from './delete_icon.svg';
import generate_icon from './generate_icon.svg';

export const GalleryIcon = ({...props}) => {
	return (
		<img src={gallery} alt="gallery" {...props}/>
	);
};

export const UploadIcon = ({...props}) => {
	return (
		<img src={upload} alt="upload" {...props}/>
	);
};

export const ValidIcon = ({...props}) => {
	return (
		<img src={valid} alt="upload" {...props}/>
	);
};

export const LightningIcon = ({...props}) => {
	return (
		<img src={lightning} alt="start" {...props}/>
	);
};

export const RightArrowIcon = ({...props}) => {
	return (
		<img src={right_arrow} alt="start" {...props}/>
	);
}

export const DownloadIcon = ({...props}) => {
	return (
		<img src={download_icon} alt="start" {...props}/>
	);
}

export const DeleteIcon = ({...props}) => {
	return (
		<img src={delete_icon} alt="start" {...props}/>
	);
}


export const GenerateIcon = ({...props}) => {
	return (
		<img src={generate_icon} alt="start" {...props}/>
	);
}




