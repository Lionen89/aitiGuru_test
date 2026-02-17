import React, { useState } from "react";
import { Box, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Alert, Snackbar, Alert as MuiAlert } from "@mui/material";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { productsApi } from "../../services/api";
import type { Product, AddProductFormData } from "../../types";

interface AddProductFormProps {
	open: boolean;
	onClose: () => void;
	onSuccess: (product: Product) => void;
}

const schema = yup.object({
	title: yup.string().required("Наименование обязательно"),
	price: yup.number().required("Цена обязательна").positive("Цена должна быть положительной").typeError("Цена должна быть числом"),
	brand: yup.string().required("Вендор обязателен"),
	sku: yup.string().required("Артикул обязателен"),
	description: yup.string().optional(),
	category: yup.string().optional(),
	stock: yup.number().integer("Количество должно быть целым числом").min(0, "Количество не может быть отрицательным").typeError("Количество должно быть числом").optional(),
	rating: yup.number().min(0, "Оценка должна быть между 0 и 5").max(5, "Оценка должна быть между 0 и 5").typeError("Оценка должна быть числом").optional(),
	weight: yup.number().positive("Вес должен быть положительным").typeError("Вес должен быть числом").optional(),
});

const AddProductForm: React.FC<AddProductFormProps> = ({ open, onClose, onSuccess }) => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
	const [snackbarMessage, setSnackbarMessage] = useState<string>("");
	const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "info" | "warning">("success");

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<AddProductFormData>({
		resolver: yupResolver(schema) as any,
	});

	const onSubmit: SubmitHandler<AddProductFormData> = async (data: AddProductFormData) => {
		setLoading(true);
		setError(null);

		try {
			const productData = {
				...data,
				description: data.description || "",
				category: data.category || "General",
				stock: data.stock || 0,
				rating: data.rating || 0,
				weight: data.weight || 1,
				thumbnail: "https://via.placeholder.com/150",
				images: ["https://via.placeholder.com/150"],
				tags: ["general"],
				availabilityStatus: "In Stock",
				dimensions: {
					width: 10,
					height: 10,
					depth: 10,
				},
				warrantyInformation: "6 months warranty",
				shippingInformation: "Ships in 2 business days",
				reviews: [],
				discountPercentage: 0,
				minimumOrderQuantity: 1,
				meta: {
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
					barcode: `BAR${Math.floor(Math.random() * 1000000)}`,
					qrCode: `QR${Math.floor(Math.random() * 1000000)}`,
				},
			};

			const newProduct = await productsApi.addProduct(productData);

			setSnackbarMessage(`Продукт "${newProduct.title}" успешно добавлен!`);
			setSnackbarSeverity("success");
			setSnackbarOpen(true);

			reset();
			onSuccess(newProduct);
			onClose();
		} catch (err: any) {
			setError(err.message || "Не удалось добавить продукт. Пожалуйста, попробуйте еще раз.");

			setSnackbarMessage(err.message || "Не удалось добавить продукт. Пожалуйста, попробуйте еще раз.");
			setSnackbarSeverity("error");
			setSnackbarOpen(true);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<Dialog
				open={open}
				onClose={onClose}
				maxWidth="sm"
				fullWidth>
				<DialogTitle>Добавить новый продукт</DialogTitle>

				<DialogContent dividers>
					{error && (
						<Alert severity="error" sx={{ mb: 2 }}>
							{error}
						</Alert>
					)}

					<Box component="form" noValidate sx={{ mt: 1, display: "flex", flexDirection: "column", gap: "16px" }}>
						<TextField
							fullWidth
							label="Наименование"
							variant="outlined"
							{...register("title")}
							error={!!errors.title}
							helperText={errors.title?.message}
						/>

						<TextField
							fullWidth
							label="Цена"
							type="number"
							variant="outlined"
							{...register("price", { valueAsNumber: true })}
							error={!!errors.price}
							helperText={errors.price?.message}
						/>

						<TextField
							fullWidth
							label="Вендор"
							variant="outlined"
							{...register("brand")}
							error={!!errors.brand}
							helperText={errors.brand?.message}
						/>

						<TextField
							fullWidth
							label="Артикул"
							variant="outlined"
							{...register("sku")}
							error={!!errors.sku}
							helperText={errors.sku?.message}
						/>

						<TextField
							fullWidth
							label="Описание"
							variant="outlined"
							multiline
							rows={3}
							{...register("description")}
							error={!!errors.description}
							helperText={errors.description?.message}
						/>

						<TextField
							fullWidth
							label="Категория"
							variant="outlined"
							{...register("category")}
							error={!!errors.category}
							helperText={errors.category?.message}
						/>

						<TextField
							fullWidth
							label="Количество на складе"
							type="number"
							variant="outlined"
							{...register("stock", { valueAsNumber: true })}
							error={!!errors.stock}
							helperText={errors.stock?.message}
						/>

						<TextField
							fullWidth
							label="Оценка (0-5)"
							type="number"
							variant="outlined"
							inputProps={{ min: 0, max: 5, step: 0.1 }}
							{...register("rating", { valueAsNumber: true })}
							error={!!errors.rating}
							helperText={errors.rating?.message}
						/>

						<TextField
							fullWidth
							label="Вес"
							type="number"
							variant="outlined"
							{...register("weight", { valueAsNumber: true })}
							error={!!errors.weight}
							helperText={errors.weight?.message}
						/>
					</Box>
				</DialogContent>

				<DialogActions>
					<Button onClick={onClose}>Отмена</Button>
					<Button
						type="submit"
						variant="contained"
						onClick={handleSubmit(onSubmit)}
						disabled={loading}>
						{loading ? "Добавление..." : "Добавить продукт"}
					</Button>
				</DialogActions>
			</Dialog>
			<Snackbar
				open={snackbarOpen}
				autoHideDuration={6000}
				onClose={() => setSnackbarOpen(false)}
				anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
				<MuiAlert
					onClose={() => setSnackbarOpen(false)}
					severity={snackbarSeverity}
					variant="filled"
					sx={{ width: "100%" }}>
					{snackbarMessage}
				</MuiAlert>
			</Snackbar>
		</>
	);
};

export default AddProductForm;