// material-ui
import { Typography, Stack, Box } from '@mui/material';
// project imports
import MainCard from 'ui-component/cards/MainCard';

import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';

// ==============================|| SAMPLE PAGE ||============================== //

const ElectionProvincial = (prop) => {
    const state = prop.state;

    const STATE_ITEMS = gql`
        query stateItems($state_id: ObjectId) {
            items(query: { state_id: $state_id }) {
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
            }
        }
    `;

    useQuery(STATE_ITEMS, {
        variables: { state_id: state._id },
        onCompleted: (data) => {}
    });

    return (
        <>
            <MainCard title="Sample Card">
                <Typography variant="body2">
                    Lorem ipsum dolor sit amen, consenter nipissing eli, sed do elusion tempos incident ut laborers et doolie magna alissa.
                    Ut enif ad minim venice, quin nostrum exercitation illampu laborings nisi ut liquid ex ea commons construal. Duos aube
                    grue dolor in reprehended in voltage veil esse colum doolie eu fujian bulla parian. Exceptive sin ocean cuspidate non
                    president, sunk in culpa qui officiate descent molls anim id est labours.
                </Typography>
            </MainCard>
        </>
    );
};

export default ElectionProvincial;
