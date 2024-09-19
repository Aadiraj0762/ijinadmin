import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Divider, Grid, Stack, Typography } from '@mui/material';
// routes
import FormProvider, {
    RHFTextField
} from '../../../../components/hook-form';
import { useSnackbar } from '../../../../components/snackbar';
import { PATH_DASHBOARD } from '../../../../routes/paths';
// components
import { createAbstract, getAbstractById, updateAbstract } from '../../../../controller/abstractController';

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
        journalName: Yup.string().required('Title of conference/symposium is required'),
        issn: Yup.string().required('Organizer is required'),
        publisher: Yup.string().required('Venue is required'),
        title: Yup.string().required('Date of conference/symposium is required').nullable(),
        affiliation: Yup.string().required('Name of Contact person is required'),
        authorName: Yup.string().required('authorName is required'),
        abstract: Yup.string().required('Country is required'),
        linkDOI: Yup.string().required('Language is required'),
        articleType: Yup.string().max(20000, 'Description must not exceed 200 words'),
    });

    const defaultValues = useMemo(
        () => ({
            journalName: currentConference?.journalName || '',
            issn: currentConference?.issn || '',
            publisher: currentConference?.publisher || '',
            title: currentConference?.title || '',
            affiliation: currentConference?.affiliation || '',
            authorName: currentConference?.authorName || '',
            abstract: currentConference?.abstract || '',
            linkDOI: currentConference?.linkDOI || '',
            articleType: currentConference?.articleType || '',
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
                    const conference = await getAbstractById(id);
                    if (conference) {
                        // Convert Firestore Timestamp to JavaScript Date
                        const formattedDate = conference.date?.toDate ? conference.date.toDate() : '';
    
                        reset({
                            journalName: conference.journalName || '',   // changed to conference.journalName
                            issn: conference.issn || '',
                            publisher: conference.publisher || '',
                            title: conference.title || '',
                            affiliation: conference.affiliation || '',
                            authorName: conference.authorName || '',
                            abstract: conference.abstract || '',
                            linkDOI: conference.linkDOI || '',
                            articleType: conference.articleType || '',
                        });
                    } else {
                        enqueueSnackbar('Conference not found', { variant: 'error' });
                        navigate('/');
                    }
                } catch (error) {
                    console.error('Error fetching conference:', error);
                    enqueueSnackbar('An error occurred while fetching conference details', { variant: 'error' });
                }
            }
        };
    
        fetchConference();
    }, [isEdit, id, reset, navigate, enqueueSnackbar,]);
    
    useEffect(() => {
        reset(defaultValues);
    }, [isEdit, currentConference, reset, defaultValues]);

    const onSubmit = async (data) => {
        try {
            if (isEdit) {
                await updateAbstract(id, data); // Update function
            } else {
                await createAbstract(data);
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
                                    Abstract / Articles Journal Submission
                                </Typography>
                                <Divider style={{ flexGrow: 1 }} />
                            </Box>
                            <Stack spacing={3} style={{ marginTop: '30px' }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <RHFTextField name="journalName" label="Journal Name" />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <RHFTextField name="issn" label="ISSN" />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <RHFTextField name="publisher" label="Publisher" />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <RHFTextField name="title" label="Title" />

                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <RHFTextField name="affiliation" label="Affiliation" />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <RHFTextField name="authorName" label="Author's Name" />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <RHFTextField name="abstract" label="Abstract/Keywords" multiline rows={3} />

                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <RHFTextField name="linkDOI" label="Link/DOI" />

                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <RHFTextField name="articleType" label="Article Type" />

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
            {/* <PricingPage />
            <Typography variant="subtitle1">
                If the journal is approved by the editorial committee of International Journal Indexing a confirmation email will be send to editor in chief. After
                fulfilled all formalities, journal will receives indexing / IJIN factor certificate.
            </Typography> */}
        </>
    );
}