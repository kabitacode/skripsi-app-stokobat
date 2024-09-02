"use client"

import * as React from 'react';

import { Button, ButtonProps } from '@mui/material';
import { styled } from '@mui/system';

interface CustomButtonProps extends ButtonProps {
  fontSize?: string;
  buttonColor?: string;
  textColor?: string;
  textTransform?: string;
  icon?: React.ReactNode;
}

export const ButtonCustom = styled(Button)<CustomButtonProps>`
  font-size: ${(props) => props.fontSize || '0.875rem'};
  background-color: ${(props) => props.buttonColor || 'initial'};
  color: ${(props) => props.textColor || 'initial'};
  text-transform: ${(props) => props.textTransform || 'none'};
`;

export const CustomButton = styled(Button)({
    boxShadow: 'none',
    textTransform: 'none',
    fontSize: 16,
    padding: '6px 12px',
    border: '1px solid',
    lineHeight: 1.5,
    backgroundColor: '#1d4ed8',
    color: '#ffffff',
    borderColor: '#0063cc',
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:hover': {
      backgroundColor: '#0069d9',
      borderColor: '#0062cc',
      boxShadow: 'none',
    },
    '&:active': {
      boxShadow: 'none',
      backgroundColor: '#0062cc',
      borderColor: '#005cbf',
    },
    '&:focus': {
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
    },
  });

  