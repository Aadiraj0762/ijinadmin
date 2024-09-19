import { Helmet } from 'react-helmet-async';
// @mui
import { Container } from '@mui/material';
// routes
// components
import { useSettingsContext } from '../../components/settings';
import AbstractJournals from '../../sections/@dashboard/e-commerce/shop/AbstractJournals';
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
        
        <AbstractJournals />
      </Container>
    </>
  );
}