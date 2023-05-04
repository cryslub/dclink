import PropTypes from 'prop-types';
// material-ui
import React, { useState } from 'react';
// project imports
import { CardContent, Typography, Stack, Grid, Avatar, Divider, Box, Skeleton } from '@mui/material';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import MainCard from 'ui-component/cards/MainCard';
import Candidates from './Candidates';
import YoutubeLink from 'ui-component/YoutubeLink';
import { useTheme } from '@mui/material/styles';
import { IconFriends, IconSatellite, IconFileSearch, IconDeviceTv, IconAward } from '@tabler/icons';

const MemberCard = ({ item }) => {
    const theme = useTheme();
    return (
        <>
            <MainCard content={false}>
                <CardContent>
                    <Stack spacing={1}>
                        <Stack direction="row" spacing={1} alignItems="end" sx={{ marginBottom: 2 }}>
                            <Avatar
                                variant="rounded"
                                sx={{
                                    ...theme.typography.commonAvatar,
                                    ...theme.typography.mediumAvatar,
                                    background: theme.palette.primary.light,
                                    color: theme.palette.primary.dark,
                                    cursor: 'default'
                                }}
                            >
                                <IconFriends fontSize="inherit" />
                            </Avatar>
                            <Typography variant="h4">소속위원</Typography>
                        </Stack>
                        <Candidates item={item} />
                    </Stack>
                </CardContent>
            </MainCard>
        </>
    );
};

MemberCard.propTypes = {
    item: PropTypes.shape({})
};

const OverviewCard = ({ item }) => {
    const theme = useTheme();
    return (
        <>
            <MainCard content={false}>
                <CardContent>
                    <Stack alignItems="start" justifyContent="space-between" direction="row" spacing={1}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Avatar
                                variant="rounded"
                                sx={{
                                    ...theme.typography.commonAvatar,
                                    ...theme.typography.mediumAvatar,
                                    background: theme.palette.primary.light,
                                    color: theme.palette.primary.dark,
                                    cursor: 'default'
                                }}
                            >
                                <IconSatellite fontSize="inherit" />
                            </Avatar>
                            <Typography variant="h4">Overview</Typography>
                        </Stack>

                        {item.link ? <YoutubeLink link={item.link} /> : null}
                    </Stack>
                </CardContent>
            </MainCard>
        </>
    );
};

OverviewCard.propTypes = {
    item: PropTypes.shape({
        link: PropTypes.string
    })
};

const IssueCard = ({ issues, title, icon }) => {
    const theme = useTheme();
    var i = 0;
    const Icon = icon;
    return (
        <>
            <MainCard content={false}>
                <CardContent>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ marginBottom: 2 }}>
                        <Avatar
                            variant="rounded"
                            sx={{
                                ...theme.typography.commonAvatar,
                                ...theme.typography.mediumAvatar,
                                background: theme.palette.primary.light,
                                color: theme.palette.primary.dark,
                                cursor: 'default'
                            }}
                        >
                            <Icon fontSize="inherit" />
                        </Avatar>
                        <Typography variant="h4">{title}</Typography>
                    </Stack>
                    {issues.map((item) => {
                        i++;
                        return (
                            <>
                                <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                                    <Typography variant="subtitle1" color="inherit">
                                        {item.name}
                                    </Typography>
                                    {item.link ? <YoutubeLink link={item.link} /> : null}
                                </Stack>
                                <Box ml={1} mt={1}>
                                    <Candidates item={item} />
                                </Box>
                                {i == issues.length ? null : <Divider sx={{ my: 1.5 }} />}
                            </>
                        );
                    })}
                </CardContent>
            </MainCard>
        </>
    );
};

IssueCard.propTypes = {
    issues: PropTypes.arrayOf(PropTypes.shape({})),
    title: PropTypes.string,
    icon: PropTypes.Icon
};

const EliteCard = ({ item }) => {
    const theme = useTheme();
    if (!item) return null;
    return (
        <>
            <MainCard content={false}>
                <CardContent>
                    <Stack alignItems="start" justifyContent="space-between" direction="row" spacing={1}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ marginBottom: 2 }}>
                            <Avatar
                                variant="rounded"
                                sx={{
                                    ...theme.typography.commonAvatar,
                                    ...theme.typography.mediumAvatar,
                                    background: theme.palette.primary.light,
                                    color: theme.palette.primary.dark,
                                    cursor: 'default'
                                }}
                            >
                                <IconAward fontSize="inherit" />
                            </Avatar>
                            <Typography variant="h4">{item?.name}</Typography>
                        </Stack>
                        {item.link ? <YoutubeLink link={item.link} /> : null}
                    </Stack>

                    <Box ml={1} mt={1}>
                        <Candidates item={item} />
                    </Box>
                </CardContent>
            </MainCard>
        </>
    );
};

EliteCard.propTypes = {
    item: PropTypes.shape({
        name: PropTypes.string,
        link: PropTypes.string
    })
};

const InspectionView = ({ state }) => {
    const [members, setMembers] = useState(undefined);
    const [overview, setOverview] = useState(undefined);
    const [issues, setIssues] = useState([]);
    const [scenes, setScenes] = useState([]);
    const [elite, setElite] = useState(undefined);

    const STATE_ITEMS = gql`
        query stateItems($state_id: ObjectId) {
            items(query: { state_id: $state_id }, sortBy: _ID_ASC) {
                _id
                name
                link
                type
                mapCode
                zoneCode
                title
                state_id
                state {
                    _id
                    election_id
                    fullName
                    name
                }
                coordinate {
                    x
                    y
                }
                votes {
                    party_id
                    type
                    votes
                }
                candidate {
                    _id
                    info {
                        name
                    }
                    party {
                        _id
                        color
                        name
                        textColor
                    }
                    person {
                        _id
                        name
                    }
                }
                party {
                    color
                    name
                    textColor
                }
            }
        }
    `;

    const { loading } = useQuery(STATE_ITEMS, {
        variables: { state_id: state._id },
        onCompleted: (data) => {
            //fetchMoreData();
            //            setItems(data.items.slice(0, pageSize));
            const issuesTemp = [];
            const scenesTemp = [];
            data.items.forEach((item) => {
                switch (item.type) {
                    case '소속위원':
                        setMembers(item);
                        break;
                    case '오버뷰':
                        setOverview(item);
                        break;

                    case '이슈':
                        issuesTemp.push(item);
                        break;

                    case '장면':
                        scenesTemp.push(item);
                        break;

                    case '피폭':
                        scenesTemp.push(item);
                        break;
                    case '파이날':
                        setElite(item);
                        break;
                }
            });

            setIssues(issuesTemp);
            setScenes(scenesTemp);
        }
    });

    //    console.log(offset + ',' + itemData.length);

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
                {loading && <Skeleton variant="rounded" height={100} />}
                {!loading && members && <MemberCard item={members} />}
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
                {loading && <Skeleton variant="rounded" height={80} />}
                {!loading && overview && <OverviewCard item={overview} />}
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6}>
                {loading && <Skeleton variant="rounded" height={200} />}
                {!loading && <IssueCard issues={issues} title="이슈" icon={IconFileSearch} />}
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
                <Stack spacing={2}>
                    {loading && <Skeleton variant="rounded" height={200} />}
                    {!loading && (
                        <>
                            <IssueCard issues={scenes} title="장면" icon={IconDeviceTv} />
                            <EliteCard item={elite} />
                        </>
                    )}
                </Stack>
            </Grid>
        </Grid>
    );
};

InspectionView.propTypes = {
    state: PropTypes.shape({
        _id: PropTypes.string
    })
};

export default InspectionView;
