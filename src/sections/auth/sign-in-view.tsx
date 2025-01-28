import { useState } from 'react';
import {  signInWithEmailAndPassword,  } from 'firebase/auth';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from '../../routes/hooks';
import {Iconify} from '../../components/iconify';

import { auth } from '../../fireaseconfig/firebase';

export function SignInView() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (error) {
      console.error('Error signing in:', error.message);
    }
    setLoading(false);
  };


  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">Sign in</Typography>
        <Typography variant="body2" color="text.secondary">
          Don’t have an account?
          <Link variant="subtitle2" sx={{ ml: 0.5 }}>Get started</Link>
        </Typography>
      </Box>

      <Box display="flex" flexDirection="column" alignItems="flex-end">
        <TextField
          fullWidth
          name="email"
          label="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 3 }}
        />

        <Link variant="body2" color="inherit" sx={{ mb: 1.5 }}>Forgot password?</Link>

        <TextField
          fullWidth
          name="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputLabelProps={{ shrink: true }}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          color="inherit"
          variant="contained"
          onClick={handleSignIn}
          loading={loading}
        >
          Sign in
        </LoadingButton>
      </Box>

      <Divider sx={{ my: 3, '&::before, &::after': { borderTopStyle: 'dashed' } }}>
        <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 'fontWeightMedium' }}>OR</Typography>
      </Divider>

      <Box gap={1} display="flex" justifyContent="center">
        <IconButton color="inherit">
          <Iconify icon="logos:google-icon" />
        </IconButton>
        <IconButton color="inherit">
          <Iconify icon="eva:github-fill" />
        </IconButton>
        <IconButton color="inherit">
          <Iconify icon="ri:twitter-x-fill" />
        </IconButton>
      </Box>
    </>
  );
}
