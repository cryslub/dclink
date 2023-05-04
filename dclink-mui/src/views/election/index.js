// material-ui
import { useState } from 'react';
// project imports

import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';

import InfiniteScroll from 'react-infinite-scroll-component';
import ElectionCard from './ElectionCard';
import CircularProgress from '@mui/material/CircularProgress';

import { Stack, Box } from '@mui/material';

const ElectionView = (prop) => {
    const [items, setItems] = useState([]);
    const [itemData, setItemData] = useState([]);
    const [offset, setOffset] = useState(0);

    const state = prop.state;
    const election = prop.election;

    const pageSize = 10;

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
                    person_id
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
            setItemData(data.items);
            //fetchMoreData();
            setItems(data.items.slice(0, pageSize));
            setOffset(pageSize);
        }
    });

    const addItems = () => {
        // console.log(itemData.slice(offset, pageSize));
        setItems(items.concat(itemData.slice(offset, offset + pageSize)));
        setOffset(offset + pageSize);
    };

    const fetchMoreData = () => {
        // a fake async api call like which sends
        // 20 more records in 1.5 secs
        setTimeout(() => {
            addItems();
        }, 1500);
    };

    //    console.log(offset + ',' + itemData.length);

    return (
        <>
            {loading ? (
                <Stack justifyContent="center" direciton="row" sx={{ width: '100%', flexDirection: 'row' }}>
                    {' '}
                    <CircularProgress color="inherit" size="1rem" />
                </Stack>
            ) : (
                <InfiniteScroll
                    dataLength={items.length}
                    next={fetchMoreData}
                    hasMore={items.length < itemData.length}
                    loader={<CircularProgress color="inherit" size="1rem" />}
                >
                    {items.length == 0 ? (
                        <CircularProgress color="inherit" size="1rem" />
                    ) : (
                        items.map((item) => {
                            if (item.link == '') return null;
                            return <ElectionCard election={election} item={item} key={item._id} state={state} />;
                        })
                    )}
                </InfiniteScroll>
            )}
        </>
    );
};

export default ElectionView;
