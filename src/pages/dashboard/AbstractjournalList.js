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
import { deleteAbstract, getAllAbstracts } from '../../controller/abstractController';

const AbstractTable = () => {
    const [abstracts, setAbstracts] = useState([]);
    const [selectedAbstracts, setSelectedAbstracts] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [openPopover, setOpenPopover] = useState(null);
    const [selectedAbstractId, setSelectedAbstractId] = useState(null);
    const [selectedPropertyId, setSelectedPropertyId] = useState(null);
    const [openConfirm, setOpenConfirm] = useState(false);

    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const abstractsData = await getAllAbstracts();
                setAbstracts(abstractsData);
            } catch (error) {
                console.error('Error fetching abstracts:', error);
            }
        };

        fetchData();
    }, []);

    const handleCheckboxChange = (abstractId) => {
        if (abstractId === 'all') {
            setSelectedAbstracts(selectedAbstracts.length === abstracts.length ? [] : abstracts.map((abstract) => abstract.id));
        } else {
            const newSelected = selectedAbstracts.includes(abstractId)
                ? selectedAbstracts.filter((id) => id !== abstractId)
                : [...selectedAbstracts, abstractId];
            setSelectedAbstracts(newSelected);
        }
    };
    const handleOpenConfirm = () => {
        setOpenConfirm(true);
    };

    const handleCloseConfirm = () => {
        setOpenConfirm(false);
    };

    const isSelected = (abstractId) => selectedAbstracts.indexOf(abstractId) !== -1;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleViewRow = (id) => {
        navigate(`/dashboard/abstract/${id}`);
    };
    const handleEditRow = (id) => {
        // navigate(PATH_DASHBOARD.conference.edit(id));
        navigate(`/dashboard/abstract/${id}/edit`);

    };
    const handleDeleteproperties = async () => {
        if (selectedPropertyId) {
            try {
                await deleteAbstract(selectedPropertyId);
                console.log("Property deleted successfully");
                enqueueSnackbar('Property deleted successfully', { variant: 'success' });

                setAbstracts(abstracts.filter(property => property.id !== selectedPropertyId));
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
    const filteredAbstracts = abstracts.filter((abstract) => {
        const isValid = true; // Add your filtering logic here
        return isValid;
    });

    return (
        <>
        <CustomBreadcrumbs
                heading="Abstract - Journal List"
                links={[
                    { name: 'Dashboard' },
                    { name: 'Abstract - Journal' },
                    { name: 'List' },
                ]}
                action={
                    <Button
                        component={RouterLink}
                        to='/dashboard/abstractjournal/new'
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
                            <TableCell>ID</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Journal</TableCell>
                            <TableCell>Author</TableCell>
                            <TableCell>Publisher</TableCell>
                            <TableCell>View</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredAbstracts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((abstract, index) => {
                            const isItemSelected = isSelected(abstract.id);

                            return (
                                <TableRow
                                    key={abstract.id}
                                    hover
                                    role="checkbox"
                                    aria-checked={isItemSelected}
                                    selected={isItemSelected}
                                >
                                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                    <TableCell>{abstract.title}</TableCell>
                                    <TableCell>{abstract.journalName}</TableCell>
                                    <TableCell>{abstract.authorName}</TableCell>
                                    <TableCell>{abstract.publisher}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleViewRow(abstract.id)}>
                                            <Iconify icon="eva:eye-fill" />
                                        </IconButton>
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            onClick={() => {
                                                setSelectedPropertyId(abstract.id);
                                                handleOpenConfirm();
                                            }}
                                            sx={{ color: 'error.main' }}
                                        >
                                            <Iconify icon="eva:trash-2-outline" />
                                        </IconButton>

                                        <IconButton
                                            onClick={(event) => handleEditRow(abstract.id)}
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
                component="div"
                count={filteredAbstracts.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </>
    );
};

export default AbstractTable;
