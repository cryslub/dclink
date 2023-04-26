import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
// material-ui
import { useTheme } from '@mui/material/styles';
import { Divider, List, Typography, Stack } from '@mui/material';

// project imports
import NavItem from '../NavItem';
import NavCollapse from '../NavCollapse';

// assets
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

// ==============================|| SIDEBAR MENU LIST GROUP ||============================== //

const NavGroup = ({ item }) => {
    const theme = useTheme();
    const customization = useSelector((state) => state.customization);
    const Icon = item.icon;
    const itemIcon = item?.icon ? (
        <Icon stroke={1.5} size="1.3rem" />
    ) : (
        <FiberManualRecordIcon
            sx={{
                width: customization.isOpen.findIndex((id) => id === item?.id) > -1 ? 8 : 6,
                height: customization.isOpen.findIndex((id) => id === item?.id) > -1 ? 8 : 6
            }}
            fontSize={'medium'}
        />
    );

    // menu list collapse & items
    const items = item.children?.map((menu) => {
        switch (menu.type) {
            case 'collapse':
                return <NavCollapse key={menu.id} menu={menu} level={1} />;
            case 'item':
                return <NavItem key={menu.id} item={menu} level={1} />;
            default:
                return (
                    <Typography key={menu.id} variant="h6" color="error" align="center">
                        Menu Items Error
                    </Typography>
                );
        }
    });

    return (
        <>
            <List
                subheader={
                    item.title && (
                        <Stack direction="row" alignItems="center">
                            {itemIcon}
                            <Typography variant="caption" sx={{ ...theme.typography.menuCaption }} display="block" gutterBottom>
                                {item.title}
                                {item.caption && (
                                    <Typography variant="caption" sx={{ ...theme.typography.subMenuCaption }} display="block" gutterBottom>
                                        {item.caption}
                                    </Typography>
                                )}
                            </Typography>
                        </Stack>
                    )
                }
            >
                {items}
            </List>

            {/* group divider */}
            <Divider sx={{ mt: 0.25, mb: 1.25 }} />
        </>
    );
};

NavGroup.propTypes = {
    item: PropTypes.object
};

export default NavGroup;
