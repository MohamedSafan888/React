import { Box, Container, Typography, Stack, Link } from '@mui/material'
import { LocalHospitalOutlined } from '@mui/icons-material'

export default function Footer() {
  return (
    <Box component="footer" sx={{borderTop:'1px solid',borderColor:'divider',py:3,mt:'auto'}}>
      <Container maxWidth="lg">
        <Stack direction={{xs:'column',sm:'row'}} justifyContent="space-between" alignItems="center" spacing={1}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <LocalHospitalOutlined fontSize="small" color="primary"/>
            <Typography variant="body2" fontWeight={600} color="primary">MediBook</Typography>
          </Stack>
          <Typography variant="caption" color="text.secondary">
            © {new Date().getFullYear()} MediBook. All rights reserved.
          </Typography>
        </Stack>
      </Container>
    </Box>
  )
}
