import { Box } from "@mui/material";
import React from "react";

export const ProductThumbnail: React.FC<{ src?: string; alt: string }> = ({ src, alt }) => {
	const [loaded, setLoaded] = React.useState<boolean>(false);
	const [error, setError] = React.useState<boolean>(false);

	if (!src || error || !loaded) {
		return (
			<Box
				sx={{
					minWidth: 48,
					minHeight: 48,
					bgcolor: "#C4C4C4",
					borderRadius: "4px",
				}}
			/>
		);
	}

	return (
		<>
		
			<img
				src={src}
				alt={alt}
				width="48"
				height="48"
				style={{
					objectFit: "cover",
					borderRadius: "4px",
					display: loaded ? "block" : "none",
				}}
				onLoad={() => setLoaded(true)}
				onError={() => setError(true)}
			/>
		</>
	);
};
