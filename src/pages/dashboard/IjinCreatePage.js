import { Helmet } from 'react-helmet-async';
// @mui
import { Container } from '@mui/material';
// routes
// components
import { useSettingsContext } from '../../components/settings';
// sections
import IjinForm from '../../sections/@dashboard/e-commerce/IjinForm';
// import { PricingPlanCard } from '../sections/pricing';

// ----------------------------------------------------------------------

export default function ConferenceCreatePage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title> IJIN: Create a new Value | INTERNATIONAL JOURNAL INDEXING</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        
        <IjinForm />
      </Container>
    </>
  );
}