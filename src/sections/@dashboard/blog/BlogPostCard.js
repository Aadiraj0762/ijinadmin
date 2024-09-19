import { Avatar, Box, Card, CardContent, Link, Typography } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// utils
import { fDate } from '../../../utils/formatTime';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// components
import Image from '../../../components/image';
import TextMaxLine from '../../../components/text-max-line';
// controller
import { getAllJournals } from '../../../controller/propertiesController'; // Adjust path accordingly

// ----------------------------------------------------------------------

const StyledOverlay = styled('div')(({ theme }) => ({
  top: 0,
  zIndex: 1,
  width: '100%',
  height: '100%',
  position: 'absolute',
  backgroundColor: alpha(theme.palette.grey[900], 0.64),
}));

// ----------------------------------------------------------------------

BlogPostCard.propTypes = {
  index: PropTypes.number,
};

export default function BlogPostCard({ index }) {
  const [journals, setJournals] = useState([]);
  const isDesktop = useResponsive('up', 'md');

  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const fetchedJournals = await getAllJournals();
        setJournals(fetchedJournals);
      } catch (error) {
        console.error('Error fetching journals:', error);
      }
    };
    fetchJournals();
  }, []);

  const latestPost = index === 0 || index === 1 || index === 2;

  return (
    <div>
      {journals.map((journal, i) => (
        <Card key={journal.id}>
          {isDesktop && latestPost && i === index ? (
            <>
              <Avatar
                alt={journal.chiefEditor}
                src={journal.cover} // Assuming 'cover' image exists, otherwise adjust
                sx={{ top: 24, left: 24, zIndex: 9, position: 'absolute' }}
              />
              <PostContent
                title={journal.title}
                abbreviation={journal.abbreviation}
                url={journal.url}
                issnPrint={journal.issnPrint}
                issnOnline={journal.issnOnline}
                publisher={journal.publisher}
                discipline={journal.discipline}
                chiefEditor={journal.chiefEditor}
                email={journal.email}
                country={journal.country}
                language={journal.language}
                frequency={journal.frequency}
                yearOfStarting={journal.yearOfStarting}
                articleFormat={journal.articleFormat}
                licenseType={journal.licenseType}
                description={journal.description}
                normalProcessing={journal.normalProcessing}
                fastTrackProcessing={journal.fastTrackProcessing}
                createdAt={journal.createdAt}
                index={i}
              />
              <StyledOverlay />
              <Image alt="cover" src={journal.cover} sx={{ height: 360 }} />
            </>
          ) : (
            <Box sx={{ position: 'relative' }}>
              <Avatar
                alt={journal.chiefEditor}
                src={journal.cover}
                sx={{ left: 24, zIndex: 9, width: 32, height: 32, bottom: -16, position: 'absolute' }}
              />
              <Image alt="cover" src={journal.cover} ratio="4/3" />
              <PostContent
                title={journal.title}
                abbreviation={journal.abbreviation}
                url={journal.url}
                issnPrint={journal.issnPrint}
                issnOnline={journal.issnOnline}
                publisher={journal.publisher}
                discipline={journal.discipline}
                chiefEditor={journal.chiefEditor}
                email={journal.email}
                country={journal.country}
                language={journal.language}
                frequency={journal.frequency}
                yearOfStarting={journal.yearOfStarting}
                articleFormat={journal.articleFormat}
                licenseType={journal.licenseType}
                description={journal.description}
                normalProcessing={journal.normalProcessing}
                fastTrackProcessing={journal.fastTrackProcessing}
                createdAt={journal.createdAt}
              />
            </Box>
          )}
        </Card>
      ))}
    </div>
  );
}

// ----------------------------------------------------------------------

PostContent.propTypes = {
  title: PropTypes.string,
  abbreviation: PropTypes.string,
  url: PropTypes.string,
  issnPrint: PropTypes.string,
  issnOnline: PropTypes.string,
  publisher: PropTypes.string,
  discipline: PropTypes.string,
  chiefEditor: PropTypes.string,
  email: PropTypes.string,
  country: PropTypes.string,
  language: PropTypes.string,
  frequency: PropTypes.string,
  yearOfStarting: PropTypes.string,
  articleFormat: PropTypes.string,
  licenseType: PropTypes.string,
  description: PropTypes.string,
  normalProcessing: PropTypes.bool,
  fastTrackProcessing: PropTypes.bool,
  createdAt: PropTypes.string,
  index: PropTypes.number,
};

export function PostContent({
  title,
  abbreviation,
  url,
  issnPrint,
  issnOnline,
  publisher,
  discipline,
  chiefEditor,
  email,
  country,
  language,
  frequency,
  yearOfStarting,
  articleFormat,
  licenseType,
  description,
  normalProcessing,
  fastTrackProcessing,
  createdAt,
  index,
}) {
  const linkTo = url; // Use URL for linking if needed

  return (
    <CardContent>
      <Typography gutterBottom variant="caption" component="div">
        {fDate(createdAt)}
      </Typography>

      <Link component={RouterLink} to={linkTo} color="inherit">
        <TextMaxLine variant="subtitle2" line={2} persistent>
          {title}
        </TextMaxLine>
      </Link>

      {/* Example of displaying additional journal information */}
      <Typography variant="body2">Publisher: {publisher}</Typography>
      <Typography variant="body2">ISSN (Print): {issnPrint}</Typography>
      <Typography variant="body2">ISSN (Online): {issnOnline}</Typography>
      <Typography variant="body2">Chief Editor: {chiefEditor}</Typography>
    </CardContent>
  );
}
