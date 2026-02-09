import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, IconButton, Box, MenuItem, Menu, TableFooter, Pagination, Typography } from "@mui/material";
import { Add, MoreVert } from "@mui/icons-material";
import type { Product } from "../../types";

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
		<TableContainer component={Paper}>
			<Table
				sx={{ minWidth: 650 }}
				aria-label="products table">
				<TableHead>
					<TableRow>
						<TableCell padding="checkbox">
							<Checkbox
								checked={selectAllChecked}
								onChange={handleSelectAll}
								inputProps={{ "aria-label": "выбрать все продукты" }}
							/>
						</TableCell>
						<TableCell
							onClick={() => handleSort("title")}
							sx={{ cursor: "pointer", fontWeight: "bold" }}>
							<Box sx={{ display: "flex", alignItems: "center" }}>Наименование {getSortIndicator("title")}</Box>
						</TableCell>
						<TableCell
							onClick={() => handleSort("brand")}
							sx={{ cursor: "pointer", fontWeight: "bold" }}>
							<Box sx={{ display: "flex", alignItems: "center" }}>Вендор {getSortIndicator("brand")}</Box>
						</TableCell>
						<TableCell
							onClick={() => handleSort("sku")}
							sx={{ cursor: "pointer", fontWeight: "bold" }}>
							<Box sx={{ display: "flex", alignItems: "center" }}>Артикул {getSortIndicator("sku")}</Box>
						</TableCell>
						<TableCell
							onClick={() => handleSort("rating")}
							sx={{ cursor: "pointer", fontWeight: "bold" }}>
							<Box sx={{ display: "flex", alignItems: "center" }}>Оценка {getSortIndicator("rating")}</Box>
						</TableCell>
						<TableCell
							onClick={() => handleSort("price")}
							sx={{ cursor: "pointer", fontWeight: "bold" }}>
							<Box sx={{ display: "flex", alignItems: "center" }}>Цена {getSortIndicator("price")}</Box>
						</TableCell>
						<TableCell
							onClick={() => handleSort("stock")}
							sx={{ cursor: "pointer", fontWeight: "bold" }}>
							<Box sx={{ display: "flex", alignItems: "center" }}>Количество {getSortIndicator("stock")}</Box>
						</TableCell>
						<TableCell align="right">Действия</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{sortedData.map((product) => (
						<TableRow
							key={product.id}
							sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
							onDoubleClick={() => handleDoubleClick(product)}>
							<TableCell padding="checkbox">
								<Checkbox
									checked={selected.includes(product.id)}
									onChange={() => handleSelect(product.id)}
									inputProps={{ "aria-label": "выбрать продукт" }}
								/>
							</TableCell>
							<TableCell
								component="th"
								scope="row">
								{product.title}
							</TableCell>
							<TableCell>{product.brand}</TableCell>
							<TableCell>{product.sku}</TableCell>
							<TableCell>
								<Box
									component="span"
									sx={{
										color: product.rating < 3 ? "error.main" : "inherit",
										fontWeight: product.rating < 3 ? "bold" : "normal",
									}}>
									{product.rating}
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
									display: "inline-flex", // ← принудительно
								},
							}}
						/>
					</Box>
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
