// material-ui
import { useState, useEffect } from 'react';
import { Typography, Backdrop } from '@mui/material';
import { useDispatch } from 'react-redux';

// project imports
import NavGroup from './NavGroup';

import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';

// assets
import { IconZoomCheck } from '@tabler/icons';

import HowToVoteOutlinedIcon from '@mui/icons-material/HowToVoteOutlined';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

// project imports
import { MENU_OPEN } from 'store/actions';

import CircularProgress from '@mui/material/CircularProgress';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {
    const [stateMap, setStateMap] = useState({});
    let { electionName, stateName } = useParams();

    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const init = stateMap[decodeURI(location.pathname)];
        if (init) dispatch({ type: MENU_OPEN, id: init.id, state: init.state });
    }, [location, dispatch, stateMap]);

    const ALL_ELECTIONS = gql`
        query AllElections {
            elections {
                _id
                name
                type
                result
            }
            states(limit: 5000) {
                _id
                name
                fullName
                election {
                    _id
                    date
                    name
                    result
                    type
                }
            }
        }
    `;

    const electionMenu = {
        id: 'election',
        title: '선거',
        type: 'group',
        icon: HowToVoteOutlinedIcon,
        children: []
    };

    const inspectionMenu = {
        id: 'inspection',
        title: '국정감사',
        type: 'group',
        icon: IconZoomCheck,
        children: []
    };

    const [menuItem, setMenuItem] = useState({
        items: [electionMenu, inspectionMenu]
    });
    const electionMap = {};

    const { loading } = useQuery(ALL_ELECTIONS, {
        onCompleted: (data) => {
            var init;

            data?.elections.forEach((election) => {
                electionMap[election._id] = [];
            });
            var stateMapTemp = {};
            data?.states.forEach((state) => {
                //        console.log(state);=
                var election = state.election;
                if (state.name != '통계') {
                    let url = '/' + election.name.replace(/\s/g, '');
                    if (state.name != '') url += '/' + state.name;
                    const child = {
                        id: state._id,
                        title: state.name,
                        type: 'item',
                        state: state,
                        url: url
                    };
                    electionMap[election._id].push(child);
                    if (
                        electionName == election.name.replace(/\s/g, '') &&
                        (stateName == state.name || election.type == 'by' || election.type == 'presidential')
                    )
                        init = child;

                    stateMapTemp[child.url] = child;
                }
            });

            setStateMap(stateMapTemp);
            //    console.log(electionMap);

            data?.elections.forEach((election) => {
                var e;
                if (election.type == 'inspection') {
                    e = {
                        id: election._id,
                        title: election.name,
                        type: 'collapse',
                        url: '/utils/util-typography',
                        children: electionMap[election._id]
                    };

                    //            console.log(e.children);

                    inspectionMenu.children.push(e);
                } else {
                    e = {
                        id: election._id,
                        title: election.name,
                        type: election.type == 'provincial' ? 'collapse' : 'item',
                        url: '/' + election.name.replace(/\s/g, ''),
                        state: electionMap[election._id][0].state,
                        children: electionMap[election._id]
                    };
                    electionMenu.children.push(e);
                }
            });

            init = init ? init : electionMenu.children[0];
            if (init && electionName != '검색') {
                console.log(init);
                if (init?.type == 'collapse') {
                    init = init.children[0];
                    dispatch({ type: MENU_OPEN, id: init.id, state: init.state });
                    navigate(init.url);
                } else {
                    dispatch({ type: MENU_OPEN, id: init.id, state: init.state });
                    navigate(init.url);
                }
            }

            setMenuItem({
                items: [electionMenu, inspectionMenu]
            });
        }
    });

    //    console.log(electionName + ',' + stateName);

    const navItems = menuItem.items.map((item) => {
        switch (item.type) {
            case 'group':
                return <NavGroup key={item.id} item={item} />;
            default:
                return (
                    <Typography key={item.id} variant="h6" color="error" align="center">
                        Menu Items Error
                    </Typography>
                );
        }
    });

    //    console.log('loading - ' + loading);
    return (
        <>
            {navItems}

            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
                {' '}
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    );
};

export default MenuList;
