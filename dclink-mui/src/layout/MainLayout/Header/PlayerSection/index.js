import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { useDispatch, useSelector } from 'react-redux';
import { TOGGLE_PLAYER } from 'store/actions';
// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Grid,
    Typography,
    useMediaQuery,
    ButtonBase,
    Avatar,
    Popper,
    ClickAwayListener,
    Paper,
    Dialog,
    DialogContent,
    Slide
} from '@mui/material';
import TvOffIcon from '@mui/icons-material/TvOff';

// project imports
import MainCard from 'ui-component/cards/MainCard';

// assets
import { IconBrandYoutube } from '@tabler/icons';
import Transitions from 'ui-component/extended/Transitions';
// notification status options
const status = [
    {
        value: 'all',
        label: 'All Notification'
    },
    {
        value: 'new',
        label: 'New'
    },
    {
        value: 'unread',
        label: 'Unread'
    },
    {
        value: 'other',
        label: 'Other'
    }
];

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

// ==============================|| NOTIFICATION ||============================== //

const Content = (props) => {
    const context = useSelector((state) => state.context);

    const link = context.link;
    return (
        <>
            {link === '' ? (
                <>
                    <Grid item xs={12}>
                        <Box p={2}>
                            <center>
                                <TvOffIcon style={{ marginRight: 2 }} />
                                <br />
                                <Typography variant="caption">재생중인 영상 없음</Typography>
                            </center>
                        </Box>
                    </Grid>
                </>
            ) : (
                <ReactPlayer width="100%" height="100%" url={link} controls={false} playing={true} />
            )}
        </>
    );
};

const PlayerSection = () => {
    const theme = useTheme();
    const dispatch = useDispatch();

    const matchesXs = useMediaQuery(theme.breakpoints.down('md'));

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('');
    /**
     * anchorRef is used on different componets and specifying one type leads to other components throwing an error
     * */
    const anchorRef = useRef(null);

    const handleToggle = () => {
        dispatch({ type: TOGGLE_PLAYER, playerOpen: true });
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }
        prevOpen.current = open;
    }, [open]);

    const handleChange = (event) => {
        if (event?.target.value) setValue(event?.target.value);
    };

    return (
        <>
            <Box
                sx={{
                    ml: 2,
                    mr: 1,
                    [theme.breakpoints.down('md')]: {
                        mr: 1
                    }
                }}
            >
                <ButtonBase sx={{ borderRadius: '12px' }}>
                    <Avatar
                        variant="rounded"
                        sx={{
                            ...theme.typography.commonAvatar,
                            ...theme.typography.mediumAvatar,
                            transition: 'all .2s ease-in-out',
                            background: theme.palette.secondary.light,
                            color: theme.palette.secondary.dark,
                            '&[aria-controls="menu-list-grow"],&:hover': {
                                background: theme.palette.secondary.dark,
                                color: theme.palette.secondary.light
                            }
                        }}
                        ref={anchorRef}
                        aria-controls={open ? 'menu-list-grow' : undefined}
                        aria-haspopup="true"
                        onClick={handleToggle}
                        color="inherit"
                    >
                        <IconBrandYoutube stroke={1.5} size="1.3rem" />
                    </Avatar>
                </ButtonBase>
            </Box>
        </>
    );
};

export default PlayerSection;
