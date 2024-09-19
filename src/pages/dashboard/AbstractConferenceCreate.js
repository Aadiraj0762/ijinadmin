import { Helmet } from 'react-helmet-async';
// @mui
import { Container } from '@mui/material';
// routes
// components
import { useSettingsContext } from '../../components/settings';
import AbstractConference from '../../sections/@dashboard/e-commerce/AbstractConference';
// sections

// ----------------------------------------------------------------------
export default function ConferenceCreatePage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title> Ecommerce: Create a new product | INTERNATIONAL JOURNAL INDEXING</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        
        <AbstractConference />
      </Container>
    </>
  );
}