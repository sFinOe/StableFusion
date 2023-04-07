import React, { useState, useEffect } from 'react';

import { Avatar } from '@nextui-org/react';


function ImageComponent({image, index, ...props}) {
	const [imageData, setImageData] = useState(null);
  
	useEffect(() => {
		let NewPath = image.replace('storage', '/images');
		setImageData(NewPath);
	}, [image]);
  
	return imageData ?     <Avatar
                              key={index}
                              size="xl"
                              pointer
                              src={imageData}
                              bordered
                              color="gradient"
                              stacked
                              /> : null;
  }

export default ImageComponent;