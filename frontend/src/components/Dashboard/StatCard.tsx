import React from 'react';
import { Card, CardContent, Box, Typography, Chip, Avatar } from '@mui/material';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: string; // icon background color
  growth?: string; // e.g., "+12%"
  softBg?: string; // card soft background
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, color = '#3B82F6', growth, softBg }) => {
  return (
    <Card sx={{ borderRadius: 3, bgcolor: softBg || 'background.paper', boxShadow: '0 6px 24px rgba(45,53,83,0.06)' }}>
      <CardContent>
        <Box display="flex" alignItems="flex-start" justifyContent="space-between">
          <Avatar sx={{ bgcolor: color, width: 40, height: 40 }}>
            {icon}
          </Avatar>
          {growth && (
            <Chip label={growth} size="small" sx={{ bgcolor: '#22C55E', color: '#fff', fontWeight: 700 }} />
          )}
        </Box>
        <Box mt={2}>
          <Typography variant="h4" fontWeight={800} sx={{ color: '#0F172A' }}>
            {value}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            {subtitle || title}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;
