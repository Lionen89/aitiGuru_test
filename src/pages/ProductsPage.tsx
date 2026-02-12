import React, { useState, useEffect } from "react";
import { useAppDispatch } from "../store";
import { Box } from "@mui/material";
import { logout } from "../store/authSlice";
import ProductList from "../components/Products/ProductList";
import AddProductForm from "../components/Products/AddProductForm";
import ProductBar from "../components/Products/ProductBar";
import type { Product, SortConfig } from "../types";

const ProductsPage: React.FC = () => {
	const [searchTerm, setSearchTerm] = useState(() => localStorage.getItem("productSearchTerm") || "");
	const [sortConfig, setSortConfig] = useState<SortConfig | null>(() => {
		const saved = localStorage.getItem("productSortConfig");
		return saved ? JSON.parse(saved) : null;
	});
	const [page, setPage] = useState(() => {
		const saved = localStorage.getItem("productPage");
		return saved ? parseInt(saved, 10) : 0;
	});
	const [showAddProduct, setShowAddProduct] = useState(false);

	const dispatch = useAppDispatch();

	// Сохранение состояний в localStorage
	useEffect(() => {
		localStorage.setItem("productSearchTerm", searchTerm);
	}, [searchTerm]);

	useEffect(() => {
		localStorage.setItem("productSortConfig", JSON.stringify(sortConfig));
	}, [sortConfig]);

	useEffect(() => {
		localStorage.setItem("productPage", page.toString());
	}, [page]);

	const handleAddProductSuccess = (product: Product) => {
		console.log("Продукт успешно добавлен:", product);
		setShowAddProduct(false);
	};

	const handleSearchChange = (value: string) => {
		setSearchTerm(value);
		setPage(0); // Сброс пагинации при новом поиске
	};

	const handleLogout = () => {
		dispatch(logout());
	};

	return (
		<Box
			component="main"
			sx={{
				background: "#F6F6F6",
				minHeight: "100vh",
				minWidth: "100vw",
				padding: { xs: "16px", sm: "20px 30px 20px 0" },
			}}>
			<ProductBar
				searchTerm={searchTerm}
				onSearchChange={handleSearchChange}
				onLogout={handleLogout}
			/>

			<ProductList
				searchTerm={searchTerm}
				sortConfig={sortConfig}
				page={page}
				onSort={setSortConfig}
				onPageChange={setPage}
				onAddProductClick={() => setShowAddProduct(true)}
			/>

			<AddProductForm
				open={showAddProduct}
				onClose={() => setShowAddProduct(false)}
				onSuccess={handleAddProductSuccess}
			/>
		</Box>
	);
};

export default ProductsPage;
