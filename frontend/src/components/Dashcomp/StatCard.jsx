// src/components/Dashcomp/StatCard.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Chip, Typography, Box, Stack } from '@mui/material';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import { areaElementClasses } from '@mui/x-charts/LineChart';
import { useTheme } from '@mui/material/styles';

export default function StatCard({ title, value, interval, trend, data }) {
  const theme = useTheme();

  const trendColors = {
    up: theme.palette.success.main,
    down: theme.palette.error.main,
    neutral: theme.palette.grey[500],
  };
  const color = trendColors[trend] || trendColors.neutral;

  const trendText = {
    up: '+25%',
    down: '-25%',
    neutral: '+5%',
  };

  return (
    <Card variant="outlined" sx={{ height: '100%', flexGrow: 1 }}>
      <CardContent>
        <Typography variant="subtitle2" gutterBottom>
          {title}
        </Typography>
        <Stack spacing={1}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h4">{value}</Typography>
            <Chip
              size="small"
              label={trendText[trend]}
              sx={{
                bgcolor: color,
                color: '#fff',
              }}
            />
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {interval}
          </Typography>
          {/* Sparkline area chart */}
          <Box sx={{ width: '100%', height: 50 }}>
            <SparkLineChart
              data={data}
              area
              showHighlight
              showTooltip
              colors={[color]}
              sx={{
                [`& .${areaElementClasses.root}`]: {
                  fill: color,
                  fillOpacity: 0.25,
                },
              }}
            />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  interval: PropTypes.string.isRequired,
  trend: PropTypes.oneOf(['up', 'down', 'neutral']).isRequired,
  data: PropTypes.arrayOf(PropTypes.number).isRequired,
};
