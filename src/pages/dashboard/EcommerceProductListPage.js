import {
  Button,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker'; // Updated import for DatePicker
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import ConfirmDialog from '../../components/confirm-dialog';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import Iconify from '../../components/iconify';
import MenuPopover from '../../components/menu-popover';
import { useSnackbar } from '../../components/snackbar';
import { deleteJournal, getAllJournals, updateBrowseStatus, updateConferenceStatus, updatePropertyFeaturedStatus } from '../../controller/propertiesController';
import { PATH_DASHBOARD } from '../../routes/paths';
// 
const PropertyTableToolbar = ({
  isFiltered,
  fromDate,
  toDate,
  onFilterFromDate,
  onFilterToDate,
  onResetFilter,
  categories,
  category,
  type,
  types,
  handleFilterCategory,
  handleFilterTypes,
}) => (
  <Stack
    spacing={2}
    alignItems="center"
    direction={{
      xs: 'column',
      sm: 'row',
    }}
    sx={{ px: 2.5, py: 3 }}
  >
    <DatePicker
      label="From Date"
      value={fromDate}
      onChange={onFilterFromDate}
      renderInput={(params) => <TextField {...params} fullWidth sx={{ maxWidth: { sm: 240 } }} />}
      maxDate={new Date()} // Disable future dates
    />

    <DatePicker
      label="To Date"
      value={toDate}
      onChange={onFilterToDate}
      renderInput={(params) => <TextField {...params} fullWidth sx={{ maxWidth: { sm: 240 } }} />}
      maxDate={new Date()} // Disable future dates
    />
    <TextField
      select
      label="Category"
      value={category}
      onChange={handleFilterCategory}
      fullWidth
      sx={{ maxWidth: { sm: 240 } }}
      SelectProps={{ displayEmpty: true }}
    >
      <MenuItem value=""><em>None</em></MenuItem>
      {categories && categories.map((cat) => (
        <MenuItem key={cat.id} value={cat.category}>{cat.category}</MenuItem>
      ))}
    </TextField>

    <TextField
      select
      label="Types"
      value={type}
      onChange={handleFilterTypes}
      fullWidth
      sx={{ maxWidth: { sm: 240 } }}
      SelectProps={{ displayEmpty: true }}
    >
      <MenuItem value="" />
      {types && types.map((cat) => (
        <MenuItem key={cat.id} value={cat.propertyType}>{cat.propertyType}</MenuItem>
      ))}
    </TextField>

    {isFiltered && (
      <Button
        color="error"
        sx={{ flexShrink: 0 }}
        onClick={onResetFilter}
        startIcon={<Iconify icon="eva:trash-2-outline" />}
      >
        Clear
      </Button>
    )}
  </Stack>
);

PropertyTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  fromDate: PropTypes.instanceOf(Date),
  toDate: PropTypes.instanceOf(Date),
  onFilterFromDate: PropTypes.func,
  onFilterToDate: PropTypes.func,
  onResetFilter: PropTypes.func,
  categories: PropTypes.array,
  types: PropTypes.array,
  category: PropTypes.string,
  type: PropTypes.string,
  handleFilterCategory: PropTypes.func,
  handleFilterTypes: PropTypes.func,
};

const PropertyTable = () => {
  const [properties, setProperties] = useState([]);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [isFiltered, setIsFiltered] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openPopover, setOpenPopover] = useState(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const [openPopover2, setOpenPopover2] = useState(null);
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [types, setTypes] = useState([]);
  const [featuredStatus, setFeaturedStatus] = useState();
  const [categories, setCategories] = useState([
  ]);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const propertiesData = await getAllJournals();
        setProperties(propertiesData);

      } catch (error) {
        console.error('Error fetching properties or categories:', error);
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

  const handleOpenPopover = (event, propertyId) => {
    setSelectedPropertyId(propertyId);
    setOpenPopover(event.currentTarget);
  };
  const handleOpenPopover2 = (event, propertyId) => {
    setSelectedPropertyId(propertyId);
    setOpenPopover2(event.currentTarget);
  };
  const handleClosePopover = () => {
    setOpenPopover(null);
    setOpenPopover2(null);

  };

  const handleDeleteproperties = async () => {
    if (selectedPropertyId) {
      try {
        await deleteJournal(selectedPropertyId);
        console.log("Property deleted successfully");
        enqueueSnackbar('Property deleted successfully', { variant: 'success' });

        // Handle additional logic after successful deletion
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
    console.log('Property Id:', id); // Check if propertiesId is received correctly
    navigate(PATH_DASHBOARD.eCommerce.view((id)));
  };
  const handleEditRow = (id) => {
    // Use the id directly without transforming it with paramCase
    navigate(PATH_DASHBOARD.eCommerce.edit(id));
  };
  const handleFilterFromDate = (date) => {
    setFromDate(date);
    setIsFiltered(true);
  };

  const handleFilterToDate = (date) => {
    setToDate(date);
    setIsFiltered(true);
  };

  const handleFilterCategory = (event) => {
    setCategory(event.target.value);
    setIsFiltered(true);
  };
  const handleFilterTypes = (event) => {
    setType(event.target.value);
    setIsFiltered(true);
  };

  const handleResetFilter = () => {
    setFromDate(null);
    setToDate(null);
    setCategory('');
    setType('');
    setIsFiltered(false);
  };

  const filteredProperties = properties.filter((property) => {
    let isValid = true;
    let propertyDate = property.createdAt;

    // Check if propertyDate needs to be converted to a JavaScript Date object
    if (propertyDate instanceof Date) {
      // Do nothing, already a Date object
    } else if (propertyDate && typeof propertyDate.toDate === 'function') {
      // Convert Firestore Timestamp to Date
      propertyDate = propertyDate.toDate();
    } else {
      // Convert other types to Date
      propertyDate = new Date(propertyDate);
    }

    if (fromDate) {
      isValid = isValid && propertyDate >= new Date(fromDate);
    }

    if (toDate) {
      isValid = isValid && propertyDate <= new Date(toDate);
    }

    if (category) {
      isValid = isValid && property.category === category;
    }

    if (type) {
      isValid = isValid && property.propertyType === type;
    }

    return isValid;
  });

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
  const handleBrowseStatusChange = async (browsestatus, userId) => {
    try {
      await updateBrowseStatus(userId, browsestatus);
      enqueueSnackbar(' status updated successfully');
      const updatedUsers = users.map(user =>
        user.id === userId ? { ...user, BrowseStatus: browsestatus } : user
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
  const handleFeaturedStatusChange = async (id, event) => {
    const newStatus = event.target.checked;

    try {
      // Update Firestore
      await updatePropertyFeaturedStatus(id, newStatus);
      console.log(`Featured status updated to ${newStatus} for property ID: ${id}`);
      enqueueSnackbar('Featured status updated successfully');

      // Update the featured status in the state
      const updatedProperties = properties.map(property =>
        property.id === id ? { ...property, featuredStatus: newStatus } : property
      );
      setProperties(updatedProperties);
    } catch (e) {
      console.error("Error updating featured status: ", e);
      enqueueSnackbar(`Error updating featured status: ${e.message}`, { variant: 'error' });

      // Revert the status change in case of error
      const revertedProperties = properties.map(property =>
        property.id === id ? { ...property, featuredStatus: !newStatus } : property
      );
      setProperties(revertedProperties);
    }
  };


  return (
    <>
      <CustomBreadcrumbs
        heading="Journal List"
        links={[
          { name: 'Dashboard', href: PATH_DASHBOARD.root },
          { name: 'Journal', href: PATH_DASHBOARD.eCommerce.root },
          { name: 'List' },
        ]}
        action={
          <Button
            component={RouterLink}
            to='/dashboard/Journal/new'
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            New
          </Button>
        }
      />
      {/* <PropertyTableToolbar
        isFiltered={isFiltered}
        fromDate={fromDate}
        toDate={toDate}
        onFilterFromDate={handleFilterFromDate}
        onFilterToDate={handleFilterToDate}
        onResetFilter={handleResetFilter}
        categories={categories} // Pass the fetched categories here
        category={category}
        handleFilterCategory={handleFilterCategory}
        types={types} // Pass the fetched categories here
        type={type}
        handleFilterTypes={handleFilterTypes}
      /> */}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Abbreviation</TableCell>
              {/* <TableCell>ISSN (Print)</TableCell>
        <TableCell>ISSN (Online)</TableCell> */}
              <TableCell>Publisher</TableCell>
              <TableCell>Discipline</TableCell>
              {/* <TableCell>Chief Editor</TableCell>
        <TableCell>Country</TableCell> */}
              <TableCell>Language</TableCell>
              <TableCell>Frequency</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>License</TableCell>
              <TableCell>Featured Status</TableCell>
              <TableCell>View</TableCell>
              <TableCell>BrowseStatus</TableCell>
              <TableCell>Status Action</TableCell>
              <TableCell>Edit</TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProperties.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((journal, index) => {
              const isItemSelected = isSelected(journal.id);

              return (
                <TableRow
                  key={journal.id}
                  hover
                  onClick={() => handleCheckboxChange(journal.id)}
                  role="checkbox"
                  aria-checked={isItemSelected}
                  selected={isItemSelected}
                >
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{journal.title}</TableCell>
                  <TableCell>{journal.abbreviation}</TableCell>
                  {/* <TableCell>{journal.UserStatus}</TableCell> */}
                  {/* // <TableCell>{journal.issnOnline}</TableCell> */}
                  <TableCell>{journal.publisher}</TableCell>
                  <TableCell>{journal.discipline}</TableCell>
                  {/* <TableCell>{journal.chiefEditor}</TableCell>
            <TableCell>{journal.country}</TableCell> */}
                  <TableCell>{journal.language}</TableCell>
                  <TableCell>{journal.frequency}</TableCell>
                  <TableCell>{journal.yearOfStarting}</TableCell>
                  <TableCell>{journal.licenseType}</TableCell>
                  <TableCell>
                    <Switch
                      checked={journal.featuredStatus}
                      onChange={(event) => handleFeaturedStatusChange(journal.id, event)}
                      color="primary"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={(event) => handleViewRow(journal.id)}
                    >
                      <Iconify icon="eva:eye-fill" />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <select
                      name="BrowseStatus"
                      label="Browse Status Type"
                      placeholder="Browse Status Type"
                      onChange={(e) => handleBrowseStatusChange(e.target.value, journal.id)} // Pass the selected value and userId
                    >
                      <option value='' />
                      <option value='indexed'>Indexed</option>
                      <option value='master'>Master</option>
                      <option value='evaluation'>Evaluation</option>

                    </select>
                  </TableCell>
                  <TableCell><IconButton
                    color={openPopover2 ? 'primary' : 'default'}
                    onClick={(event) => handleOpenPopover2(event, journal.id)}
                  >
                    <Iconify icon="eva:more-vertical-fill" />
                  </IconButton>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        if (journal.id) {
                          setSelectedPropertyId(journal.id);
                          handleOpenConfirm();
                        } else {
                          console.error("No journal ID available");
                          enqueueSnackbar('No journal ID available', { variant: 'warning' });
                        }
                        handleClosePopover();
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

