import React, { useState } from "react";
import { useAppDispatch } from "../store";
import { loginSuccess, loginFailure } from "../store/authSlice";
import { authApi } from "../services/api";
import type { LoginRequest } from "../types";
import { Typography, TextField, Button, FormControlLabel, Checkbox, Box, Alert, Link, InputAdornment, IconButton } from "@mui/material";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Visibility, VisibilityOff, Email, Lock, Close } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import logo from "../assets/logo.svg";

// Стилизованная оболочка для формы
const FormContainer = styled(Box)(({ theme }) => ({
	padding: theme.spacing(4),
	borderRadius: 16,
	boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
	width: "100%",
	margin: "0 auto",
}));

// Стилизованная кнопка
const StyledButton = styled(Button)(({ theme }) => ({
	borderRadius: 8,
	padding: theme.spacing(1.5, 2),
	fontWeight: 600,
	textTransform: "none",
	fontSize: "1rem",
	height: 48,
	"&:hover": {
		boxShadow: "0 4px 12px rgba(33, 15, 243, 0.3)",
	},
}));

const Login: React.FC = () => {
	const dispatch = useAppDispatch();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [rememberMe, setRememberMe] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	// Валидация по-прежнему для поля username, но логика — email
	const loginSchema = yup.object({
		username: yup.string().required("Почта обязательна"),
		password: yup.string().required("Пароль обязателен").min(6, "Пароль должен содержать не менее 6 символов"),
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		clearErrors,
	} = useForm<LoginRequest>({
		resolver: yupResolver(loginSchema),
	});

	const onSubmit: SubmitHandler<LoginRequest> = async (data) => {
		setLoading(true);
		setError(null);

		try {
			const userData = await authApi.login(data);
			dispatch(loginSuccess({ user: userData, token: userData.token, rememberMe }));
		} catch (err: any) {
			setError(err.response?.data?.message || "Ошибка входа. Пожалуйста, попробуйте еще раз.");
			dispatch(loginFailure());
		} finally {
			setLoading(false);
		}
	};

	const handleClearField = (field: keyof LoginRequest) => {
		setValue(field, "" as any);
		clearErrors(field);
	};

	return (
		<Box
			component="main"
			sx={{
				maxWidth: "100vw",
				width: "100%",
				height: "100vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: "#F9F9F9",
			}}>
			<Box
				sx={{
					backgroundColor: "#fff",
					padding: "6px",
					width: "527px",
					boxShadow: "0 24px 32px rgba(0, 0, 0, 0.04)",
					borderRadius: "40px",
				}}>
				<FormContainer
					sx={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						backgroundColor: "#f8f9fa",
						gap: "32px",
						borderRadius: "34px",
					}}>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							height: 52,
							backgroundColor: "#fff",
							borderRadius: "50%",
							width: 52,
							margin: "0 auto",
							boxShadow: "inset 0 0 0 1px #fff, 0 0 0 2px #fff, 0 12px 8px 0 rgba(0, 0, 0, 0.03)",
						}}>
						<img
							src={logo}
							alt="Logo"
							width={35}
							height={35}
						/>
					</Box>
					<Box sx={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "center", justifyContent: "center" }}>
						<Typography
							component="h1"
							variant="h5"
							align="center"
							sx={{
								fontWeight: 700,
								fontSize: "40px",
								lineHeight: "110%",
								color: "#232323",
							}}>
							Добро пожаловать!
						</Typography>

						<Typography
							variant="body1"
							align="center"
							sx={{
								color: "#E0E0E0",
								fontSize: "18px",
								lineHeight: "150%",
							}}>
							Пожалуйста, авторизуйтесь
						</Typography>
					</Box>

					<Box
						component="form"
						onSubmit={handleSubmit(onSubmit)}
						noValidate
						sx={{ width: "100%" }}>
						<Box sx={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "center", justifyContent: "center", width: "100%" }}>
							<Box sx={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-start", justifyContent: "flex-start", width: "100%" }}>
								<Typography sx={{ fontSize: "18px", lineHeight: "150%" }}>Почта</Typography>
								<TextField
									required
									fullWidth
									id="username"
									type="email"
									autoComplete="email"
									autoFocus
									{...register("username")}
									error={!!errors.username}
									helperText={errors.username?.message}
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<Email sx={{ color: "#C9C9C9" }} />
											</InputAdornment>
										),
										endAdornment: (
											<InputAdornment position="end">
												<IconButton
													onClick={() => handleClearField("username")}
													edge="end"
													sx={{ color: "#C9C9C9" }}>
													<Close />
												</IconButton>
											</InputAdornment>
										),
									}}
									sx={{
										margin: 0,
										borderRadius: "12px",
										"& .MuiOutlinedInput-root": {
											borderRadius: "12px",
										},
									}}
								/>
							</Box>
							<Box sx={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-start", justifyContent: "flex-start", width: "100%" }}>
								<Typography sx={{ fontSize: "18px", lineHeight: "150%" }}>Пароль</Typography>
								<TextField
									margin="normal"
									required
									fullWidth
									type={showPassword ? "text" : "password"}
									id="password"
									autoComplete="current-password"
									{...register("password")}
									error={!!errors.password}
									helperText={errors.password?.message}
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<Lock sx={{ color: "#C9C9C9" }} />
											</InputAdornment>
										),
										endAdornment: (
											<InputAdornment position="end">
												<IconButton
													aria-label="переключить видимость пароля"
													onClick={() => setShowPassword(!showPassword)}
													edge="end"
													sx={{ color: "#C9C9C9", "&:focus": { outline: "none" } }}>
													{showPassword ? <VisibilityOff /> : <Visibility />}
												</IconButton>
											</InputAdornment>
										),
									}}
									sx={{
										margin: 0,
										borderRadius: "12px",
										"& .MuiOutlinedInput-root": {
											borderRadius: "12px",
										},
									}}
								/>
							</Box>
						</Box>
						{error && (
							<Alert
								severity="error"
								sx={{
									mb: 2,
									borderRadius: 8,
									backgroundColor: "#FFEBEE",
									color: "#B71C1C",
								}}>
								{error}
							</Alert>
						)}

						<FormControlLabel
							control={
								<Checkbox
									checked={rememberMe}
									onChange={(e) => setRememberMe(e.target.checked)}
									color="primary"
									sx={{
										padding: 0,
										color: "#9C9C9C",
										mr: "10px",
										"& .MuiSvgIcon-root": {
											fontSize: 24,
										},
									}}
								/>
							}
							label="Запомнить данные"
							sx={{
								textAlign: "left",
								width: "100%",
								margin: "20px 0",
								"& .MuiFormControlLabel-label": {
									fontSize: "16px",
									fontWeight: "medium",
									lineHeight: "150%",
									color: "#9C9C9C",
								},
							}}
						/>

						<StyledButton
							type="submit"
							fullWidth
							variant="contained"
							sx={{
								backgroundColor: "#242EDB",
								"&:hover": {
									backgroundColor: "#242EDB",
								},
							}}
							disabled={loading}>
							{loading ? "Выполняется вход..." : "Войти"}
						</StyledButton>

						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								mb: 2,
								color: "#9E9E9E",
								fontSize: "0.875rem",
							}}>
							<Box sx={{ height: 1, width: "40%", bgcolor: "#E0E0E0" }} />
							<Box sx={{ px: 2 }}>или</Box>
							<Box sx={{ height: 1, width: "40%", bgcolor: "#E0E0E0" }} />
						</Box>

						<Typography
							variant="body2"
							align="center"
							sx={{
								color: "#616161",
								fontSize: "0.9rem",
							}}>
							Нет аккаунта?{" "}
							<Link
								href="/register"
								variant="body2"
								sx={{
									fontWeight: 600,
									color: "#2196F3",
									textDecoration: "none",
									"&:hover": {
										textDecoration: "underline",
									},
								}}>
								Создать
							</Link>
						</Typography>

						<Box sx={{ mt: 3, textAlign: "center" }}>
							<Typography
								variant="body2"
								color="text.secondary"
								sx={{ fontSize: "0.85rem" }}>
								Демо учетные данные:
								<br />
								email: emilys, пароль: emilyspass
							</Typography>
						</Box>
					</Box>
				</FormContainer>
			</Box>
		</Box>
	);
};

export default Login;
