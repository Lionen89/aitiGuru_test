// src/components/ProductList.tsx
import React, { useState, useMemo, useEffect, useRef } from "react";
import { Box, Typography, TextField, Button, CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import type { Product, SortConfig } from "../../types";
import { Add, ArrowDownward, ArrowUpward } from "@mui/icons-material";
import ProductTable from "./ProductTable";
import { productsApi } from "../../services/api";

interface ProductListProps {
	onAddProductClick: () => void;
}

const ProductList: React.FC<ProductListProps> = ({ onAddProductClick }) => {
	const [searchTerm, setSearchTerm] = useState(() => localStorage.getItem("productSearchTerm") || "");
	const [sortConfig, setSortConfig] = useState<SortConfig | null>(() => {
		const saved = localStorage.getItem("productSortConfig");
		return saved ? JSON.parse(saved) : null;
	});
	const [page, setPage] = useState(() => {
		const saved = localStorage.getItem("productPage");
		return saved ? parseInt(saved, 10) : 0;
	});
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

	// Sorting
	const handleSort = (key: keyof Product) => {
		let direction: "asc" | "desc" = "asc";
		if (sortConfig?.key === key && sortConfig.direction === "asc") {
			direction = "desc";
		}
		setSortConfig({ key, direction });
	};

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
				<Typography variant="h6" color="error">
					Ошибка загрузки продуктов: {error instanceof Error ? error.message : "Неизвестная ошибка"}
				</Typography>
			</Box>
		);
	}

	return (
		<Box sx={{ p: 3 }}>
			<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
				<Typography variant="h4">Продукты</Typography>
				<Button variant="contained" startIcon={<Add />} onClick={onAddProductClick} sx={{ ml: 2 }}>
					Добавить продукт
				</Button>
			</Box>

			<Box sx={{ mb: 3 }}>
				<TextField
					fullWidth
					label="Поиск продуктов"
					variant="outlined"
					value={searchTerm}
					onChange={(e) => {
						setSearchTerm(e.target.value);
						setPage(0);
					}}
					placeholder="Поиск по названию продукта, бренду, категории..."
				/>
			</Box>

			{isLoading && (
				<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px" }}>
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
					onPageChange={setPage}
				/>
			)}
		</Box>
	);
};

export default ProductList;