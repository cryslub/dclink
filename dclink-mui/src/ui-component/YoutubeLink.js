import { Tooltip, IconButton } from '@mui/material';
import { IconBrandYoutube } from '@tabler/icons';

import { useTheme } from '@mui/material/styles';

import { useDispatch } from 'react-redux';
import { PLAY } from 'store/actions';

const YoutubeLink = (prop) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const link = prop.link;

    const play = () => {
        dispatch({ type: PLAY, link });
    };

    return (
        <Tooltip title="듣기">
            <IconButton size="small" onClick={play}>
                <IconBrandYoutube
                    stroke={1.5}
                    size="1.3rem"
                    sx={{
                        color: theme.palette.primary.main,
                        cursor: 'pointer'
                    }}
                />
            </IconButton>
        </Tooltip>
    );
};

export default YoutubeLink;
