import { useState } from 'react'
import { TextField, Button, IconButton, InputAdornment, Alert, Stack, Grid,
  ToggleButtonGroup, ToggleButton, CircularProgress, Typography } from '@mui/material'
import { Visibility, VisibilityOff, PersonOutlined, LocalHospitalOutlined } from '@mui/icons-material'
import { useLang } from '../../context/LanguageContext'

const INIT = { first_name:'', last_name:'', email:'', phone:'', password:'', confirmPassword:'', role:'patient' }

const validate = (v, t) => {
  const e = {}
  if (!v.first_name) e.first_name = t('required')
  if (!v.last_name)  e.last_name  = t('required')
  if (!v.email) e.email = t('required')
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = t('invalidEmail')
  if (!v.phone) e.phone = t('required')
  if (!v.password) e.password = t('required')
  else if (v.password.length < 8) e.password = t('passwordMin')
  if (!v.confirmPassword) e.confirmPassword = t('required')
  else if (v.password !== v.confirmPassword) e.confirmPassword = t('passwordMatch')
  return e
}

export default function RegisterForm({ onSubmit, apiError, loading }) {
  const { t } = useLang()
  const [v, setV]           = useState(INIT)
  const [errs, setErrs]     = useState({})
  const [touched, setTouched] = useState({})
  const [showP, setShowP]   = useState(false)
  const [showC, setShowC]   = useState(false)

  const change = e => {
    const {name,value} = e.target; setV(p=>({...p,[name]:value}))
    if (touched[name]) setErrs(validate({...v,[name]:value},t))
  }
  const blur = e => {
    const {name} = e.target; setTouched(p=>({...p,[name]:true})); setErrs(validate(v,t))
  }
  const submit = e => {
    e.preventDefault()
    const all = Object.fromEntries(Object.keys(INIT).map(k=>[k,true])); setTouched(all)
    const e2 = validate(v,t); setErrs(e2)
    if (!Object.keys(e2).length) { const {confirmPassword,...rest}=v; onSubmit(rest) }
  }

  return (
    <Stack component="form" onSubmit={submit} spacing={2.5} noValidate>
      {apiError && <Alert severity="error" sx={{borderRadius:2}}>{apiError}</Alert>}

      <Stack spacing={0.5}>
        <Typography variant="body2" color="text.secondary">{t('role')}</Typography>
        <ToggleButtonGroup value={v.role} exclusive onChange={(_,r)=>r&&setV(p=>({...p,role:r}))}
          fullWidth size="small" sx={{'& .MuiToggleButton-root':{borderRadius:'8px !important',py:1,gap:1,fontWeight:500},gap:1}}>
          <ToggleButton value="patient"><PersonOutlined fontSize="small"/>{t('patient')}</ToggleButton>
          <ToggleButton value="doctor"><LocalHospitalOutlined fontSize="small"/>{t('doctor')}</ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField label={t('firstName')} name="first_name" value={v.first_name}
            onChange={change} onBlur={blur} error={!!errs.first_name} helperText={errs.first_name} fullWidth required/>
        </Grid>
        <Grid item xs={6}>
          <TextField label={t('lastName')} name="last_name" value={v.last_name}
            onChange={change} onBlur={blur} error={!!errs.last_name} helperText={errs.last_name} fullWidth required/>
        </Grid>
      </Grid>

      <TextField label={t('email')} name="email" type="email" value={v.email}
        onChange={change} onBlur={blur} error={!!errs.email} helperText={errs.email}
        fullWidth required inputProps={{dir:'ltr'}}/>
      <TextField label={t('phone')} name="phone" type="tel" value={v.phone}
        onChange={change} onBlur={blur} error={!!errs.phone} helperText={errs.phone}
        fullWidth required inputProps={{dir:'ltr'}}/>

      {[['password',showP,setShowP,'new-password'],['confirmPassword',showC,setShowC,'new-password']].map(([name,show,setShow,ac])=>(
        <TextField key={name} label={t(name)} name={name} type={show?'text':'password'} value={v[name]}
          onChange={change} onBlur={blur} error={!!errs[name]} helperText={errs[name]}
          autoComplete={ac} fullWidth required
          InputProps={{endAdornment:(
            <InputAdornment position="end">
              <IconButton onClick={()=>setShow(p=>!p)} edge="end" size="small">
                {show?<VisibilityOff fontSize="small"/>:<Visibility fontSize="small"/>}
              </IconButton>
            </InputAdornment>
          )}}/>
      ))}

      <Button type="submit" variant="contained" size="large" fullWidth disabled={loading} sx={{height:48}}>
        {loading?<CircularProgress size={22} color="inherit"/>:t('register')}
      </Button>
    </Stack>
  )
}
