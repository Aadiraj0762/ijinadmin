
import { Avatar, Box, Card, Divider, Typography } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUsersByID } from '../../controller/usersController';

const StyledOverlay = styled('div')(({ theme }) => ({
    top: 0,
    left: 0,
    zIndex: 8,
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: alpha(theme.palette.grey[900], 0.64),
}));

const UserViewPage = () => {
    const { id: userId } = useParams(); // Extract userId from URL parameters
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);

            try {
                const userData = await getUsersByID(userId);
                setUser(userData);
            } catch (error) {
                console.error('Error fetching user:', error);
                setFetchError(`Error getting user: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchUser();
        }
    }, [userId]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (fetchError) {
        return <p>{fetchError}</p>;
    }

    if (!user) {
        return <p>User not found.</p>;
    }

    const { name, avatarUrl, type, address, city, state, country, zipCode, phoneNumber, UserStatus, email } = user;

    return (
        <>
            <Card style={{ margin: "20px" }}>
                <Box sx={{ py: 3 }}>
                    <Typography variant="title" component="div" sx={{ color: 'black' }}>
                        <b style={{ padding: "20px", fontSize: "large" }}>User Details:</b>
                    </Typography>
                </Box>
            </Card>
            <Card sx={{ textAlign: 'center' }} style={{ margin: "20px" }}>

                <Box sx={{ position: 'relative' }}>

                    <Avatar
                        alt={name}
                        src={avatarUrl}
                        sx={{
                            width: 64,
                            height: 64,
                            zIndex: 11,
                            left: 0,
                            right: 0,
                            bottom: -32,
                            mx: 'auto',
                            position: 'absolute',
                        }}
                    />
                    <br /><br />
                </Box>

                <Typography variant="subtitle1" sx={{ mt: 6, mb: 0.5 }}>
                    <span> Name:</span> {name}
                </Typography>

                <Typography variant="subtitle1" sx={{ color: 'text' }}>
                    Role: {type}
                </Typography>


                <Divider sx={{ borderStyle: 'dashed' }} />

                <Box sx={{ py: 3 }} style={{ textAlign: "left", margin: "20px" }}>
                    <div>
                        <Typography variant="" component="div" sx={{ mb: 0.75, }}>
                            <span style={{ fontWeight: "bold" }}>Email:</span>&nbsp;  {(email)}                  </Typography>
                    </div>
                    <div>
                        <Typography variant="" component="div" sx={{ mb: 0.75, }}>
                            <span style={{ fontWeight: "bold" }}>Contact:</span>&nbsp;  {(phoneNumber)}                  </Typography>
                    </div>
                    <div>
                        <Typography component="div" sx={{ mb: 0.75 }}>
                            <span style={{ fontWeight: "bold" }}>Address:</span>&nbsp;{(address)},&nbsp;{(city)},&nbsp;{(state)},&nbsp;{(country)},&nbsp;{(zipCode)}
                        </Typography>
                    </div>
                    <div>
                        <Typography component="div" sx={{ mb: 0.75, }}>
                            <span style={{ fontWeight: "bold" }}>User Status:</span>&nbsp;  {(UserStatus)}
                        </Typography>
                    </div>
                </Box>
            </Card>
        </>

    );
};

export default UserViewPage;
