
import React from "react";


export function formatTime(timestamp) {

	const date = new Date(timestamp);
	const hour = date.getHours();
	const minute = date.getMinutes();
	const ampm = hour >= 12 ? "PM" : "AM";
	const formattedTime = `Today At ${hour % 12}:${minute < 10 ? '0' + minute : minute} ${ampm}`;
	return formattedTime;
  }
  

