import { useEffect, useState } from "react";

import {
	AppBar,
	Box,
	Container,
	IconButton,
	InputAdornment,
	TextField,
	Toolbar,
	Typography,
	Button,
	Paper,
} from "@mui/material";
import { useRouter } from "next/router";
import { FaChevronDown } from "react-icons/fa";

import Drawer from "./Drawer";
import Link from "../common/Link";
import Logo from "../common/Logo";
import { NAV_ITEMS } from "@/src/constants/nav";
import { NavItem, NavLink, Submenu, SubmenuDropDown, SubmenuItem } from "@/src/utils/header";
import getIcon from "@/src/utils/icon";

/**
 * Header component displaying the site header with navigation links and logo.
 *
 * @returns {JSX.Element} The rendered Header component.
 */
const Header = () => {
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [sticky, setSticky] = useState(false);
	const [scrollY, setScrollY] = useState(0);
	const [searchOpen, setSearchOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");

	const router = useRouter();

	const handleDrawerToggle = () => {
		setDrawerOpen((prev) => {
			const newState = !prev;
			document.body.style.overflow = newState ? "hidden" : "";
			return newState;
		});
	};

	const handleSearchToggle = () => {
		setSearchOpen((prev) => !prev);
	};

	const handleSearchSubmit = () => {
		router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
	};

	useEffect(() => {
		const handleScroll = () => {
			const currentScrollY = window.scrollY;
			setScrollY(currentScrollY);
			setSticky(currentScrollY > 200);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<>
			<AppBar
				id="site-header"
				position="fixed"
				sx={(theme) => ({
					top: 0,
					background: sticky ? theme.palette.primary.main : "transparent",
					boxShadow: "none",
					display: "flex",
					justifyContent: "center",
					minHeight: sticky ? { xs: 60 } : { xs: 70, md: 110 },
					transition: "all 0.25s ease-in-out",
					zIndex: sticky ? 101 : scrollY > 35 ? 100 : 101,
				})}
			>
				<Container>
					<Toolbar
						sx={{
							px: "0 !important",
							width: "100%",
							minHeight: 0,
						}}
					>
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								width: "100%",
							}}
						>
							<Typography
								component="div"
								sx={{
									py: 1,
									lineHeight: 1,
								}}
							>
								<Logo link height={sticky ? 28 : 36} />
							</Typography>

							<Box sx={{ display: "flex", alignItems: "center" }}>
								<Typography
									variant="sans"
									component="nav"
									sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}
								>
									<Box
										component="ul"
										sx={{
											px: 0,
											m: 0,
											display: "flex",
											flexWrap: "wrap",
										}}
									>
										{NAV_ITEMS.map((menuItem) => (
											<NavItem component="li" key={menuItem.title}>
												<NavLink href={menuItem.href}>
													{menuItem.title}
													{menuItem.submenu?.length && <FaChevronDown size="12px" style={{ marginLeft: "3px" }} />}
												</NavLink>
												{menuItem.submenu && (
													<SubmenuDropDown className="dropdown" elevation={3}>
														<Submenu component="ul" sx={{ columns: 3 }}>
															{menuItem.submenu.map((subMenuItem) => (
																<SubmenuItem key={subMenuItem.title}>
																	<Link href={subMenuItem.href}>{subMenuItem.title}</Link>
																</SubmenuItem>
															))}
														</Submenu>
													</SubmenuDropDown>
												)}
											</NavItem>
										))}
									</Box>
								</Typography>

								<Box
									sx={{
										ml: 0.5,
										position: "relative",
									}}
								>
									<IconButton
										edge="start"
										color="inherit"
										aria-label="search"
										onClick={handleSearchToggle}
										sx={{
											ml: 0,
											borderRadius: 0,
											"&:hover": { background: "rgba(0, 0, 0, 0.15)" },
										}}
									>
										{getIcon({ icon: "search" })}
									</IconButton>

									{searchOpen && (
										<Paper
											elevation={2}
											sx={{
												position: "absolute",
												top: "100%",
												right: 0,
												m: 0,
												p: 2,
												width: { xs: 280, sm: 300 },
												display: "flex",
												flexDirection: "column",
												alignItems: "flex-start",
												borderRadius: 0,
											}}
										>
											<TextField
												value={searchTerm}
												onChange={(e) => setSearchTerm(e.target.value)}
												fullWidth
												placeholder="Type here to search &hellip;"
												onKeyDown={(e) => {
													if (e.key === "Enter") {
														handleSearchSubmit();
													}
												}}
												slotProps={{
													input: {
														endAdornment: (
															<InputAdornment position="end">
																<Button
																	variant="contained"
																	onClick={handleSearchSubmit}
																	sx={{ zIndex: 10, minHeight: 40, width: 40, p: 0 }}
																>
																	{getIcon({ icon: "search", size: "20px" })}
																</Button>
															</InputAdornment>
														),
													},
												}}
												sx={{
													"& .MuiInputBase-root": { pr: 0 },
													"& .MuiOutlinedInput-notchedOutline": { borderWidth: "1px !important" },
												}}
											/>
										</Paper>
									)}
								</Box>

								<Box
									sx={{
										ml: 0.5,
										position: "relative",
									}}
								>
									<IconButton
										edge="start"
										color="inherit"
										aria-label="menu"
										onClick={handleDrawerToggle}
										sx={{
											ml: 0,
											borderRadius: 0,
											"&:hover": { background: "rgba(0, 0, 0, 0.15)" },
										}}
									>
										{getIcon({ icon: "MENU" })}
									</IconButton>
								</Box>
							</Box>
						</Box>
					</Toolbar>
				</Container>
			</AppBar>
			<Drawer open={drawerOpen} onClose={handleDrawerToggle} />
		</>
	);
};

export default Header;
