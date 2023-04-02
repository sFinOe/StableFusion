import React, { useState, useEffect } from 'react';
import { PostPreImages } from '_api/studio';

import { Avatar } from '@nextui-org/react';


function PreImages({token_id, index, ...props}) {
	const [imageData, setImageData] = useState([]);
  
	useEffect(() => {
	  const data = {
		token_id : token_id,
	  }
	  PostPreImages(data).then((res) => {
		setImageData(res.body)
	  });
	}, [imageData === null]);
  
	return (
		<Avatar.Group count={5} style={{zIndex : "0"}} >
		{imageData.map((image, index) => {
		  return (
			<div key={index}>
			  <Avatar src={image} size="xl" pointer bordered color="gradient" stacked />
			</div>
		  )
		}
		)}
	  </Avatar.Group>
	)
  }

export default PreImages;