import {
    Avatar,
    Box,
    Button,
    IconButton,
    MenuItem,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Typography
} from '@mui/material';
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import ConfirmDialog from '../../components/confirm-dialog';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import Iconify from '../../components/iconify';
import MenuPopover from '../../components/menu-popover';
import { useSnackbar } from '../../components/snackbar';
import { deleteThesis, getThesesByVolume, updateConferenceStatus } from '../../controller/thesisController';

const PropertyTable = () => {
    const [properties, setProperties] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedProperties, setSelectedProperties] = useState([]);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [isFiltered, setIsFiltered] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [selectedPropertyId, setSelectedPropertyId] = useState(null);
    const [users, setUsers] = useState([]);
    const [openPopover, setOpenPopover] = useState(null);
    const [openPopover2, setOpenPopover2] = useState(null); const [selectedUserId, setSelectedUserId] = useState(null);

    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const volume = 1; // Replace with the actual volume you want to fetch
                const propertiesData = await getThesesByVolume(volume);
                setProperties(propertiesData.theses); // Make sure to use `theses` field from the returned data
            } catch (error) {
                console.error('Error fetching properties:', error);
                enqueueSnackbar('Error fetching properties', { variant: 'error' });
            }
        };

        fetchData();
    }, [enqueueSnackbar]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleOpenConfirm = () => {
        setOpenConfirm(true);
    };

    const handleCloseConfirm = () => {
        setOpenConfirm(false);
    };



    const handleViewRow = (id) => {
        navigate(`/dashboard/conference/${id}`);
    };
    const handleEditRow = (id) => {
        navigate(`/dashboard/thesis/${id}/edit`);
    };

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

    const getPdfDownloadUrl = async (pdfPath) => {
        const storage = getStorage();
        const pdfRef = ref(storage, pdfPath);
        try {
            const url = await getDownloadURL(pdfRef);
            return url;
        } catch (error) {
            console.error('Error fetching PDF URL:', error);
            enqueueSnackbar('Error fetching PDF URL', { variant: 'error' });
            return null;
        }
    };
    const handleOpenPopover = (event, userId) => {
        setSelectedUserId(userId);
        setOpenPopover(event.currentTarget);
    };
    const handleOpenPopover2 = (event, userId) => {
        setSelectedUserId(userId);
        setOpenPopover2(event.currentTarget);
    };
    const handleClosePopover = () => {
        setOpenPopover(null);
        setOpenPopover2(null);

    };
    const handleDeleteproperties = async () => {
        if (selectedPropertyId) {
            try {
                await deleteThesis(selectedPropertyId);
                console.log("Property deleted successfully");
                enqueueSnackbar('Property deleted successfully', { variant: 'success' });

                setProperties(properties.filter(property => property.id !== selectedPropertyId));
                handleCloseConfirm();
            } catch (error) {
                console.error("Error deleting property:", error);
                enqueueSnackbar('Error deleting property', { variant: 'error' });
            }
        } else {
            console.error("No property ID selected for deletion");
            enqueueSnackbar('No property ID selected for deletion', { variant: 'warning' });
        }
    };
    const handleUserStatusChange = async (status, userId) => {
        try {
            await updateConferenceStatus(userId, status);
            enqueueSnackbar(' status updated successfully');
            const updatedUsers = users.map(user =>
                user.id === userId ? { ...user, UserStatus: status } : user
            );
            setUsers(updatedUsers); // Assuming users is your state variable for user data
        } catch (error) {
            console.error("Error updating  status:", error);
            enqueueSnackbar('Error updating  status', { variant: 'error' });
        } finally {
            handleClosePopover();
        }
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
        <>
            <CustomBreadcrumbs
                heading="Thesis List"
                links={[
                    { name: 'Dashboard', },
                    { name: 'Thesis', },
                    { name: 'List' },
                ]}
                action={
                    <Button
                        component={RouterLink}
                        to='/dashboard/thesis/new'
                        variant="contained"
                        startIcon={<Iconify icon="eva:plus-fill" />}
                    >
                        New
                    </Button>
                }
            />

            <TableContainer component={Paper} sx={{ margin: '2%', width: '90%' }}>
                <Table sx={{ minWidth: 650 }} aria-label="property table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Thesis ID</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>College/University</TableCell>
                            <TableCell>Author</TableCell>
                            <TableCell>Status Action</TableCell>
                            <TableCell align="center">Actions</TableCell>
                            <TableCell align="center">Edit</TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {properties.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((property) => (
                            <TableRow key={property.id}>
                                <TableCell>{property.thesisId}</TableCell>
                                <Stack direction="row" alignItems="center" spacing={2} sx={{marginTop:'15px'}}>
                                    <Avatar alt={property.title} src={property.photoId} />
                                    <Typography variant="subtitle2" noWrap>
                                        {property.title}
                                    </Typography>
                                </Stack>

                                <TableCell>{property.collegeUniversity}</TableCell>
                                <TableCell>{property.author}</TableCell>
                                <TableCell>
                                    <IconButton
                                        color={openPopover2 ? 'primary' : 'default'}
                                        onClick={(event) => handleOpenPopover2(event, property.id)}
                                    >
                                        <Iconify icon="eva:more-vertical-fill" />
                                    </IconButton>
                                    {property.UserStatus}
                                </TableCell>
                                <TableCell align="center">
                                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                        <IconButton
                                            component="a"
                                            href={property.fullPdf}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Iconify icon="eva:eye-outline" />
                                        </IconButton>
                                        <IconButton
                                            component="a"
                                            href={property.fullPdf}
                                            download={`${property.title}.pdf`}
                                        >
                                            <Iconify icon="eva:download-fill" />
                                        </IconButton>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        onClick={() => {
                                            setSelectedPropertyId(property.id);
                                            handleOpenConfirm();
                                        }}
                                        sx={{ color: 'error.main' }}
                                    >
                                        <Iconify icon="eva:trash-2-outline" />
                                    </IconButton>

                                    <IconButton
                                        onClick={(event) => handleEditRow(property.id)}
                                    >
                                        <Iconify icon="eva:edit-fill" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <ConfirmDialog
                    open={openConfirm}
                    onClose={handleCloseConfirm}
                    title="Delete"
                    content="Are you sure want to delete?"
                    action={
                        <Button variant="contained" color="error" onClick={handleDeleteproperties}>
                            Delete
                        </Button>
                    }
                />
                <MenuPopover
                    open={openPopover2}
                    onClose={handleClosePopover}
                    arrow="right-top"
                    sx={{ width: 140 }}
                >

                    <MenuItem
                        onClick={() => {
                            handleUserStatusChange("Approve", selectedUserId);
                            handleClosePopover();
                        }}
                    >
                        <Iconify icon="eva:checkmark-circle-2-fill" style={{ color: "rgb(59, 130, 246)" }} />
                        <Typography variant="inherit" style={{ color: "rgb(59, 130, 246)" }}>Approve</Typography>
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            handleUserStatusChange("Rejected", selectedUserId);
                            handleClosePopover();
                        }}
                    >
                        <Iconify icon="bi:circle" style={{ color: "rgb(202, 138, 4)" }} />
                        <Typography variant="inherit" style={{ color: "rgb(202, 138, 4)" }}>Rejected</Typography>
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            handleUserStatusChange("Disabled", selectedUserId);
                            handleClosePopover();
                        }}
                    >
                        <Iconify icon="carbon:close-outline" style={{ color: "red" }} />
                        <Typography variant="inherit" style={{ color: "rgb(239, 68, 68)" }}>Disabled</Typography>
                    </MenuItem>

                </MenuPopover>
                <TablePagination
                    component="div"
                    count={properties.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>
        </>
    );
};

export default PropertyTable;
