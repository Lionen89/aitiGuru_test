import { Box, Tooltip } from "@mui/material";

interface StockIndicatorProps {
	value: number;
}

export const StockIndicator = ({ value }: StockIndicatorProps) => {
	const getBarColor = (index: number): string => {
		if (value < 3) {
			return index === 2 ? "#dd6565" : "#D8D8D8";
		}
		if (value < 46) {
			return index === 2 ? "#949494" : "#D8D8D8";
		}
		if (value < 90) {
			return index > 0 ? "#949494" : "#D8D8D8";
		}
		return "#949494";
	};

	return (
		<Tooltip
			title={`Остаток: ${value}`}
			arrow>
			<Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
				{[0, 1, 2].map((i) => (
					<Box
						key={i}
						sx={{
							width: "6px",
							height: "24px",
							borderRadius: "6px",
							backgroundColor: getBarColor(i),
						}}
					/>
				))}
			</Box>
		</Tooltip>
	);
};
