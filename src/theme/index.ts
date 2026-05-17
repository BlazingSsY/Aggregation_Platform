import { createTheme } from '@mui/material/styles';

const PRIMARY = '#46AEF7';
const PRIMARY_DARK = '#104A78';
const PRIMARY_LIGHT = '#7BCFFA';
const ACCENT = '#16D9E3';

export const muiTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: PRIMARY,
      dark: PRIMARY_DARK,
      light: PRIMARY_LIGHT,
      contrastText: '#ffffff',
    },
    secondary: {
      main: ACCENT,
    },
    success: { main: '#30C7EC' },
    warning: { main: '#F59E0B' },
    error: { main: '#EF4444' },
    info: { main: '#30C7EC' },
    background: {
      default: '#F5FAFD',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0F2742',
      secondary: '#4A6582',
    },
    divider: '#DCE9F3',
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", "Segoe UI", "Source Han Sans CN", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          transition: 'all 0.25s ease',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #46AEF7 0%, #30C7EC 55%, #16D9E3 100%)',
          color: '#fff',
          boxShadow: '0 2px 8px rgba(48,199,236,0.32)',
          '&:hover': {
            background: 'linear-gradient(135deg, #1E7FC7 0%, #30C7EC 55%, #16D9E3 100%)',
            boxShadow: '0 6px 18px rgba(22,217,227,0.40)',
            transform: 'translateY(-1px)',
          },
        },
        outlinedPrimary: {
          borderWidth: 1.5,
          '&:hover': { borderWidth: 1.5 },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        colorDefault: {
          background: 'linear-gradient(135deg, #46AEF7 0%, #30C7EC 55%, #16D9E3 100%)',
          color: '#fff',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 6 },
        colorPrimary: {
          background: 'linear-gradient(135deg, rgba(70,174,247,0.12) 0%, rgba(123,207,250,0.18) 100%)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid #DCE9F3',
          boxShadow: '0 1px 2px rgba(15, 39, 66, 0.04)',
        },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
    },
    MuiTextField: {
      defaultProps: { size: 'small', fullWidth: true },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          background: 'linear-gradient(135deg, #EBF7FE 0%, #D6EFFD 100%)',
          color: '#0F2742',
          fontWeight: 600,
        },
      },
    },
  },
});

export default muiTheme;
