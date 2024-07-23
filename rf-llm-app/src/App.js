import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Card, CardContent } from '@mui/material';

function App() {
    const [query, setQuery] = useState('');
    const [budget, setBudget] = useState('');
    const [recommendations, setRecommendations] = useState([]);

    const handleRecommend = async () => {
        try {
            const response = await axios.post('http://localhost:8000/recommend', {
                query,
                budget: parseFloat(budget)
            });
            setRecommendations(response.data);
        } catch (error) {
            console.error('Error recommending:', error);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <Card>
                <CardContent>
                    <Typography variant="h5">House Recommendation</Typography>
                    <TextField
                        label="What do you want in your house?"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        fullWidth
                        style={{ marginBottom: '20px' }}
                    />
                    <TextField
                        label="What's your budget?"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        fullWidth
                        style={{ marginBottom: '20px' }}
                    />
                    <Button variant="contained" color="primary" onClick={handleRecommend}>
                        Get Recommendations
                    </Button>
                    {recommendations.length > 0 && (
                        <div style={{ marginTop: '20px' }}>
                            {recommendations.map((rec, index) => (
                                <Card key={index} style={{ marginBottom: '10px' }}>
                                    <CardContent>
                                        <Typography variant="body1">
                                            Recommendation {index + 1}: {JSON.stringify(rec)}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default App;
