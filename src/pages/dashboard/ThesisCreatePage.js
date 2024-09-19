import { Helmet } from 'react-helmet-async';
// @mui
import { Container } from '@mui/material';
// routes
// components
import { useSettingsContext } from '../../components/settings';
// sections
import ThesisNewEditForm from '../../sections/@dashboard/e-commerce/ThesisNewEditForm';

// ----------------------------------------------------------------------

export default function ThesisCreatePage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title> Jounral Indexing : Create a new Thesis | INTERNATIONAL JOURNAL INDEXING</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        
        <ThesisNewEditForm />
      </Container>
    </>
  );
}
