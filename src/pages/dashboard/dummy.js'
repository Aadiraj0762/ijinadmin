import { Card, CardContent, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../components/snackbar';
import { getAllTheses } from '../../controller/thesisController';
import { ThesisHero } from '../../sections/about';

const PropertyTable = () => {
    const [groupedTheses, setGroupedTheses] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const groupedData = await getAllTheses();
                setGroupedTheses(groupedData);
            } catch (error) {
                console.error('Error fetching theses:', error);
                enqueueSnackbar('Error fetching theses', { variant: 'error' });
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

    const handleViewRow = (volume) => {
        console.log('Navigating to:', `/thesis/${volume}`); // Debug log
        navigate(`/thesis/${volume}`);
    };

    return (
        <>
            <ThesisHero />

            <Grid container spacing={3} style={{ padding: '2%', marginLeft: '10%', width: '85%' }}>
                {groupedTheses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((group) => {
                    const year = group.theses.length > 0 ? group.theses[0].year : 'Unknown Year';

                    return (
                        <Grid item xs={12} sm={6} md={3} key={group.volume}>
                            <Card sx={{ maxWidth: 345, Height: 200, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6" component="div" onClick={() => handleViewRow(group.volume)}>
                                        Volume - {group.volume} - {year}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        </>
    );
};

export default PropertyTable;
