import PropTypes from 'prop-types';

import { Stack } from '@mui/material';
import PartyChip from 'ui-component/PartyChip';
import PersonName from 'ui-component/PersonName';

const PresidentialTitle = ({ item }) => {
    //  console.log(item);
    return (
        <>
            <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={1}>
                <PersonName size="large" title={item.candidate?.info.name} person={item.candidate?.person} />
                <PartyChip party={item.candidate?.party} />
            </Stack>
        </>
    );
};

PresidentialTitle.propTypes = {
    item: PropTypes.shape({
        candidate: PropTypes.shape({
            _id: PropTypes.string,
            link: PropTypes.string,
            text: PropTypes.string,
            party: PropTypes.shape({}),
            person: PropTypes.shape({}),
            info: PropTypes.shape({
                name: PropTypes.string
            }),
            subs: PropTypes.arrayOf(PropTypes.shape({}))
        })
    })
};

export default PresidentialTitle;
