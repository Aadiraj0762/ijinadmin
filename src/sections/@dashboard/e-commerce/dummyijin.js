// import PropTypes from 'prop-types';
// import { useEffect, useMemo } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import * as Yup from 'yup';
// // form
// import { yupResolver } from '@hookform/resolvers/yup';
// import { useForm } from 'react-hook-form';
// // @mui
// import { LoadingButton } from '@mui/lab';
// import { Box, Card, Divider, Grid, Stack, Typography } from '@mui/material';
// // routes
// import FormProvider, {
//     RHFEditor,
//     RHFTextField
// } from '../../../components/hook-form';
// import { useSnackbar } from '../../../components/snackbar';
// import { PATH_DASHBOARD } from '../../../routes/paths';
// // components
// import { createIjin, getIjinById, updateIjin } from '../../../controller/ijinController';
// import PricingPage from "../../../pages/PricingPage";

// // ----------------------------------------------------------------------

// const COUNTRY_OPTIONS = [
//   { label: 'USA', value: 'USA' },
//   { label: 'Canada', value: 'Canada' },
//   { label: 'India', value: 'India' },
//   // Add more countries as needed
// ];

// const LANGUAGE_OPTIONS = [
//   { label: 'English', value: 'English' },
//   { label: 'Spanish', value: 'Spanish' },
//   { label: 'French', value: 'French' },
//   // Add more languages as needed
// ];

// // ----------------------------------------------------------------------

// ConferenceForm.propTypes = {
//   isEdit: PropTypes.bool,
//   currentIjin: PropTypes.object,
// };

// function countryToFlag(isoCode) {
//   return typeof String.fromCodePoint !== 'undefined'
//     ? isoCode
//       .toUpperCase()
//       .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
//     : isoCode;
// }

// export default function ConferenceForm({ isEdit, currentIjin }) {
//   const navigate = useNavigate();
//   const { enqueueSnackbar } = useSnackbar();
//   const { id } = useParams();

//   const IjinSchema = Yup.object().shape({
//     title: Yup.string().required('Title of the IJIN is required'),
//     author: Yup.string().required('Author is required'),
//     university: Yup.string().required('University is required'),
//     year: Yup.string().required('Year of the IJIN is required'),
//     description: Yup.string().max(20000, 'Description must not exceed 200 words'),
//   });

//   const defaultValues = useMemo(
//     () => ({
//       title: currentIjin?.title || '',
//       author: currentIjin?.author || '',
//       university: currentIjin?.university || '',
//       year: currentIjin?.year || '',
//       description: currentIjin?.description || '',
//     }),
//     [currentIjin]
//   );

//   const methods = useForm({
//     resolver: yupResolver(IjinSchema),
//     defaultValues,
//   });

//   const {
//     reset,
//     handleSubmit,
//     formState: { isSubmitting },
//   } = methods;

//   useEffect(() => {
//     const fetchIjin = async () => {
//       if (isEdit) {
//         try {
//           const ijin = await getIjinById(id);
//           if (ijin) {
//             reset({
//               title: ijin.title || '',
//               author: ijin.author || '',
//               university: ijin.university || '',
//               year: ijin.year || '',
//               description: ijin.description || '',
//             });
//           } else {
//             enqueueSnackbar('IJIN not found', { variant: 'error' });
//             navigate('/ijin/list');
//           }
//         } catch (error) {
//           console.error('Error fetching IJIN:', error);
//           enqueueSnackbar('An error occurred while fetching IJIN details', { variant: 'error' });
//         }
//       }
//     };

//     fetchIjin();
//   }, [isEdit, id, navigate, enqueueSnackbar, reset]);

//   useEffect(() => {
//     reset(defaultValues);
//   }, [isEdit, currentIjin, reset, defaultValues]);

//   const onSubmit = async (data) => {
//     try {
//       if (isEdit) {
//         await updateIjin(id, data); // Update function
//       } else {
//         await createIjin(data);
//       }
//       reset();
//       enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
//       navigate(PATH_DASHBOARD.ijin.list);
//     } catch (error) {
//       console.error('Submission error:', error);
//       enqueueSnackbar('An error occurred. Please try again.', { variant: 'error' });
//     }
//   };

//   return (
//     <>
//       <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
//         <Grid container spacing={3}>
//           <Grid item xs={12} md={12}>
//             <Card sx={{ p: 3 }}>
//               <Box display="flex" alignItems="center">
//                 <Divider style={{ flexGrow: 1 }} />
//                 <Typography variant="h4" style={{ margin: '0 16px', whiteSpace: 'nowrap' }}>
//                   IJIN Submission
//                 </Typography>
//                 <Divider style={{ flexGrow: 1 }} />
//               </Box>
//               <Stack spacing={3} style={{ marginTop: '30px' }}>
//                 <Grid container spacing={2}>
//                   <Grid item xs={12} sm={6}>
//                     <RHFTextField name="title" label="Title of IJIN*" fullWidth />
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <RHFTextField name="author" label="Author*" fullWidth />
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <RHFTextField name="university" label="University*" fullWidth />
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <RHFTextField name="year" label="Year*" fullWidth />
//                   </Grid>
//                   <Grid item xs={12} md={12}>
//                     <Typography variant="title" style={{ fontWeight: 'bold' }}>
//                       Description
//                     </Typography>
//                     <RHFEditor simple name="description" />
//                   </Grid>
//                   <br />
//                   <Grid container spacing={2} justifyContent="flex-end" style={{ marginTop: "30px" }}>
//                     <Grid item>
//                       <LoadingButton
//                         type="submit"
//                         variant="contained"
//                         size="large"
//                         loading={isSubmitting}
//                       >
//                         {!isEdit ? 'Create IJIN' : 'Save Changes'}
//                       </LoadingButton>
//                     </Grid>
//                     <Grid item>
//                       <LoadingButton
//                         type="button"
//                         variant="outlined"
//                         size="large"
//                         onClick={() => reset()}
//                       >
//                         Reset
//                       </LoadingButton>
//                     </Grid>
//                   </Grid>
//                 </Grid>
//               </Stack>
//             </Card>
//           </Grid>
//         </Grid>
//       </FormProvider>
//       <br />
//       <PricingPage />
//       <Typography variant="subtitle1">
//         If the IJIN is approved by the editorial committee, a confirmation email will be sent to the editor in chief. After fulfilling all formalities, the IJIN will receive an indexing certificate.
//       </Typography>
//     </>
//   );
// }
import {
    Card, CardContent,
    Grid,
    Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useSnackbar } from '../../components/snackbar';
import { deleteIjin, getAllIjins } from '../../controller/ijinController'; // Updated import

const PropertyTable = () => {
    const [ijins, setIjins] = useState([]);
    const [selectedIjins, setSelectedIjins] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [isFiltered, setIsFiltered] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [selectedIjinId, setSelectedIjinId] = useState(null);

    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const ijinsData = await getAllIjins(); // Fetching IJINs
                setIjins(ijinsData);
            } catch (error) {
                console.error('Error fetching IJINs:', error);
                enqueueSnackbar('Error fetching IJINs', { variant: 'error' });
            }
        };

        fetchData();
    }, [enqueueSnackbar]);

    const handleCheckboxChange = (ijinId) => {
        if (ijinId === 'all') {
            if (selectedIjins.length === ijins.length) {
                setSelectedIjins([]);
            } else {
                setSelectedIjins(ijins.map((ijin) => ijin.id));
            }
            return;
        }

        const selectedIndex = selectedIjins.indexOf(ijinId);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selectedIjins, ijinId);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selectedIjins.slice(1));
        } else if (selectedIndex === selectedIjins.length - 1) {
            newSelected = newSelected.concat(selectedIjins.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selectedIjins.slice(0, selectedIndex),
                selectedIjins.slice(selectedIndex + 1)
            );
        }

        setSelectedIjins(newSelected);
    };

    const isSelected = (ijinId) => selectedIjins.indexOf(ijinId) !== -1;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleOpenConfirm = (ijinId) => {
        setSelectedIjinId(ijinId);
        setOpenConfirm(true);
    };

    const handleCloseConfirm = () => {
        setOpenConfirm(false);
        setSelectedIjinId(null);
    };

    const handleDeleteIjins = async () => {
        if (selectedIjinId) {
            try {
                await deleteIjin(selectedIjinId); // Deleting IJIN
                enqueueSnackbar('IJIN deleted successfully', { variant: 'success' });

                setIjins(ijins.filter(ijin => ijin.id !== selectedIjinId));
                handleCloseConfirm();
            } catch (error) {
                console.error('Error deleting IJIN:', error);
                enqueueSnackbar('Error deleting IJIN', { variant: 'error' });
            }
        } else {
            enqueueSnackbar('No IJIN selected for deletion', { variant: 'warning' });
        }
    };

    const handleViewRow = (id) => {
        navigate(`/dashboard/ijins/${id}`); // Navigating to IJIN details
    };

    const filteredIjins = ijins.filter((ijin) => {
        let isValid = true;
        let ijinDate = ijin.date; // Assuming ijin.date is a Firestore timestamp object

        if (ijinDate instanceof Date) {
            // Already a Date object
        } else if (ijinDate && typeof ijinDate.toDate === 'function') {
            // Convert Firestore Timestamp to Date
            ijinDate = ijinDate.toDate();
        } else {
            ijinDate = new Date(ijinDate);
        }

        if (fromDate) {
            isValid = isValid && ijinDate >= new Date(fromDate);
        }

        if (toDate) {
            isValid = isValid && ijinDate <= new Date(toDate);
        }

        return isValid;
    });

    const formatDate = (date) => {
        if (!date) return 'Invalid Date';

        let validDate = date;

        if (date instanceof Date) {
            validDate = date;
        } else if (date && typeof date.toDate === 'function') {
            validDate = date.toDate();  // For Firestore Timestamp to Date conversion
        } else {
            validDate = new Date(date);
        }

        return Number.isNaN(validDate) ? 'Invalid Date' : validDate.toLocaleDateString();
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approve':
                return 'rgb(59, 130, 246)';
            case 'Reject':
                return 'rgb(202, 138, 4)';
            case 'Disabled':
                return 'red';
            default:
                return 'black'; // Default color if status is not recognized
        }
    };

    return (
        <Grid container spacing={3} style={{ padding: '2%', marginLeft: '10%', width: '85%' }}>
            {filteredIjins.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((ijin) => (
                <Grid item xs={12} sm={6} md={3} key={ijin.id}>
                    <Card sx={{ maxWidth: 345,  display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        {/* <CardMedia
                            component="img"
                            height="140"
                            image="https://api-prod-minimal-v610.pages.dev/assets/images/cover/cover-4.webp" // Replace with the actual image source
                            alt={ijin.title}
                        /> */}
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" component="div" onClick={() => handleViewRow(ijin.id)}>
                                {ijin.title}
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="body2" color="text.secondary">
                                        Author: {ijin.author}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body2" color="text.secondary">
                                        University: {ijin.university}
                                    </Typography>
                                </Grid>
                            </Grid>
                            
                            <Typography variant="body2" color="text.secondary" style={{ marginTop: '10px' }}>
                                Year: {ijin.year}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default PropertyTable;
