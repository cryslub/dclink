import { useState } from 'react';

import { PersonPin } from '@mui/icons-material';
import { Dialog, DialogTitle, Typography, Stack, Divider, Box, ListSubheader, ListItemIcon, Grid, Tooltip, Skeleton } from '@mui/material';
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

const Person = ({ person }) => {
    const theme = useTheme();

    const [candidates, setCandidates] = useState([]);
    const [inspections, setInspections] = useState([]);

    const context = useSelector((state) => state.context);

    const dispatch = useDispatch();
    const personInfoOpen = context.personInfoOpen;

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

    const { loading } = useQuery(PERSON_CANDIDATES, {
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
        <>
            {loading && <Skeleton variant="rounded" height={70} sx={{ ml: 1, mr: 1, mt: 1 }} />}

            <List
                sx={{
                    width: '100%',
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
                {!loading && (
                    <ListSubheader component="div">
                        <Stack direction="row" alignItems="end" sx={{ mt: 2, mb: 1 }}>
                            <HowToVoteOutlinedIcon sx={{ mr: 1 }} /> <Typography>선거이력</Typography>
                        </Stack>
                    </ListSubheader>
                )}

                {candidates.map((candidate) => {
                    const item = candidate.item;
                    const state = item.state;
                    const election = state.election;

                    let secondaryTitle = state.name + ' ' + item.name + ' ' + (item.title ? item.title : '');
                    if (election.type == 'presidential') secondaryTitle = '';

                    return (
                        <>
                            <Tooltip title="듣기">
                                <ListItemButton alignItems="center" onClick={() => play(candidate.link)} key={candidate._id}>
                                    <ListItemText
                                        primary={election.name}
                                        secondary={
                                            <Stack direction="row" alignItems="end">
                                                {secondaryTitle != '' && <Typography sx={{ marginRight: 1 }}>{secondaryTitle}</Typography>}
                                                <PartyChip party={candidate.party} />
                                            </Stack>
                                        }
                                    />
                                </ListItemButton>
                            </Tooltip>
                        </>
                    );
                })}

                {inspections.length > 0 ? (
                    <>
                        <Box mt={3}></Box>
                        <Divider />
                        <ListSubheader component="div" sx={{ marginTop: 3 }}>
                            <Stack direction="row" alignItems="end" sx={{ mt: 2, mb: 1 }}>
                                <IconZoomCheck /> <Typography sx={{ ml: 1 }}>국정감사 기록</Typography>
                            </Stack>
                        </ListSubheader>
                        <Grid container>
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
                                    <Grid item>
                                        <Tooltip title="듣기">
                                            <ListItemButton alignItems="center" onClick={() => play(link)} key={candidate._id}>
                                                <ListItemIcon>
                                                    <Icon color={party.color} />
                                                </ListItemIcon>
                                                <ListItem alignItems="center">
                                                    <ListItemText primary={item.name} secondary={secondaryTitle} />
                                                </ListItem>
                                            </ListItemButton>
                                        </Tooltip>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </>
                ) : null}
            </List>
        </>
    );
};

export default Person;
