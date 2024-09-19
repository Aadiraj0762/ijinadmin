import {
  Avatar,
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
import { deleteUser, getUsers, updateUserStatus } from '../../controller/usersController';
import { PATH_DASHBOARD } from '../../routes/paths';

const UserTableToolbar = ({
  isFiltered,
  fromDate,
  toDate,
  onFilterFromDate,
  onFilterToDate,
  onResetFilter,
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

UserTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  fromDate: PropTypes.instanceOf(Date),
  toDate: PropTypes.instanceOf(Date),
  onFilterFromDate: PropTypes.func,
  onFilterToDate: PropTypes.func,
  onResetFilter: PropTypes.func,
};

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [isFiltered, setIsFiltered] = useState(false);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [openPopover, setOpenPopover] = useState(null);
  const [openPopover2, setOpenPopover2] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersData = await getUsers();
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchData();
  }, []);

  const handleCheckboxChange = (userId) => {
    const selectedIndex = selectedUsers.indexOf(userId);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedUsers, userId);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedUsers.slice(1));
    } else if (selectedIndex === selectedUsers.length - 1) {
      newSelected = newSelected.concat(selectedUsers.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedUsers.slice(0, selectedIndex),
        selectedUsers.slice(selectedIndex + 1)
      );
    }

    setSelectedUsers(newSelected);
  };

  const isSelected = (userId) => selectedUsers.indexOf(userId) !== -1;

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

  const handleDeleteUser = async () => {
    if (selectedUserId) {
      try {
        await deleteUser(selectedUserId);
        console.log("User deleted successfully");
        enqueueSnackbar('User deleted successfully');

        // Handle additional logic after successful deletion
        setUsers(users.filter(user => user.id !== selectedUserId));
        setSelectedUsers(selectedUsers.filter(id => id !== selectedUserId));
        handleCloseConfirm();
      } catch (error) {
        console.error("Error deleting user:", error);
        enqueueSnackbar('Error deleting user:', { variant: 'error' });
      }
    } else {
      console.error("No user ID selected for deletion");
    }
  };

  const handleEditRow = (userId) => {
    console.log('UserViewPage userId:', userId); // Check if userId is received correctly
    navigate(`/dashboard/user/edit/${userId}`);
  };

  const handleViewUser = (userId) => {
    console.log('UserViewPage userId:', userId); // Check if userId is received correctly
    navigate(`/dashboard/user/view/${userId}`);
  };

  const handleFilterFromDate = (date) => {
    setFromDate(date);
    setIsFiltered(true);
  };

  const handleFilterToDate = (date) => {
    setToDate(date);
    setIsFiltered(true);
  };

  const handleResetFilter = () => {
    setFromDate(null);
    setToDate(null);
    setIsFiltered(false);
  };

  const filteredUsers = users.filter((user) => {
    if (user.createdAt) {
      const userDate = user.createdAt; // createdAt is already a Date object

      const fromDateObj = fromDate ? new Date(fromDate) : null;
      const toDateObj = toDate ? new Date(toDate) : null;

      if (fromDateObj && toDateObj) {
        toDateObj.setHours(23, 59, 59, 999);
        return userDate >= fromDateObj && userDate <= toDateObj;
      }

      if (fromDateObj) {
        return userDate >= fromDateObj;
      }

      if (toDateObj) {
        toDateObj.setHours(23, 59, 59, 999);
        return userDate <= toDateObj;
      }
    }

    return true;
  });
  const handleUserStatusChange = async (status, userId) => {
    try {
      await updateUserStatus(userId, status);
      enqueueSnackbar('User status updated successfully');
      const updatedUsers = users.map(user => 
        user.id === userId ? { ...user, UserStatus: status } : user
      );
      setUsers(updatedUsers); // Assuming users is your state variable for user data
    } catch (error) {
      console.error("Error updating user status:", error);
      enqueueSnackbar('Error updating user status', { variant: 'error' });
    } finally {
      handleClosePopover();
    }
  };
  const getStatusColor = (status) => {
    switch (status) {
      case 'Verified':
        return 'rgb(59, 130, 246)';
      case 'Unverified':
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
        heading="User List"
        links={[
          { name: 'Dashboard', href: PATH_DASHBOARD.root },
          { name: 'User', href: PATH_DASHBOARD.user.root },
          { name: 'List' },
        ]}
        action={
          <Button
            component={RouterLink}
            to={PATH_DASHBOARD.user.new}
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            New User
          </Button>
        }
      />
      <UserTableToolbar
        isFiltered={isFiltered}
        fromDate={fromDate}
        toDate={toDate}
        onFilterFromDate={handleFilterFromDate}
        onFilterToDate={handleFilterToDate}
        onResetFilter={handleResetFilter}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sr. No</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status Action</TableCell>
              <TableCell>Status</TableCell>

              <TableCell>Details</TableCell>
              <TableCell>Actions</TableCell>
              <TableCell>Date / Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user, index) => {
              const isItemSelected = isSelected(user.id);

              return (
                <TableRow
                  key={user.id}
                  hover
                  onClick={() => handleCheckboxChange(user.id)}
                  role="checkbox"
                  aria-checked={isItemSelected}
                  selected={isItemSelected}
                >
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar alt={user.name} src={user.avatarUrl} />
                      <Typography variant="subtitle2" noWrap>
                        {user.name}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phoneNumber}</TableCell>
                  <TableCell>{user.type}</TableCell>
                  <TableCell><IconButton
                      color={openPopover2 ? 'primary' : 'default'}
                      onClick={(event) => handleOpenPopover2(event, user.id)}
                    >
                      <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                     </TableCell>
                     <TableCell style={{ color: getStatusColor(user.UserStatus) }}>{user.UserStatus}</TableCell>
                     <TableCell align="left">
                    <MenuItem
                      onClick={() => {
                        handleViewUser(user.id);
                        handleClosePopover();
                      }}
                    >
                      <Iconify icon="eva:eye-fill" />&nbsp;
                      View
                    </MenuItem>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      color={openPopover ? 'primary' : 'default'}
                      onClick={(event) => handleOpenPopover(event, user.id)}
                    >
                      <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                  </TableCell>
                  <TableCell>{user.formattedDate}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            handleOpenConfirm();
            handleClosePopover();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="eva:trash-2-outline" />
          Delete
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleEditRow(selectedUserId);
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:edit-fill" />
          Edit
        </MenuItem>
      </MenuPopover>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={handleDeleteUser}>
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
    handleUserStatusChange("Verified", selectedUserId);
    handleClosePopover();
  }}
>
  <Iconify icon="eva:checkmark-circle-2-fill" style={{ color: "rgb(59, 130, 246)" }} />
  <Typography variant="inherit" style={{ color: "rgb(59, 130, 246)" }}>Verified</Typography>
</MenuItem>
<MenuItem
  onClick={() => {
    handleUserStatusChange("Unverified", selectedUserId);
    handleClosePopover();
  }}
>
  <Iconify icon="bi:circle" style={{ color: "rgb(202, 138, 4)" }} />
  <Typography variant="inherit" style={{ color: "rgb(202, 138, 4)" }}>Unverified</Typography>
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
        count={filteredUsers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};

export default UserTable;
