import { useState, useEffect } from 'react'
import { Container, Typography, Card, CardContent, Grid, Box, Button, MenuItem,
  TextField, Chip, Stack, CircularProgress, Alert } from '@mui/material'
import { AddOutlined, DeleteOutlined } from '@mui/icons-material'
import { doctorService } from '../../services/doctorService'
import { useTitle } from '../../hooks/useTitle'
import { useLang } from '../../context/LanguageContext'
import { useSnackbar } from 'notistack'

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
const TIMES = Array.from({length:24},(_,i)=>`${String(i).padStart(2,'0')}:00`)

const INIT = { day:1, start_time:'08:00', end_time:'09:00' }

export default function ScheduleManagement() {
  const { t } = useLang()
  const { enqueueSnackbar } = useSnackbar()
  const [slots, setSlots]   = useState([])
  const [form, setForm]     = useState(INIT)
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')
  useTitle(t('manageAvailability'))

  useEffect(() => {
    doctorService.getAvailability('me').then(setSlots).catch(()=>{})
  },[])

  const handleAdd = async (e) => {
    e.preventDefault(); setError('')
    if (form.start_time >= form.end_time) { setError('End time must be after start time'); return }
    setSaving(true)
    try {
      const saved = await doctorService.setAvailability(form)
      setSlots(p=>[...p, saved])
      enqueueSnackbar('Slot added!', {variant:'success'})
      setForm(INIT)
    } catch(err) {
      setError(err?.response?.data?.detail || t('error'))
    } finally { setSaving(false) }
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" fontWeight={700} mb={3}>{t('manageAvailability')}</Typography>
      <Grid container spacing={3}>
        {/* Add slot form */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>Add new slot</Typography>
              {error && <Alert severity="error" sx={{mb:2}}>{error}</Alert>}
              <Box component="form" onSubmit={handleAdd}>
                <Stack spacing={2}>
                  <TextField select label="Day" value={form.day} onChange={e=>setForm(p=>({...p,day:e.target.value}))}>
                    {DAYS.map((d,i)=><MenuItem key={i} value={i}>{d}</MenuItem>)}
                  </TextField>
                  <TextField select label="Start time" value={form.start_time} onChange={e=>setForm(p=>({...p,start_time:e.target.value}))}>
                    {TIMES.map(t=><MenuItem key={t} value={t}>{t}</MenuItem>)}
                  </TextField>
                  <TextField select label="End time" value={form.end_time} onChange={e=>setForm(p=>({...p,end_time:e.target.value}))}>
                    {TIMES.map(t=><MenuItem key={t} value={t}>{t}</MenuItem>)}
                  </TextField>
                  <Button type="submit" variant="contained" startIcon={<AddOutlined/>} disabled={saving}>
                    {saving ? <CircularProgress size={20} color="inherit"/> : 'Add slot'}
                  </Button>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Existing slots */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>Your schedule</Typography>
              {slots.length === 0
                ? <Typography color="text.secondary" sx={{py:3,textAlign:'center'}}>No slots added yet.</Typography>
                : DAYS.map((day,dayIdx) => {
                  const daySlots = slots.filter(s=>s.day===dayIdx||s.day===day)
                  if (!daySlots.length) return null
                  return (
                    <Box key={dayIdx} mb={2}>
                      <Typography variant="subtitle2" fontWeight={600} mb={1}>{day}</Typography>
                      <Stack direction="row" flexWrap="wrap" gap={1}>
                        {daySlots.map((s,i)=>(
                          <Chip key={i} label={`${s.start_time} – ${s.end_time}`}
                            color={s.is_available?'success':'default'} variant="outlined"
                            onDelete={()=>setSlots(p=>p.filter((_,j)=>j!==i))}
                            deleteIcon={<DeleteOutlined fontSize="small"/>}/>
                        ))}
                      </Stack>
                    </Box>
                  )
                })
              }
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}
