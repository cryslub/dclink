import PropTypes from 'prop-types';
import { Box, Card } from '@mui/material';

import { styled } from '@mui/material/styles';

import { useDispatch } from 'react-redux';
import { PLAY } from 'store/actions';
import PersonName from 'ui-component/PersonName';

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

const ProportionalCandidate = ({ candidate }) => {
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

    const CardWrapper = styled(Card)(({}) => ({
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
                    <PersonName size="small" title={title} person={candidate.person} />
                    {!title && <Box sx={{ p: 1 }} />}
                </Box>
            </Card>
        </CardWrapper>
    );
};

ProportionalCandidate.propTypes = {
    candidate: PropTypes.shape({
        _id: PropTypes.string,
        link: PropTypes.string,
        party: PropTypes.shape({}),
        person: PropTypes.shape({}),
        info: PropTypes.shape({
            name: PropTypes.string
        })
    })
};

export default ProportionalCandidate;
