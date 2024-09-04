import { Box, FormControl, IconButton, InputAdornment, OutlinedInput } from "@mui/material";

const Header = () => {
    return (
        <Box className="header">
            <Box className="maxWidth">
                <Box className="header_inner d-center">
                    <Box className="d-center">
                        <img
                            className="logo"
                            src="/logo.svg"
                            alt="Mirae Asset ETF Logo"
                        />
                        <Box className="menu d-center">
                            <a href="#">Our ETFs</a>
                            <a href="#">Other Passives</a>
                            <a href="#">Insights <img src="/arrow-down.svg" alt="icon" /></a>
                            <a href="#">About Us <img src="/arrow-down.svg" alt="icon" /></a>
                            <a href="#">Baskets</a>
                            <a href="#">iNAV <img src="/inav.gif" alt="inav gif" /></a>
                        </Box>
                    </Box>
                    <Box className="d-center">
                        <FormControl variant="outlined">
                            <OutlinedInput
                                id="outlined-adornment-password"
                                startAdornment={
                                <InputAdornment position="start">
                                    <IconButton
                                        edge="start"
                                    >
                                    <img src="/search-icon.svg" alt="search icon" />
                                    </IconButton>
                                </InputAdornment>
                                }
                                placeholder="Search for Funds..."
                            />
                        </FormControl>
                        <button className="custom-btn-icon">
                            <p>INVEST</p>
                            <img src="/link-icon.svg" alt="icon" />
                        </button>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default Header;