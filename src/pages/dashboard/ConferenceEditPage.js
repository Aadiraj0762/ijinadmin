import { paramCase } from 'change-case';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// redux
import { getProducts } from '../../redux/slices/product';
import { useDispatch, useSelector } from '../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
// sections
import ConferenceForm from '../../sections/@dashboard/e-commerce/ConferenceForm';

// ----------------------------------------------------------------------

export default function EcommerceProductEditPage() {
  const { themeStretch } = useSettingsContext();

  const dispatch = useDispatch();

  const { name } = useParams();

  const currentProduct = useSelector((state) =>
    state.product.products.find((product) => paramCase(product.name) === name)
  );

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  return (
    <>
      <Helmet>
        <title> Conference: Edit Conference | IndexingJournal</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Edit Conference"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Journal',
              href: PATH_DASHBOARD.conference.root,
            },
            { name: currentProduct?.name },
          ]}
        />

        <ConferenceForm isEdit currentProduct={currentProduct} />
      </Container>
    </>
  );
}
