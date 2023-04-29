// material-ui
import { useState } from 'react';
import { Typography, Stack, Box, Avatar, Button } from '@mui/material';
// project imports
import MainCard from 'ui-component/cards/MainCard';

import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { styled, useTheme } from '@mui/material/styles';
import { IconBrandYoutube } from '@tabler/icons';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';

import InfiniteScroll from 'react-infinite-scroll-component';
import ProvincialCard from './ProvincialCard';

// ==============================|| SAMPLE PAGE ||============================== //

const CandidateBox = ({ bgcolor, title, data, color }) => (
    <>
        <Card>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    py: 4.5,
                    bgcolor,
                    color
                }}
            >
                {title && (
                    <Typography variant="subtitle1" color="inherit">
                        {title}
                    </Typography>
                )}
                {!title && <Box sx={{ p: 1.15 }} />}
            </Box>
        </Card>
    </>
);

const ElectionProvincial = (prop) => {
    const [items, setItems] = useState([]);
    const [itemData, setItemData] = useState([]);
    const [offset, setOffset] = useState(0);
    const theme = useTheme();

    const state = prop.state;

    const pageSize = 10;

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
        onCompleted: (data) => {
            setItemData(data.items);
            //fetchMoreData();
            setItems(data.items.slice(0, pageSize));
            setOffset(offset + pageSize);
        }
    });

    const addItems = () => {
        // console.log(itemData.slice(offset, pageSize));
        setItems(items.concat(itemData.slice(offset, offset + pageSize)));
        console.log(itemData);
        console.log(itemData.slice(offset, offset + pageSize));
        console.log(items.concat(itemData.slice(offset, pageSize)));
        console.log('addItems');
        setOffset(offset + pageSize);
    };

    const fetchMoreData = () => {
        console.log('fetchMoreData');
        // a fake async api call like which sends
        // 20 more records in 1.5 secs
        setTimeout(() => {
            addItems();
        }, 1500);
    };

    console.log(offset + ',' + itemData.length);

    return (
        <>
            <InfiniteScroll
                dataLength={items.length}
                next={fetchMoreData}
                hasMore={items.length < itemData.length}
                loader={<h4>Loading...</h4>}
            >
                {items.map((item) => {
                    return <ProvincialCard item={item} key={item._id} />;
                })}
            </InfiniteScroll>
        </>
    );
};

export default ElectionProvincial;
