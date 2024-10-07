import { IncomingForm } from 'formidable';
import fs from 'fs';
import csv from 'csv-parser';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const form = new IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: 'Error parsing form data' });
      }

      const file = files.file[0];
      const data = [];

      fs.createReadStream(file.filepath)
        .pipe(csv({ separator: ';' }))
        .on('data', (row) => data.push(row))
        .on('end', () => {
          // Process the CSV data (similar to your Python script)
          const salesPerSalesman = calculateSalesPerSalesman(data);
          res.status(200).json({ salesPerSalesman });
        });
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

function calculateSalesPerSalesman(data) {
  const salesPerSalesman = {};
  for (const row of data) {
    const salesman = row['Vendedor'];
    if (salesman && salesman.toLowerCase() !== 'total') {
      const sale = parseFloat(row['Venta'].replace('$', '').replace('.', '').replace(',', '.'));
      if (!isNaN(sale)) {
        salesPerSalesman[salesman] = (salesPerSalesman[salesman] || 0) + sale;
      }
    }
  }
  return salesPerSalesman;
}