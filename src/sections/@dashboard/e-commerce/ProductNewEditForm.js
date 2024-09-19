import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Divider, Grid, Stack, Typography } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import FormProvider, {
  RHFEditor,
  RHFSelect,
  RHFSwitch,
  RHFTextField,
  RHFUpload
} from '../../../components/hook-form';
import { useSnackbar } from '../../../components/snackbar';
import { createJournal, getJournalById, updateJournal } from '../../../controller/propertiesController';
import PricingPage from "../../../pages/PricingPage";

// ----------------------------------------------------------------------

const COUNTRY_OPTIONS = [
  { code: 'AD', label: 'Andorra', phone: '376' },

  { code: 'AI', label: 'Anguilla', phone: '1-264' },
  { code: 'AL', label: 'Albania', phone: '355' },
  { code: 'AM', label: 'Armenia', phone: '374' },
  { code: 'AO', label: 'Angola', phone: '244' },
  { code: 'AQ', label: 'Antarctica', phone: '672' },
  { code: 'AR', label: 'Argentina', phone: '54' },
  { code: 'AS', label: 'American Samoa', phone: '1-684' },
  { code: 'AT', label: 'Austria', phone: '43' },

];

// Add more countries as needed

const LANGUAGE_OPTIONS = [
  { label: 'English', value: 'English' },
  { label: 'Spanish', value: 'Spanish' },
  { label: 'French', value: 'French' },
  // Add more languages as needed
];

const FREQUENCY_OPTIONS = [
  { label: 'Monthly', value: 'Monthly' },
  { label: 'Quarterly', value: 'Quarterly' },
  { label: 'Annually', value: 'Annually' },
];

const LICENSE_TYPE_OPTIONS = [
  { label: 'CC BY-SA', value: 'CC BY-SA' },
  { label: 'CC BY-NC', value: 'CC BY-NC' },
  { label: 'CC BY-NC-SA', value: 'CC BY-NC-SA' },
  { label: 'CC BY-ND', value: 'CC BY-ND' },
  { label: 'CC BY-NC-ND', value: 'CC BY-NC-ND' },
];

// ----------------------------------------------------------------------

JournalForm.propTypes = {
  isEdit: PropTypes.bool,
  currentJournal: PropTypes.shape({
    title: PropTypes.string.isRequired,
    abbreviation: PropTypes.string,
    url: PropTypes.string,
    issnPrint: PropTypes.string,
    issnOnline: PropTypes.string,
    publisher: PropTypes.string,
    discipline: PropTypes.string,
    chiefEditor: PropTypes.string,
    email: PropTypes.string,
    country: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    frequency: PropTypes.string.isRequired,
    yearOfStarting: PropTypes.number,
    articleFormat: PropTypes.string,
    licenseType: PropTypes.string.isRequired,
    coverImage: PropTypes.arrayOf(PropTypes.string).isRequired,
    description: PropTypes.string,
    normalProcessing: PropTypes.bool,
    fastTrackProcessing: PropTypes.bool,
  }),
};

function countryToFlag(isoCode) {
  return typeof String.fromCodePoint !== 'undefined'
    ? isoCode
      .toUpperCase()
      .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
    : isoCode;
}

export default function
  JournalForm({ isEdit, currentJournal }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();

  const JournalSchema = Yup.object().shape({
    title: Yup.string().required('Journal Title is required'),
    abbreviation: Yup.string(),
    url: Yup.string().url('Invalid URL format'),
    issnPrint: Yup.string(),
    issnOnline: Yup.string(),
    publisher: Yup.string(),
    discipline: Yup.string(),
    chiefEditor: Yup.string(),
    email: Yup.string().email('Invalid email format'),
    country: Yup.string().required('Country is required'),
    language: Yup.string().required('Language is required'),
    frequency: Yup.string().required('Frequency is required'),
    yearOfStarting: Yup.number().integer().min(1900, 'Invalid year'),
    articleFormat: Yup.string(),
    licenseType: Yup.string().required('License Type is required'),
    // coverImage: Yup.mixed(),
    coverImage: Yup.array().min(1, 'At least one image is required'),

    description: Yup.string().max(20000, 'Description must not exceed 200 words'),
    normalProcessing: Yup.boolean(),
    fastTrackProcessing: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      title: currentJournal?.title || '',
      abbreviation: currentJournal?.abbreviation || '',
      url: currentJournal?.url || '',
      issnPrint: currentJournal?.issnPrint || '',
      issnOnline: currentJournal?.issnOnline || '',
      publisher: currentJournal?.publisher || '',
      discipline: currentJournal?.discipline || '',
      chiefEditor: currentJournal?.chiefEditor || '',
      email: currentJournal?.email || '',
      country: currentJournal?.country || COUNTRY_OPTIONS[0].value,
      language: currentJournal?.language || LANGUAGE_OPTIONS[0].value,
      frequency: currentJournal?.frequency || FREQUENCY_OPTIONS[0].value,
      yearOfStarting: currentJournal?.yearOfStarting || '',
      articleFormat: currentJournal?.articleFormat || '',
      licenseType: currentJournal?.licenseType || LICENSE_TYPE_OPTIONS[0].value,
      coverImage: [],
      description: currentJournal?.description || '',
      normalProcessing: currentJournal?.normalProcessing || false,
      fastTrackProcessing: currentJournal?.fastTrackProcessing || false,
    }),
    [currentJournal]
  );

  const methods = useForm({
    resolver: yupResolver(JournalSchema),
    defaultValues,
  });

  const {
    reset, watch, setValue, handleSubmit, control, formState: { isSubmitting },
  } = methods;
  const values = watch();
  useEffect(() => {
    const fetchJournal = async () => {
      if (isEdit) {
        try {
          const journal = await getJournalById(id);
          if (journal) {
            console.log('Fetched Journal Data:', journal);

            reset({
              title: journal?.title || '',
              abbreviation: journal?.abbreviation || '',
              url: journal?.url || '',
              issnPrint: journal?.issnPrint || '',
              issnOnline: journal?.issnOnline || '',
              publisher: journal?.publisher || '',
              discipline: journal?.discipline || '',
              chiefEditor: journal?.chiefEditor || '',
              email: journal?.email || '',
              country: journal?.country || COUNTRY_OPTIONS[0].value,
              language: journal?.language || LANGUAGE_OPTIONS[0].value,
              frequency: journal?.frequency || FREQUENCY_OPTIONS[0].value,
              yearOfStarting: journal?.yearOfStarting || '',
              articleFormat: journal?.articleFormat || '',
              licenseType: journal?.licenseType || LICENSE_TYPE_OPTIONS[0].value,
              coverImage: journal?.coverImage || [],
              // images: property.PropertyImages || [], // Ensure this matches the form field name

              description: journal?.description || '',
              normalProcessing: journal?.normalProcessing || false,
              fastTrackProcessing: journal?.fastTrackProcessing || false,
            });

            console.log('Form has been reset with fetched journal data');
          } else {
            enqueueSnackbar('Journal not found', { variant: 'error' });
            navigate(PATH_DASHBOARD.eCommerce.list);
          }
        } catch (error) {
          console.error('Error fetching journal:', error);
          enqueueSnackbar('An error occurred while fetching journal details', { variant: 'error' });
        }
      }
    };

    fetchJournal();
  }, [id, isEdit, reset, enqueueSnackbar, navigate]);

  useEffect(() => {
    if (isEdit && currentJournal) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, currentJournal, reset, defaultValues]);

  const onSubmit = async (data) => {
    console.log("Submitting Data:", data);  // Ensure this is printed in the console
    try {
      if (isEdit) {
        await updateJournal(id, data); // Call your update function
      } else {
        await createJournal(data); // Call your create function
      }
      reset();
      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      navigate(PATH_DASHBOARD.eCommerce.list);
    } catch (error) {
      console.error("Error during submission:", error);
      enqueueSnackbar('An error occurred. Please try again.', { variant: 'error' });
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      console.log('Files dropped:', acceptedFiles);  // Add this line to check if files are being handled
      const files = values.coverImage || [];
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      setValue('coverImage', [...files, ...newFiles], { shouldValidate: true });
    },
    [setValue, values.coverImage]
  );


  const handleRemoveFile = (inputFile) => {
    const filtered = values.images && values.coverImage?.filter((file) => file !== inputFile);
    setValue('coverImage', filtered);
  };

  const handleRemoveAllFiles = () => {
    setValue('coverImage', []);
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
                  Journal Submission
                </Typography>
                <Divider style={{ flexGrow: 1 }} />
              </Box>
              <Stack spacing={3} style={{ marginTop: "30px" }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <RHFTextField name="title" label="Journal Title*" fullWidth />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <RHFTextField name="abbreviation" label="Abbreviation" fullWidth />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <RHFTextField name="url" label="Journal URL" fullWidth />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <RHFTextField name="issnPrint" label="ISSN (Print Version)" fullWidth />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <RHFTextField name="issnOnline" label="ISSN (Online Version)" fullWidth />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <RHFTextField name="publisher" label="Publisher / Co-Publisher" fullWidth />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <RHFTextField name="discipline" label="Discipline" fullWidth />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <RHFTextField name="chiefEditor" label="Chief Editor" fullWidth />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <RHFTextField name="email" label="Email Id" fullWidth />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    {/* <Block title="Country Select"> */}
                    <RHFSelect native name="country" label="Country" fullWidth>
                      <option value="" />
                      {COUNTRY_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </RHFSelect>

                    {/* </Block> */}
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <RHFTextField name="language" label="Langauge" fullWidth />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <RHFSelect native name="frequency" label="Frequency" fullWidth>
                      <option value="" />
                      {FREQUENCY_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </RHFSelect>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <RHFTextField name="yearOfStarting" label="Year of Starting" type="number" fullWidth />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <RHFTextField name="articleFormat" label="Article Format" fullWidth />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <RHFSelect native name="licenseType" label="License Type" fullWidth>
                      <option value="" />
                      {LICENSE_TYPE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </RHFSelect>
                  </Grid>

                  <Grid item xs={12} md={12}>
                    <Typography variant="title" style={{ fontWeight: "bold" }}>
                      Cover Image
                    </Typography>
                    <RHFUpload
                      multiple
                      thumbnail
                      name="coverImage"
                      maxSize={3145728}
                      accept="image/*"  // Only accept image files
                      onDrop={handleDrop}
                      onRemove={handleRemoveFile}
                      onRemoveAll={handleRemoveAllFiles}
                      onUpload={() => console.log('ON UPLOAD')}
                    />
                  </Grid>

                  <Grid item xs={12} md={12}>
                    <Typography variant="title" style={{ fontWeight: "bold" }}>
                      Description
                    </Typography>
                    <RHFEditor simple name="description" />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <RHFSwitch name="NormalProcessing" label="Normal Processing" />
                    <RHFSwitch name="Fast-track / Priority Processing" label="Fast-track / Priority Processing" />
                  </Grid>
                  <Grid container spacing={2} justifyContent="flex-end">

                    <Grid item>
                      <LoadingButton type="submit" variant="contained" size="large">
                        {!isEdit ? 'Create Journal' : 'Save Changes'}
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
