import {
    Button,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import ConfirmDialog from '../../components/confirm-dialog';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import Iconify from '../../components/iconify';
import { useSnackbar } from '../../components/snackbar';
import { deleteIjin, getAllIjins } from '../../controller/ijinController';

const PropertyTable = () => {
    const [properties, setProperties] = useState([]);
    const [selectedProperties, setSelectedProperties] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
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
                const propertiesData = await getAllIjins();
                setProperties(propertiesData);
            } catch (error) {
                console.error('Error fetching properties:', error);
            }
        };

        fetchData();
    }, []);

    const handleCheckboxChange = (propertyId) => {
        if (propertyId === 'all') {
            if (selectedProperties.length === properties.length) {
                setSelectedProperties([]);
            } else {
                setSelectedProperties(properties.map((property) => property.id));
            }
            return;
        }

        const selectedIndex = selectedProperties.indexOf(propertyId);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selectedProperties, propertyId);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selectedProperties.slice(1));
        } else if (selectedIndex === selectedProperties.length - 1) {
            newSelected = newSelected.concat(selectedProperties.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selectedProperties.slice(0, selectedIndex),
                selectedProperties.slice(selectedIndex + 1)
            );
        }

        setSelectedProperties(newSelected);
    };

    const isSelected = (propertyId) => selectedProperties.indexOf(propertyId) !== -1;

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
                await deleteIjin(selectedPropertyId);
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

    const handleViewRow = (id) => {
        // navigate(PATH_DASHBOARD.conference.view(id));
        navigate(`/dashboard/ijin/${id}`);

    };

    const handleEditRow = (id) => {
        navigate(`/dashboard/ijin/${id}/edit`);
    };

    const filteredProperties = properties.filter((property) => {
        let isValid = true;
        let propertyDate = property.date; // Assuming property.date is a Firestore timestamp object

        if (propertyDate instanceof Date) {
            // Already a Date object
        } else if (propertyDate && typeof propertyDate.toDate === 'function') {
            // Convert Firestore Timestamp to Date
            propertyDate = propertyDate.toDate();
        } else {
            propertyDate = new Date(propertyDate);
        }

        if (fromDate) {
            isValid = isValid && propertyDate >= new Date(fromDate);
        }

        if (toDate) {
            isValid = isValid && propertyDate <= new Date(toDate);
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
    // const handleUserStatusChange = async (status, userId) => {
    //     try {
    //         await updateConferenceStatus(userId, status);
    //         enqueueSnackbar(' status updated successfully');
    //         const updatedUsers = users.map(user =>
    //             user.id === userId ? { ...user, UserStatus: status } : user
    //         );
    //         setUsers(updatedUsers); // Assuming users is your state variable for user data
    //     } catch (error) {
    //         console.error("Error updating  status:", error);
    //         enqueueSnackbar('Error updating  status', { variant: 'error' });
    //     } finally {
    //         handleClosePopover();
    //     }
    // };
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
                heading="IJIN List"
                links={[
                    { name: 'Dashboard',},
                    { name: 'IJIN', },
                    { name: 'List' },
                ]}
                action={
                    <Button
                        component={RouterLink}
                        to='/dashboard/ijin/new'
                        variant="contained"
                        startIcon={<Iconify icon="eva:plus-fill" />}
                    >
                        New
                    </Button>
                }
            />

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">ID</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>ISSN Print</TableCell>
                            <TableCell>ISSN Online</TableCell>
                            <TableCell>Year of Starting</TableCell>
                            <TableCell>License Type</TableCell>
                            <TableCell>IJIN</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Cover Image</TableCell>
                            <TableCell>View</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredProperties.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((conference, index) => {
                            const isItemSelected = isSelected(conference.id);

                            return (
                                <TableRow
                                    key={conference.id}
                                    hover
                                    role="checkbox"
                                    aria-checked={isItemSelected}
                                    selected={isItemSelected}
                                >
                                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                    <TableCell>{conference.title}</TableCell>
                                    <TableCell>{conference.issnPrint}</TableCell>
                                    <TableCell>{conference.issnOnline}</TableCell>
                                    <TableCell>{conference.yearOfStarting}</TableCell>
                                    <TableCell>{conference.licenseType}</TableCell>
                                    <TableCell>{conference.ijin}</TableCell>
                                    <TableCell>{conference.email}</TableCell>
                                    <TableCell>
                                        <img src={conference.coverImage} alt={conference.title} style={{ width: 50, height: 50 }} />
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            onClick={() => handleViewRow(conference.id)}
                                        >
                                            <Iconify icon="eva:eye-fill" />
                                        </IconButton>
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            onClick={() => {
                                                setSelectedPropertyId(conference.id);
                                                handleOpenConfirm();
                                            }}
                                            sx={{ color: 'error.main' }}
                                        >
                                            <Iconify icon="eva:trash-2-outline" />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => handleEditRow(conference.id)}
                                        >
                                            <Iconify icon="eva:edit-fill" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

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

            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredProperties.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </>
    );
};


export default PropertyTable;
