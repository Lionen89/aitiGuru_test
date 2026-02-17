import { Box, Button } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

interface SimplePaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

export default function SimplePagination({ currentPage, totalPages, onPageChange }: SimplePaginationProps) {
	const getPageNumbers = () => {
		const pages: number[] = [];
		const displayPage: number = currentPage + 1;
		const start: number = Math.max(1, displayPage - 2);
		const end: number = Math.min(totalPages, start + 4);

		for (let i = start; i <= end; i++) {
			pages.push(i);
		}
		return pages;
	};

	const pages: number[] = getPageNumbers();

	return (
		<Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
			<Button
				variant="text"
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage === 0}
				sx={{
					minWidth: "32px",
					height: "32px",
					borderRadius: "5px",
					border: "1px solid #E3DBD8",
					color: currentPage === 0 ? "#CCCCCC" : "#08152E",
					padding: 0,
					"&:hover": {
						bgcolor: "grey.100",
					},
					"&:disabled": {
						color: "#CCCCCC",
					},
          "&:focus": { outline: "none" }
				}}>
				<ChevronLeft />
			</Button>

			{pages.map((page) => (
				<Button
					key={page}
					variant={page === currentPage + 1 ? "contained" : "text"}
					onClick={() => onPageChange(page - 1)}
          disabled={page === currentPage + 1}
					sx={{
						minWidth: "32px",
						height: "32px",
						borderRadius: "5px",
						border: page === currentPage + 1 ? "none" : "1px solid #E3DBD8",
						backgroundColor: page === currentPage + 1 ? "#797FEA" : "transparent",
						color: page === currentPage + 1 ? "#FFFFFF" : "#B2B3B9",
						fontWeight: 700,
						fontSize: "14px",
						padding: "4px 8px",
						"&:disabled": {
							backgroundColor: page === currentPage + 1 ? "#797FEA" : "grey.100",
							color: "#FFFFFF"
						},
            "&:focus": { outline: "none" }
					}}>
					{page}
				</Button>
			))}

			<Button
				variant="text"
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage >= totalPages - 1}
				sx={{
					minWidth: "32px",
					height: "32px",
					borderRadius: "5px",
					border: "1px solid #E3DBD8",
					color: currentPage >= totalPages - 1 ? "#CCCCCC" : "#08152E",
					padding: 0,
					"&:hover": {
						bgcolor: "grey.100",
					},
					"&:disabled": {
						color: "#CCCCCC",
					},
          "&:focus": { outline: "none" }
				}}>
				<ChevronRight />
			</Button>
		</Box>
	);
}
