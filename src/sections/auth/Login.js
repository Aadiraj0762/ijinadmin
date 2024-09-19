// @mui
import { Stack, Typography } from '@mui/material';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// routes
// layouts
import LoginLayout from '../../layouts/login';
//
import Logo from '../../components/logo';
import AuthLoginForm from './AuthLoginForm';

// ----------------------------------------------------------------------

export default function Login() {
  const { method } = useAuthContext();

  return (
    <LoginLayout>
      <Logo sx={{height:100,width:100, display: 'flex', justifyContent: 'center', alignItems: 'center',marginLeft:15}}/>
      <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
        <Typography variant="h4" style={{textAlign:'center'}}>Login to Continue
        </Typography>

        <Stack direction="row" spacing={0.5}>
          {/* <Typography variant="body2">New user?</Typography> */}

          {/* <Link component={RouterLink} to={PATH_AUTH.register} variant="subtitle2">
            Create an account
          </Link> */}
        </Stack>

        {/* <Tooltip title={method} placement="left">
          <Box
            component="img"
            alt={method}
            src={`/assets/icons/auth/ic_${method}.png`}
            sx={{ width: 32, height: 32, position: 'absolute', right: 0 }}
          />
        </Tooltip> */}
      </Stack>

      {/* <Alert severity="info" sx={{ mb: 3 }}>
        Use email : <strong>demo@Minimalls.cc</strong> / password :<strong> demo1234</strong>
      </Alert> */}

      <AuthLoginForm />

      {/* <AuthWithSocial /> */}
    </LoginLayout>
  );
}
