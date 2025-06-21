// app/Accounting/page.js
// This file contains the complete code for the Society Accounting Page.
// It integrates with Clerk for authentication and uses Next.js API Routes for data persistence.
// All components (MessageModal, AddExpenseForm, AddPaymentForm, MemberReceiptCard) are defined within this single file.

"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

// Clerk client-side hooks for authentication status and user details
import { useAuth, useUser } from '@clerk/nextjs';

// Lucide React icons for UI elements and feedback
import {
  BarChart3, Banknote, FileText, ClipboardList, PieChart, TrendingUp, Receipt,
  XCircle, CheckCircle, Loader2, LogOut,
} from "lucide-react";

// Recharts components for data visualization (charts)
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

// Note: Removed direct import of supabase from '@/lib/supabaseClient' as it's not used directly for auth logic here.
// Clerk's signOut() handles the session clearing.


// --- Component: MessageModal (Defined Locally) ---
// A custom modal component to display success or error messages to the user.
// This provides a much better user experience than native browser 'alert()'.
const MessageModal = ({ message, type, onClose }) => {
  if (!message) return null; // Don't render if there's no message to display

  const isSuccess = type === "success";
  const bgColor = isSuccess ? "bg-green-100" : "bg-red-100";
  const textColor = isSuccess ? "text-green-800" : "text-red-800";
  const icon = isSuccess ? <CheckCircle className="w-6 h-6 text-green-500" /> : <XCircle className="w-6 h-6 text-red-500" />;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${bgColor} ${textColor} p-6 rounded-lg shadow-xl max-w-sm w-full relative`}>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          aria-label="Close message"
        >
          <XCircle className="w-6 h-6" />
        </button>
        <div className="flex items-center space-x-3 mb-4">
          {icon}
          <h3 className="font-bold text-lg">{isSuccess ? "Success!" : "Error!"}</h3>
        </div>
        <p className="text-sm">{message}</p>
        <div className="mt-4 text-right">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-md font-medium ${isSuccess ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"} text-white transition-colors`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};


// --- Component: AddExpenseForm (Defined Locally) ---
function AddExpenseForm({ onSubmit, showMessage, userEmail }) { // Added userEmail prop
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [transactionDate, setTransactionDate] = useState(new Date().toISOString().slice(0, 10)); // Defaults to current date
  const [paymentMethod, setPaymentMethod] = useState("Cash"); // Default payment method

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic client-side validation
    if (!amount || !category || !description || !transactionDate || !paymentMethod) {
      showMessage("Please fill in all expense details.", "error");
      return;
    }

    try {
      // Call the onSubmit prop function with the form data
      await onSubmit({
        amount: parseFloat(amount), // Convert amount to a number
        category,
        description,
        transactionDate, // Passed as string; API route will convert to Date object
        paymentMethod,
        type: "EXPENSE", // Matches Prisma's TransactionType enum
        email: userEmail, // Pass user's email to the API route for potential User creation logic
      });
      showMessage("Expense added successfully!", "success");
      // Reset form fields to their initial empty states after successful submission
      setAmount("");
      setCategory("");
      setDescription("");
      setTransactionDate(new Date().toISOString().slice(0, 10));
      setPaymentMethod("Cash");
    } catch (error) {
      console.error("Error adding expense from form:", error);
      showMessage("Failed to add expense. Please try again.", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="expense-amount" className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
        <input
          id="expense-amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="e.g., 5000"
          className="border p-2 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div>
        <label htmlFor="expense-category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <input
          id="expense-category"
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="e.g., Electricity Bill, Repairs"
          className="border p-2 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div>
        <label htmlFor="expense-description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          id="expense-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of the expense"
          rows="2"
          className="border p-2 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
          required
        ></textarea>
      </div>
      <div>
        <label htmlFor="expense-date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
        <input
          id="expense-date"
          type="date"
          value={transactionDate}
          onChange={(e) => setTransactionDate(e.target.value)}
          className="border p-2 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div>
        <label htmlFor="payment-method" className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
        <select
          id="payment-method"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="border p-2 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="Cash">Cash</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="Cheque">Cheque</option>
          <option value="Online Payment">Online Payment</option>
          <option value="UPI">UPI</option>
        </select>
      </div>
      <button
        type="submit"
        className="bg-red-600 text-white px-5 py-2 rounded-full hover:bg-red-700 transition-colors shadow-md w-full sm:w-auto"
      >
        Add Expense
      </button>
    </form>
  );
}


// --- Component: AddPaymentForm (Defined Locally) ---
function AddPaymentForm({ onSubmit, showMessage, userEmail }) { // Added userEmail prop
  const [amount, setAmount] = useState("");
  const [payer, setPayer] = useState("");
  const [flat, setFlat] = useState("");
  const [month, setMonth] = useState("");
  const [transactionDate, setTransactionDate] = useState(new Date().toISOString().slice(0, 10));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !payer || !flat || !month || !transactionDate) {
      showMessage("Please fill in all payment details.", "error");
      return;
    }

    try {
      await onSubmit({
        amount: parseFloat(amount),
        payerName: payer,
        flatNumber: flat,
        forMonth: month,
        transactionDate,
        paidStatus: true,
        type: "INCOME",
        email: userEmail, // Pass user's email to the API route for potential User creation logic
      });
      showMessage("Payment recorded successfully!", "success");
      setAmount("");
      setPayer("");
      setFlat("");
      setMonth("");
      setTransactionDate(new Date().toISOString().slice(0, 10));
    } catch (error) {
      console.error("Error recording payment from form:", error);
      showMessage("Failed to record payment. Please try again.", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="payment-amount" className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
        <input
          id="payment-amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="e.g., 2500"
          className="border p-2 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div>
        <label htmlFor="payer-name" className="block text-sm font-medium text-gray-700 mb-1">Payer Name</label>
        <input
          id="payer-name"
          type="text"
          value={payer}
          onChange={(e) => setPayer(e.target.value)}
          placeholder="e.g., John Doe"
          className="border p-2 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div>
        <label htmlFor="payer-flat" className="block text-sm font-medium text-gray-700 mb-1">Flat Number</label>
        <input
          id="payer-flat"
          type="text"
          value={flat}
          onChange={(e) => setFlat(e.target.value)}
          placeholder="e.g., A-101, B-205"
          className="border p-2 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div>
        <label htmlFor="payment-month" className="block text-sm font-medium text-gray-700 mb-1">For Month</label>
        <input
          id="payment-month"
          type="text"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          placeholder="e.g., May 2025"
          className="border p-2 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div>
        <label htmlFor="payment-date" className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
        <input
          id="payment-date"
          type="date"
          value={transactionDate}
          onChange={(e) => setTransactionDate(e.target.value)}
          className="border p-2 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-green-600 text-white px-5 py-2 rounded-full hover:bg-green-700 transition-colors shadow-md w-full sm:w-auto"
      >
        Add Payment
      </button>
    </form>
  );
}


// --- Component: MemberReceiptCard (Defined Locally) ---
function MemberReceiptCard({ payment }) {
  const receiptRef = useRef();

  const downloadReceipt = async () => {
    if (!payment.paidStatus) return;

    const element = receiptRef.current;
    setTimeout(async () => {
        const canvas = await html2canvas(element, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");

        const { jsPDF } = await import('jspdf');
        const pdf = new jsPDF("p", "mm", "a4");
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Receipt_${payment.payerName || 'Unknown'}_${payment.forMonth || 'NoMonth'}.pdf`);
    }, 50);
  };

  return (
    <div className="border rounded-xl p-4 shadow-sm bg-white space-y-2">
      <div ref={receiptRef} className="p-2">
        <h2 className="text-lg font-semibold text-gray-800">{payment.payerName}</h2>
        <p className="text-gray-600">Flat: {payment.flatNumber}</p>
        <p className="text-gray-600">Month: {payment.forMonth}</p>
        <p className="text-gray-600">Amount: ₹{payment.amount}</p>
        <p className={`font-medium ${payment.paidStatus ? "text-green-600" : "text-red-600"}`}>
          {payment.paidStatus ?`✅ Paid on ${new Date(payment.transactionDate).toLocaleDateString()}` : `"❌ Not Paid"`}
        </p>
      </div>

      <button
        className={`mt-2 px-4 py-2 text-sm rounded-full font-medium transition-colors shadow-md
          ${payment.paidStatus
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-70"
          }`}
        disabled={!payment.paidStatus}
        onClick={downloadReceipt}
      >
        Download Receipt
      </button>
    </div>
  );
}


// --- AccountingPage (Main Component) ---
export default function AccountingPage() {
  // Clerk hooks to get the authentication status and current user's ID.
  const { isLoaded, userId, signOut } = useAuth();
  const { user } = useUser(); // Provides access to the full Clerk user object (e.g., email)

  // State for overall data loading indication
  const [loadingData, setLoadingData] = useState(false);

  const [role, setRole] = useState("VISITOR"); // Default role for demo purposes
  useEffect(() => {
    // Simulate role fetching logic (e.g., from Clerk user metadata or a database)
    async function fetchUserRole() {
      console.log("Fetching user role from API...");
      try {
        const res = await fetch("/api/users/me");
        if (!res.ok) {
          throw new Error("Failed to fetch user role");
        }
        const user = await res.json();
        console.log("Fetched user role:", user.role);
        setRole(user.role);
      } catch (error) {
        console.error("Error fetching user role:", error);
      } finally {
        console.log("User role fetch completed.");
      }

      
    }
    fetchUserRole();
  }, []);
  

  // States to hold processed financial data for display
  const [allTransactions, setAllTransactions] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netBalance: 0,
  });
  const [paymentsList, setPaymentsList] = useState([]);

  // UI states for feature display and modal messages
  const isSubscribed = true;
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [expandedFeature, setExpandedFeature] = useState(null);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("info");

  // Memoized callback to display messages using the custom modal
  const showMessage = useCallback((msg, type) => {
    setMessage(msg);
    setMessageType(type);
  }, []);

  // Memoized callback to clear the custom message modal
  const clearMessage = useCallback(() => {
    setMessage(null);
    setMessageType("info");
  }, []);


  // --- Data Fetching Logic (using Next.js API Route) ---
  // This useCallback hook ensures the 'fetchTransactions' function is stable across renders.
  const fetchTransactions = useCallback(async () => {
    // Only attempt to fetch data if Clerk's authentication state is loaded AND a user is logged in
    if (!isLoaded || !userId) {
      // Clear data if no user or auth is still loading
      setAllTransactions([]);
      setMonthlyData([]);
      setSummary({ totalIncome: 0, totalExpenses: 0, netBalance: 0 });
      setPaymentsList([]);
      return; // Exit if not ready to fetch
    }

    setLoadingData(true); // Set loading state to true while fetching begins
    try {
      console.log("Frontend Log: Fetching transactions for Clerk userId:", userId);
      // Make a GET request to your Next.js API route
      // Clerk automatically handles attaching authentication headers for API routes within Next.js
      const res = await fetch('/api/accounting/transactions', {
        headers: {
          'Content-Type': 'application/json',
          // No manual Authorization header needed here, Clerk's middleware handles it.
        },
      });

      if (!res.ok) {
        // If response is not OK (e.g., 401, 403, 500), parse and throw error
        const errorData = await res.json();
        console.error("Frontend Error: API Error fetching transactions:", errorData);
        throw new Error(errorData.message || 'Failed to fetch transactions from API');
      }

      const data = await res.json(); // Parse the JSON response
      console.log("Frontend Log: Fetched transactions from API:", data);
      setAllTransactions(data); // Store the raw fetched data

      // --- Data Processing for Monthly Charts (Income vs. Expense) ---
      // Aggregates income and expenses by month for the bar chart.
      const newMonthlyData = data.reduce((acc, transaction) => {
        const date = new Date(transaction.transactionDate); // Use 'transactionDate' from Prisma model
        const monthName = date.toLocaleString('en-US', { month: 'short' }); // e.g., "Jan", "Feb"
        const year = date.getFullYear();
        const key =   `${monthName} ${year}`; // Unique key for each month-year (e.g., "Jan 2025")

        let monthEntry = acc.find(m => m.name === key); // Find if an entry for this month-year already exists

        if (!monthEntry) {
          // If not, create a new entry
          monthEntry = { name: key, income: 0, expense: 0, fullDate: date };
          acc.push(monthEntry);
        }

        // Add amount to either income or expense based on transaction type
        if (transaction.type === 'INCOME') { // Use Prisma enum value 'INCOME'
          monthEntry.income += transaction.amount;
        } else if (transaction.type === 'EXPENSE') { // Use Prisma enum value 'EXPENSE'
          monthEntry.expense += transaction.amount;
        }
        return acc;
      }, []);

      newMonthlyData.sort((a, b) => a.fullDate - b.fullDate); // Sort the monthly data chronologically
      setMonthlyData(newMonthlyData); // Update state for the chart

      // --- Data Processing for Current Month's Summary ---
      // Filters transactions for the current month and calculates total income, expenses, and net balance.
      const currentMonthTransactions = data.filter(transaction => {
        const transactionDate = new Date(transaction.transactionDate);
        const today = new Date();
        // Check if transaction month and year match current month and year
        return transactionDate.getMonth() === today.getMonth() && transactionDate.getFullYear() === today.getFullYear();
      });

      const incomeSum = currentMonthTransactions
        .filter(t => t.type === 'INCOME')
        .reduce((sum, t) => sum + t.amount, 0); // Sum all income for the current month
      const expenseSum = currentMonthTransactions
        .filter(t => t.type === 'EXPENSE')
        .reduce((sum, t) => sum + t.amount, 0); // Sum all expenses for the current month

      setSummary({
        totalIncome: incomeSum,
        totalExpenses: expenseSum,
        netBalance: incomeSum - expenseSum, // Calculate net balance
      }); // Update state for the monthly summary

      // --- Data Processing for Member Payment Receipts ---
      // Filters transactions to show only income types and sorts them for the receipts section.
      const fetchedPayments = data.filter(t => t.type === 'INCOME');
      fetchedPayments.sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()); // Sort by transaction date (newest first)
      setPaymentsList(fetchedPayments); // Update state for the receipts list

    } catch (error) {
      console.error("Frontend Error: Failed to fetch transactions in fetchTransactions:", error);
      showMessage(error.message || "Failed to load financial data.", "error"); // Show error message in modal
    } finally {
      setLoadingData(false); // Always set loading state to false after fetch attempt
    }
  }, [isLoaded, userId, showMessage]); // Dependencies for useCallback: re-create if these values change


  // Effect hook to trigger data fetching when Clerk authentication state changes (e.g., user logs in/out)
  useEffect(() => {
    // Only fetch data when Clerk has loaded the user info AND a user is present (userId is not null)
    if (isLoaded && userId) {
      fetchTransactions(); // Call the memoized fetch function
    }
  }, [isLoaded, userId, fetchTransactions]); // Dependencies: re-run this effect if Clerk's loaded status, userId, or fetchTransactions changes


  // --- Function to Add New Expense via API ---
  // This function is passed to AddExpenseForm. It sends data to the API route.
  const handleAddExpense = async (newExpenseData) => {
    if (!userId) { // Ensure a user is authenticated before allowing data submission
      showMessage("Please log in to add expenses.", "error");
      return;
    }
    setLoadingData(true); // Set loading state for form submission
    try {
      // Pass Clerk user's email to the API route for potential User creation logic
      const dataToSend = {
          ...newExpenseData,
          email: user?.primaryEmailAddress?.emailAddress, // Pass Clerk user's email if available
      };
      console.log("Frontend Log: Sending expense data to API:", dataToSend);
      // Make a POST request to the accounting transactions API route
      const res = await fetch('/api/accounting/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Clerk automatically handles authentication headers for API routes
        },
        body: JSON.stringify(dataToSend), // Send the transaction data as JSON
      });

      if (!res.ok) {
        // If API response is not OK, parse and throw error
        const errorData = await res.json();
        console.error("Frontend Error: API Error adding expense:", errorData);
        throw new Error(errorData.message || 'Failed to add expense via API');
      }
      console.log("Frontend Log: Expense added via API successfully!");
      fetchTransactions(); // Re-fetch all data to update the UI with the new entry
    } catch (error) {
      console.error("Frontend Error: Failed to add expense via API:", error);
      throw error; // Re-throw the error so the calling form can handle it (e.g., display error message)
    } finally {
      setLoadingData(false); // Always reset loading state
    }
  };


  // --- Function to Add New Payment via API ---
  // This function is passed to AddPaymentForm. It sends data to the API route.
  const handleAddPayment = async (newPaymentData) => {
    if (!userId) { // Ensure a user is authenticated before allowing data submission
      showMessage("Please log in to record payments.", "error");
      return;
    }
    setLoadingData(true); // Set loading state for form submission
    try {
        // Pass Clerk user's email to the API route for potential User creation logic
        const dataToSend = {
            ...newPaymentData,
            email: user?.primaryEmailAddress?.emailAddress, // Pass Clerk user's email if available
        };
      console.log("Frontend Log: Sending payment data to API:", dataToSend);
      const res = await fetch('/api/accounting/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend), // Send the transaction data as JSON
      });

      if (!res.ok) {
        // If API response is not OK, parse and throw error
        const errorData = await res.json();
        console.error("Frontend Error: API Error recording payment:", errorData);
        throw new Error(errorData.message || 'Failed to record payment via API');
      }
      console.log("Frontend Log: Payment recorded via API successfully!");
      fetchTransactions(); // Re-fetch all data to update the UI with the new entry
    } catch (error) {
      console.error("Frontend Error: Failed to record payment via API:", error);
      throw error; // Re-throw the error so the calling form can handle it
    } finally {
      setLoadingData(false); // Always reset loading state
    }
  };

  // Static data for main features section (purely for UI display)
  const mainFeatures = [
    { icon: <BarChart3 className="w-6 h-6 text-blue-600" />, title: "Income & Expense Tracking", desc: "Record all society transactions, categorize, and filter them by type or time period.", details: "Track maintenance collections, utility bills, vendor payments, and more. Keep everything categorized for easy auditing and reporting." },
    { icon: <Banknote className="w-6 h-6 text-green-600" />, title: "Bank Reconciliation", desc: "Easily reconcile society accounts with real bank statements.", details: "Match each transaction with your bank entries. Reduce errors and increase financial transparency for your committee." },
    { icon: <FileText className="w-6 h-6 text-purple-600" />, title: "Audit-ready Reports", desc: "Generate downloadable reports for audits or annual reviews.", details: "Export PDF or Excel reports covering income, expenses, dues, and balances. Perfect for AGMs or auditor reviews." },
  ];

  // Static data for extra features section (purely for UI display)
  const extraFeatures = [
    { icon: <PieChart className="w-6 h-6 text-orange-600" />, title: "Category-wise Breakdown", desc: "Visualize your income and expenses across different heads.", details: "Quickly understand where your society spends the most or earns the most. Perfect for budget planning.", isNew: true },
    { icon: <TrendingUp className="w-6 h-6 text-indigo-600" />, title: "Financial Insights", desc: "Automatic insights like top spending months or overdue dues.", details: "Let the system surface useful insights like irregular payments, seasonal spikes, and long-standing dues." },
    { icon: <Receipt className="w-6 h-6 text-pink-600" />, title: "Auto Receipts", desc: "Send instant payment receipts to members via email or SMS.", details: "Confirmations build trust. Automatically notify members with official receipts for every payment logged.", isNew: true },
    { icon: <ClipboardList className="w-6 h-6 text-teal-600" />, title: "Expense Approvals", desc: "Route expenses for committee approval before final entry.", details: "Optional workflow to ensure only vetted expenses make it to the ledger. Great for larger societies." },
  ];

  // UI logic for expanding/collapsing feature details
  const toggleFeature = (title) => {
    setExpandedFeature(expandedFeature === title ? null : title);
  };

  // --- Conditional Rendering for Loading and Unauthenticated States ---
  // Display a loading spinner if Clerk's auth state is still loading or data is being fetched.
  if (!isLoaded || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
        <p className="ml-4 text-gray-700 text-lg">Loading accounting data...</p>
      </div>
    );
  }

  // If Clerk has loaded but no user ID is present (user is not logged in), show login prompt.
  if (!userId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <MessageModal message={message} type={messageType} onClose={clearMessage} />
        <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-lg w-full border border-blue-200">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Access Restricted</h1>
          <p className="text-gray-600 text-lg mb-6">
            Please log in to view and manage society accounting.
          </p>
          <Link
            href="/login" // Link to your existing login page
            className="inline-block bg-blue-600 text-white text-md font-bold px-8 py-4 rounded-full hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Log In
          </Link>
          <p className="mt-4 text-sm text-gray-500">
            Don't have an account?{" "}
            <Link href="/signup" className="text-blue-600 underline hover:text-blue-800">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // --- Main Accounting Page UI (rendered when authenticated and data is loaded) ---
  return (
    <div className="bg-gray-50 min-h-screen px-4 py-10 font-sans antialiased">
      {/* Custom message modal rendered at the top level */}
      <MessageModal
        message={message}
        type={messageType}
        onClose={clearMessage}
      />

      <div className="max-w-6xl mx-auto space-y-12">
        {/* Premium Accounting Unlock Section (Conditional, based on isSubscribed) */}
        {!isSubscribed && (
          <div className="bg-white rounded-2xl shadow-xl p-10 text-center border border-blue-200">
            <Image
              src="https://res.cloudinary.com/dayrre5om/image/upload/v1748016715/WhatsApp_Image_2025-05-23_at_21.40.22_368915a7_uhkm97.jpg"
              alt="Premium Accounting"
              width={400}
              height={250}
              className="rounded-lg mb-6 mx-auto object-cover"
            />
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
              Unlock Premium Accounting
            </h1>
            <p className="text-gray-700 text-lg mb-6 max-w-2xl mx-auto">
              Simplify society finances with powerful features: income & expense
              tracking, bank reconciliation, downloadable audit-ready reports
              and more.
            </p>
            <Link
              href="/demo"
              className="inline-block bg-blue-600 text-white text-md font-bold px-8 py-4 rounded-full hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Request a Demo
            </Link>
            <p className="mt-6 text-sm text-gray-500">
              Already subscribed?{" "}
              <Link
                href="/login"
                className="text-blue-600 underline hover:text-blue-800"
              >
                Log in
              </Link>
            </p>
          </div>
        )}

        {/* Feature Grid Section */}
        <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Society Accounting Features
          </h2>
          <p className="text-gray-700 mb-8 max-w-2xl">
            Access powerful tools to manage your society’s complete financial
            lifecycle — from dues and collections to reports and audits.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {[...mainFeatures, ...(showAllFeatures ? extraFeatures : [])].map(
              ({ icon, title, desc, details, isNew }) => (
                <li
                  key={title}
                  className="bg-gray-100 rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer relative"
                  onClick={() => toggleFeature(title)}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="p-2 rounded-full bg-blue-50/50">{icon}</div>
                    <h3 className="text-xl font-bold text-blue-800">{title}</h3>
                    {isNew && (
                      <span className="ml-auto bg-blue-200 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full animate-pulse">
                        ✨ New
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{desc}</p>
                  <button
                    className="text-sm text-blue-700 hover:underline font-semibold focus:outline-none"
                    onClick={(e) => {
                      // Prevent card click from also toggling
                      e.stopPropagation(); // Stop event propagation to avoid triggering parent li's onClick
                      toggleFeature(title);
                    }}
                  >
                    {expandedFeature === title ? "Show Less" : "Learn More →"}
                  </button>
                  {expandedFeature === title && (
                    <p className="mt-3 text-sm text-gray-700 leading-relaxed bg-white p-3 rounded-lg border border-gray-200">
                      {details}
                    </p>
                  )}
                </li>
              )
            )}
          </ul>
          <div className="text-center mt-10">
            <button
              onClick={() => setShowAllFeatures((prev) => !prev)}
              className="text-blue-700 font-semibold hover:underline focus:outline-none text-lg px-6 py-3 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              {showAllFeatures
                ? "Show Less Features"
                : "See All Accounting Features"}
            </button>
          </div>
        </div>

        {/* Charts and Summary Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Monthly Finance Overview
            </h3>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    formatter={(value, name) => [
                      `₹ ${value.toLocaleString("en-IN")}`,
                      name,
                    ]}
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      padding: "10px",
                    }}
                    labelStyle={{ color: "#374151", fontWeight: "bold" }}
                  />
                  <Bar
                    dataKey="income"
                    fill="#2563eb"
                    name="Income"
                    radius={[10, 10, 0, 0]}
                  />
                  <Bar
                    dataKey="expense"
                    fill="#f97316"
                    name="Expense"
                    radius={[10, 10, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>No financial data available for charts.</p>
              </div>
            )}
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 space-y-5 flex flex-col justify-center">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              This Month's Summary
            </h3>
            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
              <div className="text-gray-600 font-medium">Total Income</div>
              <div className="font-bold text-green-600 text-lg">
                ₹ {summary.totalIncome.toLocaleString("en-IN")}
              </div>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
              <div className="text-gray-600 font-medium">Total Expenses</div>
              <div className="font-bold text-red-600 text-lg">
                ₹ {summary.totalExpenses.toLocaleString("en-IN")}
              </div>
            </div>
            <div className="flex justify-between items-center pt-2">
              <div className="text-gray-700 font-semibold text-lg">
                Net Balance
              </div>
              <div className="font-extrabold text-blue-700 text-2xl">
                ₹ {summary.netBalance.toLocaleString("en-IN")}
              </div>
            </div>
            {userId && ( // Display Clerk's userId for debugging/identification
              <div>
                <p className="text-xs text-gray-400 mt-4 break-all">
                  Logged in as Clerk ID: {userId}
                </p>
                <p className="text-xs text-gray-400 mt-4 break-all">
                  Logged in user role: {role}
                </p>
              </div>
            )}
            <button
              onClick={() => signOut()} // Clerk's signOut method
              className="mt-4 bg-gray-200 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-300 transition-colors self-end flex items-center justify-center"
            >
              <LogOut className="w-4 h-4 mr-2" /> Log Out
            </button>
          </div>
        </div>

        {/* Forms Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-5">
              Record New Payment
            </h3>
            {/* Pass user's email to the form for the API route's user creation fallback */}
            <AddPaymentForm
              onSubmit={handleAddPayment}
              showMessage={showMessage}
              userEmail={user?.primaryEmailAddress?.emailAddress}
            />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-5">
              Log New Expense
            </h3>
            {/* Pass user's email to the form for the API route's user creation fallback */}
            <AddExpenseForm
              onSubmit={handleAddExpense}
              showMessage={showMessage}
              userEmail={user?.primaryEmailAddress?.emailAddress}
            />
          </div>
        </div>

        {/* Member Receipts Section */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Member Payment Receipts
          </h2>
          <p className="text-gray-600 max-w-2xl">
            View and download payment receipts for members. This section
            automatically updates with new payments.
          </p>
          {paymentsList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paymentsList.map((payment) => (
                <MemberReceiptCard key={payment.id} payment={payment} />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
              <p>No payment receipts available yet. Add a new payment above!</p>
            </div>
          )}
        </div>

        {/* Back to Dashboard Link */}
        <div className="text-center mt-10">
          <Link
            href="/dashboard"
            className="text-blue-600 font-medium hover:underline text-lg"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}