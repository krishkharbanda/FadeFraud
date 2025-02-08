export const metadata = {
    title: 'Transaction Dashboard',
    description: 'Visualizing credit card transactions with charts',
  };
  
  import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
  import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
  
  const transactions = [
    { name: 'Jan', amount: 1200 },
    { name: 'Feb', amount: 800 },
    { name: 'Mar', amount: 1500 },
    { name: 'Apr', amount: 1700 },
    { name: 'May', amount: 900 },
  ];
  
  const categories = [
    { name: 'Food', value: 400 },
    { name: 'Entertainment', value: 300 },
    { name: 'Bills', value: 700 },
    { name: 'Shopping', value: 600 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  function Dashboard() {
    return (
      <div>
        <h1>Credit Card Transaction Dashboard</h1>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <BarChart width={500} height={300} data={transactions}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" fill="#8884d8" />
          </BarChart>
          <PieChart width={400} height={400}>
            <Pie data={categories} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value" label>
              {categories.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </div>
      </div>
    );
  }
  
  export default function Layout({ children }) {
    return (
      <Router>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
        <html lang="en">
          <head>
            <meta name="description" content={metadata.description} />
          </head>
          <body>
            {children}
          </body>
        </html>
      </Router>
    );
  }