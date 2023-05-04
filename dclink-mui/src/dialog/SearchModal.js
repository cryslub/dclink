import React, { useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';

import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';

import PropTypes from 'prop-types';
import { useState } from 'react';

import {
    Avatar,
    Box,
    ButtonBase,
    Card,
    Grid,
    InputAdornment,
    OutlinedInput,
    Popper,
    Stack,
    Paper,
    DialogContent,
    Skeleton
} from '@mui/material';

// third-party
import PopupState, { bindPopper, bindToggle } from 'material-ui-popup-state';

// project imports
import Transitions from 'ui-component/extended/Transitions';

// assets
import { IconAdjustmentsHorizontal, IconSearch, IconX, IconPlayerPlay } from '@tabler/icons';
import { shouldForwardProp } from '@mui/system';
import { CoPresent } from '@mui/icons-material';

import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';

import Person from './Person';
import SubCard from 'ui-component/cards/SubCard';
import MainCard from 'ui-component/cards/MainCard';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

const OutlineInputStyle = styled(OutlinedInput, { shouldForwardProp })(({ theme }) => ({
    width: 434,
    marginLeft: 16,
    paddingLeft: 16,
    paddingRight: 16,
    height: 40,
    '& input': {
        background: 'transparent !important',
        paddingLeft: '4px !important'
    },
    [theme.breakpoints.down('lg')]: {
        width: 250
    },
    [theme.breakpoints.down('md')]: {
        width: '100%',
        marginLeft: 4,
        background: '#fff'
    }
}));

const HeaderAvatarStyle = styled(Avatar, { shouldForwardProp })(({ theme }) => ({
    ...theme.typography.commonAvatar,
    ...theme.typography.mediumAvatar,
    background: theme.palette.secondary.light,
    color: theme.palette.secondary.dark,
    '&:hover': {
        background: theme.palette.secondary.dark,
        color: theme.palette.secondary.light
    }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const SearchPeople = ({ searchKey }) => {
    const theme = useTheme();

    const SEARCH_PEOPLE = gql`
        query searchPeople($name: String) {
            people(query: { name: $name }, sortBy: _ID_ASC) {
                _id
            }
        }
    `;

    const { loading, data } = useQuery(SEARCH_PEOPLE, {
        variables: { name: searchKey },
        onCompleted: (data) => {
            //  setPeople(data.people);
            console.log('end');
        }
    });

    const people = data?.people;
    return (
        <>
            {loading && <Skeleton variant="rounded" width="100%" height={200} sx={{ mt: 2 }} />}
            {!loading && (
                <>
                    {people.length > 1 && (
                        <Stack direction="row" sx={{ mt: 2 }}>
                            {' '}
                            <Typography>검색된 인물 : {people.length} 명</Typography>
                        </Stack>
                    )}
                    <Grid container spacing={2} alignItems="stretch" sx={{ mb: 1 }}>
                        {typeof people.map === 'function' ? (
                            <>
                                {people?.map((person) => {
                                    var xl = 3;
                                    var lg = 4;
                                    var md = 6;

                                    if (people.length == 1) {
                                        xl = 12;
                                        lg = 12;
                                        md = 12;
                                    }
                                    if (people.length == 2) {
                                        xl = 6;
                                        lg = 6;
                                    }
                                    if (people.length == 3) {
                                        xl = 4;
                                    }

                                    return (
                                        <Grid item xs={12} sm={12} md={md} lg={lg} xl={xl} key={person._id}>
                                            <Paper elevation={5} sx={{ pt: 1, mt: 2, height: '100%' }}>
                                                <Person person={person} />
                                            </Paper>
                                        </Grid>
                                    );
                                })}
                            </>
                        ) : null}
                    </Grid>
                </>
            )}
        </>
    );
};

export default function SearchModal() {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = useState('');
    const [searchKey, setSearchKey] = useState('');

    let { electionName, stateName } = useParams();

    const navigate = useNavigate();
    const theme = useTheme();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        navigate(-1);
        //        setOpen(false);
    };
    const handleChange = (value) => {
        setValue(value);

        //        setOpen(false);
    };

    const search = () => {
        if (value.trim().length > 1) {
            //  console.log(value);
            setSearchKey(value.trim());
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            search();
        }
    };

    console.log(searchKey);
    return (
        <div>
            <Dialog fullScreen open={electionName == '검색'} onClose={handleClose} TransitionComponent={Transition}>
                <DialogContent sx={{ backgroundColor: '#eef2f6' }}>
                    <AppBar
                        enableColorOnDark
                        position="relative"
                        color="inherit"
                        elevation={5}
                        sx={{
                            bgcolor: theme.palette.background.default
                        }}
                    >
                        <Toolbar>
                            <IconButton color="inherit" onClick={handleClose} aria-label="close">
                                <CloseIcon />
                            </IconButton>

                            <Box p={1}>
                                <OutlineInputStyle
                                    value={value}
                                    onChange={(e) => handleChange(e.target.value)}
                                    onBlur={(e) => handleChange(e.target.value)}
                                    placeholder="인물이름"
                                    inputProps={{ 'aria-label': 'weight' }}
                                    onKeyPress={handleKeyPress}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton edge="start" color="inherit" onClick={search} aria-label="close">
                                                <IconSearch />
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </Box>
                        </Toolbar>
                    </AppBar>

                    <SearchPeople searchKey={searchKey} />
                </DialogContent>
            </Dialog>
        </div>
    );
}
