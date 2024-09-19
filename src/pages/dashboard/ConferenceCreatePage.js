import { Helmet } from 'react-helmet-async';
// @mui
import { Container } from '@mui/material';
// routes
// components
import { useSettingsContext } from '../../components/settings';
// sections
import ConferenceForm from '../../sections/@dashboard/e-commerce/ConferenceForm';
// import { PricingPlanCard } from '../sections/pricing';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';

// ----------------------------------------------------------------------

export default function ConferenceCreatePage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title> Conference: Create a new Conference | Indexing Journal</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
          heading="Create a New Conference"
          links={[
            { name: 'Dashboard', href: 'PATH_DASHBOARD.root' },
            {
              name: 'Conference',
              href: 'PATH_DASHBOARD.Conference.root',
            },
            { name: 'New Conference' },
          ]}
        />
        <ConferenceForm />
      </Container>
    </>
  );
}