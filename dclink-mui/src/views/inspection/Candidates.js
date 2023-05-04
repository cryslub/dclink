import PropTypes from 'prop-types';
import { useState } from 'react';

import { Stack, Grid, Tooltip, Skeleton } from '@mui/material';

import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';

import { IconUser, IconUserSearch } from '@tabler/icons';
import { useDispatch } from 'react-redux';
import { TOGGLE_PERSON_INFO } from 'store/actions';

const Candidate = ({ candidate }) => {
    const [isShown, setIsShown] = useState(false);
    const dispatch = useDispatch();
    if (!candidate.party) return null;

    const info = (e) => {
        //        console.log(e);
        e.stopPropagation();
        if (typeof e.preventDefault === 'function') e.preventDefault();
        dispatch({ type: TOGGLE_PERSON_INFO, personInfoOpen: true, person: candidate.person });
    };

    return (
        <Tooltip title="인물이력">
            <Stack
                direction="row"
                alignItems="end"
                sx={{ cursor: 'pointer', marginRight: 1 }}
                onMouseEnter={() => setIsShown(true)}
                onMouseLeave={() => setIsShown(false)}
                onClick={info}
            >
                {isShown ? (
                    <IconUserSearch sx={{ color: candidate.party.color }} color={candidate.party.color} fontSize="small" />
                ) : (
                    <IconUser sx={{ color: candidate.party.color }} color={candidate.party.color} fontSize="small" />
                )}

                {candidate.person.name}
            </Stack>
        </Tooltip>
    );
};

Candidate.propTypes = {
    candidate: PropTypes.shape({
        _id: PropTypes.string,
        party: PropTypes.shape({
            _id: PropTypes.string,
            color: PropTypes.string
        }),
        person: PropTypes.shape({
            _id: PropTypes.string,
            name: PropTypes.string
        })
    })
};

const Candidates = ({ item }) => {
    const [candidates, setCandidates] = useState([]);

    const ITEM_CANDIDATES = gql`
        query itemCandidates($item_id: ObjectId) {
            candidates(query: { item_id: $item_id }, sortBy: _ID_ASC) {
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
            }
        }
    `;

    const { loading } = useQuery(ITEM_CANDIDATES, {
        variables: { item_id: item._id },
        onCompleted: (data) => {
            setCandidates(data.candidates);
        }
    });

    return (
        <>
            {loading && <Skeleton variant="rounded" height={50} />}
            <Grid container spacing={1}>
                {candidates.map((candidate) => {
                    return (
                        <>
                            <Grid itemID="" key={candidate._id}>
                                <Candidate candidate={candidate} />
                            </Grid>
                        </>
                    );
                })}
            </Grid>
        </>
    );
};

Candidates.propTypes = {
    item: PropTypes.shape({
        _id: PropTypes.string
    })
};

export default Candidates;
