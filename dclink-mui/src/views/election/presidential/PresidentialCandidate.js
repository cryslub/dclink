import PropTypes from 'prop-types';

import { Typography, Stack, Box, Button, Grid, Card, Divider, Tooltip } from '@mui/material';

import { styled, useTheme } from '@mui/material/styles';

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

const PresidentialCandidate = ({ candidate }) => {
    const dispatch = useDispatch();
    const theme = useTheme();

    if (!candidate) return null;

    const party = candidate.party
        ? candidate.party
        : {
              color: '#aaaaaa',
              textColor: 'black'
          };

    const rgb = hexToRgb(party.color);

    if (!rgb) {
        console.log(party);
        return null;
    }
    const title = candidate.text;

    const play = (e, link) => {
        if (typeof e.preventDefault === 'function') e.preventDefault();
        console.log(link);
        if (!link) return;
        dispatch({ type: PLAY, link });
    };

    const CardWrapper = styled(Card)(({}) => ({
        backgroundColor: 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',0.3)',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        cursor: candidate.link != '' ? 'pointer' : 'default',
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

    const subs = candidate.subs;
    const content = subs?.length > 0;
    var i = 0;

    // console.log(candidate);

    return (
        <CardWrapper onClick={(e) => play(e, candidate.link)}>
            <Card>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        py: 3.5,
                        background: 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',0.3)'
                    }}
                >
                    <Stack sx={{ width: '100%' }}>
                        <Typography variant="body" color="inherit" sx={{ marginRight: 1, marginLeft: 2 }}>
                            {title}
                        </Typography>
                        {!title && <Box sx={{ p: 1 }} />}
                        {content ? (
                            <>
                                <Divider sx={{ marginTop: 2, marginBottom: 2, bgcolor: 'white', borderColor: 'white' }} light />

                                <Box mt={1} ml={1}>
                                    <Grid container spacing={1}>
                                        {subs?.map((sub) => {
                                            return (
                                                <Grid item key={i++}>
                                                    {sub.link === '' ? (
                                                        sub.title
                                                    ) : (
                                                        <Tooltip title="듣기">
                                                            <Button
                                                                variant="text"
                                                                onClick={(e) => play(e, sub.link)}
                                                                size="small"
                                                                style={{
                                                                    padding: 5,
                                                                    minHeight: 0,
                                                                    minWidth: 0,
                                                                    alignitems: 'end',
                                                                    color: theme.palette.grey[500]
                                                                }}
                                                            >
                                                                {sub.title}
                                                            </Button>
                                                        </Tooltip>
                                                    )}
                                                </Grid>
                                            );
                                        })}
                                    </Grid>
                                </Box>
                            </>
                        ) : null}
                    </Stack>
                </Box>
            </Card>
        </CardWrapper>
    );
};

PresidentialCandidate.propTypes = {
    candidate: PropTypes.shape({
        _id: PropTypes.string,
        link: PropTypes.string,
        text: PropTypes.string,
        party: PropTypes.shape({}),
        person: PropTypes.shape({}),
        info: PropTypes.shape({
            name: PropTypes.string
        }),
        subs: PropTypes.arrayOf(PropTypes.shape({}))
    })
};

export default PresidentialCandidate;
