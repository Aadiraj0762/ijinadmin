import { Box, Card, Container, Divider, Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { format } from 'date-fns';
import DOMPurify from 'dompurify';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

import CustomBreadcrumbs from '../../components/custom-breadcrumbs/CustomBreadcrumbs';
import { useSettingsContext } from '../../components/settings';
import { PATH_DASHBOARD } from '../../routes/paths';
// 
import { getConferenceById } from '../../controller/articlesController';

const formatFirestoreTimestamp = (timestamp) => {
  if (!timestamp || !timestamp.seconds) return '';
  const date = new Date(timestamp.seconds * 1000);
  return format(date, 'dd-MM-yyyy');
};

const sanitizeAndFormatDescription = (description) => {
  if (!description) return '';

  // Remove HTML tags using DOMPurify
  const cleanText = DOMPurify.sanitize(description, { ALLOWED_TAGS: [] });

  // Replace line breaks with `<br />` for formatting
  return cleanText.replace(/\n/g, '<br />');
};

const ConferenceOverviewTab = ({ conference }) => (
  <Card>
    <Box sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: '8px' }}>
      <Grid container spacing={1}>
        {/* Conference Details with full width */}
        <Grid item xs={12}>
          <Grid container spacing={1}>
            {conference.title && (
              <Grid item xs={12}>
                <Typography variant="h2">
                  {conference.title}
                </Typography>
              </Grid>
            )}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>
            {conference.organizer && (
              <Grid item xs={12} md={6}>
                <Typography>
                  <b>Organizer:</b> {conference.organizer}
                </Typography>
              </Grid>
            )}

            {conference.venue && (
              <Grid item xs={12} md={6}>
                <Typography>
                  <b>Venue:</b> {conference.venue}
                </Typography>
              </Grid>
            )}

            {conference.date && (
              <Grid item xs={12} md={6}>
                <Typography>
                  <b>Date:</b> {formatFirestoreTimestamp(conference.date)}
                </Typography>
              </Grid>
            )}

            {conference.contactPerson && (
              <Grid item xs={12} md={6}>
                <Typography>
                  <b>Contact Person:</b> {conference.contactPerson}
                </Typography>
              </Grid>
            )}

            {conference.email && (
              <Grid item xs={12} md={6}>
                <Typography>
                  <b>Email:</b> {conference.email}
                </Typography>
              </Grid>
            )}

            {conference.country && (
              <Grid item xs={12} md={6}>
                <Typography>
                  <b>Country:</b> {conference.country}
                </Typography>
              </Grid>
            )}

            {conference.language && (
              <Grid item xs={12} md={6}>
                <Typography>
                  <b>Language:</b> {conference.language}
                </Typography>
              </Grid>
            )}

            {conference && conference.Status && (
              <Grid item xs={12} md={6}>
                <Typography>
                  <b>Status:</b> {conference.Status}
                </Typography>
              </Grid>
            )}

            {/* Divider before the description */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>

            {conference.description && (
              <Grid item xs={12}>
                <Typography style={{ textAlign: "justify" }}>
                  <b>Description:</b>
                  <span dangerouslySetInnerHTML={{ __html: sanitizeAndFormatDescription(conference.description) }} />
                </Typography>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  </Card>
);

ConferenceOverviewTab.propTypes = {
  conference: PropTypes.shape({
    title: PropTypes.string,
    organizer: PropTypes.string,
    venue: PropTypes.string,
    date: PropTypes.object, // Firestore timestamp object
    contactPerson: PropTypes.string,
    email: PropTypes.string,
    country: PropTypes.string,
    language: PropTypes.string,
    description: PropTypes.string,
    Status: PropTypes.string,
  }).isRequired,
};

//   export default ConferenceOverviewTab;
export default function ConferenceDetailsPage() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();
  const [conference, setConference] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchConference = async () => {
      try {
        const conferenceDetails = await getConferenceById(id);
        setConference(conferenceDetails);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    if (id) {
      fetchConference();
    }
  }, [id]);

  return (
    <>
      <Helmet>
        <title>{`Conference: ${conference?.title || 'Loading...'} | INTERNATIONAL JOURNAL INDEXING`}</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'} style={{ backgroundImage: 'url("https://w0.peakpx.com/wallpaper/855/63/HD-wallpaper-light-purple-plain-background-purple.jpg")', height: '300px' }}>
        <CustomBreadcrumbs
          heading="Conference Details"
          className="breadcrumb breadcrumb-link"
          style={{ color: 'white' }}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root, style: { color: 'white' } },
            { name: 'Conference', href: PATH_DASHBOARD.eCommerce.root, style: { color: 'white' } },
            { name: 'Details', href: PATH_DASHBOARD.eCommerce.shop, style: { color: 'white' } },
            { name: conference?.title || 'Loading...', style: { color: '#451245' } },
          ]}
        />

        {/* Conditional rendering: Check if conference data is loaded */}
        {!isLoading && conference ? (
          <ConferenceOverviewTab conference={conference} />
        ) : (
          <Typography variant="h6" align="center" color="textSecondary">
            Loading conference details...
          </Typography>
        )}
      </Container>
    </>
  );
}
