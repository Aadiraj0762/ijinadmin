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
// components
import FormProvider, { RHFTextField, RHFUpload } from '../../../components/hook-form';
import { useSnackbar } from '../../../components/snackbar';
import { createThesis, getThesisById, updateThesis } from '../../../controller/thesisController';

// ----------------------------------------------------------------------

ThesisForm.propTypes = {
  isEdit: PropTypes.bool,
  currentThesis: PropTypes.shape({
    title: PropTypes.string.isRequired,
    collegeUniversity: PropTypes.string,
    author: PropTypes.string,
    photoId: PropTypes.arrayOf(PropTypes.string),
    fullPdf: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default function ThesisForm({ isEdit, currentThesis }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();

  const ThesisSchema = Yup.object().shape({
    title: Yup.string().required('Thesis Title is required'),
    collegeUniversity: Yup.string().required('College/University is required'),
    author: Yup.string().required('Author is required'),
    photoId: Yup.array().min(1, 'At least one photo ID is required'),
    fullPdf: Yup.array().min(1, 'At least one full PDF is required'),
  });

  const defaultValues = useMemo(
    () => ({
      title: currentThesis?.title || '',
      collegeUniversity: currentThesis?.collegeUniversity || '',
      author: currentThesis?.author || '',
      photoId: [],
      fullPdf: [],
    }),
    [currentThesis]
  );

  const methods = useForm({
    resolver: yupResolver(ThesisSchema),
    defaultValues,
  });

  const {
    reset, watch, setValue, handleSubmit, formState: { isSubmitting },
  } = methods;
  const values = watch();

  useEffect(() => {
    console.log("useEffect is firing. ID:", id, "isEdit:", isEdit);
    
    const fetchThesis = async () => {
      if (isEdit) {
        try {
          const thesis = await getThesisById(id);
          console.log('Fetched Thesis:', thesis);
          
          if (thesis) {
            reset({
              title: thesis?.title || '',
              collegeUniversity: thesis?.collegeUniversity || '',
              author: thesis?.author || '',
              photoId: thesis?.photoId || [],
              fullPdf: thesis?.fullPdf || [],
            });
            console.log('Form reset with thesis:', thesis); // Add this to check form reset
            
          } else {
            enqueueSnackbar('Thesis not found', { variant: 'error' });
            navigate('/dashboard/theses/list');
          }
        } catch (error) {
          console.error('Error fetching thesis:', error);
          enqueueSnackbar('An error occurred while fetching thesis details', { variant: 'error' });
        }
      }
    };
  
    fetchThesis();
  }, [id, isEdit, reset, enqueueSnackbar, navigate]);
  

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await updateThesis(id, data); 
      } else {
        await createThesis(data); 
      }
      reset();
      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      navigate('/dashboard/theses/list');
    } catch (error) {
      console.error("Error during submission:", error);
      enqueueSnackbar('An error occurred. Please try again.', { variant: 'error' });
    }
  };

  const handleDropPhotoId = useCallback(
    (acceptedFiles) => {
      const files = values.photoId || [];
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      setValue('photoId', [...files, ...newFiles], { shouldValidate: true });
    },
    [setValue, values.photoId]
  );

  const handleDropFullPdf = useCallback(
    (acceptedFiles) => {
      const files = values.fullPdf || [];
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      setValue('fullPdf', [...files, ...newFiles], { shouldValidate: true });
    },
    [setValue, values.fullPdf]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Box display="flex" alignItems="center">
              <Divider style={{ flexGrow: 1 }} />
              <Typography variant="h4" style={{ margin: '0 16px', whiteSpace: 'nowrap' }}>
                Thesis Submission
              </Typography>
              <Divider style={{ flexGrow: 1 }} />
            </Box>
            <Stack spacing={3} style={{ marginTop: "30px" }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <RHFTextField name="title" label="Thesis Title*" fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <RHFTextField name="collegeUniversity" label="College/University*" fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <RHFTextField name="author" label="Author*" fullWidth />
                </Grid>

                <Grid item xs={12} md={12}>
                  <Typography variant="title" style={{ fontWeight: "bold" }}>
                    Photo ID
                  </Typography>
                  <RHFUpload
                    multiple
                    thumbnail
                    name="photoId"
                    maxSize={3145728}
                    accept="image/*"
                    onDrop={handleDropPhotoId}
                  />
                </Grid>

                <Grid item xs={12} md={12}>
                  <Typography variant="title" style={{ fontWeight: "bold" }}>
                    Full PDF
                  </Typography>
                  <RHFUpload
                    multiple
                    thumbnail
                    name="fullPdf"
                    maxSize={5242880} // 5MB max size
                    accept="application/pdf"
                    onDrop={handleDropFullPdf}
                  />
                </Grid>
<br/>
                <Grid container spacing={2} justifyContent="flex-end" sx={{mt:2}}>
                  <Grid item>
                    <LoadingButton type="submit" variant="contained" size="large">
                      {!isEdit ? 'Create Thesis' : 'Save Changes'}
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
      <br/>
    </FormProvider>
  );
}
