import { useState } from 'react'
import { AppBar, Toolbar, Typography, Box, Button, IconButton, Avatar, Menu, MenuItem,
  Divider, Tooltip, Switch, Stack } from '@mui/material'
import { LocalHospitalOutlined, DarkModeOutlined, LightModeOutlined,
  AccountCircleOutlined, LogoutOutlined, DashboardOutlined } from '@mui/icons-material'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useDarkMode } from '../../hooks/useDarkMode'
import { useLang } from '../../context/LanguageContext'
import { defaultRedirect } from '../../utils/rolePermissions'
import { getInitials } from '../../utils/helpers'

export default function Navbar({ dashboard = false }) {
  const navigate  = useNavigate()
  const { user, isAuthenticated, logout, role } = useAuth()
  const { isDark, toggleTheme } = useDarkMode()
  const { t, lang, toggleLang } = useLang()
  const [anchor, setAnchor] = useState(null)

  const fullName = user ? `${user.first_name} ${user.last_name}` : ''

  const handleLogout = () => { setAnchor(null); logout(); navigate('/login') }

  return (
    <AppBar position="sticky" elevation={0}
      sx={{bgcolor:'background.paper',borderBottom:'1px solid',borderColor:'divider',color:'text.primary'}}>
      <Toolbar sx={{gap:1}}>
        {/* Logo */}
        <RouterLink to="/" style={{textDecoration:'none',display:'flex',alignItems:'center',gap:8}}>
          <Box sx={{width:32,height:32,borderRadius:1.5,bgcolor:'primary.main',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff'}}>
            <LocalHospitalOutlined sx={{fontSize:18}}/>
          </Box>
          <Typography variant="h6" fontWeight={700} color="primary" sx={{display:{xs:'none',sm:'block'}}}>
            MediBook
          </Typography>
        </RouterLink>

        <Box sx={{flex:1}}/>

        {/* Nav links (non-dashboard only) */}
        {!dashboard && (
          <Button component={RouterLink} to="/doctors" color="inherit" sx={{display:{xs:'none',md:'inline-flex'}}}>
            {t('findDoctors')}
          </Button>
        )}

        {/* Dark mode */}
        <Tooltip title={isDark ? 'Light mode' : 'Dark mode'}>
          <IconButton onClick={toggleTheme} size="small">
            {isDark ? <LightModeOutlined fontSize="small"/> : <DarkModeOutlined fontSize="small"/>}
          </IconButton>
        </Tooltip>

        {/* Language */}
        <Button size="small" variant="outlined" onClick={toggleLang} sx={{minWidth:0,px:1.5,fontSize:12}}>
          {lang === 'en' ? 'ع' : 'EN'}
        </Button>

        {/* User menu */}
        {isAuthenticated ? (
          <>
            <Tooltip title={fullName}>
              <IconButton onClick={e=>setAnchor(e.currentTarget)} size="small">
                <Avatar sx={{width:32,height:32,bgcolor:'primary.main',fontSize:13}}>
                  {getInitials(fullName)}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={()=>setAnchor(null)}
              PaperProps={{sx:{mt:1.5,minWidth:180}}}>
              <Box sx={{px:2,py:1}}>
                <Typography variant="subtitle2" fontWeight={600}>{fullName}</Typography>
                <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
              </Box>
              <Divider/>
              <MenuItem onClick={()=>{setAnchor(null);navigate(defaultRedirect(role))}}>
                <DashboardOutlined fontSize="small" sx={{mr:1}}/>{t('dashboard')}
              </MenuItem>
              <MenuItem onClick={()=>{setAnchor(null);navigate('/profile')}}>
                <AccountCircleOutlined fontSize="small" sx={{mr:1}}/>{t('profile')}
              </MenuItem>
              <Divider/>
              <MenuItem onClick={handleLogout} sx={{color:'error.main'}}>
                <LogoutOutlined fontSize="small" sx={{mr:1}}/>{t('logout')}
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Stack direction="row" spacing={1}>
            <Button component={RouterLink} to="/login" variant="outlined" size="small">{t('login')}</Button>
            <Button component={RouterLink} to="/register" variant="contained" size="small">{t('register')}</Button>
          </Stack>
        )}
      </Toolbar>
    </AppBar>
  )
}
