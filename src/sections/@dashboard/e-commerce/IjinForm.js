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
  RHFSelect,
  RHFTextField,
  RHFUpload
} from '../../../components/hook-form';
import { useSnackbar } from '../../../components/snackbar';
import { createIjin, getIjinById, updateIjin } from '../../../controller/ijinController';

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

    issnPrint: PropTypes.string,
    issnOnline: PropTypes.string,

    email: PropTypes.string,
    yearOfStarting: PropTypes.string,
    licenseType: PropTypes.string.isRequired,
    coverImage: PropTypes.arrayOf(PropTypes.string).isRequired,
    ijin: PropTypes.string,

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
    ijin: Yup.string(),
    url: Yup.string().url('Invalid URL format'),
    issnPrint: Yup.string(),
    issnOnline: Yup.string(),
    email: Yup.string().email('Invalid email format'),
    yearOfStarting: Yup.string().required('Invalid year'),
    licenseType: Yup.string().required('License Type is required'),
    coverImage: Yup.array().min(1, 'At least one image is required'),

  });

  const defaultValues = useMemo(
    () => ({
      title: currentJournal?.title || '',
      issnPrint: currentJournal?.issnPrint || '',
      issnOnline: currentJournal?.issnOnline || '',
      email: currentJournal?.email || '',
      yearOfStarting: currentJournal?.yearOfStarting || '',
      licenseType: currentJournal?.licenseType || LICENSE_TYPE_OPTIONS[0].value,
      coverImage: currentJournal?.coverImage || [],
      ijin: currentJournal?.ijin || '',

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
          const journal = await getIjinById(id);
          if (journal) {
            console.log('Fetched Journal Data:', journal);

            reset({
              title: journal?.title || '',
              issnPrint: journal?.issnPrint || '',
              issnOnline: journal?.issnOnline || '',
              email: journal?.email || '',
              yearOfStarting: journal?.yearOfStarting || '',
              licenseType: journal?.licenseType || LICENSE_TYPE_OPTIONS[0].value,
              coverImage: journal?.coverImage || [],
              ijin: journal?.ijin || '',

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
        await updateIjin(id, data); // Call your update function
      } else {
        await createIjin(data); // Call your create function
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
                  IJIN Submission
                </Typography>
                <Divider style={{ flexGrow: 1 }} />
              </Box>
              <Stack spacing={3} style={{ marginTop: "30px" }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <RHFTextField name="title" label="Journal Title*" fullWidth />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <RHFTextField name="issnPrint" label="P- ISSN" fullWidth />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <RHFTextField name="issnOnline" label="E- ISSN " fullWidth />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <RHFTextField name="email" label="Email Id" fullWidth />
                  </Grid>


                  <Grid item xs={12} sm={6}>
                    <RHFTextField name="yearOfStarting" label="Indexed Since" type="string" fullWidth />
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

                  <Grid item xs={12} sm={6}>
                    <RHFTextField name="ijin" label="IJIN Value" type="string" fullWidth />
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

    </>
  );
}
