import { ColorGenerator } from './components/ColorGenerator'
import { Container, Typography } from '@mui/material'
import './App.css';

function App() {
  // Cette fonction nous permettra de voir les palettes générées dans la console
  const handleColorGenerated = (palettes: string[][]) => {
    console.log('Nouvelles palettes générées:', palettes)
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" align="center" gutterBottom>
        
      </Typography>

      {/* Test avec les props par défaut */}
      <ColorGenerator 
        onColorGenerated={handleColorGenerated}
      />
    </Container>
  )
}

export default App