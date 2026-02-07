import '@mantine/core/styles.css';
import Router from './routes/index';  
import { MantineProvider, createTheme, } from '@mantine/core';

const myColor = [
  '#effde7',
  '#e1f8d4',
  '#c3efab',
  '#a2e67e',
  '#87de58',
  '#75d93f',
  '#6bd731',
  '#59be23',
  '#4da91b',
  '#3d920d'
];

const theme = createTheme({
  colors: {
    myColor,
  },
  primaryColor: 'myColor',
});

function App() {
  return (
    <MantineProvider theme={theme}>
      <Router />
    </MantineProvider>
  )
}

export default App
