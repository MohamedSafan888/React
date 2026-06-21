import { useState, useEffect } from 'react'
import { TextField, Button, Stack, Alert, CircularProgress, Avatar, Box, Typography } from '@mui/material'
import { useLang } from '../../context/LanguageContext'
import { getInitials } from '../../utils/helpers'

const validate = (v,t) => {
  const e={}
  if (!v.first_name) e.first_name=t('required')
  if (!v.last_name)  e.last_name=t('required')
  if (!v.phone)      e.phone=t('required')
  return e
}

export default function ProfileForm({ user, onSubmit, apiError, loading, success }) {
  const { t } = useLang()
  const [v,setV]           = useState({first_name:user?.first_name??'',last_name:user?.last_name??'',phone:user?.phone??''})
  const [errs,setErrs]     = useState({})
  const [touched,setTouched] = useState({})

  useEffect(()=>{ if(user) setV({first_name:user.first_name??'',last_name:user.last_name??'',phone:user.phone??''}) },[user])

  const change = e => {
    const {name,value}=e.target; setV(p=>({...p,[name]:value}))
    if(touched[name]) setErrs(validate({...v,[name]:value},t))
  }
  const blur = e => {
    const {name}=e.target; setTouched(p=>({...p,[name]:true})); setErrs(validate(v,t))
  }
  const submit = e => {
    e.preventDefault()
    setTouched({first_name:true,last_name:true,phone:true})
    const e2=validate(v,t); setErrs(e2)
    if(!Object.keys(e2).length) onSubmit(v)
  }
  const fullName = `${user?.first_name??''} ${user?.last_name??''}`.trim()
  return (
    <Stack component="form" onSubmit={submit} spacing={3} noValidate>
      <Box sx={{display:'flex',alignItems:'center',gap:2}}>
        <Avatar sx={{width:64,height:64,fontSize:22,bgcolor:'primary.main'}}>{getInitials(fullName)}</Avatar>
        <Box>
          <Typography variant="subtitle1" fontWeight={600}>{fullName||'—'}</Typography>
          <Typography variant="body2" color="text.secondary">{user?.email}</Typography>
        </Box>
      </Box>
      {apiError && <Alert severity="error" sx={{borderRadius:2}}>{apiError}</Alert>}
      {success  && <Alert severity="success" sx={{borderRadius:2}}>{t('success')}</Alert>}
      <TextField label={t('firstName')} name="first_name" value={v.first_name}
        onChange={change} onBlur={blur} error={!!errs.first_name} helperText={errs.first_name} fullWidth required/>
      <TextField label={t('lastName')} name="last_name" value={v.last_name}
        onChange={change} onBlur={blur} error={!!errs.last_name} helperText={errs.last_name} fullWidth required/>
      <TextField label={t('phone')} name="phone" type="tel" value={v.phone}
        onChange={change} onBlur={blur} error={!!errs.phone} helperText={errs.phone} fullWidth required inputProps={{dir:'ltr'}}/>
      <TextField label={t('email')} value={user?.email??''} fullWidth disabled inputProps={{dir:'ltr'}}/>
      <Button type="submit" variant="contained" size="large" disabled={loading}
        sx={{height:48,alignSelf:'flex-start',px:4}}>
        {loading?<CircularProgress size={22} color="inherit"/>:t('save')}
      </Button>
    </Stack>
  )
}
