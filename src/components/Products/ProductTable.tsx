import React, { useEffect, useRef } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, IconButton, Box, MenuItem, Menu, Typography, TableFooter } from "@mui/material";
import { Add, MoreVert } from "@mui/icons-material";
import type { Product, ContextMenuState } from "../../types";
import { ProductThumbnail } from "./ProductThumbnail";
import { StockIndicator } from "./StockIndicator";
import SimplePagination from "./SimplePagination";

interface ProductTableProps {
	sortedData: Product[];
	selected: number[];
	selectAllChecked: boolean;
	handleSelect: (id: number) => void;
	handleSelectAll: () => void;
	handleSort: (key: keyof Product) => void;
	getSortIndicator: (key: keyof Product) => React.ReactNode | null;
	handleDoubleClick: (product: Product) => void;
	page: number;
	totalCount: number;
	onPageChange: (newPage: number) => void;
}
const MAX_RAITING = 5;

const ProductTable: React.FC<ProductTableProps> = ({ sortedData, selected, selectAllChecked, handleSelect, handleSelectAll, handleSort, getSortIndicator, handleDoubleClick, page, totalCount, onPageChange }) => {
	const menuRef = useRef<HTMLDivElement>(null);

	const [contextMenu, setContextMenu] = React.useState<ContextMenuState>({ mouseX: 0, mouseY: 0, product: null });

	const handleCloseContextMenu = () => {
		setContextMenu({ mouseX: 0, mouseY: 0, product: null });
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				handleCloseContextMenu();
			}
		};

		document.addEventListener("click", handleClickOutside);
		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, []);

	const handleEditProduct = () => {
		handleCloseContextMenu();
	};

	const handleDeleteProduct = () => {
		handleCloseContextMenu();
	};

	return (
		<TableContainer
			component={Paper}
			sx={{ border: "none", boxShadow: "none", pl: "30px" }}>
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
							<Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#B2B3B9", fontSize: "16px" }}>Наименование {getSortIndicator("title")}</Box>
						</TableCell>
						<TableCell
							onClick={() => handleSort("brand")}
							sx={{ cursor: "pointer", fontWeight: "bold" }}>
							<Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#B2B3B9", fontSize: "16px", justifyContent: "center" }}>Вендор {getSortIndicator("brand")}</Box>
						</TableCell>
						<TableCell
							onClick={() => handleSort("sku")}
							sx={{ cursor: "pointer", fontWeight: "bold" }}>
							<Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#B2B3B9", fontSize: "16px", justifyContent: "center" }}>Артикул {getSortIndicator("sku")}</Box>
						</TableCell>
						<TableCell
							onClick={() => handleSort("rating")}
							sx={{ cursor: "pointer", fontWeight: "bold" }}>
							<Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#B2B3B9", fontSize: "16px", justifyContent: "center" }}>Оценка {getSortIndicator("rating")}</Box>
						</TableCell>
						<TableCell
							onClick={() => handleSort("price")}
							sx={{ cursor: "pointer", fontWeight: "bold" }}>
							<Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#B2B3B9", fontSize: "16px", justifyContent: "center" }}>Цена, ₽ {getSortIndicator("price")}</Box>
						</TableCell>
						<TableCell
							onClick={() => handleSort("stock")}
							sx={{ cursor: "pointer", fontWeight: "bold" }}>
							<Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#B2B3B9", fontSize: "16px", justifyContent: "center" }}>Количество {getSortIndicator("stock")}</Box>
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
										color="#161919"
										fontWeight={"bold"}
										fontSize={16}>
										{product?.title}
									</Typography>
									<Typography
										variant="body2"
										color="#B2B3B9"
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
							<TableCell sx={{ fontWeight: "bold", color: "#000000", fontSize: "16px", fontFamily: "Open Sans" }}>
								<Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>{product.brand}</Box>
							</TableCell>
							<TableCell sx={{ fcolor: "#000000", fontSize: "16px", fontFamily: "Open Sans" }}>
								<Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>{product.sku}</Box>
							</TableCell>
							<TableCell>
								<Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
									<Typography
										variant="body2"
										sx={{
											color: product.rating < 3 ? "#F11010" : "inherit",
											fontWeight: "normal",
											fontFamily: "Open Sans",
										}}>
										{product.rating}
									</Typography>
									/ {MAX_RAITING}
								</Box>
							</TableCell>
							<TableCell>
								<Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Roboto Mono", fontSize: "16px", whiteSpace: "nowrap" }}>
									{(() => {
										const fixed = product.price.toFixed(2);
										const [rublesStr, kopecks] = fixed.split(".");
										const rubles = rublesStr.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
										return (
											<>
												{rubles}
												<Typography sx={{ color: "#B2B3B9", fontFamily: "Roboto Mono", fontSize: "16px" }}>,{kopecks}</Typography>
											</>
										);
									})()}
								</Box>
							</TableCell>
							<TableCell>
								<Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
									<StockIndicator value={product.stock} />
								</Box>
							</TableCell>
							<TableCell align="right">
								<Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", flexWrap: "nowrap", gap: "32px" }}>
									<IconButton
										aria-label="add"
										sx={{ width: "57px", height: "27px", bgcolor: "#242EDB", borderRadius: "23px", "&:focus": { outline: "none" }, "&:hover": { bgcolor: "#242EDB", opacity: 0.8 } }}>
										<Add sx={{ color: "#fff" }} />
									</IconButton>
									<IconButton
										aria-label="more options"
										onClick={(e) => {
											setContextMenu({
												mouseX: e.clientX + 2,
												mouseY: e.clientY - 6,
												product,
											});
										}}
										sx={{ transform: "rotate(90deg)", color: "#B2B3B9", width: "32px", height: "32px", "&:focus": { outline: "none" } }}>
										<MoreVert sx={{ border: "1px solid #B2B3B9", borderRadius: "50%" }} />
									</IconButton>
								</Box>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
				<TableFooter>
					<TableRow>
						<TableCell
							colSpan={100}
							sx={{ borderBottom: "none", padding: "16px 16px 11px" }}>
							<Box
								sx={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									mt: "24px",
									mb: "30px",
									flexWrap: "nowrap",
									whiteSpace: "nowrap",
									minWidth: 0,
								}}>
								<Typography
									variant="body2"
									sx={{ fontSize: "18px", flexShrink: 1, color: "#969B9F" }}>
									Показано{" "}
									<Typography
										component="span"
										color="#333333">
										{page * 20 + 1}-{Math.min((page + 1) * 20, totalCount)}
									</Typography>{" "}
									из{" "}
									<Typography
										component="span"
										color="#333333">
										{totalCount}
									</Typography>
								</Typography>

								<SimplePagination
									currentPage={page}
									totalPages={Math.ceil(totalCount / 20)}
									onPageChange={(page) => onPageChange(page)}
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
				<MenuItem
					onClick={handleDeleteProduct}
					sx={{ color: "error.main" }}>
					Удалить
				</MenuItem>
			</Menu>
		</TableContainer>
	);
};

export default ProductTable;
