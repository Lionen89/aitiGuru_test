import React, { useState, useMemo, useEffect } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Add, ArrowDownward, ArrowUpward } from "@mui/icons-material";
import ProductTable from "./ProductTable";
import ProductInfoModal from "./ProductInfoModal";
import type { Product, SortConfig } from "../../types";
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

const ProductList: React.FC<ProductListProps> = ({ searchTerm, sortConfig: propSortConfig, page, onSort, onPageChange, onAddProductClick }) => {
	const [localSortConfig, setLocalSortConfig] = useState<SortConfig | null>(propSortConfig);
	const [selected, setSelected] = useState<number[]>([]);
	const [selectAllChecked, setSelectAllChecked] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
	const [modalOpen, setModalOpen] = useState(false);

	useEffect(() => {
		setSelected([]);
		setSelectAllChecked(false);
	}, [searchTerm]);

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

	const handleSort = (key: keyof Product) => {
		let newConfig: SortConfig | null = null;

		if (!localSortConfig || localSortConfig.key !== key) {
			newConfig = { key, direction: "asc" };
		} else if (localSortConfig.direction === "asc") {
			newConfig = { key, direction: "desc" };
		}

		setLocalSortConfig(newConfig);
		onSort(newConfig);
	};

	const activeSortConfig = localSortConfig || propSortConfig;

	const sortedData = useMemo(() => {
		if (!data?.products) return [];
		let items = [...data.products];
		if (activeSortConfig) {
			items.sort((a, b) => {
				if (a[activeSortConfig.key] < b[activeSortConfig.key]) return activeSortConfig.direction === "asc" ? -1 : 1;
				if (a[activeSortConfig.key] > b[activeSortConfig.key]) return activeSortConfig.direction === "asc" ? 1 : -1;
				return 0;
			});
		}
		return items;
	}, [data, activeSortConfig]);

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

	const handleDoubleClick = (product: Product) => {
		setSelectedProduct(product);
		setModalOpen(true);
	};

	const getSortIndicator = (key: keyof Product) => {
		if (!activeSortConfig || activeSortConfig.key !== key) return null;
		return activeSortConfig.direction === "asc" ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />;
	};

	useEffect(() => localStorage.setItem("productSearchTerm", searchTerm), [searchTerm]);
	useEffect(() => localStorage.setItem("productSortConfig", JSON.stringify(activeSortConfig)), [activeSortConfig]);
	useEffect(() => localStorage.setItem("productPage", page.toString()), [page]);

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
		<Box sx={{ pt: 3 }}>
			<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, pl: '30px' }}>
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
				<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "70vh" }}>
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
					handleDoubleClick={handleDoubleClick}
					page={page}
					totalCount={data?.total || 0}
					onPageChange={onPageChange}
				/>
			)}

			<ProductInfoModal
				open={modalOpen}
				onClose={() => setModalOpen(false)}
				product={selectedProduct}
			/>
		</Box>
	);
};

export default ProductList;
