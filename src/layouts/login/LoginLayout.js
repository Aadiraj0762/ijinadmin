import PropTypes from 'prop-types';
// @mui
import { Stack, Typography } from '@mui/material';
// components
import Image from '../../components/image';
import { StyledContent, StyledRoot, StyledSection, StyledSectionBg } from './styles';

// ----------------------------------------------------------------------

LoginLayout.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  illustration: PropTypes.string,
};

export default function LoginLayout({ children, illustration, title }) {
  return (
    <StyledRoot>
      {/* <Logo
        sx={{
          zIndex: 9,
          position: 'absolute',
          mt: { xs: 1.5, md: 5 },
          ml: { xs: 2, md: 5 },
        }}
      /> */}

      <StyledSection>
        <Typography variant="h3" sx={{ mb: 10, maxWidth: 480, textAlign: 'center' }}>
          {/* {title || 'Hi, Welcome back'} */}
        </Typography>

        <Image
          disabledEffect
          visibleByDefault
          alt="auth"
          src={illustration || 'https://firebasestorage.googleapis.com/v0/b/journalindexing-38ac8.appspot.com/o/illustrations%2Fresearch.jpg?alt=media&token=e85706a6-e6ee-45a4-9295-cd7975712953'}
          sx={{ Width: "100%",height:'100%',marginBottom:'20px' }}
        />

        <StyledSectionBg />
      </StyledSection>

      <StyledContent>
        <Stack sx={{ width: 1 }}> {children} </Stack>
      </StyledContent>
    </StyledRoot>
  );
}
