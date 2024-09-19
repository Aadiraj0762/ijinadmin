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
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
// sections
import IjinForm from '../../sections/@dashboard/e-commerce/IjinForm';

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
        <title> IJIN : Edit Conference | IndexingJournal</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Edit IJIN"
          links={[
            { name: 'Dashboard', },
            {
              name: 'IJIN',
            },
            { name: currentProduct?.name },
          ]}
        />

        <IjinForm isEdit currentProduct={currentProduct} />
      </Container>
    </>
  );
}
