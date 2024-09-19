import { Helmet } from 'react-helmet-async';
// @mui
import { Box, Card, CardHeader, Container, Stack } from '@mui/material';
// routes
import { PATH_PAGE } from '../../../routes/paths';
// components
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
// sections
import BasicTable from '../../../sections/_examples/mui/table/BasicTable';
import CollapsibleTable from '../../../sections/_examples/mui/table/collapsible-table';
import GroupingFixedHeader from '../../../sections/_examples/mui/table/GroupingFixedHeader';
import SortingSelecting from '../../../sections/_examples/mui/table/sorting-selecting';

// ----------------------------------------------------------------------

export default function MUITablePage() {
  return (
    <>
      <Helmet>
        <title> MUI Components: Table | INTERNATIONAL JOURNAL INDEXING</title>
      </Helmet>

      <Box
        sx={{
          pt: 6,
          pb: 1,
          bgcolor: (theme) => (theme.palette.mode === 'light' ? 'grey.200' : 'grey.800'),
        }}
      >
        <Container>
          <CustomBreadcrumbs
            heading="Table"
            links={[
              {
                name: 'Components',
                href: PATH_PAGE.components,
              },
              { name: 'Table' },
            ]}
            moreLink={['https://mui.com/components/tables']}
          />
        </Container>
      </Box>

      <Container sx={{ my: 10 }}>
        <Stack spacing={3}>
          <Card>
            <CardHeader title="Basic Table" />
            <BasicTable />
          </Card>

          <Card>
            <SortingSelecting />
          </Card>

          <Card>
            <CardHeader title="Grouping & FixedHeader" />
            <GroupingFixedHeader />
          </Card>

          <Card>
            <CardHeader title="Collapsible Table" />
            <CollapsibleTable />
          </Card>
        </Stack>
      </Container>
    </>
  );
}
