import { Box, Card, Container, Divider, Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs/CustomBreadcrumbs';
import { useSettingsContext } from '../../components/settings';
import { getJournalById } from '../../controller/propertiesController';
import { PATH_DASHBOARD } from '../../routes/paths';

const formatFirestoreTimestamp = (timestamp) => {
  if (!timestamp || !timestamp.seconds) return '';
  const date = new Date(timestamp.seconds * 1000);
  return format(date, 'dd-MM-yyyy');
};

const JournalOverviewTab = ({ journal }) => (
  <Card>
    <Box sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: '8px' }}>
      <Grid container spacing={2}>
        {/* Image with border */}
        {journal.coverImage && (
          <Grid item xs={12} md={3}>
            <Box sx={{
              display: 'flex',
              justifyContent: { xs: 'center', md: 'flex-start' },
              mb: { xs: 2, md: 0 },
              p: 1,
              border: '1px solid #e0e0e0', // Border around the cover image
              borderRadius: '8px',
            }}>
              <img
                src={journal.coverImage}
                alt="Cover"
                style={{ width: '100%', maxWidth: '200px', height: 'auto' }}
              />
            </Box>
          </Grid>
        )}

        {/* Journal Details with border */}
        <Grid item xs={12} md={9}>
          <Grid container spacing={1}>
            {journal.title && (
              <Grid item xs={12}>
                <Typography variant="h2">
                  {journal.title}
                </Typography>
              </Grid>
            )}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>
            {journal.abbreviation && (
              <Grid item xs={12} md={6}>
                <Typography>
                  <b>Abbreviation:</b> {journal.abbreviation}
                </Typography>
              </Grid>
            )}

            {journal.url && (
              <Grid item xs={12} md={6}>
                <Typography style={{color:"#00000"}}>
                  <b>URL:</b> <a href={journal.url} target="_blank" rel="noopener noreferrer" style={{color:"black"}}>{journal.url} </a>
                </Typography>
              </Grid>
            )}

            {journal.issnPrint && (
              <Grid item xs={12} md={6}>
                <Typography>
                  <b>ISSN (Print):</b> {journal.issnPrint}
                </Typography>
              </Grid>
            )}

            {journal.issnOnline && (
              <Grid item xs={12} md={6}>
                <Typography>
                  <b>ISSN (Online):</b> {journal.issnOnline}
                </Typography>
              </Grid>
            )}

            {journal.publisher && (
              <Grid item xs={12} md={6}>
                <Typography>
                  <b>Publisher:</b> {journal.publisher}
                </Typography>
              </Grid>
            )}

            {journal.discipline && (
              <Grid item xs={12} md={6}>
                <Typography>
                  <b>Discipline:</b> {journal.discipline}
                </Typography>
              </Grid>
            )}

            {journal.email && (
              <Grid item xs={12} md={6}>
                <Typography>
                  <b>Email:</b> {journal.email}
                </Typography>
              </Grid>
            )}

            {journal.country && (
              <Grid item xs={12} md={6}>
                <Typography>
                  <b>Country:</b> {journal.country}
                </Typography>
              </Grid>
            )}

            {journal.language && (
              <Grid item xs={12} md={6}>
                <Typography>
                  <b>Language:</b> {journal.language}
                </Typography>
              </Grid>
            )}

            {journal.frequency && (
              <Grid item xs={12} md={6}>
                <Typography>
                  <b>Frequency:</b> {journal.frequency}
                </Typography>
              </Grid>
            )}

            {journal.yearOfStarting && (
              <Grid item xs={12} md={6}>
                <Typography>
                  <b>Year of Starting:</b> {journal.yearOfStarting}
                </Typography>
              </Grid>
            )}

            {journal.licenseType && (
              <Grid item xs={12} md={6}>
                <Typography>
                  <b>License Type:</b> {journal.licenseType}
                </Typography>
              </Grid>
            )}

            {journal.normalProcessing !== undefined && (
              <Grid item xs={12} md={6}>
                <Typography>
                  <b>Normal Processing:</b> {journal.normalProcessing ? 'Yes' : 'No'}
                </Typography>
              </Grid>
            )}

            {journal.fastTrackProcessing !== undefined && (
              <Grid item xs={12} md={6}>
                <Typography>
                  <b>Fast Track Processing:</b> {journal.fastTrackProcessing ? 'Yes' : 'No'}
                </Typography>
              </Grid>
            )}


            {/* Divider before the description */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>

            {journal.description && (
              <Grid item xs={12}>
                <Typography style={{ textAlign: "justify" }}>
                  <b>Description:</b> {journal.description}
                </Typography>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  </Card>
);

JournalOverviewTab.propTypes = {
  journal: PropTypes.shape({
    title: PropTypes.string,
    abbreviation: PropTypes.string,
    url: PropTypes.string,
    issnPrint: PropTypes.string,
    issnOnline: PropTypes.string,
    publisher: PropTypes.string,
    discipline: PropTypes.string,
    email: PropTypes.string,
    country: PropTypes.string,
    language: PropTypes.string,
    frequency: PropTypes.string,
    yearOfStarting: PropTypes.string,
    licenseType: PropTypes.string,
    coverImage: PropTypes.string,
    description: PropTypes.string,
    normalProcessing: PropTypes.bool,
    fastTrackProcessing: PropTypes.bool,
  }).isRequired,
};

export default function JournalDetailsPage() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();
  const [journal, setJournal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchJournal = async () => {
      try {
        const journalDetails = await getJournalById(id);
        setJournal(journalDetails);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    if (id) {
      fetchJournal();
    }
  }, [id]);

  return (
    <>
      <Helmet>
        <title>{`Journal: ${journal?.title || ''} | INTERNATIONAL JOURNAL INDEXING`}</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'} style={{ backgroundImage: 'url("https://w0.peakpx.com/wallpaper/855/63/HD-wallpaper-light-purple-plain-background-purple.jpg")', height: '300px' }}>
        <CustomBreadcrumbs
          heading="Journal Details"
          className="breadcrumb breadcrumb-link"
          style={{ color: 'white' }}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root, style: { color: 'white' } },
            { name: 'Journal', href: PATH_DASHBOARD.eCommerce.root, style: { color: 'white' } },
            { name: 'Details', href: PATH_DASHBOARD.eCommerce.shop, style: { color: 'white' } },
            { name: journal?.title, style: { color: 'white' } },
          ]}
        />

        {!isLoading && journal && <JournalOverviewTab journal={journal} />}
      </Container>
    </>
  );
}
