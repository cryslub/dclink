// material-ui
// eslint-disable-next-line no-unused-vars
import { Typography, Box, Link } from '@mui/material';

// project imports

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = () => {
    return (
        <Box>
            <Link
                href="http://xsfm.co.kr/"
                target="xsfm"
                color="inherit"
                sx={{
                    '&:hover': {
                        textDecoration: 'none'
                    },
                    textDecoration: 'none'
                }}
            >
                <Typography variant="h6">XSFM 그것은 알기 싫다</Typography>
                <Typography variant="caption" component="div">
                    데이터 센트럴 조감도
                </Typography>
            </Link>
        </Box>
    );
};

export default LogoSection;
