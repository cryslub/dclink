import { Chip } from '@mui/material';

const chipSX = {
    height: 24,
    padding: '2px 0px 0px 0px',
    marginRight: '5px'
};
const PartyChip = (prop) => {
    const party = prop.party;
    if (!party) return null;
    return <Chip label={party.name} sx={[chipSX, { background: party.color, color: party.textColor }]} />;
};

export default PartyChip;
