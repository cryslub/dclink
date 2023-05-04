import { Typography, Stack, Box, Avatar, Button } from '@mui/material';

const ProvincialTitle = (prop) => {
    const item = prop.item;

    return (
        <>
            <Stack direction="row" justifyContent="flex-start" alignItems="center">
                {item.name + ' ' + (item.title ? item.title : '')}
            </Stack>
        </>
    );
};

export default ProvincialTitle;
