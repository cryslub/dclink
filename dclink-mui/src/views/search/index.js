// material-ui
import { lazy } from 'react';

import { Typography, Stack, Box } from '@mui/material';
import Loadable from 'ui-component/Loadable';
const ElectionView = Loadable(lazy(() => import('views/election')));
const InpsectionView = Loadable(lazy(() => import('views/inspection')));

import { useSelector } from 'react-redux';

import { useParams } from 'react-router-dom';
// ==============================|| SAMPLE PAGE ||============================== //

const Search = () => {
    return <></>;
};

export default Search;
