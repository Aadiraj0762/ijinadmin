import { Helmet } from 'react-helmet-async';
// @mui
import { Container } from '@mui/material';
// routes
// components
// sections
import { paramCase } from 'change-case';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSettingsContext } from '../../components/settings';

import ThesisNewEditForm from '../../sections/@dashboard/e-commerce/ThesisNewEditForm';

// ----------------------------------------------------------------------

// @mui
// redux
import { getProducts } from '../../redux/slices/product';
import { useDispatch, useSelector } from '../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections

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
      <title> Jounral Indexing : Edit a new Thesis | INTERNATIONAL JOURNAL INDEXING</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Edit Thesis"
          links={[
            { name: 'Dashboard',  },
            {
              name: 'Journal',
              href: PATH_DASHBOARD.eCommerce.root,
            },
            { name: currentProduct?.name },
          ]}
        />

        <ThesisNewEditForm isEdit currentProduct={currentProduct} />
      </Container>
    </>
  );
}
