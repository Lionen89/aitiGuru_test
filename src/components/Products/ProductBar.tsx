import { Search } from "@mui/icons-material";
import { AppBar, Box, IconButton, Toolbar, Typography, TextField, useMediaQuery, useTheme, InputAdornment, Divider } from "@mui/material";
import NotificationIcon from "../NotificationIcon";
import { GlobeIcon } from "../../assets/GlobeIcon.tsx";
import { Settings } from "../../assets/Settings.tsx";
import { MailIcon } from "../../assets/MailIcon.tsx";

interface ProductBarProps {
	searchTerm: string;
	onSearchChange: (value: string) => void;
	onLogout: () => void;
}

function ProductBar({ searchTerm, onSearchChange, onLogout }: ProductBarProps) {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
						value={searchTerm}
						onChange={(e) => onSearchChange(e.target.value)}
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
