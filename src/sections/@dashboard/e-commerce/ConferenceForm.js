import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { Autocomplete, Box, Card, Divider, Grid, Stack, TextField, Typography } from '@mui/material';
// routes
import { countries } from '../../../assets/data';
import FormProvider, {
  RHFEditor,
  RHFSelect,
  RHFTextField
} from '../../../components/hook-form';
import { useSnackbar } from '../../../components/snackbar';
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { createConference, getConferenceById, updateConference } from '../../../controller/articlesController';
import PricingPage from "../../../pages/PricingPage";

// ----------------------------------------------------------------------

const COUNTRY_OPTIONS = [
  { label: 'USA', value: 'USA' },
  { label: 'Canada', value: 'Canada' },
  { label: 'India', value: 'India' },
  // Add more countries as needed
];

const LANGUAGE_OPTIONS = [
  { label: 'English', value: 'English' },
  { label: 'Spanish', value: 'Spanish' },
  { label: 'French', value: 'French' },
  // Add more languages as needed
];

// ----------------------------------------------------------------------

ConferenceForm.propTypes = {
  isEdit: PropTypes.bool,
  currentConference: PropTypes.object,
};

function countryToFlag(isoCode) {
  return typeof String.fromCodePoint !== 'undefined'
    ? isoCode
      .toUpperCase()
      .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
    : isoCode;
}

export default function ConferenceForm({ isEdit, currentConference }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();

  const ConferenceSchema = Yup.object().shape({
    title: Yup.string().required('Title of conference/symposium is required'),
    organizer: Yup.string().required('Organizer is required'),
    venue: Yup.string().required('Venue is required'),
    date: Yup.date().required('Date of conference/symposium is required').nullable(),
    contactPerson: Yup.string().required('Name of Contact person is required'),
    email: Yup.string().email('Invalid email format').required('Email ID is required'),
    country: Yup.string().required('Country is required'),
    language: Yup.string().required('Language is required'),
    description: Yup.string().max(20000, 'Description must not exceed 200 words'),
  });

  const defaultValues = useMemo(
    () => ({
      title: currentConference?.title || '',
      organizer: currentConference?.organizer || '',
      venue: currentConference?.venue || '',
      date: currentConference?.date || '',
      contactPerson: currentConference?.contactPerson || '',
      email: currentConference?.email || '',
      country: currentConference?.country || '',
      language: currentConference?.language || '',
      description: currentConference?.description || '',
    }),
    [currentConference]
  );

  const methods = useForm({
    resolver: yupResolver(ConferenceSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    const fetchConference = async () => {
      if (isEdit) {
        try {
          const conference = await getConferenceById(id);
          if (conference) {
            // Convert Firestore Timestamp to JavaScript Date
            const formattedDate = conference.date?.toDate ? conference.date.toDate() : '';

            reset({
              title: conference.title || '',
              organizer: conference.organizer || '',
              venue: conference.venue || '',
              date: formattedDate, // Use the formatted date
              contactPerson: conference.contactPerson || '',
              email: conference.email || '',
              country: conference.country || '',
              language: conference.language || '',
              description: conference.description || '',
            });
          } else {
            enqueueSnackbar('Conference not found', { variant: 'error' });
            navigate(PATH_DASHBOARD.conference.list);
          }
        } catch (error) {
          console.error('Error fetching conference:', error);
          enqueueSnackbar('An error occurred while fetching conference details', { variant: 'error' });
        }
      }
    };

    fetchConference();
  }, [isEdit, id, navigate, enqueueSnackbar, reset]);


  useEffect(() => {
    reset(defaultValues);
  }, [isEdit, currentConference, reset, defaultValues]);

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await updateConference(id, data); // Update function
      } else {
        await createConference(data);
      }
      reset();
      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      navigate(PATH_DASHBOARD.conference.list);
    } catch (error) {
      console.error('Submission error:', error);
      enqueueSnackbar('An error occurred. Please try again.', { variant: 'error' });
    }
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Box display="flex" alignItems="center">
                <Divider style={{ flexGrow: 1 }} />
                <Typography variant="h4" style={{ margin: '0 16px', whiteSpace: 'nowrap' }}>
                  Conference/Symposium Submission
                </Typography>
                <Divider style={{ flexGrow: 1 }} />
              </Box>
              <Stack spacing={3} style={{ marginTop: '30px' }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <RHFTextField name="title" label="Title of conference/symposium*" fullWidth />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <RHFTextField name="organizer" label="Organizer*" fullWidth />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <RHFTextField name="venue" label="Venue*" fullWidth />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="date"
                      control={methods.control}
                      render={({ field }) => {
                        let formattedDate = '';

                        // Check if the value is a Date object
                        if (field.value instanceof Date) {
                          formattedDate = field.value.toISOString().split('T')[0];
                        }
                        // Check if the value is already a string in YYYY-MM-DD format
                        else if (typeof field.value === 'string') {
                          formattedDate = field.value;
                        }

                        return (
                          <TextField
                            {...field}
                            label="Date of conference/symposium"
                            type="date"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            fullWidth
                            margin="normal"
                            value={formattedDate}
                            onChange={(event) => field.onChange(event.target.value)}
                          />
                        );
                      }}
                    />
                  </Grid>




                  <Grid item xs={12} sm={6}>
                    <RHFTextField name="contactPerson" label="Name of Contact person*" fullWidth />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <RHFTextField name="email" label="Email ID*" fullWidth />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="country"
                      control={methods.control}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          fullWidth
                          autoHighlight
                          options={countries}
                          getOptionLabel={(option) => option.label}
                          renderOption={(props, option) => (
                            <Box component="li" {...props} sx={{ px: '8px !important' }}>
                              <Box component="span" sx={{ flexShrink: 0, mr: 2, fontSize: 22 }}>
                                {countryToFlag(option.code)}
                              </Box>
                              {option.label} ({option.code}) +{option.phone}
                            </Box>
                          )}
                          onChange={(_, value) => field.onChange(value?.label)}
                          value={countries.find((option) => option.label === field.value) || null}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Choose a country"
                              inputProps={{
                                ...params.inputProps,
                                autoComplete: 'new-password',
                              }}
                            />
                          )}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <RHFSelect native name="language" label="Language*" fullWidth>
                      <option value="" />
                      {LANGUAGE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </RHFSelect>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Typography variant="title" style={{ fontWeight: 'bold' }}>
                      Description
                    </Typography>
                    <RHFEditor simple name="description" />
                  </Grid>
                  <br />
                  <Grid container spacing={2} justifyContent="flex-end" style={{ marginTop: "30px" }}>
                    <Grid item>
                      <LoadingButton
                        type="submit"
                        variant="contained"
                        size="large"
                        loading={isSubmitting}
                      >
                        {!isEdit ? 'Create Conference' : 'Save Changes'}
                      </LoadingButton>
                    </Grid>
                    <Grid item>
                      <LoadingButton
                        type="button"
                        variant="outlined"
                        size="large"
                        onClick={() => reset()}
                      >
                        Reset
                      </LoadingButton>
                    </Grid>
                  </Grid>
                </Grid>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
      <br />
      <PricingPage />
      <Typography variant="subtitle1">
        If the journal is approved by the editorial committee of International Journal Indexing a confirmation email will be send to editor in chief. After
        fulfilled all formalities, journal will receives indexing / IJIN factor certificate.
      </Typography>
    </>
  );
}
