// material-ui
import { lazy } from 'react';

import { Typography, Stack, Box } from '@mui/material';
import Loadable from 'ui-component/Loadable';
const ElectionView = Loadable(lazy(() => import('views/election')));
const InpsectionView = Loadable(lazy(() => import('views/inspection')));

import { useSelector } from 'react-redux';

import { useParams } from 'react-router-dom';
// ==============================|| SAMPLE PAGE ||============================== //

const Base = () => {
    let { stateName } = useParams();
    const context = useSelector((state) => state.context);
    const state = context.state;
    const election = state.election;

    //    console.log(election);

    return (
        <>
            <Stack direction="row" justifyContent="space-between">
                <Box ml={1} mb={2}>
                    <Typography variant="h2">{stateName ? stateName : ' '}</Typography>
                </Box>
            </Stack>
            {election ? (
                election.type == 'inspection' ? (
                    <InpsectionView election={election} state={state} />
                ) : (
                    <ElectionView election={election} state={state} />
                )
            ) : null}
        </>
    );
};

export default Base;
