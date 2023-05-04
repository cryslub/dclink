import { useState } from 'react';

import { Grid } from '@mui/material';

import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';

import CircularProgress from '@mui/material/CircularProgress';

import ProvincialCandidate from './provincial/ProvincialCandidate';
import PresidentialCandidate from './presidential/PresidentialCandidate';
import ProportionalCandidate from './proportional/ProportionalCandidate';

import { Skeleton } from '@mui/material';

const CardContent = (prop) => {
    const item = prop.item;
    const election = prop.election;
    const state = prop.state;

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
                info {
                    address
                    age
                    birth
                    career1
                    career2
                    chinese
                    district
                    education
                    gender
                    historyCount
                    job
                    name
                    necDate
                    necId
                    necType
                    order
                    partyName
                    stateName
                    status
                    ward
                }
                subs {
                    link
                    title
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

    let Candidate = ProvincialCandidate;
    if (election.type == 'presidential') Candidate = PresidentialCandidate;
    if (state.name == '비례') Candidate = ProportionalCandidate;

    return (
        <>
            {loading ? (
                <Skeleton variant="rounded" height={80} />
            ) : (
                <Grid container spacing={1} alignItems="stretch">
                    {candidates.map((candidate) => {
                        return (
                            <>
                                {candidate.link ? (
                                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={candidate._id}>
                                        <Candidate candidate={candidate} key={candidate._id} />
                                    </Grid>
                                ) : null}
                            </>
                        );
                    })}
                </Grid>
            )}
        </>
    );
};

export default CardContent;
