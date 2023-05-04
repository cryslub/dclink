import { Typography, Stack, Box, Avatar, Button } from '@mui/material';
import PartyChip from 'ui-component/PartyChip';

const ProportionalTitle = (prop) => {
    const item = prop.item;

    return (
        <>
            <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={1}>
                {item.name}
                <PartyChip party={item.party} />
            </Stack>
        </>
    );
};

export default ProportionalTitle;
