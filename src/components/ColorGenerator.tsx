import { useState } from 'react'
import { Box, Typography, TextField, Button,Paper, Alert } from '@mui/material'
import { styled } from '@mui/material/styles'
import chroma from 'chroma-js'
import Grid from '@mui/material/Grid'


interface ColorGeneratorProps {
  title?: string;
  subtitle?: string;
  initialColor?: string;
  className?: string;
  onColorGenerated?: (palettes: string[][]) => void;
}

const ColorBox = styled(Paper)(() => ({
  height: '100px',
  width: '150px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '12px',
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  cursor: 'pointer',
  position: 'relative',
  transition: 'all 0.2s ease-in-out',
  fontFamily: 'monospace',
  textAlign: 'center',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
  },
}))

const PaletteWrapper = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  padding: theme.spacing(2),
  borderRadius: '16px',
  background: 'rgba(255,255,255,0.08)',
  backdropFilter: 'blur(6px)',
}))

const StyledTextField = styled(TextField)(() => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '30px',
  },
}))

const GenerateButton = styled(Button)(() => ({
  borderRadius: '30px',
  padding: '10px 28px',
  fontSize: '1rem',
  textTransform: 'none',
  background: 'linear-gradient(45deg, #2196f3, #21a3a3)',
  '&:hover': {
    background: 'linear-gradient(45deg, #1976d2, #1a8383)',
  },
}))

const PALETTE_LABELS = ['Monochromatique', 'Complémentaire', 'Triadique', 'Analogue', 'Tétradique',
  'Pastel']

export const ColorGenerator = ({
  title = "Générateur de Palettes",
  subtitle = "Choisissez une couleur",
  initialColor = "#6ce68d",
  className,
  onColorGenerated
}: ColorGeneratorProps) => {
  const [baseColor, setBaseColor] = useState(initialColor)
  const [palettes, setPalettes] = useState<string[][]>([])
  const [copyMessage, setCopyMessage] = useState('')
  const [copiedColorIndex, setCopiedColorIndex] = useState<{ paletteIndex: number; colorIndex: number } | null>(null)

  const generatePalettes = () => {
    const color = chroma(baseColor)
    const hsl = color.hsl()
  
    const monoPalette = chroma
      .scale([color.brighten(1.2), color.darken(2)])
      .colors(5)
  
    const complementary = chroma
      .scale([
        chroma.hsl((hsl[0] + 180) % 360, hsl[1], hsl[2]),
        color
      ])
      .colors(5)
  
    const triadic = [0, 120, 240].map((deg, i) =>
      chroma.hsl((hsl[0] + deg) % 360, hsl[1], 0.5 + 0.1 * ((i % 2) * 2 - 1)).hex()
    )
  
    const analogous = [-30, 0, 30, 60, 90].map((deg) =>
      chroma.hsl((hsl[0] + deg + 360) % 360, hsl[1], hsl[2]).hex()
    )
  
    const tetradic = [0, 90, 180, 270].map((deg) =>
      chroma.hsl((hsl[0] + deg) % 360, hsl[1], hsl[2]).hex()
    )
  
    const pastel = Array.from({ length: 5 }, (_, i) =>
      chroma(baseColor)
        .set('hsl.l', 0.85 - i * 0.05)
        .set('hsl.s', 0.4)
        .hex()
    )
  
    const newPalettes = [
      monoPalette,
      complementary,
      triadic,
      analogous,
      tetradic,
      pastel
    ]
  
    setPalettes(newPalettes)
    onColorGenerated?.(newPalettes)
  }
  
  

  const copyToClipboard = async (color: string, paletteIndex: number, colorIndex: number) => {
    try {
      await navigator.clipboard.writeText(color)
      setCopyMessage('Copié !')
      setCopiedColorIndex({ paletteIndex, colorIndex })
      setTimeout(() => setCopiedColorIndex(null), 1500)
    } catch {
      setCopyMessage('Erreur')
    }
  }

  return (
    <Box className={className}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" component="h2" sx={{ mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 3 }}>
          {subtitle}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', alignItems: 'center' }}>
          <StyledTextField
            type="color"
            value={baseColor}
            onChange={(e) => setBaseColor(e.target.value)}
            sx={{ width: '80px' }}
          />
          <GenerateButton variant="contained" onClick={generatePalettes}>
            Générer
          </GenerateButton>
        </Box>
      </Box>

      {palettes.map((palette, paletteIndex) => (
        <PaletteWrapper key={paletteIndex}>
          <Typography variant="h6" sx={{ mb: 2, textAlign: 'center', fontWeight: 500 }}>
            {PALETTE_LABELS[paletteIndex]}
          </Typography>
          <Grid container spacing={2} justifyContent="center">
  {palette.map((color, colorIndex) => (
    <Grid key={colorIndex}>
      <ColorBox
        onClick={() => copyToClipboard(color, paletteIndex, colorIndex)}
        sx={{
          backgroundColor: color,
          color: chroma(color).luminance() > 0.5 ? '#000' : '#fff',
        }}
      >
        {color}
        {copiedColorIndex?.paletteIndex === paletteIndex &&
          copiedColorIndex?.colorIndex === colorIndex && (
            <Alert
              severity="success"
              sx={{
                position: 'absolute',
                top: '-30px',
                left: '50%',
                transform: 'translateX(-50%)',
                p: 0.5,
                fontSize: '0.75rem'
              }}
            >
              {copyMessage}
            </Alert>
          )}
      </ColorBox>
    </Grid>
  ))}
</Grid>

        </PaletteWrapper>
      ))}
    </Box>
  )
}
