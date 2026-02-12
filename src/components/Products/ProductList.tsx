// src/components/ProductList.tsx
import React, { useState, useMemo, useEffect, useRef } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import type { Product, SortConfig } from "../../types";
import { Add, ArrowDownward, ArrowUpward } from "@mui/icons-material";
import ProductTable from "./ProductTable";
import { productsApi } from "../../services/api";
import { FilterIcon } from "../../assets/FilterIcon.tsx";
import { RefreshtIcon } from "../../assets/RefreshtIcon.tsx";

interface ProductListProps {
	searchTerm: string;
	sortConfig: SortConfig | null;
	page: number;
	onSort: (config: SortConfig | null) => void;
	onPageChange: (page: number) => void;
	onAddProductClick: () => void;
}

const ProductList: React.FC<ProductListProps> = ({ searchTerm, sortConfig, page, onSort, onPageChange, onAddProductClick }) => {
	const [selected, setSelected] = useState<number[]>([]);
	const [selectAllChecked, setSelectAllChecked] = useState(false);

	const doubleClickTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

	// Fetch products
	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["products", searchTerm, page],
		queryFn: () => {
			if (searchTerm) {
				return productsApi.searchProducts(searchTerm, 20, page * 20);
			}
			return productsApi.getProducts(20, page * 20);
		},
		staleTime: 5 * 60 * 1000,
	});

	const sortedData = useMemo(() => {
		if (!data?.products) return [];
		let items = [...data.products];
		if (sortConfig) {
			items.sort((a, b) => {
				if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
				if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
				return 0;
			});
		}
		return items;
	}, [data, sortConfig]);

	// Selection
	const handleSelect = (id: number) => {
		setSelected((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
	};

	const handleSort = (key: keyof Product) => {
		if (!sortConfig || sortConfig.key !== key) {
			onSort({ key, direction: "asc" });
		} else if (sortConfig.direction === "asc") {
			onSort({ key, direction: "desc" });
		} else {
			onSort(null);
		}
	};

	const handleSelectAll = () => {
		if (selectAllChecked) {
			setSelected([]);
		} else {
			setSelected(sortedData.map((p) => p.id));
		}
		setSelectAllChecked(!selectAllChecked);
	};

	useEffect(() => {
		setSelectAllChecked(sortedData.length > 0 && sortedData.length === selected.length);
	}, [selected, sortedData]);

	// Double click handler
	const handleDoubleClick = (product: Product) => {
		if (doubleClickTimeout.current) {
			clearTimeout(doubleClickTimeout.current);
			doubleClickTimeout.current = null;
			console.log("Double-click edit:", product);
			// Здесь можно открыть форму редактирования
		} else {
			doubleClickTimeout.current = setTimeout(() => {
				doubleClickTimeout.current = null;
			}, 300);
		}
	};

	// Context menu
	const handleContextMenu = (event: React.MouseEvent) => {
		event.preventDefault();
		// В ProductTable обрабатывается отдельно
	};

	// Get sort indicator
	const getSortIndicator = (key: keyof Product) => {
		if (!sortConfig || sortConfig.key !== key) return null;
		return sortConfig.direction === "asc" ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />;
	};

	// Save to localStorage
	useEffect(() => localStorage.setItem("productSearchTerm", searchTerm), [searchTerm]);
	useEffect(() => localStorage.setItem("productSortConfig", JSON.stringify(sortConfig)), [sortConfig]);
	useEffect(() => localStorage.setItem("productPage", page.toString()), [page]);

	// Error handling
	if (isError) {
		return (
			<Box sx={{ p: 3 }}>
				<Typography
					variant="h6"
					color="error">
					Ошибка загрузки продуктов: {error instanceof Error ? error.message : "Неизвестная ошибка"}
				</Typography>
			</Box>
		);
	}

	return (
		<Box sx={{ mt: 3, p: 3, borderRadius: "12px", background: "white" }}>
			<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
				<Typography
					variant="h4"
					sx={{ fontSize: 20, fontWeight: 700, color: "#333333" }}>
					Все позиции
				</Typography>
				<Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "8px" }}>
					<Button sx={{ width: "42px", minWidth: "unset", height: "42px", border: "1px solid #ECECEB", padding: 0, borderRadius: "8px", "&:focus": { outline: "none" } }}>
						<RefreshtIcon />
					</Button>
					<Button sx={{ width: "42px", minWidth: "unset", height: "42px", border: "1px solid #ECECEB", padding: 0, borderRadius: "8px", "&:focus": { outline: "none" } }}>
						<FilterIcon />
					</Button>
					<Button
						variant="contained"
						startIcon={
							<Box
								sx={{
									borderRadius: "50%",
									color: "#FFFFFF",
									border: "1px solid #FFFFFF",
									height: "22px",
									width: "22px",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
								}}>
								<Add fontSize="small" />
							</Box>
						}
						onClick={onAddProductClick}
						sx={{
							fontSize: 14,
							fontWeight: 600,
							textTransform: "none",
							"&:focus": { outline: "none" },
							"& .MuiButton-startIcon": { mr: "15px" },
							padding: "10px 20px",
							borderRadius: "6px",
						}}>
						Добавить
					</Button>
				</Box>
			</Box>

			{isLoading && (
				<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
					<CircularProgress />
				</Box>
			)}

			{!isLoading && (
				<ProductTable
					sortedData={sortedData}
					selected={selected}
					selectAllChecked={selectAllChecked}
					handleSelect={handleSelect}
					handleSelectAll={handleSelectAll}
					handleSort={handleSort}
					getSortIndicator={getSortIndicator}
					handleContextMenu={handleContextMenu}
					handleDoubleClick={handleDoubleClick}
					page={page}
					totalCount={data?.total || 0}
					onPageChange={onPageChange}
				/>
			)}
		</Box>
	);
};

export default ProductList;
