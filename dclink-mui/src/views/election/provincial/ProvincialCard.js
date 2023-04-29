import { useState } from 'react';

import { Typography, Stack, Box, Avatar, Button, Grid, Card, Chip } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import YoutubeLink from 'ui-component/YoutubeLink';

import { IconBrandYoutube } from '@tabler/icons';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';

import { styled, useTheme } from '@mui/material/styles';

import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';

import { chiefOfBasic, chiefOfMetro, chiefOfEducation, congressMan } from 'store/constant';

import { useDispatch } from 'react-redux';
import { PLAY } from 'store/actions';

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    //    console.log(result);

    return result
        ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16)
          }
        : null;
}

const chipSX = {
    height: 24,
    padding: '2px 0px 0px 0px',
    marginRight: '5px'
};

const CandidateBox = ({ candidate }) => {
    const dispatch = useDispatch();

    if (!candidate) return null;

    const party = candidate.party
        ? candidate.party
        : {
              color: '#aaaaaa',
              textColor: 'black'
          };

    const person = candidate.person
        ? candidate.person
        : {
              name: candidate.info.name
          };

    const rgb = hexToRgb(party.color);

    if (!rgb) {
        console.log(party);
        return null;
    }
    const title = person.name;

    const play = () => {
        dispatch({ type: PLAY, link: candidate.link });
    };

    const CardWrapper = styled(Card)(({ theme }) => ({
        backgroundColor: 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',0.3)',
        overflow: 'hidden',
        position: 'relative',
        '&:after': {
            content: '""',
            position: 'absolute',
            width: 210,
            height: 210,
            background: `linear-gradient(210.04deg, ${party.color} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
            borderRadius: '50%',
            top: -30,
            right: -180
        },
        '&:before': {
            content: '""',
            position: 'absolute',
            width: 210,
            height: 210,
            background: `linear-gradient(140.9deg, ${party.color} -14.02%, rgba(144, 202, 249, 0) 77.58%)`,
            borderRadius: '50%',
            top: -160,
            right: -130
        }
    }));

    return (
        <CardWrapper>
            <Card>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        py: 3.5,
                        paddingLeft: 2,
                        background: 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',0.3)',
                        cursor: candidate.link != '' ? 'pointer' : 'default'
                    }}
                    onClick={play}
                >
                    <Typography variant="body" color="inherit" sx={{ marginRight: 1 }}>
                        {title}
                    </Typography>
                    <>
                        {party.name ? <Chip label={party.name} sx={[chipSX, { background: party.color, color: party.textColor }]} /> : null}
                    </>
                    {!title && <Box sx={{ p: 1 }} />}
                </Box>
            </Card>
        </CardWrapper>
    );
};

const ProvincialCard = (prop) => {
    const item = prop.item;
    const theme = useTheme();
    const [candidates, setCandidates] = useState([]);

    const ITEM_CANDIDATES = gql`
        query itemCandidates($item_id: ObjectId) {
            candidates(query: { item_id: $item_id }) {
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
                person {
                    _id
                    birth
                    chinese
                    legacyId
                    name
                    photo
                }
                info {
                    address
                    age
                    birth
                    career1
                    career2
                    chinese
                    district
                    education
                    gender
                    historyCount
                    job
                    name
                    necDate
                    necId
                    necType
                    order
                    partyName
                    stateName
                    status
                    ward
                }
            }
        }
    `;

    useQuery(ITEM_CANDIDATES, {
        variables: { item_id: item._id },
        onCompleted: (data) => {
            setCandidates(data.candidates);
        }
    });

    const content = item.type == '광역' || item.type == '기초' || item.type == '국회' || item.title == '교육감' || item.name == '교육감';

    return (
        <Box mb={2} key={item._id}>
            <MainCard
                title={
                    <Stack direction="row" justifyContent="flex-start" alignItems="center">
                        {item.name + ' ' + (item.title ? item.title : '')}
                    </Stack>
                }
                content={content}
                secondary={
                    <Stack alignItems="center" direction="row" spacing={1}>
                        {/*
           // {item.zoneCode ? (
           //     <Button size="small" sx={{ minWidth: 0, marginLeft: 0 }}>
           //         <HistoryOutlinedIcon
           //             stroke={1.5}
           //             size="1.3rem"
           //             sx={{
           //                 color: theme.palette.primary.main,
           //                 cursor: 'pointer'
           //             }}
           //         />
           //     </Button>
           // ) : null}
    */}
                        {item.link ? <YoutubeLink link={item.link} /> : null}
                    </Stack>
                }
            >
                <Grid container spacing={1}>
                    {candidates.map((candidate) => {
                        return (
                            <>
                                {candidate.info.necType == chiefOfBasic ||
                                candidate.info.necType == chiefOfMetro ||
                                candidate.info.necType == chiefOfEducation ||
                                candidate.info.necType == congressMan ||
                                candidate.info.necType == null ? (
                                    <Grid item xs={12} sm={6} md={4} lg={2}>
                                        <CandidateBox candidate={candidate} />
                                    </Grid>
                                ) : null}
                            </>
                        );
                    })}
                </Grid>
            </MainCard>
        </Box>
    );
};

export default ProvincialCard;
