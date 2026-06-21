import { useState } from 'react'
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom'
import { Box, Card, CardContent, Typography, Link, Divider, Stack } from '@mui/material'
import { LocalHospitalOutlined } from '@mui/icons-material'
import { useAuth } from '../../hooks/useAuth'
import { useTitle } from '../../hooks/useTitle'
import { useLang } from '../../context/LanguageContext'
import LoginForm from '../../components/forms/LoginForm'
import { defaultRedirect } from '../../utils/rolePermissions'

export default function Login() {
  const { login } = useAuth()
  const { t } = useLang()
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  useTitle(t('login'))
  const from = location.state?.from?.pathname

  const handleSubmit = async (values) => {
    setLoading(true); setApiError('')
    try {
      const user = await login(values)
      navigate(from || defaultRedirect(user.role), { replace: true })
    } catch(err) {
      setApiError(err?.response?.data?.detail || err?.response?.data?.message || t('error'))
    } finally { setLoading(false) }
  }

  return (
    <Card elevation={0} sx={{border:'1px solid',borderColor:'divider'}}>
      <CardContent sx={{p:{xs:3,sm:4}}}>
        <Stack spacing={3}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box sx={{width:40,height:40,borderRadius:2,bgcolor:'primary.main',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff'}}>
              <LocalHospitalOutlined fontSize="small"/>
            </Box>
            <Typography variant="h6" fontWeight={700} color="primary">MediBook</Typography>
          </Stack>
          <Box>
            <Typography variant="h5" fontWeight={700} gutterBottom>{t('welcomeBack')}</Typography>
            <Typography variant="body2" color="text.secondary">
              {t('noAccount')}{' '}
              <Link component={RouterLink} to="/register" underline="hover" fontWeight={500}>{t('register')}</Link>
            </Typography>
          </Box>
          <Divider />
          <LoginForm onSubmit={handleSubmit} apiError={apiError} loading={loading}/>
          <Box sx={{textAlign:'center'}}>
            <Link component={RouterLink} to="#" variant="body2" color="text.secondary" underline="hover">
              {t('forgotPassword')}
            </Link>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}
