import { useState } from 'react';

import { PersonPin } from '@mui/icons-material';
import { Dialog, DialogTitle, Typography, Stack, Divider, Box } from '@mui/material';
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
import { IconFriends, IconSatellite, IconFileSearch, IconDeviceTv, IconAward } from '@tabler/icons';

// styles
const ListItemWrapper = styled('div')(({ theme }) => ({
    cursor: 'pointer',
    padding: 16,
    '&:hover': {
        background: theme.palette.primary.light
    },
    '& .MuiListItem-root': {
        padding: 0
    }
}));

const PersonHistory = ({ person }) => {
    const theme = useTheme();

    const [candidates, setCandidates] = useState([]);
    const [inspections, setInspections] = useState([]);

    const context = useSelector((state) => state.context);

    const dispatch = useDispatch();
    const personInfoOpen = context.personInfoOpen;
    if (!person) person = { _id: 'dummy' };

    const handleClose = () => {
        dispatch({ type: TOGGLE_PERSON_INFO, playerOpen: false });
    };

    const play = (link) => {
        dispatch({ type: PLAY, link });
    };

    const PERSON_CANDIDATES = gql`
        query personCandidates($person_id: ObjectId) {
            candidates(query: { person_id: $person_id }, sortBy: _ID_ASC) {
                _id
                item_id
                link
                party_id
                person_id
                text
                votes
                party {
                    _id
                    color
                    name
                    textColor
                }
                item {
                    _id
                    name
                    title
                    type
                    link
                    state {
                        _id
                        election {
                            _id
                            date
                            name
                            type
                        }
                        name
                    }
                }
            }
        }
    `;

    useQuery(PERSON_CANDIDATES, {
        variables: { person_id: person._id },
        onCompleted: (data) => {
            const candidatesTemp = [];
            const inspectionsTemp = [];

            data.candidates.forEach((candidate) => {
                const item = candidate.item;
                const state = item.state;
                const election = state.election;

                if (election.type == 'inspection') {
                    if (item.name != '소속위원') inspectionsTemp.push(candidate);
                } else {
                    candidatesTemp.push(candidate);
                }
            });
            candidatesTemp.sort((a, b) => a.item.state.election.date - b.item.state.election.date);
            inspectionsTemp.sort((a, b) => a.item.state.election.date - b.item.state.election.date);
            //   console.log(candidatesTemp);
            setCandidates(candidatesTemp);
            setInspections(inspectionsTemp);
        }
    });

    return (
        <PerfectScrollbar style={{ height: '100%', maxHeight: 'calc(100vh - 205px)', overflowX: 'hidden' }}>
            <List
                sx={{
                    width: '100%',
                    maxWidth: 330,
                    py: 0,
                    borderRadius: '10px',
                    [theme.breakpoints.down('md')]: {
                        maxWidth: 300
                    },
                    '& .MuiListItemSecondaryAction-root': {
                        top: 22
                    },
                    '& .MuiDivider-root': {
                        my: 0
                    },
                    '& .list-container': {
                        pl: 7
                    }
                }}
            >
                {candidates.map((candidate) => {
                    const item = candidate.item;
                    const state = item.state;
                    const election = state.election;

                    let secondaryTitle = state.name + ' ' + item.name + ' ' + (item.title ? item.title : '');
                    if (election.type == 'presidential') secondaryTitle = '';

                    return (
                        <>
                            <Divider />
                            <ListItemWrapper sx={{ paddingLeft: 3, paddingRight: 5 }} onClick={() => play(candidate.link)}>
                                <ListItem alignItems="center">
                                    <ListItemText primary={election.name} />
                                </ListItem>
                                <Stack direction="row" alignItems="end">
                                    {secondaryTitle != '' && <Typography sx={{ marginRight: 1 }}>{secondaryTitle}</Typography>}
                                    <PartyChip party={candidate.party} />
                                </Stack>
                            </ListItemWrapper>
                        </>
                    );
                })}
                {inspections.length > 0 ? (
                    <>
                        <Divider />
                        <Box pl={3} pt={4} pb={1}>
                            <Typography variant="h5">국정감사 기록</Typography>
                        </Box>
                    </>
                ) : null}
                {inspections.map((candidate) => {
                    const item = candidate.item;
                    const state = item.state;
                    const election = state.election;
                    const party = candidate.party;

                    let secondaryTitle = state.name + ' ' + election.date.substring(0, 4);
                    let Icon = IconFileSearch;
                    if (item.type == '장면' || item.type == '피폭') Icon = IconDeviceTv;
                    if (item.type == '파이날') Icon = IconAward;

                    let link = item.link;
                    if (item.type == '파이날') link = candidate.link;

                    return (
                        <>
                            <Divider />
                            <ListItemWrapper sx={{ paddingLeft: 3, paddingRight: 5 }} onClick={() => play(link)}>
                                <ListItem alignItems="center">
                                    <ListItemAvatar>
                                        <Icon color={party.color} />
                                    </ListItemAvatar>
                                    <ListItem alignItems="center">
                                        <ListItemText primary={item.name} secondary={secondaryTitle} />
                                    </ListItem>
                                </ListItem>
                            </ListItemWrapper>
                        </>
                    );
                })}
            </List>
        </PerfectScrollbar>
    );
};

export default PersonHistory;
