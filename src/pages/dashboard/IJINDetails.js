import { Box, Card, Container, Divider, Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs/CustomBreadcrumbs';
import { useSettingsContext } from '../../components/settings';
import { getIjinById } from '../../controller/ijinController';

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
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: { xs: 'center', md: 'flex-start' },
                  mb: { xs: 2, md: 0 },
                  p: 1,
                  border: '1px solid #e0e0e0', // Border around the cover image
                  borderRadius: '8px',
                }}
              >
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
                  <Typography variant="h2">{journal.title}</Typography>
                </Grid>
              )}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
              </Grid>
  
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
  
              {journal.ijin && (
                <Grid item xs={12} md={6}>
                  <Typography>
                    <b>IJIN:</b> {journal.ijin}
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
  
              {/* Divider before the description */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
              </Grid>
  
              {journal.description && (
                <Grid item xs={12}>
                  <Typography style={{ textAlign: 'justify' }}>
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
      issnPrint: PropTypes.string,
      issnOnline: PropTypes.string,
      yearOfStarting: PropTypes.string,
      licenseType: PropTypes.string,
      ijin: PropTypes.string,
      email: PropTypes.string,
      coverImage: PropTypes.string,
      description: PropTypes.string,
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
        const journalDetails = await getIjinById(id);
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
        <title>{`IJIN: ${journal?.title || ''} | INTERNATIONAL JOURNAL INDEXING`}</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'} style={{ backgroundImage: 'url("https://w0.peakpx.com/wallpaper/855/63/HD-wallpaper-light-purple-plain-background-purple.jpg")', height: '300px' }}>
        <CustomBreadcrumbs
          heading="IJIN Details"
          className="breadcrumb breadcrumb-link"
          style={{ color: 'white' }}
          links={[
            { name: 'Dashboard', },
            { name: 'IJIN',  },
            { name: 'Details',  },
            { name: journal?.title, style: { color: 'white' } },
          ]}
        />

        {!isLoading && journal && <JournalOverviewTab journal={journal} />}
      </Container>
    </>
  );
}
