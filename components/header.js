import { Box } from "@mui/material";
import Image from "next/image";

const Header = () => {
    return (
        <Box className="header">
            <Box className="maxWidth">
                <Image
                    src="/logo.svg"
                    alt="Mirae Asset ETF Logo"
                    height={58}
                    width={256}
                />
            </Box>
        </Box>
    )
}

export default Header;