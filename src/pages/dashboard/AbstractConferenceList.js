// import {
//     Card, CardContent, CardMedia,
//     Grid,
//     Link,
//     Typography
// } from '@mui/material';
// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// import { useSnackbar } from '../../components/snackbar';
// import { getAllAbstracts } from '../../controller/abstractconferenceController';

// const AbstractTable = () => {
//     const [abstracts, setAbstracts] = useState([]);
//     const [selectedAbstracts, setSelectedAbstracts] = useState([]);
//     const [page, setPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(5);

//     const { enqueueSnackbar } = useSnackbar();
//     const navigate = useNavigate();

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const abstractsData = await getAllAbstracts();
//                 setAbstracts(abstractsData);
//             } catch (error) {
//                 console.error('Error fetching abstracts:', error);
//             }
//         };

//         fetchData();
//     }, []);

//     const handleViewRow = (id) => {
//         navigate(`/dashboard/abstractconference/${id}`);
//     };

//     const filteredAbstracts = abstracts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

//     return (
//         <Grid container spacing={3} style={{ padding: '2%', marginLeft: '10%', width: '85%' }}>
//             {filteredAbstracts.map((abstract) => (
//                 <Grid item xs={12} sm={6} md={3} key={abstract.id}>
//                     <Card sx={{ maxWidth: 345, minHeight: 400, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
//                         <CardMedia
//                             component="img"
//                             height="140"
//                             image={abstract.assetFile || "https://api-prod-minimal-v610.pages.dev/assets/images/cover/cover-4.webp"} // Show assetFile if available
//                             alt={abstract.title}
//                         />
//                         <CardContent sx={{ flexGrow: 1 }}>
//                             <Typography variant="h6" component="div" onClick={() => handleViewRow(abstract.id)}>
//                                 {abstract.title}
//                             </Typography>

//                             <Grid container spacing={2}>
//                                 <Grid item xs={6}>
//                                     <Typography variant="body2" color="text.secondary">
//                                         Author: {abstract.authorName}
//                                     </Typography>
//                                 </Grid>
//                                 <Grid item xs={6}>
//                                     <Typography variant="body2" color="text.secondary">
//                                         Conference: {abstract.conferenceName}
//                                     </Typography>
//                                 </Grid>
//                                 <Grid item xs={12}>
//                                     <Typography variant="body2" color="text.secondary">
//                                         Affiliation: {abstract.affiliation}
//                                     </Typography>
//                                 </Grid>
//                             </Grid>

//                             <Typography variant="body2" color="text.secondary" style={{ marginTop: '10px' }}>
//                                 Abstract: {abstract.abstract}
//                             </Typography>

//                             {abstract.linkDOI && (
//                                 <Typography variant="body2" color="primary" style={{ marginTop: '10px' }}>
//                                     <Link href={abstract.linkDOI} target="_blank" rel="noopener noreferrer">
//                                         DOI Link
//                                     </Link>
//                                 </Typography>
//                             )}
//                         </CardContent>
//                     </Card>
//                 </Grid>
//             ))}
//         </Grid>
//     );
// };

// export default AbstractTable;
import {
    Button,
    IconButton,
    MenuItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import ConfirmDialog from '../../components/confirm-dialog';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import MenuPopover from '../../components/menu-popover';
import { deleteAbstract, getAllAbstracts } from '../../controller/abstractconferenceController';

import Iconify from '../../components/iconify';
import { useSnackbar } from '../../components/snackbar';
import { updateConferenceStatus } from '../../controller/articlesController';

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
                const propertiesData = await getAllAbstracts();
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
                await deleteAbstract(selectedPropertyId);
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
        navigate(`/dashboard/abstractconference/${id}`);

    };

    const handleEditRow = (id) => {
        // navigate(PATH_DASHBOARD.conference.edit(id));
        navigate(`/dashboard/abstractconference/${id}/edit`);

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
                heading="Abstract - Conference List"
                links={[
                    { name: 'Dashboard' },
                    { name: 'Abstract - Conference' },
                    { name: 'List' },
                ]}
                action={
                    <Button
                        component={RouterLink}
                        to='/dashboard/abstractconference/new'
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
                            <TableCell>Author</TableCell>
                            <TableCell>Conference</TableCell>
                            <TableCell>Affiliation</TableCell>
                            <TableCell>Abstract</TableCell>
                            <TableCell> DOI Link</TableCell>
                            <TableCell>View</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredProperties.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((journal, index) => {
                            const isItemSelected = isSelected(journal.id);

                            return (
                                <TableRow
                                    key={journal.id}
                                    hover
                                    role="checkbox"
                                    aria-checked={isItemSelected}
                                    selected={isItemSelected}
                                >
                                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                    <TableCell>{journal.title}</TableCell>
                                    <TableCell>{journal.authorName}</TableCell>
                                    <TableCell>{journal.conferenceName}</TableCell>
                                    <TableCell>{journal.affiliation}</TableCell>
                                    <TableCell>
                                        {(journal.abstract)}
                                    </TableCell>
                                    <TableCell>
                                        {(journal.linkDOI)}
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            onClick={(event) => handleViewRow(journal.id)}
                                        >
                                            <Iconify icon="eva:eye-fill" />
                                        </IconButton>
                                    </TableCell>
                                    {/* <TableCell><IconButton
                                        color={openPopover2 ? 'primary' : 'default'}
                                        onClick={(event) => handleOpenPopover2(event, journal.id)}
                                    >
                                        <Iconify icon="eva:more-vertical-fill" />
                                    </IconButton>
                                    </TableCell> */}
                                    {/* <TableCell style={{ color: getStatusColor(journal.UserStatus) }}>{journal.UserStatus}</TableCell> */}

                                    <TableCell>
                                        <IconButton
                                            onClick={() => {
                                                setSelectedPropertyId(journal.id);
                                                handleOpenConfirm();
                                            }}
                                            sx={{ color: 'error.main' }}
                                        >
                                            <Iconify icon="eva:trash-2-outline" />
                                        </IconButton>

                                        <IconButton
                                            onClick={(event) => handleEditRow(journal.id)}
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
