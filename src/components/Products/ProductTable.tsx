import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, IconButton, Box, MenuItem, Menu, TableFooter, Pagination, Typography } from "@mui/material";
import { Add, MoreVert } from "@mui/icons-material";
import type { Product, SortConfig } from "../../types";
import { ProductThumbnail } from "./ProductThumbnail";

interface ProductTableProps {
	sortedData: Product[];
	selected: number[];
	selectAllChecked: boolean;
	handleSelect: (id: number) => void;
	handleSelectAll: () => void;
	handleSort: (key: keyof Product) => void;
	getSortIndicator: (key: keyof Product) => React.ReactNode | null;
	handleContextMenu: (event: React.MouseEvent, product: Product) => void;
	handleDoubleClick: (product: Product) => void;
	page: number;
	totalCount: number;
	onPageChange: (newPage: number) => void;
}
const MAX_RAITING = 5;

const ProductTable: React.FC<ProductTableProps> = ({ sortedData, selected, selectAllChecked, handleSelect, handleSelectAll, handleSort, getSortIndicator, handleContextMenu, handleDoubleClick, page, totalCount, onPageChange }) => {
	const [contextMenu, setContextMenu] = React.useState<{
		mouseX: number;
		mouseY: number;
		product: Product | null;
	}>({ mouseX: 0, mouseY: 0, product: null });

	const handleCloseContextMenu = () => {
		setContextMenu({ mouseX: 0, mouseY: 0, product: null });
	};

	const handleEditProduct = () => {
		if (contextMenu.product) {
			console.log("Edit product:", contextMenu.product);
			// Открыть диалог редактирования
		}
		handleCloseContextMenu();
	};

	return (
		<TableContainer
			component={Paper}
			sx={{ border: "none", boxShadow: "none" }}>
			<Table
				sx={{ minWidth: 650 }}
				aria-label="products table">
				<TableHead>
					<TableRow>
						<TableCell padding="checkbox">
							<Checkbox
								icon={<Box sx={{ backgroundColor: "#fff", width: "22px", height: "22px", borderRadius: "4px", border: "1px solid #CCCCCC" }}></Box>}
								checked={selectAllChecked}
								onChange={handleSelectAll}
								inputProps={{ "aria-label": "выбрать все продукты" }}
								checkedIcon={<Box sx={{ backgroundColor: "#3C538E", width: "22px", height: "22px", borderRadius: "4px", border: "1px solid #CCCCCC" }}></Box>}
							/>
						</TableCell>
						<TableCell
							onClick={() => handleSort("title")}
							sx={{ cursor: "pointer", fontWeight: "bold" }}>
							<Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#E0E0E0" }}>Наименование {getSortIndicator("title")}</Box>
						</TableCell>
						<TableCell
							onClick={() => handleSort("brand")}
							sx={{ cursor: "pointer", fontWeight: "bold" }}>
							<Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#E0E0E0" }}>Вендор {getSortIndicator("brand")}</Box>
						</TableCell>
						<TableCell
							onClick={() => handleSort("sku")}
							sx={{ cursor: "pointer", fontWeight: "bold" }}>
							<Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#E0E0E0" }}>Артикул {getSortIndicator("sku")}</Box>
						</TableCell>
						<TableCell
							onClick={() => handleSort("rating")}
							sx={{ cursor: "pointer", fontWeight: "bold" }}>
							<Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#E0E0E0" }}>Оценка {getSortIndicator("rating")}</Box>
						</TableCell>
						<TableCell
							onClick={() => handleSort("price")}
							sx={{ cursor: "pointer", fontWeight: "bold" }}>
							<Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#E0E0E0" }}>Цена {getSortIndicator("price")}</Box>
						</TableCell>
						<TableCell
							onClick={() => handleSort("stock")}
							sx={{ cursor: "pointer", fontWeight: "bold" }}>
							<Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#E0E0E0" }}>Количество {getSortIndicator("stock")}</Box>
						</TableCell>
						<TableCell align="right"></TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{sortedData.map((product) => (
						<TableRow
							key={product.id}
							sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
							onDoubleClick={() => handleDoubleClick(product)}>
							<TableCell
								padding="checkbox"
								sx={{ borderLeft: selected.includes(product.id) ? "5px solid #3C538E" : "5px solid #fff " }}>
								<Checkbox
									icon={<Box sx={{ backgroundColor: "#fff", width: "22px", height: "22px", borderRadius: "4px", border: "1px solid #CCCCCC" }}></Box>}
									checked={selected.includes(product.id)}
									onChange={() => handleSelect(product.id)}
									inputProps={{ "aria-label": "выбрать продукт" }}
									checkedIcon={<Box sx={{ backgroundColor: "#3C538E", width: "22px", height: "22px", borderRadius: "4px", border: "1px solid #CCCCCC" }}></Box>}
									sx={{
										color: "#F5F5F5",
										"& input": {
											borderRadius: "4px",
										},
									}}
								/>
							</TableCell>
							<TableCell
								component="th"
								scope="row"
								sx={{ display: "flex", alignItems: "center", height: "auto", gap: "8px" }}>
								<ProductThumbnail
									src={product.thumbnail}
									alt={product.title}
								/>
								<Box>
									<Typography
										variant="h6"
										color="black"
										fontSize={16}>
										{product?.title}
									</Typography>
									<Typography
										variant="body2"
										color="#E0E0E0"
										fontSize={14}
										sx={{
											display: "inline-block",
											"&::first-letter": {
												textTransform: "uppercase",
											},
										}}>
										{product?.category}
									</Typography>
								</Box>
							</TableCell>
							<TableCell>{product.brand}</TableCell>
							<TableCell>{product.sku}</TableCell>
							<TableCell>
								<Box sx={{ display: "flex", alignItems: "center" }}>
									<Typography
										variant="body2"
										sx={{
											color: product.rating < 3 ? "#F11010" : "inherit",
											fontWeight: "normal",
										}}>
										{product.rating}
									</Typography>
									/ {MAX_RAITING}
								</Box>
							</TableCell>
							<TableCell>${product.price.toFixed(2)}</TableCell>
							<TableCell>{product.stock}</TableCell>
							<TableCell align="right">
								<IconButton aria-label="add">
									<Add />
								</IconButton>
								<IconButton
									aria-label="more options"
									onClick={(e) => handleContextMenu(e, product)}>
									<MoreVert />
								</IconButton>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
				<TableFooter>
					<TableRow>
						<TableCell
							colSpan={100}
							sx={{ borderBottom: "none" }}>
							<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2, px: 2 }}>
								<Typography
									variant="body2"
									color="text.secondary">
									{page * 20 + 1}–{Math.min((page + 1) * 20, totalCount)} из {totalCount}
								</Typography>
								<Pagination
									count={Math.ceil(totalCount / 20)}
									page={page + 1}
									onChange={(_, newPage) => onPageChange(newPage - 1)}
									color="primary"
									sx={{
										"& .MuiPaginationItem-root": {
											display: "inline-flex",
										},
									}}
								/>
							</Box>
						</TableCell>
					</TableRow>
				</TableFooter>
			</Table>

			<Menu
				open={contextMenu.mouseY !== 0}
				onClose={handleCloseContextMenu}
				anchorReference="anchorPosition"
				anchorPosition={contextMenu.mouseY !== 0 && contextMenu.mouseX !== 0 ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined}
				onClick={handleCloseContextMenu}>
				<MenuItem onClick={handleEditProduct}>Редактировать</MenuItem>
			</Menu>
		</TableContainer>
	);
};

export default ProductTable;
