import { useState } from 'react'
import { Box, Typography, TextField, Button, Grid, Paper, Alert } from '@mui/material'
import { styled } from '@mui/material/styles'
import chroma from 'chroma-js'

interface ColorGeneratorProps {
  title?: string;
  subtitle?: string;
  initialColor?: string;
  className?: string;
  onColorGenerated?: (palettes: string[][]) => void;
}

const ColorBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  height: '100px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer', 
  transition: 'all 0.2s ease-in-out',
  position: 'relative',
  flex: '1 1 150px',
  maxWidth: '200px',
  borderRadius: '12px',
  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 20px rgba(0,0,0,0.15)',
  },
}))

const PaletteContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  justifyContent: 'center',
  padding: theme.spacing(2),
  background: 'rgba(255, 255, 255, 0.1)',
  borderRadius: '16px',
  backdropFilter: 'blur(10px)',
}))

const StyledTextField = styled(TextField)(() => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '30px',
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: '#fff',
    },
  },
}))

const GenerateButton = styled(Button)(() => ({
  borderRadius: '30px',
  padding: '12px 32px',
  fontSize: '1.1rem',
  textTransform: 'none',
  background: 'linear-gradient(45deg, #21a3a3 30%, #2196f3 90%)',
  boxShadow: '0 4px 12px rgba(33, 163, 163, 0.3)',
  '&:hover': {
    background: 'linear-gradient(45deg, #1a8383 30%, #1976d2 90%)',
    boxShadow: '0 6px 15px rgba(33, 163, 163, 0.4)',
  },
}))

export const ColorGenerator = ({
  title = "Générateur de Palettes",
  subtitle = "Choisissez une couleur",
  initialColor = "#845EC2",
  className,
  onColorGenerated
}: ColorGeneratorProps) => {
  const [baseColor, setBaseColor] = useState(initialColor)
  const [palettes, setPalettes] = useState<string[][]>([])
  const [copyMessage, setCopyMessage] = useState('')
  const [showCopyAlert, setShowCopyAlert] = useState(false)
  const [copiedColorIndex, setCopiedColorIndex] = useState<{ paletteIndex: number; colorIndex: number } | null>(null)

  const generatePalettes = () => {
    const color = chroma(baseColor)
    const hsl = color.hsl()
    
    const newPalettes = [
      // Monochromatic
      chroma.scale([color, color.darken(2)]).colors(5),
      // Complementary
      [color.hex(), chroma.hsl((hsl[0] + 180) % 360, hsl[1], hsl[2]).hex()],
      // Triadic
      [
        color.hex(),
        chroma.hsl((hsl[0] + 120) % 360, hsl[1], hsl[2]).hex(),
        chroma.hsl((hsl[0] + 240) % 360, hsl[1], hsl[2]).hex()
      ],
      // Analogous
      [
        color.hex(),
        chroma.hsl((hsl[0] + 30) % 360, hsl[1], hsl[2]).hex(),
        chroma.hsl((hsl[0] - 30 + 360) % 360, hsl[1], hsl[2]).hex()
      ],
    ]
    setPalettes(newPalettes)
    onColorGenerated?.(newPalettes)
  }

  const copyToClipboard = async (color: string, paletteIndex: number, colorIndex: number) => {
    try {
      await navigator.clipboard.writeText(color)
      setCopyMessage('Copié !')
      setShowCopyAlert(true)
      setCopiedColorIndex({ paletteIndex, colorIndex })
      setTimeout(() => {
        setShowCopyAlert(false)
        setCopiedColorIndex(null)
      }, 2000)
    } catch (err) {
      setCopyMessage('Erreur')
      setShowCopyAlert(true)
    }
  }

  return (
    <Box className={className}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" component="h2" sx={{ mb: 2 }}>
          {title}
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 3 }}>
          {subtitle}
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          justifyContent: 'center',
          alignItems: 'center',
          maxWidth: '400px',
          margin: '0 auto'
        }}>
          <StyledTextField
            type="color"
            value={baseColor}
            onChange={(e) => setBaseColor(e.target.value)}
            sx={{ width: '120px' }}
          />
          <GenerateButton 
            variant="contained" 
            onClick={generatePalettes}
          >
            Générer
          </GenerateButton>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {palettes.map((palette: string[], paletteIndex: number) => (
          <div key={paletteIndex}>
            <PaletteContainer>
              {palette.map((color: string, colorIndex: number) => (
                <ColorBox
                  key={colorIndex}
                  sx={{ 
                    backgroundColor: color, 
                    color: chroma(color).luminance() > 0.5 ? '#000' : '#fff',
                    fontFamily: 'monospace'
                  }}
                  onClick={() => copyToClipboard(color, paletteIndex, colorIndex)}
                >
                  {color}
                  {showCopyAlert && 
                   copiedColorIndex?.paletteIndex === paletteIndex && 
                   copiedColorIndex?.colorIndex === colorIndex && (
                    <Alert 
                      severity="success"
                      sx={{
                        position: 'absolute',
                        top: '-35px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 1,
                      }}
                    >
                      {copyMessage}
                    </Alert>
                  )}
                </ColorBox>
              ))}
            </PaletteContainer>
          </div>
        ))}
      </Grid>
    </Box>
  )
}