import React, { useState } from 'react';
import ReactPlayer from 'react-player';

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
    Slide,
    Hidden
} from '@mui/material';
import TvOffIcon from '@mui/icons-material/TvOff';
import { useDispatch, useSelector } from 'react-redux';
import { TOGGLE_PLAYER } from 'store/actions';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const Content = () => {
    const context = useSelector((state) => state.context);

    const link = context.link;
    return (
        <>
            {link === '' ? (
                <>
                    <Grid item style={{ paddingRight: 2 }} xs={12}>
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
                <ReactPlayer width="100%" height="100%" url={link} controls={true} playing={true} />
            )}
        </>
    );
};

const YoutubeModal = () => {
    const context = useSelector((state) => state.context);
    const dispatch = useDispatch();
    const playerOpen = context.playerOpen;
    const handleToggle = () => {
        dispatch({ type: TOGGLE_PLAYER, playerOpen: false });
    };
    return (
        <Dialog open={playerOpen} onClose={handleToggle} TransitionComponent={Transition} keepMounted>
            <DialogContent style={{ padding: 0, overflow: 'hidden' }}>
                <Hidden mdUp>
                    <Grid container justifyContent="center" alignItems="center" style={{ width: '100%', height: 169 }} direction="row">
                        <Content />
                    </Grid>
                </Hidden>
                <Hidden smDown>
                    <Grid container justifyContent="center" alignItems="center" style={{ width: 500, height: 281 }} direction="row">
                        <Content />
                    </Grid>
                </Hidden>
            </DialogContent>
        </Dialog>
    );
};

export default YoutubeModal;
