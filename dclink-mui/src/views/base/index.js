// material-ui
import { lazy } from 'react';

import { Typography, Stack, Box } from '@mui/material';
import Loadable from 'ui-component/Loadable';
const ElectionProvincial = Loadable(lazy(() => import('views/election/provincial')));

import { useSelector } from 'react-redux';

import { useParams } from 'react-router-dom';
// ==============================|| SAMPLE PAGE ||============================== //

const Base = () => {
    let { stateName } = useParams();
    const context = useSelector((state) => state.context);
    const state = context.state;
    const election = state.election;

    console.log(election);

    return (
        <>
            <Stack direction="row" justifyContent="space-between">
                <Box ml={1} mb={2}>
                    <Typography variant="h2">{stateName ? stateName : ' '}</Typography>
                </Box>
            </Stack>
            {election ? (
                (election.type == 'provincial' || election.type == 'by') && state.name != '비례' && state.name != '통계' ? (
                    <ElectionProvincial state={state} />
                ) : null
            ) : null}
        </>
    );
};

export default Base;
