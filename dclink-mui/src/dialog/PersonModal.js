import { useState } from 'react';

import { PersonPin } from '@mui/icons-material';
import { Dialog, DialogTitle, Typography, Stack, Divider, Box, ListSubheader, ListItemIcon } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { TOGGLE_PERSON_INFO, PLAY } from 'store/actions';

import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import PartyChip from 'ui-component/PartyChip';
import { useTheme, styled } from '@mui/material/styles';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';
import { IconFriends, IconSatellite, IconFileSearch, IconDeviceTv, IconAward, IconZoomCheck } from '@tabler/icons';

import HowToVoteOutlinedIcon from '@mui/icons-material/HowToVoteOutlined';

import Person from './Person';

const PersonModal = () => {
    const theme = useTheme();

    const [candidates, setCandidates] = useState([]);
    const [inspections, setInspections] = useState([]);

    const context = useSelector((state) => state.context);

    const dispatch = useDispatch();
    const personInfoOpen = context.personInfoOpen;
    let person = context.person;
    if (!person) person = { _id: 'dummy' };

    const handleClose = () => {
        dispatch({ type: TOGGLE_PERSON_INFO, playerOpen: false });
    };

    const play = (link) => {
        dispatch({ type: PLAY, link });
    };

    return (
        <Dialog onClose={handleClose} open={personInfoOpen}>
            <DialogTitle>
                <Typography variant="h3">{person.name}</Typography>
            </DialogTitle>
            <PerfectScrollbar style={{ height: '100%', maxHeight: 'calc(100vh - 205px)', overflowX: 'hidden', paddingBottom: 10 }}>
                <Person person={person} />
            </PerfectScrollbar>
        </Dialog>
    );
};

export default PersonModal;
