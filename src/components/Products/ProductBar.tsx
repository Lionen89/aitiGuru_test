import { useState, useEffect } from "react";
import { Search } from "@mui/icons-material";
import { AppBar, Box, IconButton, Toolbar, Typography, TextField, useMediaQuery, useTheme, InputAdornment, Divider } from "@mui/material";
import NotificationIcon from "../NotificationIcon";
import { GlobeIcon } from "../../assets/GlobeIcon.tsx";
import { Settings } from "../../assets/Settings.tsx";
import { MailIcon } from "../../assets/MailIcon.tsx";

interface ProductBarProps {
	searchTerm: string;
	onSearchChange: (value: string) => void;
}

const useDebounce = (value: string, delay: number): string => {
	const [debouncedValue, setDebouncedValue] = useState<string>(value);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return debouncedValue;
};

function ProductBar({ searchTerm, onSearchChange }: ProductBarProps) {
	const theme = useTheme();
	const isMobile: boolean = useMediaQuery(theme.breakpoints.down("sm"));
	const [localSearchTerm, setLocalSearchTerm] = useState<string>(searchTerm);
	const debouncedSearchTerm: string = useDebounce(localSearchTerm, 500);

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
	if (e.key === 'Enter') {
		const searchValue = localSearchTerm.trim();
		onSearchChange(searchValue); 
	}
};

	useEffect(() => {
		const searchValue = debouncedSearchTerm.trim();
		if (searchValue.length >= 2) {
			onSearchChange(searchValue);
		}
	}, [debouncedSearchTerm, onSearchChange]);

	useEffect(() => {
		setLocalSearchTerm(searchTerm);
	}, [searchTerm]);

	const handleSearchChange = (value: string) => {
		setLocalSearchTerm(value);
	};

	return (
		<AppBar
			position="static"
			sx={{
				boxShadow: "none",
				background: "white",
				color: "text.primary",
				padding: "20px 20px 20px 30px",
				borderRadius: "10px",
			}}>
			<Toolbar sx={{ flexDirection: { xs: "column", sm: "row" }, alignItems: "flex-start", gap: 2, padding: "0 !important", minHeight: "unset !important" }}>
				<Box
					sx={{
						display: "flex",
						width: "100%",
						justifyContent: "space-between",
						alignItems: { xs: "flex-start", sm: "center" },
						flexDirection: { xs: "column", sm: "row" },
						gap: 2,
					}}>
					<Typography
						variant="h6"
						component="div"
						sx={{ fontWeight: 900, color: "#202020", fontSize: 24 }}>
						Товары
					</Typography>

					<TextField
						fullWidth
						size={isMobile ? "small" : "medium"}
						variant="outlined"
						value={localSearchTerm}
						onChange={(e) => handleSearchChange(e.target.value)}
						onKeyDown={handleKeyDown} 
						placeholder="Найти"
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<Search sx={{ color: "#999999" }} />
								</InputAdornment>
							),
							sx: {
								background: "#F3F3F3",
								borderRadius: "8px",
								"& fieldset": {
									border: "none",
								},
							},
						}}
						sx={{
							width: "52%",
							borderRadius: "8px",
							"& .MuiOutlinedInput-root": {
								background: "white",
							},
							"& .MuiOutlinedInput-input": {
								padding: "12.5px 20px 12.5px 0",
							},
							"& .MuiInputBase-root": {
								background: "#F3F3F3",
							},
						}}
					/>
					<Divider
						orientation="vertical"
						flexItem
						sx={{ width: "1px", backgroundColor: "#E6E6E6" }}
					/>
					<Box sx={{ display: "flex", gap: "10px" }}>
						<IconButton
							sx={{ color: "#CCCCCC", padding: "10px", "&:focus": { outline: "none" } }}
							aria-label="язык">
							<GlobeIcon />
						</IconButton>
						<IconButton
							sx={{ color: "#CCCCCC", padding: "10px", "&:focus": { outline: "none" } }}
							aria-label="уведомления">
							<NotificationIcon data={true} />
						</IconButton>
						<IconButton
							sx={{ color: "#CCCCCC", padding: "10px", "&:focus": { outline: "none" } }}
							aria-label="сообщения">
							<MailIcon />
						</IconButton>
						<IconButton
							sx={{ color: "#CCCCCC", padding: "10px", "&:focus": { outline: "none" } }}
							aria-label="фильтры">
							<Settings />
						</IconButton>
					</Box>
				</Box>
			</Toolbar>
		</AppBar>
	);
}

export default ProductBar;
