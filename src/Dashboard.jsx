import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import './Dashboard.css'; 

 import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
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
  Snackbar,
  IconButton,
  Chip,
  Divider,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide, ListItemIcon, ListItem, ListItemText, List, LinearProgress
 } from '@mui/material';
 import {
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  CloudUpload as CloudUploadIcon,
  Refresh as RefreshIcon,
  Info as FiberManualRecordIcon,
  Opacity
 
 
 } from '@mui/icons-material';
 import Papa from 'papaparse';
 import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
 
 
 const FLASK_API_URL = 'http://localhost:5001/api/v1/fraud';
 
 
 const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
 });
 const RiskFactorDetail = ({ factor, transaction }) => {
  const getDetailedExplanation = (factor, transaction) => {
    const explanations = {
      'Location mismatch': {
        impact: 'MEDIUM',
        description: `ISP location (${transaction['ISP City']}) doesn't match the provided address location (${transaction['Cust_AddressCity']}). Distance between locations may indicate risk.`,
        recommendation: 'Verify customer\'s identity through additional means.',
        details: 'Location mismatches can indicate:',
        bulletPoints: [
          'Use of VPN or proxy services',
          'Account sharing or theft',
          'False address information',
          'Travel or temporary relocation'
        ],
        customData: {
          locations: {
            provided: transaction['Cust_AddressCity'],
            detected: transaction['ISP City'],
            state: transaction['Cust_AddressState']
          }
        }
      },
      'IP address is blacklisted': {
        impact: 'HIGH',
        description: `IP address ${transaction['UserSessionInputIP']} has been identified in known blacklists.`,
        recommendation: 'Immediately flag for review and consider blocking future transactions from this IP.',
        details: 'Blacklisted IPs are often associated with:',
        bulletPoints: [
          'Previous fraudulent activities',
          'Spam or malicious traffic',
          'Known proxy or VPN services',
          'Compromised devices in botnets'
        ],
        customData: {
          ip: transaction['UserSessionInputIP'],
          isp: transaction['ISP']
        }
      },
      'IP mismatch': {
        impact: 'HIGH',
        description: `Session IP (${transaction['UserSessionInputIP']}) differs from True IP (${transaction['UserTrueIP']}).`,
        recommendation: 'Implement additional authentication steps.',
        details: 'IP mismatches can indicate:',
        bulletPoints: [
          'Session hijacking attempts',
          'Man-in-the-middle attacks',
          'Proxy switching',
          'Network instability'
        ],
        customData: {
          sessionIP: transaction['UserSessionInputIP'],
          trueIP: transaction['UserTrueIP']
        }
      },
      'Suspicious activity time': {
        impact: 'MEDIUM',
        description: `Transaction completed in ${transaction['Page activity time']}ms, which is unusually quick. Normal transactions typically take over 30,000ms.`,
        recommendation: 'Review for automated behavior patterns.',
        details: 'Quick transactions might indicate:',
        bulletPoints: [
          'Automated bots or scripts',
          'Pre-filled form data',
          'Familiar fraud patterns',
          'Copy-paste behavior'
        ],
        customData: {
          activityTime: transaction['Page activity time'],
          threshold: 30000
        }
      },
      'Virtual Machine detected': {
        impact: 'MEDIUM',
        description: `Virtual machine detected from ${transaction['Device_Manufacturer']} device with ${transaction['UA_OS']} operating system.`,
        recommendation: 'Monitor for automated behavior patterns.',
        details: 'Virtual machines are often used for:',
        bulletPoints: [
          'Automated fraud attempts',
          'Masking true device identity',
          'Running multiple accounts',
          'Bypassing security measures'
        ],
        customData: {
          deviceInfo: {
            manufacturer: transaction['Device_Manufacturer'],
            os: transaction['UA_OS'],
            deviceId: transaction['Device_ID']
          }
        }
      }
    };
 
 
    return explanations[factor] || {
      impact: 'UNKNOWN',
      description: 'Additional risk factor detected.',
      recommendation: 'Review transaction details manually.',
      details: 'General security concerns:',
      bulletPoints: [
        'Unusual pattern detected',
        'Requires manual review',
        'Consider additional verification',
        'Monitor for similar patterns'
      ]
    };
  };
 
 
  const explanation = getDetailedExplanation(factor, transaction);
 
 
  const renderCustomDetail = () => {
    if (!explanation.customData) return null;
 
 
    switch (factor) {
      case 'Location mismatch':
        return (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Location Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Paper sx={{ p: 1, bgcolor: 'success.light' }}>
                    <Typography variant="caption" color="success.contrastText">Provided Location</Typography>
                    <Typography variant="body2" color="success.contrastText">
                      {explanation.customData.locations.provided}, {explanation.customData.locations.state}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper sx={{ p: 1, bgcolor: 'error.light' }}>
                    <Typography variant="caption" color="error.contrastText">Detected Location</Typography>
                    <Typography variant="body2" color="error.contrastText">
                      {explanation.customData.locations.detected}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
        );
 
 
      case 'IP mismatch':
        return (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                IP Comparison
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Paper sx={{ p: 1, bgcolor: 'warning.light' }}>
                    <Typography variant="caption" color="warning.contrastText">Session IP</Typography>
                    <Typography variant="body2" color="warning.contrastText">
                      {explanation.customData.sessionIP}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper sx={{ p: 1, bgcolor: 'warning.light' }}>
                    <Typography variant="caption" color="warning.contrastText">True IP</Typography>
                    <Typography variant="body2" color="warning.contrastText">
                      {explanation.customData.trueIP}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
        );
 
 
      case 'Suspicious activity time':
        return (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Activity Time Analysis
              </Typography>
              <LinearProgress
                  variant="determinate"
                  value={(explanation.customData.activityTime / explanation.customData.threshold) * 100}
                  sx={{ mt: 1, mb: 1 }}
              />
              <Typography variant="caption" color="text.secondary">
                {explanation.customData.activityTime}ms of {explanation.customData.threshold}ms expected minimum
              </Typography>
            </Box>
        );
 
 
      default:
        return null;
    }
  };
 
 
  return (
      <Accordion>
        <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              '& .MuiAccordionSummary-content': {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }
            }}
        >
          <Typography>{factor}</Typography>
          <Chip
              label={explanation.impact}
              size="small"
              color={
                explanation.impact === 'HIGH' ? 'error' :
                    explanation.impact === 'MEDIUM' ? 'warning' : 'info'
              }
              sx={{ ml: 2 }}
          />
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Description
              </Typography>
              <Typography>{explanation.description}</Typography>
            </Box>
 
 
            {renderCustomDetail()}
 
 
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Recommendation
              </Typography>
              <Typography>{explanation.recommendation}</Typography>
            </Box>
 
 
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                {explanation.details}
              </Typography>
              <List dense>
                {explanation.bulletPoints.map((point, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <FiberManualRecordIcon sx={{ fontSize: 8 }} />
                      </ListItemIcon>
                      <ListItemText primary={point} />
                    </ListItem>
                ))}
              </List>
            </Box>
          </Stack>
        </AccordionDetails>
      </Accordion>
  );
 };
 
 
 const App = () => {
  const [transactions, setTransactions] = useState({ high: [], medium: [], low: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRisk, setSelectedRisk] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [progress, setProgress] = useState(0);
  const [apiStatus, setApiStatus] = useState(false);
  const [uploadKey, setUploadKey] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
 
 
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
 
 
  const TransactionDetail = ({ transaction, open, onClose }) => (
      <Dialog
          fullWidth
          maxWidth="md"
          open={open}
          onClose={onClose}
          TransitionComponent={Transition}
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              Transaction Details
              <Typography component="span" variant="subtitle2" sx={{ ml: 1 }}>
                ({transaction.Cust_RefID})
              </Typography>
            </Typography>
            <Chip
                label={transaction.riskLevel.toUpperCase()}
                color={
                  transaction.riskLevel === 'high' ? 'error' :
                      transaction.riskLevel === 'medium' ? 'warning' : 'success'
                }
            />
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Customer Information
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography><strong>Name:</strong> {transaction['Cust_FirstName']} {transaction['Cust_LastName']}</Typography>
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
                  <Typography><strong>Risk Level:</strong> {transaction.riskLevel.toUpperCase()}</Typography>
                </Box>
              </Paper>
            </Grid>
 
 
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Risk Factors Analysis
                </Typography>
                {transaction.riskFactors.length > 0 ? (
                    <Stack spacing={1}>
                      {transaction.riskFactors.map((factor, index) => (
                          <RiskFactorDetail
                              key={index}
                              factor={factor}
                              transaction={transaction}
                          />
                      ))}
                    </Stack>
                ) : (
                    <Alert severity="success">No risk factors detected</Alert>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
  );
 
 
  return (
      <Box sx={{ p: 3, maxWidth: 'xl', mx: 'auto' }}>
        {!apiStatus && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              <AlertTitle>Warning</AlertTitle>
              Flask API is not running. Please start the backend server.
            </Alert>
        )}
 
 
        <Card sx={{ 
          mb: 3,
          borderRadius: '16px', 
          backgroundColor: '#fff3e0', 
          boxShadow: 3 
          }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5" sx={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
            AI-Powered Fraud Analysis Dashboard
            </Typography>
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
                {[
                  { title: "High", count: transactions.high.length, color: "error.main", icon: <ErrorIcon color="error" /> },
                  { title: "Medium", count: transactions.medium.length, color: "warning.main", icon: <WarningIcon color="warning" /> },
                  { title: "Low", count: transactions.low.length, color: "success.main", icon: <CheckCircleIcon color="success" /> },
                ].map((item, index) => (
                  <Grid item xs={12} md={4} key={index} sx={{ display: "flex" }}>
                    <RiskCard
                      title={item.title}
                      count={item.count}
                      icon={item.icon}
                      sx={{
                        flexGrow: 1,
                        height: "100%",
                        border: `2px solid`, 
                        borderColor: item.color,
                        color: item.color, // Keeps text/icons in theme colors
                        fontFamily: "SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif", 
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 2,
                        boxShadow: 1,
                        p: 2,
                      }}
                    />
                  </Grid>
                ))}
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
                                      variant="contained"
                                      onClick={() => {
                                        setSelectedTransaction(transaction);
                                        setDialogOpen(true);
                                      }}
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
                  <TransactionDetail
                      transaction={selectedTransaction}
                      open={dialogOpen}
                      onClose={() => {
                        setDialogOpen(false);
                        setSelectedTransaction(null);
                      }}
                  />
              )}
            </Box>
        )}
      </Box>
  );
 };
 
 
 export default App;