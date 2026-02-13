import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import ProductList from "../components/Products/ProductList";
import AddProductForm from "../components/Products/AddProductForm";
import ProductBar from "../components/Products/ProductBar";
import type { SortConfig } from "../types";

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

	useEffect(() => {
		localStorage.setItem("productSearchTerm", searchTerm);
	}, [searchTerm]);

	useEffect(() => {
		localStorage.setItem("productSortConfig", JSON.stringify(sortConfig));
	}, [sortConfig]);

	useEffect(() => {
		localStorage.setItem("productPage", page.toString());
	}, [page]);

	const handleAddProductSuccess = () => {
		setShowAddProduct(false);
	};

	const handleSearchChange = (value: string) => {
		setSearchTerm(value);
		setPage(0);
	}

	return (
		<Box
			component="main"
			sx={{
				background: "#F6F6F6",
				minHeight: "100vh",
				width: "calc(100vw - 15px)",
				padding: "20px 30px 20px 0" ,
			}}>
			<ProductBar
				searchTerm={searchTerm}
				onSearchChange={handleSearchChange}
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
