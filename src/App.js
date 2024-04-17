import { useState, useEffect } from 'react';
import React from 'react';
import ColorComponent from './ColorComponent';
import Table from 'react-bootstrap/Table';

function App() {
  const [jsonData, setJsonData] = useState([]);

  useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch('/sample-data.json'); // Adjust the path as needed
            let data = await response.json();
    
            // Add missing data if necessary
            data = addMissingData(data);
            data.sort((a, b) => new Date(a.ts) - new Date(b.ts));
            console.log(data);
            setJsonData(data);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData();
      }, []);

      const addMissingData = (data) => {
            const newData = [];
            for (let i = 0; i < data.length - 1; i++) {
              newData.push(data[i]);
              const ts1 = new Date(data[i].ts).getTime();
              const ts2 = new Date(data[i + 1].ts).getTime();
              if (ts2 - ts1 > 1000) { // Assuming a 1 second difference
                const missingTimestamps = getMissingTimestamps(data[i].ts, data[i + 1].ts);
                missingTimestamps.forEach(ts => {
                  newData.push({
                    ts: ts.toISOString(),
                    machine_status: "NA",
                    vibration: "NA"
                  });
                });
              }
            }
            newData.push(data[data.length - 1]);
            return newData;
          };

          const getMissingTimestamps = (startTimestamp, endTimestamp) => {
                const start = new Date(startTimestamp).getTime();
                const end = new Date(endTimestamp).getTime();
                const missingTimestamps = [];
                for (let ts = start + 1000; ts < end; ts += 1000) { // Assuming a 1 second difference
                  missingTimestamps.push(new Date(ts));
                }
                return missingTimestamps;
              };

  const calculateSummary = () => {
    let onesCount = 0;
    let zerosCount = 0;
    let continuousOnes = 0;
    let continuousZeros = 0;

    jsonData.forEach((item, index) => {
      if (item.machine_status === 1) {
        onesCount++;
        continuousOnes++;
        continuousZeros = 0; // Reset continuous zeros count
      } else if (item.machine_status === 0) {
        zerosCount++;
        continuousZeros++;
        continuousOnes = 0; // Reset continuous ones count
      } 
    });

    

    return {
      onesCount,
      zerosCount,
      continuousOnes,
      continuousZeros,
    };
  };

  const summaryData = calculateSummary();
  const shouldDisplayTimestamp = (index) => {
    if (index === 0) return true;
    const prevTimestamp = new Date(jsonData[index - 1].ts);
    const currentTimestamp = new Date(jsonData[index].ts);
    return (
      prevTimestamp.getHours() !== currentTimestamp.getHours() ||
      prevTimestamp.getMinutes() < 30 && currentTimestamp.getMinutes() >= 30
    );
  };

  return (
    <div className="app-container">
      <h1 className='fw-bold text-center'>Data</h1>
       <div className='container-fluid' style={{ display: 'flex' }}>
       {jsonData.map((item,index) => (
          <ColorComponent key={item.ts} ts={item.ts} status={item.machine_status} value={item.vibration} shouldDisplayTimestamp={shouldDisplayTimestamp(index)}/>
        ))}
        </div>
        
      <div className="summary-container">
        <h2>Summary</h2>
        <Table border={2} cellPadding={10}>
          <thead>
            <tr>
              <th>Number of 1s</th>
              <th>Number of 0s</th>
              <th>Continuous 1s</th>
              <th>Continuous 0s</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{summaryData.onesCount}</td>
              <td>{summaryData.zerosCount}</td>
              <td>{summaryData.continuousOnes}</td>
              <td>{summaryData.continuousZeros}</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default App;


