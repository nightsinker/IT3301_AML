import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Card, CardContent, Grid } from '@mui/material';

const initialFeatures = {
    MSSubClass: '',
    MSZoning: '',
    LotFrontage: '',
    LotArea: '',
    Street: '',
    Alley: '',
    LotShape: '',
    LandContour: '',
    Utilities: '',
    LotConfig: '',
    LandSlope: '',
    Neighborhood: '',
    Condition1: '',
    Condition2: '',
    BldgType: '',
    HouseStyle: '',
    OverallQual: '',
    OverallCond: '',
    YearBuilt: '',
    YearRemodAdd: '',
    RoofStyle: '',
    RoofMatl: '',
    Exterior1st: '',
    Exterior2nd: '',
    MasVnrType: '',
    MasVnrArea: '',
    ExterQual: '',
    ExterCond: '',
    Foundation: '',
    BsmtQual: '',
    BsmtCond: '',
    BsmtExposure: '',
    BsmtFinType1: '',
    BsmtFinSF1: '',
    BsmtFinType2: '',
    BsmtFinSF2: '',
    BsmtUnfSF: '',
    TotalBsmtSF: '',
    Heating: '',
    HeatingQC: '',
    CentralAir: '',
    Electrical: '',
    firstFlrSF: '',
    secondFlrSF: '',
    LowQualFinSF: '',
    GrLivArea: '',
    BsmtFullBath: '',
    BsmtHalfBath: '',
    FullBath: '',
    HalfBath: '',
    BedroomAbvGr: '',
    KitchenAbvGr: '',
    KitchenQual: '',
    TotRmsAbvGrd: '',
    Functional: '',
    Fireplaces: '',
    FireplaceQu: '',
    GarageType: '',
    GarageYrBlt: '',
    GarageFinish: '',
    GarageCars: '',
    GarageArea: '',
    GarageQual: '',
    GarageCond: '',
    PavedDrive: '',
    WoodDeckSF: '',
    OpenPorchSF: '',
    EnclosedPorch: '',
    SsnPorch: '',
    ScreenPorch: '',
    PoolArea: '',
    PoolQC: '',
    Fence: '',
    MiscFeature: '',
    MiscVal: '',
    MoSold: '',
    YrSold: '',
    SaleType: '',
    SaleCondition: ''
};

function App() {
    const [features, setFeatures] = useState(initialFeatures);
    const [result, setResult] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFeatures({ ...features, [name]: value });
    };

    const handlePredict = async () => {
        try {
            const response = await axios.post('http://localhost:8000/predict', {
                features: Object.values(features).map(Number),
            });
            setResult(response.data);
        } catch (error) {
            console.error('Error predicting:', error);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <Card>
                <CardContent>
                    <Typography variant="h5">Predict and Explain</Typography>
                    <Grid container spacing={2}>
                        {Object.keys(initialFeatures).map((feature, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <TextField
                                    label={feature}
                                    name={feature}
                                    value={features[feature]}
                                    onChange={handleChange}
                                    fullWidth
                                    style={{ marginBottom: '20px' }}
                                />
                            </Grid>
                        ))}
                    </Grid>
                    <Button variant="contained" color="primary" onClick={handlePredict}>
                        Predict
                    </Button>
                    {result && (
                        <div style={{ marginTop: '20px' }}>
                            <Typography variant="h6">Prediction: {result.prediction}</Typography>
                            <Typography variant="body1">Explanation: {result.explanation}</Typography>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default App;
