document.addEventListener('DOMContentLoaded', () => {
  const serviceNameInput = document.getElementById('service-name-input');
  const footerServiceName = document.getElementById('footer-service-name');
  const tableBody = document.getElementById('table-body');
  const tableHeadRow = document.getElementById('table-head-row');
  const addRowBtn = document.getElementById('add-row-btn');
  const addColBtn = document.getElementById('add-col-btn');
  const downloadPdfBtn = document.getElementById('download-pdf-btn');
  const totalCostDisplay = document.getElementById('total-cost-display');

  // Sync Service Name Input with Footer Banner
  serviceNameInput.addEventListener('input', (e) => {
    const value = e.target.value.trim();
    footerServiceName.textContent = value.length > 0 ? value : '(Your Transport Service Name)';
  });

  // Recalculate Total Cost
  function calculateTotal() {
    let total = 0;
    const costInputs = document.querySelectorAll('.cost-input');
    
    costInputs.forEach(input => {
      const val = parseFloat(input.value);
      if (!isNaN(val)) {
        total += val;
      }
    });

    totalCostDisplay.textContent = `$${total.toFixed(2)}`;
  }

  // Delegate input listeners on table body to automatically recalculate cost
  tableBody.addEventListener('input', (e) => {
    if (e.target.classList.contains('cost-input')) {
      calculateTotal();
    }
  });

  // Delete Row Functionality
  tableBody.addEventListener('click', (e) => {
    const deleteBtn = e.target.closest('.delete-row-btn');
    if (deleteBtn) {
      const row = deleteBtn.closest('tr');
      if (tableBody.querySelectorAll('tr').length > 1) {
        row.remove();
        calculateTotal();
      } else {
        alert("The table must contain at least one row.");
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
        // Action column
        td.className = 'action-col';
        td.innerHTML = `<button class="delete-row-btn" title="Remove Row"><i class="fa-solid fa-trash-can"></i></button>`;
      } else if (i === 3) {
        // Cost input column
        td.innerHTML = `<input type="number" class="table-input cost-input" placeholder="0.00">`;
      } else {
        td.innerHTML = `<input type="text" class="table-input" placeholder="Enter Details">`;
      }
      
      newRow.appendChild(td);
    }

    tableBody.appendChild(newRow);
    calculateTotal();
  });

  // Add New Dynamic Column
  addColBtn.addEventListener('click', () => {
    const colName = prompt("Enter new column name:", "Additional Info");
    if (!colName) return;

    // Insert new <th> before the Action column
    const actionTh = tableHeadRow.querySelector('.action-col');
    const newTh = document.createElement('th');
    newTh.innerHTML = `<input type="text" class="th-input" value="${colName}">`;
    tableHeadRow.insertBefore(newTh, actionTh);

    // Insert new <td> into every row in tbody
    const rows = tableBody.querySelectorAll('tr');
    rows.forEach(row => {
      const actionTd = row.querySelector('.action-col');
      const newTd = document.createElement('td');
      newTd.innerHTML = `<input type="text" class="table-input" placeholder="Enter ${colName}">`;
      row.insertBefore(newTd, actionTd);
    });
  });

  // Direct PDF Download without Print Dialog
  downloadPdfBtn.addEventListener('click', () => {
    const element = document.getElementById('receipt-card');

    // Add CSS flag class for export cleanup
    element.classList.add('pdf-export-mode');

    // PDF Configuration options
    const opt = {
      margin:       [0.3, 0.3, 0.3, 0.3],
      filename:     'Transport_Receipt.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // Generate PDF directly
    html2pdf().set(opt).from(element).save().then(() => {
      // Remove export cleanup class after generation completes
      element.classList.remove('pdf-export-mode');
    });
  });

  // Initialize total on start
  calculateTotal();
});
