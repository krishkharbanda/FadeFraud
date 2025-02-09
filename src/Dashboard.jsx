import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Alert,
    AlertTitle,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    IconButton,
    Chip,
    Divider,
    Tooltip
   } from '@mui/material';
   import {
    Error as ErrorIcon,
    CheckCircle as CheckCircleIcon,
    Warning as WarningIcon,
    CloudUpload as CloudUploadIcon,
    Refresh as RefreshIcon,
    Info as InfoIcon
   } from '@mui/icons-material';
   import Papa from 'papaparse';
   
   
   const FLASK_API_URL = 'http://localhost:5001/api/v1/fraud';
   
   
   const App = () => {
    const [transactions, setTransactions] = useState({ high: [], medium: [], low: [] });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedRisk, setSelectedRisk] = useState(null);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [progress, setProgress] = useState(0);
    const [apiStatus, setApiStatus] = useState(false);
    const [uploadKey, setUploadKey] = useState(0); // For resetting file input
   
   
    useEffect(() => {
      checkApiStatus();
    }, []);
   
   
    const checkApiStatus = async () => {
      try {
        const response = await fetch('http://localhost:5001/');
        const data = await response.json();
        setApiStatus(true);
      } catch (err) {
        setApiStatus(false);
        console.error('API Status Check Failed:', err);
      }
    };
   
   
    const analyzeTransaction = async (transaction) => {
      try {
        const response = await fetch(`${FLASK_API_URL}/analyze`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(transaction),
        });
   
   
        if (!response.ok) {
          throw new Error('API response was not ok');
        }
   
   
        const result = await response.json();
        const finalScore = parseInt(transaction.FinalScore);
        let riskLevel = finalScore < 70 ? 'high' : finalScore <= 85 ? 'medium' : 'low';
   
   
        // Combine risk factors
        const riskFactors = new Set([
          ...(result.analysis?.risk_factors || []),
          ...(transaction.UserIP_Blacklist > 0 ? ['IP address is blacklisted'] : []),
          ...(transaction.TrueIP_Blacklist > 0 ? ['True IP is blacklisted'] : []),
          ...(transaction.VirtualMachineSession > 0 ? ['Virtual Machine detected'] : []),
          ...(transaction['ISP City'] !== transaction.Cust_AddressCity ? ['Location mismatch'] : []),
          ...(transaction.UserSessionInputIP !== transaction.UserTrueIP ? ['IP mismatch'] : []),
          ...(parseInt(transaction['Page activity time']) < 30000 ? ['Suspicious activity time'] : [])
        ]);
   
   
        return {
          ...transaction,
          riskLevel,
          riskFactors: Array.from(riskFactors),
          fraudProbability: Math.max((100 - finalScore) / 100, result.analysis?.fraud_probability || 0),
          analysis: {
            ...result.analysis,
            risk_level: riskLevel,
            risk_factors: Array.from(riskFactors),
            location_check: {
              match: transaction['ISP City'] === transaction.Cust_AddressCity,
            },
            ip_check: {
              match: transaction.UserSessionInputIP === transaction.UserTrueIP,
            }
          }
        };
      } catch (err) {
        console.error('Error analyzing transaction:', err);
        throw err;
      }
    };
   
   
    const processTransactions = async (data) => {
      const categorizedTransactions = {
        high: [],
        medium: [],
        low: []
      };
   
   
      const batchSize = 10;
      for (let i = 0; i < data.length; i += batchSize) {
        try {
          const batch = data.slice(i, i + batchSize);
          const analysisPromises = batch.map(transaction => analyzeTransaction(transaction));
          const analyzedBatch = await Promise.all(analysisPromises);
   
   
          analyzedBatch.forEach(transaction => {
            categorizedTransactions[transaction.riskLevel].push(transaction);
          });
   
   
          setProgress(Math.round((i + batch.length) / data.length * 100));
        } catch (err) {
          console.error(`Error processing batch starting at ${i}:`, err);
        }
      }
   
   
      return categorizedTransactions;
    };
   
   
    const handleFileUpload = async (event) => {
      if (!apiStatus) {
        setError('Flask API is not running. Please start the backend server.');
        return;
      }
   
   
      setLoading(true);
      setError(null);
      setProgress(0);
      const file = event.target.files[0];
   
   
      if (file) {
        Papa.parse(file, {
          complete: async (results) => {
            try {
              const categorized = await processTransactions(results.data);
              setTransactions(categorized);
            } catch (err) {
              setError('Error processing file: ' + err.message);
            } finally {
              setLoading(false);
            }
          },
          header: true,
          dynamicTyping: true,
          error: (err) => {
            setError('Error parsing CSV: ' + err.message);
            setLoading(false);
          }
        });
      }
    };
   
   
    const resetUpload = () => {
      setTransactions({ high: [], medium: [], low: [] });
      setSelectedRisk(null);
      setSelectedTransaction(null);
      setProgress(0);
      setError(null);
      setUploadKey(key => key + 1);
    };
   
   
    const RiskCard = ({ title, count, color, icon }) => (
        <Card
            sx={{
              cursor: 'pointer',
              transform: 'scale(1)',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.05)' },
              border: selectedRisk === title.toLowerCase() ? 2 : 0,
              borderColor: 'primary.main'
            }}
            onClick={() => {
              setSelectedRisk(title.toLowerCase());
              setSelectedTransaction(null);
            }}
        >
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="h6">{title} Risk</Typography>
              {icon}
            </Box>
            <Typography variant="h3" color={color}>{count}</Typography>
            <Typography variant="body2" color="text.secondary">transactions</Typography>
          </CardContent>
        </Card>
    );
   
   
    const TransactionDetail = ({ transaction }) => (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Transaction Details</Typography>
              <Chip
                  label={transaction.riskLevel.toUpperCase()}
                  color={
                    transaction.riskLevel === 'high' ? 'error' :
                        transaction.riskLevel === 'medium' ? 'warning' : 'success'
                  }
              />
            </Box>
   
   
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Customer Information
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography><strong>Name:</strong> {transaction['Cust_FirstName']} {transaction['Cust_LastName']}</Typography>
                    <Typography><strong>Reference ID:</strong> {transaction['Cust_RefID']}</Typography>
                    <Typography><strong>Email:</strong> {transaction['Cust_EmailAddress']}</Typography>
                    <Typography><strong>Phone:</strong> {transaction['Cust_PhoneNo']}</Typography>
                    <Typography><strong>Address:</strong> {transaction['Cust_StreetAddress']}</Typography>
                    <Typography><strong>City:</strong> {transaction['Cust_AddressCity']}</Typography>
                    <Typography><strong>State:</strong> {transaction['Cust_AddressState']}</Typography>
                  </Box>
                </Paper>
              </Grid>
   
   
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Risk Assessment
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography><strong>Final Score:</strong> {transaction.FinalScore}</Typography>
                    <Typography><strong>Fraud Probability:</strong> {(transaction.fraudProbability * 100).toFixed(2)}%</Typography>
                  </Box>
   
   
                  <Divider sx={{ my: 2 }} />
   
   
                  <Typography variant="subtitle2" gutterBottom>Security Checks</Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography color={transaction.analysis.location_check.match ? 'success.main' : 'error.main'}>
                      <strong>Location Check:</strong> {transaction.analysis.location_check.match ? 'Match' : 'Mismatch'}
                    </Typography>
                    <Typography color={transaction.analysis.ip_check.match ? 'success.main' : 'error.main'}>
                      <strong>IP Check:</strong> {transaction.analysis.ip_check.match ? 'Match' : 'Mismatch'}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
   
   
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Risk Factors {transaction.riskFactors.length > 0 &&
                      <Chip
                          size="small"
                          label={transaction.riskFactors.length}
                          color="error"
                          sx={{ ml: 1 }}
                      />
                  }
                  </Typography>
                  {transaction.riskFactors.length > 0 ? (
                      <Box component="ul" sx={{ color: 'error.main', pl: 2 }}>
                        {transaction.riskFactors.map((factor, index) => (
                            <li key={index}>{factor}</li>
                        ))}
                      </Box>
                  ) : (
                      <Typography color="success.main">No risk factors detected</Typography>
                  )}
                </Paper>
              </Grid>
   
   
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Technical Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography><strong>Device ID:</strong> {transaction['Device_ID']}</Typography>
                      <Typography><strong>Device Manufacturer:</strong> {transaction['Device_Manufacturer']}</Typography>
                      <Typography><strong>OS:</strong> {transaction['UA_OS']}</Typography>
                      <Typography><strong>Connection Type:</strong> {transaction['Connection Type']}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography><strong>Session Time:</strong> {transaction['Page activity time']}ms</Typography>
                      <Typography><strong>ISP:</strong> {transaction['ISP']}</Typography>
                      <Typography><strong>Virtual Machine:</strong> {transaction['VirtualMachineSession'] ? 'Yes' : 'No'}</Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
    );
   
   
    return (
        <Box sx={{ p: 3, maxWidth: 'xl', mx: 'auto' }}>
          {!apiStatus && (
              <Alert severity="warning" sx={{ mb: 3 }}>
                <AlertTitle>Warning</AlertTitle>
                Flask API is not running. Please start the backend server.
              </Alert>
          )}
   
   
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5">AI-Powered Fraud Analysis Dashboard</Typography>
                <Tooltip title="Check API Status">
                  <IconButton onClick={checkApiStatus} color={apiStatus ? "success" : "error"}>
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              </Box>
   
   
              <Paper
                  variant="outlined"
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
              >
                <input
                    key={uploadKey}
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    disabled={loading}
                    style={{ display: 'none' }}
                    id="file-upload"
                />
                <label htmlFor="file-upload">
                  {loading ? (
                      <Box>
                        <CircularProgress size={40} sx={{ mb: 2 }} />
                        <Typography>Analyzing transactions... {progress}%</Typography>
                      </Box>
                  ) : (
                      <Box>
                        <CloudUploadIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="subtitle1" gutterBottom>
                          Click to upload or drag and drop
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          CSV file with transaction data
                        </Typography>
                      </Box>
                  )}
                </label>
              </Paper>
   
   
              {Object.values(transactions).some(arr => arr.length > 0) && (
                  <Box display="flex" justifyContent="center" mt={2}>
                    <Button
                        startIcon={<RefreshIcon />}
                        onClick={resetUpload}
                        color="primary"
                        variant="outlined"
                    >
                      Upload New File
                    </Button>
                  </Box>
              )}
            </CardContent>
          </Card>
   
   
          {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                <AlertTitle>Error</AlertTitle>
                {error}
   
   
              </Alert>
          )}
   
   
          {(transactions.high.length > 0 || transactions.medium.length > 0 || transactions.low.length > 0) && (
              <Box sx={{ mt: 3 }}>
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid item xs={12} md={4}>
                    <RiskCard
                        title="High"
                        count={transactions.high.length}
                        color="error.main"
                        icon={<ErrorIcon color="error" />}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <RiskCard
                        title="Medium"
                        count={transactions.medium.length}
                        color="warning.main"
                        icon={<WarningIcon color="warning" />}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <RiskCard
                        title="Low"
                        count={transactions.low.length}
                        color="success.main"
                        icon={<CheckCircleIcon color="success" />}
                    />
                  </Grid>
                </Grid>
   
   
                {selectedRisk && (
                    <Paper sx={{ mb: 3 }}>
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Reference ID</TableCell>
                              <TableCell>Customer</TableCell>
                              <TableCell>Score</TableCell>
                              <TableCell>Risk Factors</TableCell>
                              <TableCell>Location</TableCell>
                              <TableCell>Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {transactions[selectedRisk].map((transaction, index) => (
                                <TableRow
                                    key={index}
                                    sx={{
                                      '&:hover': { bgcolor: 'action.hover' },
                                      bgcolor: selectedTransaction === transaction ? 'action.selected' : 'inherit'
                                    }}
                                >
                                  <TableCell>{transaction['Cust_RefID']}</TableCell>
                                  <TableCell>
                                    {transaction['Cust_FirstName']} {transaction['Cust_LastName']}
                                  </TableCell>
                                  <TableCell>
                                    <Chip
                                        label={transaction.FinalScore}
                                        color={
                                          transaction.riskLevel === 'high' ? 'error' :
                                              transaction.riskLevel === 'medium' ? 'warning' : 'success'
                                        }
                                        size="small"
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Chip
                                        label={transaction.riskFactors.length}
                                        color={
                                          transaction.riskFactors.length > 3 ? 'error' :
                                              transaction.riskFactors.length > 1 ? 'warning' : 'success'
                                        }
                                        size="small"
                                    />
                                  </TableCell>
                                  <TableCell>{transaction['Cust_AddressCity']}</TableCell>
                                  <TableCell>
                                    <Button
                                        color="primary"
                                        size="small"
                                        variant={selectedTransaction === transaction ? "contained" : "outlined"}
                                        onClick={() => setSelectedTransaction(transaction)}
                                    >
                                      View Details
                                    </Button>
                                  </TableCell>
                                </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Paper>
                )}
   
   
                {selectedTransaction && (
                    <TransactionDetail transaction={selectedTransaction} />
                )}
              </Box>
          )}
        </Box>
    );
   };
   
   
   export default App;