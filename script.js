document.addEventListener('DOMContentLoaded', () => {
  const serviceNameInput = document.getElementById('service-name-input');
  const footerServiceName = document.getElementById('footer-service-name');
  const tableBody = document.getElementById('table-body');
  const tableHeadRow = document.getElementById('table-head-row');
  const addRowBtn = document.getElementById('add-row-btn');
  const addColBtn = document.getElementById('add-col-btn');
  const downloadPdfBtn = document.getElementById('download-pdf-btn');
  const totalCostDisplay = document.getElementById('total-cost-display');

  // Sync Transport Service Name with Footer Message
  serviceNameInput.addEventListener('input', (e) => {
    const value = e.target.value.trim();
    footerServiceName.textContent = value;
  });

  // Calculate Total Cost in Rupee (₹)
  function calculateTotal() {
    let total = 0;
    const costInputs = document.querySelectorAll('.cost-input');
    
    costInputs.forEach(input => {
      const val = parseFloat(input.value);
      if (!isNaN(val)) {
        total += val;
      }
    });

    totalCostDisplay.textContent = `₹${total.toFixed(2)}`;
  }

  // Recalculate total on table input changes
  tableBody.addEventListener('input', (e) => {
    if (e.target.classList.contains('cost-input')) {
      calculateTotal();
    }
  });

  // Remove Row functionality
  tableBody.addEventListener('click', (e) => {
    const deleteBtn = e.target.closest('.delete-row-btn');
    if (deleteBtn) {
      const row = deleteBtn.closest('tr');
      if (tableBody.querySelectorAll('tr').length > 1) {
        row.remove();
        calculateTotal();
      } else {
        alert("At least one row is required.");
      }
    }
  });

  // Add New Row
  addRowBtn.addEventListener('click', () => {
    const colCount = tableHeadRow.children.length;
    const newRow = document.createElement('tr');

    for (let i = 0; i < colCount; i++) {
      const td = document.createElement('td');
      
      if (i === colCount - 1) {
        // Action Button Column
        td.className = 'action-col';
        td.innerHTML = `<button class="delete-row-btn" title="Remove Row"><i class="fa-solid fa-trash-can"></i></button>`;
      } else if (i === 3) {
        // Cost Column
        td.innerHTML = `<input type="number" class="table-input cost-input" placeholder="0.00">`;
      } else {
        td.innerHTML = `<input type="text" class="table-input" placeholder="Enter Details">`;
      }
      
      newRow.appendChild(td);
    }

    tableBody.appendChild(newRow);
    calculateTotal();
  });

  // Add Dynamic Column
  addColBtn.addEventListener('click', () => {
    const colName = prompt("Enter new column header name:", "Additional Info");
    if (!colName) return;

    // Add new <th> header
    const actionTh = tableHeadRow.querySelector('.action-col');
    const newTh = document.createElement('th');
    newTh.innerHTML = `<input type="text" class="th-input" value="${colName}">`;
    tableHeadRow.insertBefore(newTh, actionTh);

    // Add new <td> in all table rows
    const rows = tableBody.querySelectorAll('tr');
    rows.forEach(row => {
      const actionTd = row.querySelector('.action-col');
      const newTd = document.createElement('td');
      newTd.innerHTML = `<input type="text" class="table-input" placeholder="Enter ${colName}">`;
      row.insertBefore(newTd, actionTd);
    });
  });

  // Direct PDF Download Logic
  downloadPdfBtn.addEventListener('click', () => {
    const element = document.getElementById('receipt-card');

    element.classList.add('pdf-export-mode');

    const opt = {
      margin:       [0.3, 0.3, 0.3, 0.3],
      filename:     'Transport_Receipt.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      element.classList.remove('pdf-export-mode');
    });
  });

  // Initial Calculation setup
  calculateTotal();
});
