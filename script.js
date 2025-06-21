const expenseForm = document.getElementById("expenseForm");
const expenseTable = document.getElementById("expenseTable");
const shrijitTotal = document.getElementById("shrijitTotal");
const nitinTotal = document.getElementById("nitinTotal");
const totalAmount = document.getElementById("total");
const equalShare = document.getElementById("equalShare");
const finalReport = document.getElementById("finalReport");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

expenseForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const person = document.getElementById("person").value;
  const item = document.getElementById("item").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const date = document.getElementById("date").value;

  expenses.push({ person, item, amount, date });
  localStorage.setItem("expenses", JSON.stringify(expenses));
  expenseForm.reset();
  renderTable();
});

function renderTable() {
  const selectedMonth = parseInt(document.getElementById("monthSelector").value);
  const selectedYear = parseInt(document.getElementById("yearSelector").value);

  expenseTable.innerHTML = "";
  let shrijit = 0, nitin = 0, total = 0;

  const filtered = expenses.filter(entry => {
    const entryDate = new Date(entry.date);
    return entryDate.getMonth() === selectedMonth && entryDate.getFullYear() === selectedYear;
  });

  filtered.forEach(entry => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${entry.person === "Shrijit" ? "Mr. Shrijit" : "Mr. Nitin"}</td>
      <td>${entry.item}</td>
      <td>₹${entry.amount.toFixed(2)}</td>
      <td>${entry.date}</td>
    `;
    expenseTable.appendChild(row);

    if (entry.person === "Shrijit") {
      shrijit += entry.amount;
    } else {
      nitin += entry.amount;
    }
    total += entry.amount;
  });

  const eachPay = total / 2;
  const balance = shrijit - nitin;

  let report = "Both have paid equally.";
  if (balance > 0) {
    report = `Mr. Nitin should pay ₹${(balance / 2).toFixed(2)} to Mr. Shrijit.`;
  } else if (balance < 0) {
    report = `Mr. Shrijit should pay ₹${(-balance / 2).toFixed(2)} to Mr. Nitin.`;
  }

  shrijitTotal.textContent = shrijit.toFixed(2);
  nitinTotal.textContent = nitin.toFixed(2);
  totalAmount.textContent = total.toFixed(2);
  equalShare.textContent = eachPay.toFixed(2);
  finalReport.textContent = report;
}

// Export data to CSV
function downloadData() {
  const csvRows = [
    ["Name", "Item", "Amount (₹)", "Date"]
  ];

  expenses.forEach(e => {
    csvRows.push([
      e.person === "Shrijit" ? "Mr. Shrijit" : "Mr. Nitin",
      e.item,
      `₹${e.amount.toFixed(2)}`,
      e.date
    ]);
  });

  const blob = new Blob([csvRows.map(e => e.join(",")).join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "expenses.csv";
  a.click();
  URL.revokeObjectURL(url);
}

// Export table to PDF
function exportPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Monthly Expense Report", 20, 20);

  let y = 30;
  doc.setFontSize(12);
  doc.text("Name", 20, y);
  doc.text("Item", 60, y);
  doc.text("Amount", 120, y);
  doc.text("Date", 160, y);

  y += 10;
  expenses.forEach(entry => {
    doc.text(entry.person === "Shrijit" ? "Mr. Shrijit" : "Mr. Nitin", 20, y);
    doc.text(entry.item, 60, y);
    doc.text(`₹${entry.amount.toFixed(2)}`, 120, y);
    doc.text(entry.date, 160, y);
    y += 10;
    if (y > 280) {
      doc.addPage();
      y = 20;
    }
  });

  doc.save("expense_report.pdf");
}

// Render table on page load
renderTable();
