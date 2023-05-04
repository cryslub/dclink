import PropTypes from 'prop-types';
import { useState, useRef, useEffect } from 'react';
import { Button, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { TOGGLE_PERSON_INFO } from 'store/actions';

const PersonName = ({ size, title, person }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const info = (e) => {
        console.log(e);
        e.stopPropagation();
        if (typeof e.preventDefault === 'function') e.preventDefault();
        dispatch({ type: TOGGLE_PERSON_INFO, personInfoOpen: true, person });
    };

    return (
        <Tooltip title="인물이력">
            <Button
                variant="text"
                size={size}
                style={{
                    padding: 5,
                    minHeight: 0,
                    minWidth: 0,
                    alignitems: 'end',
                    color: theme.palette.grey[900],
                    whiteSpace: 'nowrap'
                }}
                onClick={info}
            >
                {title}
            </Button>
        </Tooltip>
    );
};

PersonName.propTypes = {
    size: PropTypes.string
};

export default PersonName;
