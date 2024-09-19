import { Container, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  UploadIllustration
} from '../../assets/illustrations';
import AbstractJournalIcon from '../../assets/illustrations/AbstractJournalIcon.svg';
import ConferenceBro from '../../assets/illustrations/ConferenceBro.svg';
import ConferencePana from '../../assets/illustrations/ConferencePana.svg';
import IjinIcon from '../../assets/illustrations/IjinIcon.svg';
import ThesisIcon from '../../assets/illustrations/ThesisIcon.svg';
import UsersIcon from '../../assets/illustrations/UsersIcon.svg';

import { useSettingsContext } from '../../components/settings';
import {
  getTotalabstarctconferencesCount,
  getTotalabstractjournalCount,
  getTotalconferencesCount,
  getTotalijinCount,
  getTotalJournalsCount,
  getTotalthesisCount,
  getTotalUsersCount,
} from '../../controller/totalcountController';
import { BookingWidgetSummary } from '../../sections/@dashboard/general/booking';

export default function GeneralBookingPage() {
  const theme = useTheme();
  const { themeStretch } = useSettingsContext();

  // State to hold the counts
  const [totalJournalsCount, setTotalJournalsCount] = useState(0);
  const [totalConferencesCount, setTotalConferencesCount] = useState(0);
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const [totalAbstractConferencesCount, setTotalAbstractConferencesCount] = useState(0);
  const [totalAbstractJournalsCount, setTotalAbstractJournalsCount] = useState(0);
  const [totalThesisCount, setTotalThesisCount] = useState(0);
  const [totalIjinCount, setTotalIjinCount] = useState(0);

  // Fetch the counts using useEffect hooks
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [journals, conferences, users, abstractConferences, abstractJournals, thesis, ijin] = await Promise.all([
          getTotalJournalsCount(),
          getTotalconferencesCount(),
          getTotalUsersCount(),
          getTotalabstarctconferencesCount(),
          getTotalabstractjournalCount(),
          getTotalthesisCount(),
          getTotalijinCount(),
        ]);

        setTotalJournalsCount(journals);
        setTotalConferencesCount(conferences);
        setTotalUsersCount(users);
        setTotalAbstractConferencesCount(abstractConferences);
        setTotalAbstractJournalsCount(abstractJournals);
        setTotalThesisCount(thesis);
        setTotalIjinCount(ijin);
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <>
      <Helmet>
        <title> General: Booking | INTERNATIONAL JOURNAL INDEXING</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <BookingWidgetSummary
              title="Total Journals"
              total={totalJournalsCount}
              icon={<UploadIllustration />}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <BookingWidgetSummary
              title="Total Conferences"
              total={totalConferencesCount}
              icon={<img src={ConferenceBro} alt="Conference Icon" style={{ width: '100%', height: '100%' }} />}

            />
          </Grid>
          <Grid item xs={12} md={4}>
            <BookingWidgetSummary
              title="Total Users"
              total={totalUsersCount}
              icon={<img src={UsersIcon} alt="Total Users Icon" style={{ width: '100%', height: '100%' }} />}

            />
          </Grid>
          <Grid item xs={12} md={4}>
            <BookingWidgetSummary
              title="Total Abstract Conferences"
              total={totalAbstractConferencesCount}
              icon={<img src={ConferencePana} alt="Abstract Conferences Icon" style={{ width: '100%', height: '100%' }} />}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <BookingWidgetSummary
              title="Total Abstract Journals"
              total={totalAbstractJournalsCount}
              icon={<img src={AbstractJournalIcon} alt="Abstract Journals Icon" style={{ width: '100%', height: '100%' }} />}

            />
          </Grid>
          <Grid item xs={12} md={4}>
            <BookingWidgetSummary
              title="Total Thesis"
              total={totalThesisCount}
              icon={<img src={ThesisIcon} alt="Thesis Icon" style={{ width: '100%', height: '100%' }} />}
              />
          </Grid>
          <Grid item xs={12} md={4}>
            <BookingWidgetSummary
              title="Total IJIN"
              total={totalIjinCount}
              icon={<img src={IjinIcon} alt="IJIN Icon" style={{ width: '100%', height: '100%' }} />}

            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
