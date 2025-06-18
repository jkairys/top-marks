import React from 'react';
import { FormControlLabel, Switch } from '@mui/material';

interface WindLayerToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const WindLayerToggle: React.FC<WindLayerToggleProps> = ({ checked, onChange }) => (
  <FormControlLabel
    control={<Switch checked={checked} onChange={e => onChange(e.target.checked)} color="primary" />}
    label="Show Wind Forecast"
    sx={{ ml: 2, mt: 1 }}
  />
);

export default WindLayerToggle;
