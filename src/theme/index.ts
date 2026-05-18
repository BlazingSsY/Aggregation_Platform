import { createTheme } from '@mui/material/styles';

const PRIMARY = '#4BB8FA';
const PRIMARY_DARK = '#1788D4';
const PRIMARY_LIGHT = '#DDF2FF';
const ACCENT = '#256B9F';

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
    success: { main: '#2E7D59' },
    warning: { main: '#D68A00' },
    error: { main: '#C2413B' },
    info: { main: PRIMARY },
    background: {
      default: '#F5F8FB',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#172B3A',
      secondary: '#607282',
    },
    divider: '#E2EAF1',
  },
  shape: { borderRadius: 8 },
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
          transition: 'background-color 0.18s ease, border-color 0.18s ease, color 0.18s ease',
        },
        containedPrimary: {
          backgroundColor: PRIMARY,
          color: '#fff',
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: PRIMARY_DARK,
            boxShadow: 'none',
          },
        },
        outlinedPrimary: {
          borderColor: '#B8DFF7',
          color: '#256B9F',
          '&:hover': {
            borderColor: PRIMARY,
            backgroundColor: '#EFF9FF',
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        colorDefault: {
          backgroundColor: PRIMARY,
          color: '#fff',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 6 },
        colorPrimary: {
          background: '#EEF8FE',
          color: '#256B9F',
          borderColor: '#B8DFF7',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: '1px solid #E2EAF1',
          boxShadow: '0 8px 24px rgba(23, 43, 58, 0.05)',
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
          backgroundColor: '#F6FAFD',
          color: '#34495A',
          fontWeight: 600,
        },
      },
    },
  },
});

export default muiTheme;
